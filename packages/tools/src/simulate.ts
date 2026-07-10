import {
  createEngine,
  evalCondition,
  Rng,
  type GameState,
  type PlayerAction,
  type StatKey,
  type ViewModel,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';
import { pathToFileURL } from 'node:url';

export type Strategy = 'random' | 'money' | 'mindset' | 'score';

interface CliArgs {
  runs: number;
  seed: number | null;
  verbose: boolean;
  check: boolean;
  strategy: Strategy;
  compare: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    runs: 200,
    seed: null,
    verbose: false,
    check: false,
    strategy: 'random',
    compare: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '-n' || a === '--runs') && argv[i + 1]) args.runs = Number(argv[++i]);
    else if (a === '--seed' && argv[i + 1]) args.seed = Number(argv[++i]);
    else if (a === '--verbose' || a === '-v') args.verbose = true;
    else if (a === '--check') args.check = true;
    else if (a === '--compare') args.compare = true;
    else if (a === '--bot' && argv[i + 1]) {
      const s = argv[++i];
      if (s === 'random' || s === 'money' || s === 'mindset' || s === 'score') args.strategy = s;
      else throw new Error(`unknown bot strategy: ${s}(可选 random/money/mindset/score)`);
    }
  }
  return args;
}

const engine = createEngine(contentPack);
const eventsById = new Map(contentPack.events.map(e => [e.id, e]));
const backgroundLabels = new Map(contentPack.backgrounds.map(b => [b.id, b.label]));
const CAREER_LABELS: Record<string, string> = {
  cs: '计算机',
  education: '教育',
  gov: '体制内',
  local: '县城/本地',
  finance: '金融',
  medicine: '医学',
  psychology: '心理',
};
const STRATEGY_LABELS: Record<Strategy, string> = {
  random: '随机',
  money: '卷钱',
  mindset: '保心态',
  score: '卷总分',
};

/** 与 engine.computeScore 同一套权重(直接读内容包配置):模拟"看得出哪个选项得分"的玩家 */
const packScoring = contentPack.meta.scoring ?? {
  weights: { knowledge: 0.2, money: 0.25, mindset: 0.2, network: 0.15, health: 0.2 },
  moneyFullScore: 600000,
};
const SCORE_WEIGHTS: Record<StatKey, number> = {
  ...packScoring.weights,
  // money 权重按满分线折算成"每元多少分"
  money: (packScoring.weights.money * 100) / packScoring.moneyFullScore,
};

/** 贪心 bot 的选项打分:按 outcome 权重求某项数值变化的期望(条件用一次性 RNG 求值,不污染对局随机流) */
function expectedStatDelta(
  eventId: string,
  choiceId: string,
  state: GameState,
  stat: StatKey,
): number {
  const event = eventsById.get(eventId);
  const choice = event?.choices.find(c => c.id === choiceId);
  if (!choice) return 0;
  const probe = new Rng(0x9e3779b9);
  const ctx = { state, pack: contentPack, rng: probe };
  const eligible = choice.outcomes.filter(o => evalCondition(o.condition, ctx));
  const pool = eligible.length > 0 ? eligible : choice.outcomes;
  const totalWeight = pool.reduce((sum, o) => sum + o.weight, 0) || 1;
  let expectation = 0;
  for (const outcome of pool) {
    let delta = 0;
    for (const effect of outcome.effects) {
      if ('stats' in effect) delta += effect.stats[stat] ?? 0;
      if ('moneyCost' in effect && stat === 'money') {
        const { rate, min = 0, max = Infinity, roundTo } = effect.moneyCost;
        const raw = state.stats.money * rate;
        const bounded = Math.max(min, Math.min(max, raw));
        const rounded = roundTo && roundTo > 0 ? Math.round(bounded / roundTo) * roundTo : Math.round(bounded);
        delta -= Math.max(0, Math.min(state.stats.money, rounded));
      }
      if ('setStat' in effect && effect.setStat === stat) delta += effect.value - state.stats[stat];
    }
    expectation += (outcome.weight / totalWeight) * delta;
  }
  return expectation;
}

function botAction(
  view: ViewModel,
  bot: Rng,
  strategy: Strategy,
  state: GameState,
): PlayerAction {
  switch (view.kind) {
    case 'TITLE':
      return { type: 'START' };
    case 'BACKGROUND_DRAW':
      // 随机选满 pickCount 个特质(策略 bot 不做特质期望计算)
      return {
        type: 'CHOOSE_TRAITS',
        traitIds: bot.sample(view.traitOffer, view.pickCount).map(t => t.id),
      };
    case 'EXAM_RESULT':
    case 'BRIEF':
    case 'OUTCOME':
    case 'SETTLEMENT':
      return { type: 'CONTINUE' };
    case 'SETUP':
      return {
        type: 'CHOOSE_SETUP',
        gender: bot.pick(view.genders),
        track: bot.pick(view.tracks),
      };
    case 'EXAM':
      return { type: 'ANSWER', optionIndex: bot.int(0, view.question.options.length - 1) };
    case 'APPLICATION':
      const appOpt = bot.pick(view.options);
      return { type: 'APPLY', optionId: appOpt.id, majorId: bot.pick(appOpt.majors).id };
    case 'NPC_SELECTION':
      return {
        type: 'CHOOSE_NPCS',
        npcIds: bot.sample(view.npcs, view.pickCount).map(npc => npc.id),
      };
    case 'LIFE_GOAL':
      return { type: 'CHOOSE_LIFE_GOAL', goalId: bot.pick(view.goals).id };
    case 'CROSSROAD': {
      const preferred =
        strategy === 'money' ? 'job' : strategy === 'mindset' ? 'civil_service' : null;
      const hit = preferred && view.options.find(o => o.id === preferred);
      return { type: 'CHOOSE_CROSSROAD', optionId: hit ? hit.id : bot.pick(view.options).id };
    }
    case 'EVENT': {
      if (strategy === 'random') return { type: 'CHOOSE', choiceId: bot.pick(view.choices).id };
      const scoreOf = (choiceId: string): number => {
        if (strategy === 'score') {
          return (Object.keys(SCORE_WEIGHTS) as StatKey[]).reduce(
            (sum, key) => sum + SCORE_WEIGHTS[key] * expectedStatDelta(view.eventId, choiceId, state, key),
            0,
          );
        }
        return expectedStatDelta(view.eventId, choiceId, state, strategy === 'money' ? 'money' : 'mindset');
      };
      let best: string[] = [];
      let bestScore = -Infinity;
      for (const choice of view.choices) {
        const score = scoreOf(choice.id);
        if (score > bestScore + 1e-9) {
          bestScore = score;
          best = [choice.id];
        } else if (Math.abs(score - bestScore) <= 1e-9) {
          best.push(choice.id);
        }
      }
      return { type: 'CHOOSE', choiceId: bot.pick(best) };
    }
    case 'ENDING':
      throw new Error('botAction called on ENDING view');
  }
}

export interface RunResult {
  endingId: string;
  endingTitle: string;
  endingScore: number;
  finalState: GameState;
  mindsetByYear: Array<[number, number]>;
  steps: number;
  presentationHits: string[];
  contextLineHits: string[];
}

function fmtDeltas(deltas: Record<string, number | undefined>): string {
  const parts = Object.entries(deltas)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([k, v]) => `${k}${v! > 0 ? '+' : ''}${v}`);
  return parts.length > 0 ? `  [${parts.join(', ')}]` : '';
}

export function runOne(seed: number, botSeed: number, strategy: Strategy, verbose: boolean): RunResult {
  let state = engine.start(seed);
  const bot = new Rng(botSeed);
  const mindsetByYear: Array<[number, number]> = [];
  const presentationHits: string[] = [];
  const contextLineHits: string[] = [];
  let steps = 0;
  const log = (line: string) => {
    if (verbose) console.log(line);
  };

  while (steps < 1000) {
    const view = engine.view(state);
    if (view.kind === 'ENDING') {
      log(`\n🏁 结局:【${view.title}】`);
      log(view.text);
      log(
        `\n最终数值: 学识${state.stats.knowledge} 金钱¥${state.stats.money} 心态${state.stats.mindset} 人脉${state.stats.network} 健康${state.stats.health}`,
      );
      log(`人生总分: ${view.score} (${view.grade} 级)`);
      return {
        endingId: view.endingId,
        endingTitle: view.title,
        endingScore: view.score,
        finalState: state,
        mindsetByYear,
        steps,
        presentationHits,
        contextLineHits,
      };
    }
    const action = botAction(view, bot, strategy, state);
    switch (view.kind) {
      case 'BACKGROUND_DRAW': {
        const picked =
          action.type === 'CHOOSE_TRAITS'
            ? view.traitOffer
                .filter(t => action.traitIds.includes(t.id))
                .map(t => t.label)
                .join(' × ')
            : '';
        log(`\n🎴 家境:${view.card.label} (初始资金 ¥${view.card.initialMoney}) · 特质:${picked}`);
        break;
      }
      case 'EXAM_RESULT':
        log(`\n📝 高考出分:${view.score} 分 (答对 ${view.correct}/${view.total})`);
        break;
      case 'APPLICATION':
        if (action.type === 'APPLY') {
          const opt = view.options.find(o => o.id === action.optionId);
          log(`🎓 志愿:${opt?.label}${opt?.risky ? '(有滑档风险)' : ''}`);
        }
        break;
      case 'NPC_SELECTION':
        if (action.type === 'CHOOSE_NPCS') {
          const names = [...view.requiredNpcs, ...view.npcs.filter(npc => action.npcIds.includes(npc.id))]
            .map(npc => npc.name)
            .join(' × ');
          log(`🤝 重要的人:${names}`);
        }
        break;
      case 'LIFE_GOAL':
        if (action.type === 'CHOOSE_LIFE_GOAL') {
          log(`🧭 人生目标:${view.goals.find(goal => goal.id === action.goalId)?.label}`);
        }
        break;
      case 'CROSSROAD':
        if (action.type === 'CHOOSE_CROSSROAD') {
          const opt = view.options.find(o => o.id === action.optionId);
          log(`\n🎒 毕业三岔口:${opt?.label}`);
        }
        break;
      case 'BRIEF':
        mindsetByYear.push([view.year, state.stats.mindset]);
        log(`\n===== ${view.year} 年 · ${view.phaseLabel} =====`);
        log(view.text);
        break;
      case 'EVENT':
        if (action.type === 'CHOOSE') {
          const event = eventsById.get(view.eventId);
          if (event) {
            // 与 engine.view 使用相同初始 RNG 与求值顺序，记录玩家本次真正看到的条件文案。
            const probe = new Rng(state.rngState);
            const ctx = { state, pack: contentPack, rng: probe };
            const presentationIndex = event.presentationVariants?.findIndex(variant =>
              evalCondition(variant.condition, ctx),
            ) ?? -1;
            const contextLineIndex = event.contextLines?.findIndex(line =>
              evalCondition(line.condition, ctx),
            ) ?? -1;
            if (presentationIndex >= 0) presentationHits.push(`${event.id}#${presentationIndex}`);
            if (contextLineIndex >= 0) contextLineHits.push(`${event.id}#${contextLineIndex}`);
          }
          const choice = view.choices.find(c => c.id === action.choiceId);
          log(`\n▶ ${view.title}`);
          log(`  选择:${choice?.text}`);
        }
        break;
      case 'OUTCOME':
        log(`  ${view.text}${fmtDeltas(view.deltas)}`);
        break;
      default:
        break;
    }
    state = engine.dispatch(state, action);
    steps++;
  }
  throw new Error(`Run did not finish within 1000 steps (seed=${seed})`);
}

function percentile(sorted: number[], p: number): number {
  return sorted[Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length))] ?? 0;
}

interface BatchStats {
  strategy: Strategy;
  runs: number;
  endingCounts: Map<string, { title: string; count: number; moneySum: number; scoreSum: number }>;
  eventsSeen: Set<string>;
  totalRounds: number;
  statSums: Record<StatKey, number>;
  scoreSum: number;
  moneySamples: number[];
  mindsetSamples: number[];
  earlyEndingCount: number;
  byBackground: Map<string, { count: number; moneySum: number; mindsetSum: number; scoreSum: number }>;
  byCareer: Map<string, { count: number; moneySum: number; mindsetSum: number; scoreSum: number }>;
  mindsetYearly: Map<number, number[]>;
}

function runBatch(runs: number, baseSeed: number, strategy: Strategy): BatchStats {
  const stats: BatchStats = {
    strategy,
    runs,
    endingCounts: new Map(),
    eventsSeen: new Set(),
    totalRounds: 0,
    statSums: { knowledge: 0, money: 0, mindset: 0, network: 0, health: 0 },
    scoreSum: 0,
    moneySamples: [],
    mindsetSamples: [],
    earlyEndingCount: 0,
    byBackground: new Map(),
    byCareer: new Map(),
    mindsetYearly: new Map(),
  };
  const earlyEndingIds = new Set(
    contentPack.endings.filter(e => e.category === 'early').map(e => e.id),
  );

  for (let i = 0; i < runs; i++) {
    const result = runOne(baseSeed + i, (baseSeed + i) ^ 0x5eed, strategy, false);
    const fs = result.finalState;
    const entry = stats.endingCounts.get(result.endingId) ?? {
      title: result.endingTitle,
      count: 0,
      moneySum: 0,
      scoreSum: 0,
    };
    entry.count++;
    entry.moneySum += fs.stats.money;
    entry.scoreSum += result.endingScore;
    stats.endingCounts.set(result.endingId, entry);
    stats.totalRounds += fs.roundCounter;
    for (const h of fs.history) {
      if (h.kind === 'event') stats.eventsSeen.add(h.eventId);
    }
    for (const key of ['knowledge', 'money', 'mindset', 'network', 'health'] as StatKey[]) {
      stats.statSums[key] += fs.stats[key];
    }
    stats.scoreSum += result.endingScore;
    stats.moneySamples.push(fs.stats.money);
    stats.mindsetSamples.push(fs.stats.mindset);
    if (earlyEndingIds.has(result.endingId)) stats.earlyEndingCount++;

    const bgKey =
      backgroundLabels.get(fs.profile.background ?? '') ?? fs.profile.background ?? '未知';
    const careerKey = fs.profile.career
      ? (CAREER_LABELS[fs.profile.career] ?? fs.profile.career)
      : '未定线';
    for (const [map, key] of [
      [stats.byBackground, bgKey],
      [stats.byCareer, careerKey],
    ] as const) {
      const g = map.get(key) ?? { count: 0, moneySum: 0, mindsetSum: 0, scoreSum: 0 };
      g.count++;
      g.moneySum += fs.stats.money;
      g.mindsetSum += fs.stats.mindset;
      g.scoreSum += result.endingScore;
      map.set(key, g);
    }
    for (const [year, mindset] of result.mindsetByYear) {
      const arr = stats.mindsetYearly.get(year) ?? [];
      arr.push(mindset);
      stats.mindsetYearly.set(year, arr);
    }
  }
  stats.moneySamples.sort((a, b) => a - b);
  stats.mindsetSamples.sort((a, b) => a - b);
  return stats;
}

function printBatch(s: BatchStats): void {
  console.log('结局分布:');
  const sorted = [...s.endingCounts.entries()].sort((a, b) => b[1].count - a[1].count);
  for (const [id, { title, count, moneySum, scoreSum }] of sorted) {
    const pct = ((count / s.runs) * 100).toFixed(1).padStart(5);
    console.log(
      `  ${pct}%  【${title}】 (${id}, ${count} 局, 均分${Math.round(scoreSum / count)}, 均财¥${Math.round(moneySum / count).toLocaleString()})`,
    );
  }
  const missingEndings = contentPack.endings.filter(e => !s.endingCounts.has(e.id));
  if (missingEndings.length > 0) {
    console.log(`\n⚠️  从未到达的结局: ${missingEndings.map(e => e.id).join(', ')}`);
  }
  console.log(`\n事件覆盖: ${s.eventsSeen.size}/${contentPack.events.length}`);
  const missedEvents = contentPack.events.filter(e => !s.eventsSeen.has(e.id));
  if (missedEvents.length > 0) {
    console.log(`  未触发过的事件: ${missedEvents.map(e => e.id).join(', ')}`);
  }
  console.log(`平均回合数: ${(s.totalRounds / s.runs).toFixed(1)}`);
  console.log(
    `平均最终数值: 学识${(s.statSums.knowledge / s.runs).toFixed(0)} 金钱¥${(s.statSums.money / s.runs).toFixed(0)} 心态${(s.statSums.mindset / s.runs).toFixed(0)} 人脉${(s.statSums.network / s.runs).toFixed(0)} 健康${(s.statSums.health / s.runs).toFixed(0)} · 均分${(s.scoreSum / s.runs).toFixed(0)}`,
  );
  console.log(
    `金钱分位: p10=¥${percentile(s.moneySamples, 10)} p50=¥${percentile(s.moneySamples, 50)} p90=¥${percentile(s.moneySamples, 90)}`,
  );
  console.log(
    `心态分位: p10=${percentile(s.mindsetSamples, 10)} p50=${percentile(s.mindsetSamples, 50)} p90=${percentile(s.mindsetSamples, 90)}`,
  );
  console.log(`提前结局占比: ${((s.earlyEndingCount / s.runs) * 100).toFixed(1)}%`);

  const printGroups = (
    label: string,
    map: BatchStats['byBackground'],
  ): void => {
    console.log(`\n${label}:`);
    const rows = [...map.entries()].sort((a, b) => b[1].count - a[1].count);
    for (const [key, g] of rows) {
      console.log(
        `  ${key.padEnd(6, ' ')} ${String(g.count).padStart(4)} 局  均财¥${Math.round(g.moneySum / g.count).toLocaleString().padStart(9)}  心态均值${Math.round(g.mindsetSum / g.count)}  均分${Math.round(g.scoreSum / g.count)}`,
      );
    }
  };
  printGroups('按家境分组', s.byBackground);
  printGroups('按职业线分组', s.byCareer);

  const years = [...s.mindsetYearly.keys()].sort((a, b) => a - b);
  if (years.length > 0) {
    const curve = years
      .map(y => {
        const arr = [...(s.mindsetYearly.get(y) ?? [])].sort((a, b) => a - b);
        return `${y}:${percentile(arr, 50)}`;
      })
      .join(' ');
    console.log(`\n心态年度中位数(年初): ${curve}`);
  }
}

function runCheck(s: BatchStats): void {
  const failures: string[] = [];
  if (s.eventsSeen.size < contentPack.events.length) {
    failures.push(`事件覆盖不完整: ${s.eventsSeen.size}/${contentPack.events.length}`);
  }
  for (const ending of contentPack.endings) {
    const entry = s.endingCounts.get(ending.id);
    if (!entry) {
      failures.push(`结局从未到达: ${ending.id}`);
    } else if (entry.count / s.runs > 0.4) {
      failures.push(
        `结局占比过高(>40%): ${ending.id} ${((entry.count / s.runs) * 100).toFixed(1)}%`,
      );
    }
  }
  const fallback = s.endingCounts.get(contentPack.meta.fallbackEndingId);
  if (fallback && fallback.count / s.runs > 0.35) {
    failures.push(`兜底结局占比过高(>35%): ${((fallback.count / s.runs) * 100).toFixed(1)}%`);
  }
  if (s.earlyEndingCount / s.runs > 0.1) {
    failures.push(`提前结局占比过高(>10%): ${((s.earlyEndingCount / s.runs) * 100).toFixed(1)}%`);
  }
  console.log('');
  if (failures.length > 0) {
    for (const f of failures) console.log(`❌ ${f}`);
    process.exit(1);
  }
  console.log('✅ 分布目标校验通过(全覆盖、全可达、无结局>40%、兜底≤35%、提前结局≤10%)');
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.verbose) {
    const seed = args.seed ?? Math.floor(Math.random() * 2147483646) + 1;
    console.log(`《${contentPack.meta.title}》 seed=${seed} bot=${STRATEGY_LABELS[args.strategy]}\n`);
    runOne(seed, seed ^ 0x5eed, args.strategy, true);
    return;
  }

  const baseSeed = args.seed ?? 42;

  if (args.compare) {
    console.log(`策略对比,每种策略 ${args.runs} 局 (baseSeed=${baseSeed}) ...\n`);
    const batches = (['random', 'money', 'mindset', 'score'] as Strategy[]).map(strategy =>
      runBatch(args.runs, baseSeed, strategy),
    );
    console.log('策略     均分  均财        心态均值  崩溃率   Top 结局');
    for (const b of batches) {
      const top = [...b.endingCounts.entries()].sort((x, y) => y[1].count - x[1].count)[0];
      const topText = top
        ? `${top[1].title} ${((top[1].count / b.runs) * 100).toFixed(0)}%`
        : '-';
      console.log(
        `${STRATEGY_LABELS[b.strategy].padEnd(4, ' ')}  ${String(Math.round(b.scoreSum / b.runs)).padStart(4)}  ¥${Math.round(b.statSums.money / b.runs).toLocaleString().padStart(9)}  ${String(Math.round(b.statSums.mindset / b.runs)).padStart(6)}  ${((b.earlyEndingCount / b.runs) * 100).toFixed(1).padStart(5)}%   ${topText}`,
      );
    }
    console.log('\n(各策略结局分布)');
    for (const b of batches) {
      console.log(`\n--- ${STRATEGY_LABELS[b.strategy]} bot ---`);
      const sorted = [...b.endingCounts.entries()].sort((x, y) => y[1].count - x[1].count);
      for (const [id, { title, count }] of sorted.slice(0, 6)) {
        console.log(`  ${(((count / b.runs) * 100).toFixed(1)).padStart(5)}%  【${title}】 (${id})`);
      }
    }
    return;
  }

  console.log(
    `模拟 ${args.runs} 局 (baseSeed=${baseSeed}, bot=${STRATEGY_LABELS[args.strategy]}) ...`,
  );
  const t0 = Date.now();
  const batch = runBatch(args.runs, baseSeed, args.strategy);
  const elapsed = Date.now() - t0;
  console.log(`\n完成,耗时 ${elapsed}ms (${(elapsed / args.runs).toFixed(2)}ms/局)\n`);
  printBatch(batch);
  if (args.check) runCheck(batch);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
