import type { ContentPack, ExamQuestion, PhaseConfig } from '../types/content';
import type { Condition, Effect } from '../types/dsl';
import type { GameState } from '../types/state';
import type { PlayerAction, ViewModel } from '../types/view';
import type { StatDeltas, StatKey } from '../types/stats';
import { Rng, randomSeed } from '../rng/rng';
import { applyEffects } from '../dsl/apply';
import { evalCondition } from '../dsl/evaluate';
import { pickRoundEvents } from '../systems/scheduler';
import { findEnding } from '../systems/ending';

export interface Engine {
  start(seed?: number): GameState;
  view(state: GameState): ViewModel;
  dispatch(state: GameState, action: PlayerAction): GameState;
}

const EXAM_BASE_SCORE = 330;
const EXAM_SCORE_RANGE = 270;
const EXAM_SKIP_RATE = 0.55;
const TRAIT_OFFER_COUNT = 4;
const TRAIT_PICK_COUNT = 2;

const CROSSROAD_OPTIONS = [
  {
    id: 'postgrad',
    label: '考研',
    text: '再把青春押给一次考试。晚几年入场，也许能换一张更硬的门票。',
    recommendedFor: ['计算机科学与技术', '师范类', '金融学', '临床医学', '心理学'],
  },
  {
    id: 'job',
    label: '求职',
    text: '先上车再说。简历、群面、笔试、offer，毕业季的风会把人推着往前走。',
    recommendedFor: ['计算机科学与技术', '计算机应用', '金融学', '临床医学'],
  },
  {
    id: 'civil_service',
    label: '考公',
    text: '回到一张安静的书桌前，把不确定的人生复习成确定的题型。',
    recommendedFor: ['师范类', '工商管理', '金融学', '心理学'],
  },
] as const;

function addDeltas(target: StatDeltas, source: StatDeltas): void {
  for (const [key, value] of Object.entries(source) as [StatKey, number][]) {
    target[key] = (target[key] ?? 0) + value;
  }
}

function clone(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function invalid(state: GameState, action: PlayerAction): never {
  throw new Error(`Invalid action ${action.type} on screen ${state.screen}`);
}

export function createEngine(pack: ContentPack): Engine {
  const eventsById = new Map(pack.events.map(e => [e.id, e]));
  const questionsById = new Map(pack.examBank.map(q => [q.id, q]));

  function phaseAt(index: number): PhaseConfig {
    const phase = pack.timeline[index];
    if (!phase) throw new Error(`Timeline has no phase at index ${index}`);
    return phase;
  }

  function admissionScore(state: GameState): number {
    return state.profile.examScore ?? 0;
  }

  // 面向玩家的文案占位符替换:{{ta}} = 恋人第三人称(与玩家性别相反)。
  // 女玩家 → 恋人是男性 → '他';其余(男玩家/未设置的旧存档)→ '她'。
  // 纯函数,不读写 state/RNG,仅在 view() 投影文案时调用,不影响存档回放。
  function renderText(text: string, state: GameState): string {
    const partner = state.flags.player_gender === 'female' ? '他' : '她';
    return text.replace(/\{\{ta\}\}/g, partner);
  }

  const traitLabelById = new Map(pack.traits.map(t => [t.id, t.label]));

  // 特质门控的选项/事件在 UI 上打【特质名】标签,让玩家看见"这是我的特质带来的"。
  // 只识别"必然要求某特质"的条件(顶层 flag 或 all 分支),any 里的备选不算必需。
  function requiredTraitLabel(cond: Condition | undefined): string | null {
    if (!cond) return null;
    if ('flag' in cond && cond.flag.startsWith('trait_')) {
      if (cond.equals === undefined || cond.equals === true) {
        return traitLabelById.get(cond.flag) ?? null;
      }
      return null;
    }
    if ('all' in cond) {
      for (const child of cond.all) {
        const label = requiredTraitLabel(child);
        if (label) return label;
      }
    }
    return null;
  }

  function withTraitTag(text: string, cond: Condition | undefined): string {
    const label = requiredTraitLabel(cond);
    return label ? `【${label}】${text}` : text;
  }

  // 录取概率按(加成后分数 - 批次线)分段:冲高批次可能滑档
  const CHANCE_TIERS = [
    { minDiff: 20, chance: 1, label: '稳' },
    { minDiff: 0, chance: 0.9, label: '较稳' },
    { minDiff: -20, chance: 0.45, label: '冲' },
    { minDiff: -45, chance: 0.18, label: '悬' },
    { minDiff: -Infinity, chance: 0.05, label: '基本无望' },
  ] as const;

  function admissionTier(diff: number) {
    const tier = CHANCE_TIERS.find(t => diff >= t.minDiff);
    if (!tier) throw new Error('unreachable: admission tier not found');
    return tier;
  }

  function start(seed?: number): GameState {
    const actualSeed = seed ?? randomSeed();
    const npcs: GameState['npcs'] = {};
    for (const npc of pack.npcs) {
      npcs[npc.id] = { favor: npc.initialFavor, stage: npc.initialStage };
    }
    return {
      schemaVersion: 1,
      seed: actualSeed,
      rngState: actualSeed,
      screen: 'TITLE',
      phaseIndex: -1,
      flowStepIndex: 0,
      roundIndex: 0,
      roundCounter: 0,
      date: { year: 2014, month: 6 },
      currentBrief: null,
      eventQueue: [],
      eventCursor: 0,
      pendingOutcome: null,
      pendingFlowAdvance: false,
      forcedEndingId: null,
      pendingJumpPhaseId: null,
      examPaper: [],
      examCursor: 0,
      examCorrect: 0,
      examEarnedPoints: 0,
      stats: { knowledge: 40, money: 0, mindset: 70, network: 10, health: 85 },
      profile: {
        background: null,
        track: null,
        examScore: null,
        university: null,
        major: null,
        career: null,
      },
      flags: {},
      npcs,
      scheduled: [],
      triggeredEventIds: [],
      history: [],
      endingId: null,
      lastSettlement: null,
      yearlySnapshots: [],
    };
  }

  function view(state: GameState): ViewModel {
    switch (state.screen) {
      case 'TITLE':
        return { kind: 'TITLE', title: pack.meta.title };
      case 'BACKGROUND_DRAW': {
        const card = pack.backgrounds.find(b => b.id === state.profile.background);
        if (!card) throw new Error('BACKGROUND_DRAW screen without a drawn card');
        const offer = (state.traitOffer ?? [])
          .map(id => pack.traits.find(t => t.id === id))
          .filter((t): t is NonNullable<typeof t> => Boolean(t));
        return {
          kind: 'BACKGROUND_DRAW',
          card,
          traitOffer: offer,
          pickCount: Math.min(TRAIT_PICK_COUNT, offer.length),
        };
      }
      case 'SETUP':
        return { kind: 'SETUP', genders: ['male', 'female'], tracks: ['文', '理'] };
      case 'EXAM': {
        const qid = state.examPaper[state.examCursor];
        const q = qid ? questionsById.get(qid) : undefined;
        if (!q) throw new Error('EXAM screen without a current question');
        return {
          kind: 'EXAM',
          index: state.examCursor,
          total: state.examPaper.length,
          question: { id: q.id, subject: q.subject, text: q.text, options: q.options },
        };
      }
      case 'EXAM_RESULT':
        return {
          kind: 'EXAM_RESULT',
          score: state.profile.examScore ?? 0,
          correct: state.examCorrect,
          total: state.examPaper.length,
        };
      case 'APPLICATION':
        return {
          kind: 'APPLICATION',
          score: state.profile.examScore ?? 0,
          options: pack.applications.map(opt => {
            const tier = admissionTier(admissionScore(state) - opt.minScore);
            return {
              id: opt.id,
              label: opt.label,
              university: opt.university,
              chanceLabel: tier.label,
              risky: tier.chance < 1,
              majors: opt.majors.map(m => ({ id: m.id, name: m.name })),
            };
          }),
        };
      case 'CROSSROAD':
        return {
          kind: 'CROSSROAD',
          year: state.date.year,
          university: state.profile.university ?? '这所大学',
          major: state.profile.major ?? '你的专业',
          options: CROSSROAD_OPTIONS.map(opt => ({ ...opt })),
        };
      case 'BRIEF': {
        const phase = phaseAt(state.phaseIndex);
        return {
          kind: 'BRIEF',
          phaseLabel: phase.label,
          year: state.date.year,
          text: renderText(state.currentBrief ?? '', state),
        };
      }
      case 'EVENT': {
        const evId = state.eventQueue[state.eventCursor];
        const ev = evId ? eventsById.get(evId) : undefined;
        if (!ev) throw new Error('EVENT screen without a current event');
        const rng = new Rng(state.rngState);
        const visible = ev.choices.filter(c =>
          evalCondition(c.visibleIf, { state, pack, rng }),
        );
        return {
          kind: 'EVENT',
          eventId: ev.id,
          title: withTraitTag(ev.title, ev.trigger),
          text: renderText(ev.text, state),
          major: ev.tier === 'major',
          choices: visible.map(c => ({
            id: c.id,
            text: withTraitTag(renderText(c.text, state), c.visibleIf),
          })),
        };
      }
      case 'OUTCOME':
        return {
          kind: 'OUTCOME',
          text: renderText(state.pendingOutcome?.text ?? '', state),
          deltas: state.pendingOutcome?.deltas ?? {},
        };
      case 'SETTLEMENT':
        return {
          kind: 'SETTLEMENT',
          year: state.date.year,
          stats: state.stats,
          incomes: state.lastSettlement?.incomes ?? [],
          moneyDelta: state.lastSettlement?.moneyDelta ?? 0,
          milestone: state.lastSettlement?.milestone ?? null,
          moneyTrend: state.yearlySnapshots ?? [],
        };
      case 'ENDING': {
        const ending = pack.endings.find(e => e.id === state.endingId);
        if (!ending) throw new Error(`ENDING screen with unknown ending: ${state.endingId}`);
        const { score, grade } = computeScore(state);
        return {
          kind: 'ENDING',
          endingId: ending.id,
          title: ending.title,
          text: renderText(ending.text, state),
          stats: state.stats,
          score,
          grade,
          historyLength: state.history.length,
          moneyTrend: state.yearlySnapshots ?? [],
          shareCard: {
            title: ending.title,
            tagline: ending.shareCard?.tagline ?? '普通人的十二年，也有自己的重量。',
            tone: ending.shareCard?.tone ?? 'warm',
            seed: state.seed,
            years: '2014-2026',
            traits: pack.traits.filter(t => Boolean(state.flags[t.id])).map(t => t.label),
          },
        };
      }
    }
  }

  function computeScore(state: GameState): { score: number; grade: 'S' | 'A' | 'B' | 'C' | 'D' } {
    const scoring = pack.meta.scoring ?? {
      weights: { knowledge: 0.2, money: 0.25, mindset: 0.2, network: 0.15, health: 0.2 },
      moneyFullScore: 600000,
    };
    const raw = (Object.entries(scoring.weights) as [StatKey, number][]).reduce(
      (sum, [key, weight]) => {
        const statScore =
          key === 'money'
            ? Math.min(100, (state.stats.money / scoring.moneyFullScore) * 100)
            : state.stats[key];
        return sum + statScore * weight;
      },
      0,
    );
    const score = Math.max(0, Math.min(100, Math.round(raw)));
    const grade = score >= 92 ? 'S' : score >= 82 ? 'A' : score >= 64 ? 'B' : score >= 45 ? 'C' : 'D';
    return { score, grade };
  }

  function enterPhase(state: GameState, rng: Rng, index: number): void {
    state.phaseIndex = index;
    const phase = phaseAt(index);
    state.date = { ...phase.date };
    if (phase.kind === 'flow') {
      state.flowStepIndex = 0;
      enterFlowStep(state, rng);
    } else {
      state.roundIndex = 0;
      startRound(state, rng, phase);
    }
  }

  function enterFlowStep(state: GameState, rng: Rng): void {
    const phase = phaseAt(state.phaseIndex);
    if (phase.kind !== 'flow') throw new Error('enterFlowStep outside flow phase');
    const step = phase.steps[state.flowStepIndex];
    if (!step) {
      enterPhase(state, rng, state.phaseIndex + 1);
      return;
    }
    switch (step) {
      case 'BACKGROUND_DRAW': {
        const card = rng.pick(pack.backgrounds);
        state.profile.background = card.id;
        state.stats.money = card.initialMoney;
        Object.assign(state.flags, card.flags ?? {});
        // 特质候选随背景一起亮出(抽 4 选 2),玩家用 CHOOSE_TRAITS 提交后才写 flags
        state.traitOffer = rng.sample(pack.traits, TRAIT_OFFER_COUNT).map(t => t.id);
        state.screen = 'BACKGROUND_DRAW';
        break;
      }
      case 'SETUP':
        state.screen = 'SETUP';
        break;
      case 'EXAM': {
        const track = state.profile.track;
        const bank = pack.examBank.filter(q => q.track === 'both' || q.track === track);
        state.examPaper = rng.sample(bank, pack.meta.examQuestionCount).map(q => q.id);
        state.examCursor = 0;
        state.examCorrect = 0;
        state.examEarnedPoints = 0;
        state.screen = 'EXAM';
        break;
      }
      case 'APPLICATION':
        state.screen = 'APPLICATION';
        break;
      case 'CROSSROAD':
        state.screen = 'CROSSROAD';
        break;
    }
  }

  function nextFlowStep(state: GameState, rng: Rng): void {
    state.flowStepIndex += 1;
    enterFlowStep(state, rng);
  }

  function startRound(
    state: GameState,
    rng: Rng,
    phase: Extract<PhaseConfig, { kind: 'rounds' }>,
  ): void {
    state.eventQueue = pickRoundEvents(state, pack, rng, phase);
    state.eventCursor = 0;
    state.currentBrief =
      phase.briefs[state.roundIndex % Math.max(1, phase.briefs.length)] ?? '';
    state.screen = 'BRIEF';
  }

  function finishWithEnding(state: GameState, endingId: string): void {
    state.endingId = endingId;
    state.screen = 'ENDING';
  }

  const MONEY_MILESTONES: { threshold: number; label: string }[] = [
    { threshold: 1_000_000, label: '资产第一次站上一百万。当年那个数着生活费过月的人,大概不敢想。' },
    { threshold: 500_000, label: '资产突破五十万。你开始理解"积累"这两个字的分量。' },
    { threshold: 100_000, label: '存款第一次突破十万。你截了个图,又默默删掉了。' },
  ];

  /**
   * 进入年度结算屏:先结算收入并把明细写入 lastSettlement,
   * 玩家在结算页看到的是入账后的数字和收入构成。
   * 提前结局检查仍在玩家点"翻过这一年"后的 settleRound 里做。
   */
  function enterSettlement(state: GameState, rng: Rng): void {
    const ctx = { state, pack, rng };
    const moneyBefore = state.stats.money;
    const incomes: { label: string; amount: number }[] = [];
    for (const rule of pack.incomes) {
      if (!evalCondition(rule.when, ctx)) continue;
      state.stats.money = Math.max(0, Math.round(state.stats.money + rule.amount));
      if (rule.mindsetDelta) {
        state.stats.mindset = Math.max(0, Math.min(100, state.stats.mindset + rule.mindsetDelta));
      }
      if (rule.healthDelta) {
        state.stats.health = Math.max(0, Math.min(100, state.stats.health + rule.healthDelta));
      }
      if (rule.amount !== 0) incomes.push({ label: rule.label, amount: rule.amount });
    }
    const snapshots = state.yearlySnapshots ?? [];
    const prevMoney = snapshots.length > 0 ? snapshots[snapshots.length - 1]!.money : null;
    const milestone =
      prevMoney === null
        ? null
        : (MONEY_MILESTONES.find(
            m => prevMoney < m.threshold && state.stats.money >= m.threshold,
          )?.label ?? null);
    state.lastSettlement = {
      incomes,
      moneyDelta: state.stats.money - moneyBefore,
      milestone,
    };
    state.yearlySnapshots = [...snapshots, { year: state.date.year, money: state.stats.money }];
    state.screen = 'SETTLEMENT';
  }

  function settleRound(state: GameState, rng: Rng): void {
    const phase = phaseAt(state.phaseIndex);
    if (phase.kind !== 'rounds') throw new Error('settleRound outside rounds phase');
    const earlyAfterSettle = findEnding(state, pack, rng, ['early']);
    if (earlyAfterSettle) {
      finishWithEnding(state, earlyAfterSettle.id);
      return;
    }
    state.roundIndex += 1;
    state.roundCounter += 1;
    if (state.roundIndex < phase.rounds) {
      state.date.year += 1;
      startRound(state, rng, phase);
      return;
    }
    if (phase.isFinal) {
      const ending = findEnding(state, pack, rng, ['early', 'final']);
      finishWithEnding(state, ending?.id ?? pack.meta.fallbackEndingId);
      return;
    }
    enterPhase(state, rng, state.phaseIndex + 1);
  }

  function resolveExamScore(state: GameState, rng: Rng): void {
    const maxPoints = Math.max(
      1,
      state.examPaper.reduce((sum, qid) => sum + (questionsById.get(qid)?.difficulty ?? 1), 0),
    );
    const rate = state.examEarnedPoints / maxPoints;
    const raw = Math.round(EXAM_BASE_SCORE + rate * EXAM_SCORE_RANGE + rng.int(-18, 18));
    state.profile.examScore = Math.max(0, Math.min(750, raw));
    state.stats.knowledge = Math.round(20 + rate * 55);
    state.screen = 'EXAM_RESULT';
  }

  function handleApplication(state: GameState, rng: Rng, optionId: string, majorId?: string): void {
    const option = pack.applications.find(o => o.id === optionId);
    if (!option) throw new Error(`Unknown application option: ${optionId}`);
    const major = option.majors.find(m => m.id === majorId) ?? option.majors[0];
    if (!major) throw new Error(`Application option has no majors: ${optionId}`);
    const diff = admissionScore(state) - option.minScore;
    const admitted = rng.chance(admissionTier(diff).chance);
    const deltas: StatDeltas = {};
    let text: string;
    if (admitted) {
      state.profile.university = option.university;
      state.profile.major = major.name;
      state.flags['major_track'] = major.trackFlag;
      if (option.effects) addDeltas(deltas, applyEffects(option.effects, state, pack).deltas);
      text =
        diff < 0
          ? `录取结果出来了：${option.university} · ${major.name}。你压着线冲了进去——查到结果那一刻，你把页面刷新了三遍才敢相信，班主任在电话里连说了三个“好”。后来你才知道，那年这个专业的最后一名，就是你。`
          : `录取结果出来了：${option.university} · ${major.name}。志愿表上的一行字，从今天起变成了你接下来四年的城市、同学和专业。`;
    } else {
      // 滑档:落到分数够线的最高批次(排除刚冲失败的那个)
      const fallback = pack.applications
        .filter(o => o.id !== option.id && admissionScore(state) >= o.minScore)
        .sort((a, b) => b.minScore - a.minScore)[0];
      if (!fallback) throw new Error('No fallback application option; content must provide one');
      const fbMajor = fallback.majors.find(m => m.trackFlag === major.trackFlag) ?? fallback.majors[0];
      if (!fbMajor) throw new Error(`Fallback option has no majors: ${fallback.id}`);
      state.profile.university = fallback.university;
      state.profile.major = fbMajor.name;
      state.flags['major_track'] = fbMajor.trackFlag;
      state.flags['slipped'] = true;
      if (option.failEffects) addDeltas(deltas, applyEffects(option.failEffects, state, pack).deltas);
      if (fallback.effects) addDeltas(deltas, applyEffects(fallback.effects, state, pack).deltas);
      text = `滑档了。「${option.label}」的投档线比往年又涨了一截，你的名字不在这一批任何一张录取名单上。那几天家里安静得可怕，爸爸在阳台抽了半包烟，妈妈把“复读”两个字含在嘴里又咽了回去。直到征集志愿的最后一轮，${fallback.university}把你接住——${fbMajor.name}。去报到那天，爸爸只说了一句：“去了，就好好念。”十八岁的夏天你第一次知道：人生的考卷不止一张，但那年夏天，它看起来就像是唯一的一张。`;
    }
    state.history.push({
      kind: 'application',
      year: state.date.year,
      optionId: option.id,
      admitted,
    });
    state.pendingOutcome = { text, deltas };
    state.pendingFlowAdvance = true;
    state.screen = 'OUTCOME';
  }

  function handleCrossroad(state: GameState, optionId: string): void {
    const major = state.profile.major ?? '';
    const tier = state.flags['university_tier'];
    const eliteBonus = tier === '985' || tier === '211';
    const deltas: StatDeltas = {};
    let text: string;
    switch (optionId) {
      case 'postgrad': {
        const result = applyEffects(
          [
            { setFlag: 'crossroad', value: 'postgrad' },
            { setFlag: 'postgrad' },
            { setFlag: 'delayed_job_market' },
            { stats: { knowledge: eliteBonus ? 10 : 8, network: eliteBonus ? 4 : 1, mindset: -4 } },
          ],
          state,
          pack,
        );
        addDeltas(deltas, result.deltas);
        text = '你选择考研。别人开始投简历、租房、领工资时，你重新坐回书桌前。晚几年入场，也意味着多几年打磨自己。';
        break;
      }
      case 'job': {
        const effects: Effect[] = [
          { setFlag: 'crossroad', value: 'job' },
          { setFlag: 'entered_job_market_2018' },
          { stats: { money: eliteBonus ? 8000 : 3000, network: eliteBonus ? 4 : 1 } },
        ];
        if (major.includes('计算机')) {
          effects.push(
            { setCareer: 'cs' },
            { setFlag: 'career_cs' },
            { setFlag: 'first_job_track', value: eliteBonus ? 'big_tech_candidate' : 'ordinary_tech_candidate' },
          );
        } else if (major.includes('师范')) {
          effects.push(
            { setCareer: 'education' },
            { setFlag: 'career_edu' },
            { setFlag: 'first_job_track', value: 'education_candidate' },
          );
        } else if (major.includes('金融')) {
          effects.push(
            { setCareer: 'finance' },
            { setFlag: 'career_finance' },
            { setFlag: 'first_job_track', value: eliteBonus ? 'finance_elite_candidate' : 'finance_ordinary_candidate' },
          );
        } else if (major.includes('临床医学') || major.includes('医学')) {
          effects.push(
            { setCareer: 'medicine' },
            { setFlag: 'career_medicine' },
            { setFlag: 'medicine_resident' },
            { setFlag: 'first_job_track', value: eliteBonus ? 'medicine_tertiary_candidate' : 'medicine_ordinary_candidate' },
          );
        } else if (major.includes('心理')) {
          effects.push(
            { setCareer: 'psychology' },
            { setFlag: 'career_psychology' },
            { setFlag: 'first_job_track', value: eliteBonus ? 'psy_elite_candidate' : 'psy_ordinary_candidate' },
          );
        } else {
          effects.push(
            { setCareer: 'local' },
            { setFlag: 'first_job_track', value: 'local_candidate' },
          );
        }
        addDeltas(deltas, applyEffects(effects, state, pack).deltas);
        text = '你选择直接求职。简历投出去的那一刻，学生时代开始松手，社会开始接管你的日程表。';
        break;
      }
      case 'civil_service': {
        const result = applyEffects(
          [
            { setFlag: 'crossroad', value: 'civil_service' },
            { setFlag: 'civil_service_track' },
            { setCareer: 'gov_candidate' },
            { stats: { knowledge: major.includes('师范') ? 6 : 4, mindset: -3 } },
          ],
          state,
          pack,
        );
        addDeltas(deltas, result.deltas);
        text = '你选择考公。把不确定的人生重新复习成题型，也是一种勇气。只是这条路不保证上岸，只保证你会很熟悉申论格子纸。';
        break;
      }
      default:
        throw new Error(`Unknown crossroad option: ${optionId}`);
    }
    state.history.push({
      kind: 'crossroad',
      year: state.date.year,
      optionId,
    });
    state.pendingOutcome = { text, deltas };
    state.pendingFlowAdvance = true;
    state.screen = 'OUTCOME';
  }

  function resolveChoice(state: GameState, rng: Rng, choiceId: string): void {
    const evId = state.eventQueue[state.eventCursor];
    const ev = evId ? eventsById.get(evId) : undefined;
    if (!ev) throw new Error('CHOOSE without a current event');
    const ctx = { state, pack, rng };
    const choice = ev.choices.find(
      c => c.id === choiceId && evalCondition(c.visibleIf, ctx),
    );
    if (!choice) throw new Error(`Choice not available: ${choiceId} on ${ev.id}`);
    const eligible = choice.outcomes.filter(o => evalCondition(o.condition, ctx));
    const outcomePool = eligible.length > 0 ? eligible : choice.outcomes;
    const outcome = rng.weightedPick(outcomePool, o => o.weight);
    const { deltas } = applyEffects(outcome.effects, state, pack);
    state.triggeredEventIds.push(ev.id);
    state.history.push({
      kind: 'event',
      year: state.date.year,
      eventId: ev.id,
      category: ev.category,
      choiceId: choice.id,
      outcomeTag: outcome.outcomeTag,
    });
    state.pendingOutcome = { text: outcome.text, deltas };
    state.screen = 'OUTCOME';
  }

  function continueAfterOutcome(state: GameState, rng: Rng): void {
    state.pendingOutcome = null;
    if (state.forcedEndingId) {
      finishWithEnding(state, state.forcedEndingId);
      return;
    }
    if (state.pendingJumpPhaseId) {
      const idx = pack.timeline.findIndex(p => p.id === state.pendingJumpPhaseId);
      if (idx < 0) throw new Error(`jumpToPhase target not found: ${state.pendingJumpPhaseId}`);
      state.pendingJumpPhaseId = null;
      enterPhase(state, rng, idx);
      return;
    }
    const early = findEnding(state, pack, rng, ['early']);
    if (early) {
      finishWithEnding(state, early.id);
      return;
    }
    if (state.pendingFlowAdvance) {
      state.pendingFlowAdvance = false;
      nextFlowStep(state, rng);
      return;
    }
    state.eventCursor += 1;
    if (state.eventCursor >= state.eventQueue.length) {
      // 年内后果:本回合中 schedule(afterRounds: 0)的事件,追加到当年队列末尾弹出
      const due = state.scheduled.filter(s => s.dueRound <= state.roundCounter);
      if (due.length > 0) {
        state.scheduled = state.scheduled.filter(s => s.dueRound > state.roundCounter);
        for (const d of due) {
          if (
            !state.eventQueue.includes(d.eventId) &&
            !state.triggeredEventIds.includes(d.eventId)
          ) {
            state.eventQueue.push(d.eventId);
          }
        }
      }
    }
    if (state.eventCursor < state.eventQueue.length) {
      state.screen = 'EVENT';
    } else {
      enterSettlement(state, rng);
    }
  }

  function handle(state: GameState, action: PlayerAction, rng: Rng): void {
    switch (state.screen) {
      case 'TITLE':
        if (action.type !== 'START') invalid(state, action);
        enterPhase(state, rng, 0);
        return;
      case 'BACKGROUND_DRAW': {
        if (action.type !== 'CHOOSE_TRAITS') invalid(state, action);
        const offer = state.traitOffer ?? [];
        const expected = Math.min(TRAIT_PICK_COUNT, offer.length);
        const chosen = [...new Set(action.traitIds)];
        if (action.traitIds.length !== expected || chosen.length !== expected) {
          throw new Error(`CHOOSE_TRAITS expects ${expected} distinct traits`);
        }
        for (const id of chosen) {
          if (!offer.includes(id)) throw new Error(`CHOOSE_TRAITS trait not in offer: ${id}`);
        }
        for (const id of chosen) {
          state.flags[id] = true;
          const mods = pack.traits.find(t => t.id === id)?.statMods;
          for (const [key, delta] of Object.entries(mods ?? {}) as [StatKey, number][]) {
            const next = state.stats[key] + delta;
            state.stats[key] = key === 'money' ? Math.max(0, next) : Math.max(0, Math.min(100, next));
          }
        }
        state.traitOffer = [];
        nextFlowStep(state, rng);
        return;
      }
      case 'SETUP': {
        if (action.type !== 'CHOOSE_SETUP') invalid(state, action);
        // 容错默认 male:旧 actionLog 回放时 gender 可能缺失,不抛错
        state.flags.player_gender = action.gender === 'female' ? 'female' : 'male';
        state.profile.track = action.track;
        nextFlowStep(state, rng);
        return;
      }
      case 'EXAM': {
        if (action.type === 'SKIP_EXAM') {
          // 跳过剩余题目,按默认得分率(55%)折算,相当于发挥平平的一次考试
          const remaining = state.examPaper.slice(state.examCursor);
          const remainingPoints = remaining.reduce(
            (sum, qid) => sum + (questionsById.get(qid)?.difficulty ?? 1),
            0,
          );
          state.examCorrect += Math.round(remaining.length * EXAM_SKIP_RATE);
          state.examEarnedPoints += remainingPoints * EXAM_SKIP_RATE;
          state.examCursor = state.examPaper.length;
          resolveExamScore(state, rng);
          return;
        }
        if (action.type !== 'ANSWER') invalid(state, action);
        const qid = state.examPaper[state.examCursor];
        const q: ExamQuestion | undefined = qid ? questionsById.get(qid) : undefined;
        if (!q) throw new Error('ANSWER without a current question');
        if (action.optionIndex === q.answerIndex) {
          state.examCorrect += 1;
          state.examEarnedPoints += q.difficulty ?? 1;
        }
        state.examCursor += 1;
        if (state.examCursor >= state.examPaper.length) resolveExamScore(state, rng);
        return;
      }
      case 'EXAM_RESULT':
        if (action.type !== 'CONTINUE') invalid(state, action);
        nextFlowStep(state, rng);
        return;
      case 'APPLICATION':
        if (action.type !== 'APPLY') invalid(state, action);
        handleApplication(state, rng, action.optionId, action.majorId);
        return;
      case 'CROSSROAD':
        if (action.type !== 'CHOOSE_CROSSROAD') invalid(state, action);
        handleCrossroad(state, action.optionId);
        return;
      case 'BRIEF':
        if (action.type !== 'CONTINUE') invalid(state, action);
        if (state.eventQueue.length > 0) {
          state.screen = 'EVENT';
        } else {
          enterSettlement(state, rng);
        }
        return;
      case 'EVENT':
        if (action.type !== 'CHOOSE') invalid(state, action);
        resolveChoice(state, rng, action.choiceId);
        return;
      case 'OUTCOME':
        if (action.type !== 'CONTINUE') invalid(state, action);
        continueAfterOutcome(state, rng);
        return;
      case 'SETTLEMENT':
        if (action.type !== 'CONTINUE') invalid(state, action);
        settleRound(state, rng);
        return;
      case 'ENDING':
        invalid(state, action);
    }
  }

  function dispatch(state: GameState, action: PlayerAction): GameState {
    const next = clone(state);
    const rng = new Rng(next.rngState);
    try {
      handle(next, action, rng);
    } finally {
      next.rngState = rng.state;
    }
    return next;
  }

  return { start, view, dispatch };
}
