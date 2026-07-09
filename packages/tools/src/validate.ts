import type { Condition, Effect } from '@life-sim/core';
import { contentPack } from '@life-sim/content';

interface Issue {
  level: 'error' | 'warn';
  message: string;
}

const issues: Issue[] = [];
const MAX_FIXED_MONEY_DEBIT = 10000;

function error(message: string): void {
  issues.push({ level: 'error', message });
}

function warn(message: string): void {
  issues.push({ level: 'warn', message });
}

function checkUnique(label: string, ids: string[]): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) error(`${label} id duplicated: ${id}`);
    seen.add(id);
  }
}

function visitCondition(cond: Condition | undefined, visit: (cond: Condition) => void): void {
  if (!cond) return;
  visit(cond);
  if ('all' in cond) for (const c of cond.all) visitCondition(c, visit);
  else if ('any' in cond) for (const c of cond.any) visitCondition(c, visit);
  else if ('not' in cond) visitCondition(cond.not, visit);
}

function visitEffects(effects: Effect[], visit: (effect: Effect) => void): void {
  for (const effect of effects) visit(effect);
}

const eventIds = new Set(contentPack.events.map(e => e.id));
const endingIds = new Set(contentPack.endings.map(e => e.id));
const npcIds = new Set(contentPack.npcs.map(n => n.id));
const fnIds = new Set(Object.keys(contentPack.fns));
const phasePoolIds = new Set(
  contentPack.timeline.flatMap(phase => (phase.kind === 'rounds' ? phase.pools : [])),
);
const eventPoolIds = new Set(contentPack.events.flatMap(e => e.pools));
const scheduledEventIds = new Set<string>();
for (const event of contentPack.events) {
  for (const choice of event.choices) {
    for (const outcome of choice.outcomes) {
      for (const effect of outcome.effects) {
        if ('schedule' in effect) scheduledEventIds.add(effect.schedule.eventId);
      }
    }
  }
}
for (const application of contentPack.applications) {
  for (const effect of [...(application.effects ?? []), ...(application.failEffects ?? [])]) {
    if ('schedule' in effect) scheduledEventIds.add(effect.schedule.eventId);
  }
}

checkUnique('event', contentPack.events.map(e => e.id));
checkUnique('income', contentPack.incomes.map(i => i.id));
for (const income of contentPack.incomes) {
  visitCondition(income.when, cond => {
    if ('fn' in cond && !fnIds.has(cond.fn)) error(`income ${income.id} references missing condition fn: ${cond.fn}`);
  });
}
checkUnique('ending', contentPack.endings.map(e => e.id));
checkUnique('npc', contentPack.npcs.map(n => n.id));
checkUnique('exam question', contentPack.examBank.map(q => q.id));
checkUnique('application', contentPack.applications.map(a => a.id));
const KNOWN_TRACK_FLAGS = new Set(['cs', 'education', 'cs_applied', 'management', 'finance', 'medicine', 'psychology']);
for (const application of contentPack.applications) {
  if (application.majors.length === 0) error(`application has no majors: ${application.id}`);
  checkUnique(`application ${application.id} major`, application.majors.map(m => m.id));
  for (const major of application.majors) {
    if (!KNOWN_TRACK_FLAGS.has(major.trackFlag)) {
      error(`application ${application.id} major ${major.id} has unknown trackFlag: ${major.trackFlag}`);
    }
  }
}
checkUnique('background', contentPack.backgrounds.map(b => b.id));

// ---- 特质校验 ----
checkUnique('trait', contentPack.traits.map(t => t.id));
const traitIds = new Set(contentPack.traits.map(t => t.id));
const eventCategories = new Set(
  contentPack.events.map(e => e.category).filter((c): c is string => Boolean(c)),
);
for (const trait of contentPack.traits) {
  if (!trait.id.startsWith('trait_')) error(`trait id must start with "trait_": ${trait.id}`);
  if (!trait.label.trim()) error(`trait has empty label: ${trait.id}`);
  if (!trait.text.trim()) error(`trait has empty text: ${trait.id}`);
  for (const [category, bias] of Object.entries(trait.poolBias ?? {})) {
    if (!(bias > 0 && bias <= 5)) {
      error(`trait ${trait.id} poolBias.${category} out of range (0, 5]: ${bias}`);
    }
    if (!eventCategories.has(category)) {
      error(`trait ${trait.id} poolBias references unknown event category: ${category}`);
    }
  }
}
// 条件里引用的 trait_ flag 必须真实存在;内容不得 setFlag 特质(特质只在开局抽取时赋值)
function checkTraitFlagRefs(owner: string, cond: Condition | undefined): void {
  visitCondition(cond, c => {
    if ('flag' in c && c.flag.startsWith('trait_') && !traitIds.has(c.flag)) {
      error(`${owner} references unknown trait flag: ${c.flag}`);
    }
  });
}
for (const event of contentPack.events) {
  checkTraitFlagRefs(`event ${event.id} trigger`, event.trigger);
  for (const choice of event.choices) {
    checkTraitFlagRefs(`event ${event.id} choice ${choice.id} visibleIf`, choice.visibleIf);
    for (const outcome of choice.outcomes) {
      checkTraitFlagRefs(`event ${event.id} choice ${choice.id} outcome`, outcome.condition);
      for (const effect of outcome.effects) {
        if ('setFlag' in effect && effect.setFlag.startsWith('trait_')) {
          error(`event ${event.id} sets trait flag via setFlag (traits are draw-only): ${effect.setFlag}`);
        }
      }
    }
  }
}
for (const ending of contentPack.endings) checkTraitFlagRefs(`ending ${ending.id}`, ending.condition);
for (const income of contentPack.incomes) checkTraitFlagRefs(`income ${income.id}`, income.when);
for (const npc of contentPack.npcs) {
  for (const [stageId, stage] of Object.entries(npc.stages)) {
    checkTraitFlagRefs(`npc ${npc.id} stage ${stageId}`, stage.advanceWhen);
  }
}

for (const track of ['文', '理'] as const) {
  const available = contentPack.examBank.filter(q => q.track === 'both' || q.track === track);
  if (available.length < contentPack.meta.examQuestionCount) {
    error(`not enough exam questions for ${track}: ${available.length}/${contentPack.meta.examQuestionCount}`);
  }
}

for (const question of contentPack.examBank) {
  if (question.options.length < 2) error(`exam question has too few options: ${question.id}`);
  if (question.answerIndex < 0 || question.answerIndex >= question.options.length) {
    error(`exam question answerIndex out of range: ${question.id}`);
  }
  if (question.difficulty !== undefined && (question.difficulty < 1 || question.difficulty > 5)) {
    error(`exam question difficulty out of range: ${question.id}`);
  }
}

if (!endingIds.has(contentPack.meta.fallbackEndingId)) {
  error(`fallback ending not found: ${contentPack.meta.fallbackEndingId}`);
}

const finalPhases = contentPack.timeline.filter(p => p.kind === 'rounds' && p.isFinal);
if (finalPhases.length !== 1) error(`expected exactly one final phase, found ${finalPhases.length}`);

for (const pool of phasePoolIds) {
  if (pool === 'npc') continue;
  if (!eventPoolIds.has(pool)) warn(`phase references pool with no events: ${pool}`);
}

for (const event of contentPack.events) {
  if (event.pools.length === 0 && !scheduledEventIds.has(event.id) && ![...contentPack.npcs].some(npc =>
    Object.values(npc.stages).some(stage => stage.eventId === event.id),
  )) {
    warn(`event has no pool and is not referenced by an NPC stage or schedule: ${event.id}`);
  }
  if (event.choices.length === 0) error(`event has no choices: ${event.id}`);
  visitCondition(event.trigger, cond => {
    if ('fn' in cond && !fnIds.has(cond.fn)) error(`event ${event.id} references missing condition fn: ${cond.fn}`);
    if ('npcFavor' in cond && !npcIds.has(cond.npcFavor)) error(`event ${event.id} references missing npc: ${cond.npcFavor}`);
    if ('npcStage' in cond && !npcIds.has(cond.npcStage)) error(`event ${event.id} references missing npc: ${cond.npcStage}`);
  });
  for (const choice of event.choices) {
    visitCondition(choice.visibleIf, cond => {
      if ('fn' in cond && !fnIds.has(cond.fn)) error(`choice ${event.id}.${choice.id} references missing condition fn: ${cond.fn}`);
    });
    if (choice.outcomes.length === 0) error(`choice has no outcomes: ${event.id}.${choice.id}`);
    for (const outcome of choice.outcomes) {
      if (outcome.weight <= 0) error(`outcome weight must be positive: ${event.id}.${choice.id}`);
      // 结果页只展示 stats 变化:没有任何非零 stats 的 outcome 会让玩家看不到选择反馈
      const hasVisibleStat = outcome.effects.some(
        e =>
          ('stats' in e && Object.values(e.stats).some(v => v !== 0)) ||
          'moneyCost' in e ||
          'setStat' in e,
      );
      if (!hasVisibleStat) {
        error(`outcome has no visible stat change (选完不展示加减分): ${event.id}.${choice.id}`);
      }
      visitCondition(outcome.condition, cond => {
        if ('fn' in cond && !fnIds.has(cond.fn)) error(`outcome ${event.id}.${choice.id} references missing condition fn: ${cond.fn}`);
      });
      visitEffects(outcome.effects, effect => {
        if ('stats' in effect && effect.stats.money !== undefined && effect.stats.money < -MAX_FIXED_MONEY_DEBIT) {
          error(
            `event ${event.id} has large fixed money debit ${effect.stats.money}; use moneyCost for costs above ${MAX_FIXED_MONEY_DEBIT}`,
          );
        }
        if ('schedule' in effect && !eventIds.has(effect.schedule.eventId)) {
          error(`event ${event.id} schedules missing event: ${effect.schedule.eventId}`);
        } else if ('triggerEnding' in effect && !endingIds.has(effect.triggerEnding)) {
          error(`event ${event.id} triggers missing ending: ${effect.triggerEnding}`);
        } else if ('moneyCost' in effect) {
          if (effect.moneyCost.rate < 0 || effect.moneyCost.rate > 1) {
            error(`event ${event.id} has invalid moneyCost rate: ${effect.moneyCost.rate}`);
          }
          if (effect.moneyCost.min !== undefined && effect.moneyCost.min < 0) {
            error(`event ${event.id} has invalid moneyCost min: ${effect.moneyCost.min}`);
          }
          if (effect.moneyCost.max !== undefined && effect.moneyCost.max < 0) {
            error(`event ${event.id} has invalid moneyCost max: ${effect.moneyCost.max}`);
          }
          if (
            effect.moneyCost.min !== undefined &&
            effect.moneyCost.max !== undefined &&
            effect.moneyCost.min > effect.moneyCost.max
          ) {
            error(`event ${event.id} has moneyCost min > max`);
          }
          if (effect.moneyCost.roundTo !== undefined && effect.moneyCost.roundTo <= 0) {
            error(`event ${event.id} has invalid moneyCost roundTo: ${effect.moneyCost.roundTo}`);
          }
        } else if ('setStat' in effect && !['knowledge', 'money', 'mindset', 'network', 'health'].includes(effect.setStat)) {
          error(`event ${event.id} sets unknown stat: ${effect.setStat}`);
        } else if ('npcFavor' in effect && !npcIds.has(effect.npcFavor)) {
          error(`event ${event.id} changes missing npc favor: ${effect.npcFavor}`);
        } else if ('npcStage' in effect && !npcIds.has(effect.npcStage)) {
          error(`event ${event.id} changes missing npc stage: ${effect.npcStage}`);
        } else if ('jumpToPhase' in effect && !contentPack.timeline.some(p => p.id === effect.jumpToPhase)) {
          error(`event ${event.id} jumps to missing phase: ${effect.jumpToPhase}`);
        } else if ('fn' in effect && !fnIds.has(effect.fn)) {
          error(`event ${event.id} references missing effect fn: ${effect.fn}`);
        }
      });
    }
  }
}

for (const npc of contentPack.npcs) {
  if (!npc.stages[npc.initialStage]) error(`npc ${npc.id} initial stage not found: ${npc.initialStage}`);
  for (const [stageId, stage] of Object.entries(npc.stages)) {
    if (stage.eventId && !eventIds.has(stage.eventId)) {
      error(`npc ${npc.id}.${stageId} references missing event: ${stage.eventId}`);
    }
    visitCondition(stage.advanceWhen, cond => {
      if ('fn' in cond && !fnIds.has(cond.fn)) error(`npc ${npc.id}.${stageId} references missing condition fn: ${cond.fn}`);
    });
  }
}

for (const ending of contentPack.endings) {
  visitCondition(ending.condition, cond => {
    if ('fn' in cond && !fnIds.has(cond.fn)) error(`ending ${ending.id} references missing condition fn: ${cond.fn}`);
  });
}

// ---------- 恒假条件静态检查(防 vc-simulator 式死结局) ----------

const gameYearMin = Math.min(
  ...contentPack.timeline.map(p => p.date.year),
);
const finalPhase = contentPack.timeline.find(p => p.kind === 'rounds' && p.isFinal);
const gameYearMax =
  finalPhase && finalPhase.kind === 'rounds' ? finalPhase.date.year + finalPhase.rounds - 1 : 2026;

const BOUNDED_STATS = new Set(['knowledge', 'mindset', 'network', 'health']);

function statBoundsImpossible(stat: string, op: string, value: number): boolean {
  if (!BOUNDED_STATS.has(stat)) return false;
  if (op === '>' && value >= 100) return true;
  if (op === '>=' && value > 100) return true;
  if (op === '<' && value <= 0) return true;
  if (op === '<=' && value < 0) return true;
  if (op === '==' && (value < 0 || value > 100)) return true;
  return false;
}

function allBranchContradicts(children: Condition[]): boolean {
  const lower = new Map<string, number>();
  const upper = new Map<string, number>();
  const flagRequired = new Map<string, boolean | number | string>();
  const flagForbidden = new Set<string>();
  const single = new Map<string, string>(); // background/career/major/npcStage 单值字段
  let yearFrom = gameYearMin;
  let yearTo = gameYearMax;

  for (const child of children) {
    if ('stat' in child) {
      const key = child.stat;
      if (!BOUNDED_STATS.has(key) && key !== 'money') continue;
      if (child.op === '>' ) lower.set(key, Math.max(lower.get(key) ?? -Infinity, child.value + 1));
      if (child.op === '>=') lower.set(key, Math.max(lower.get(key) ?? -Infinity, child.value));
      if (child.op === '<' ) upper.set(key, Math.min(upper.get(key) ?? Infinity, child.value - 1));
      if (child.op === '<=') upper.set(key, Math.min(upper.get(key) ?? Infinity, child.value));
      if (child.op === '==') {
        lower.set(key, Math.max(lower.get(key) ?? -Infinity, child.value));
        upper.set(key, Math.min(upper.get(key) ?? Infinity, child.value));
      }
    } else if ('flag' in child) {
      const want = child.equals ?? true;
      if (flagForbidden.has(child.flag) && want === true) return true;
      const existing = flagRequired.get(child.flag);
      if (existing !== undefined && existing !== want) return true;
      flagRequired.set(child.flag, want);
    } else if ('not' in child && typeof child.not === 'object' && 'flag' in child.not && child.not.equals === undefined) {
      if (flagRequired.get(child.not.flag) === true) return true;
      flagForbidden.add(child.not.flag);
    } else if ('year' in child) {
      yearFrom = Math.max(yearFrom, child.year.from ?? gameYearMin);
      yearTo = Math.min(yearTo, child.year.to ?? gameYearMax);
    } else if ('background' in child) {
      if ((single.get('background') ?? child.background) !== child.background) return true;
      single.set('background', child.background);
    } else if ('career' in child) {
      if ((single.get('career') ?? child.career) !== child.career) return true;
      single.set('career', child.career);
    } else if ('major' in child) {
      if ((single.get('major') ?? child.major) !== child.major) return true;
      single.set('major', child.major);
    } else if ('npcStage' in child) {
      const key = `npcStage:${child.npcStage}`;
      if ((single.get(key) ?? child.stage) !== child.stage) return true;
      single.set(key, child.stage);
    }
  }
  if (yearFrom > yearTo) return true;
  for (const [key, lo] of lower) {
    const hi = upper.get(key);
    if (hi !== undefined && lo > hi) return true;
  }
  return false;
}

function conditionImpossible(cond: Condition | undefined): boolean {
  if (!cond) return false;
  if ('chance' in cond) return cond.chance <= 0;
  if ('stat' in cond) return statBoundsImpossible(cond.stat, cond.op, cond.value);
  if ('year' in cond) {
    const from = cond.year.from ?? gameYearMin;
    const to = cond.year.to ?? gameYearMax;
    return from > to || from > gameYearMax || to < gameYearMin;
  }
  if ('not' in cond) return typeof cond.not === 'object' && 'always' in cond.not;
  if ('all' in cond) {
    if (cond.all.some(conditionImpossible)) return true;
    return allBranchContradicts(cond.all);
  }
  if ('any' in cond) return cond.any.length > 0 && cond.any.every(conditionImpossible);
  return false;
}

for (const ending of contentPack.endings) {
  if (conditionImpossible(ending.condition)) {
    error(`ending condition can never be true (dead ending): ${ending.id}`);
  }
}
for (const event of contentPack.events) {
  if (conditionImpossible(event.trigger)) {
    warn(`event trigger can never be true: ${event.id}`);
  }
  for (const choice of event.choices) {
    if (conditionImpossible(choice.visibleIf)) {
      warn(`choice visibleIf can never be true: ${event.id}.${choice.id}`);
    }
    for (const outcome of choice.outcomes) {
      if (conditionImpossible(outcome.condition)) {
        warn(`outcome condition can never be true: ${event.id}.${choice.id}`);
      }
    }
  }
}

// ---------- 互斥语境词表检查(防"买了房还收到房租涨价"式穿帮) ----------
// 只扫事件标题和正文(不扫 outcome 文案,避免"当年交给房东"这类回忆句误报)。

function conditionRequiresFlag(cond: Condition | undefined, flag: string): boolean {
  if (!cond) return false;
  if ('flag' in cond) return cond.flag === flag && (cond.equals === undefined || cond.equals === true);
  if ('all' in cond) return cond.all.some(c => conditionRequiresFlag(c, flag));
  return false;
}

function conditionForbidsFlag(cond: Condition | undefined, flag: string): boolean {
  if (!cond) return false;
  if ('not' in cond) {
    const inner = cond.not;
    return typeof inner === 'object' && 'flag' in inner && inner.flag === flag && inner.equals === undefined;
  }
  if ('all' in cond) return cond.all.some(c => conditionForbidsFlag(c, flag));
  return false;
}

const MUTEX_TEXT_RULES: { pattern: RegExp; label: string; ok: (trigger?: Condition) => boolean }[] = [
  {
    pattern: /房租|房东|续租|租房软件/,
    label: '租房语境需要 not has_house(或 no_house)门控',
    ok: trigger => conditionForbidsFlag(trigger, 'has_house') || conditionRequiresFlag(trigger, 'no_house'),
  },
  {
    pattern: /相亲/,
    label: '相亲语境需要 not in_love 门控',
    ok: trigger => conditionForbidsFlag(trigger, 'in_love'),
  },
];

for (const event of contentPack.events) {
  const surface = `${event.title} ${event.text}`;
  for (const rule of MUTEX_TEXT_RULES) {
    if (rule.pattern.test(surface) && !rule.ok(event.trigger)) {
      error(`互斥门控缺失(${rule.label}): ${event.id}`);
    }
  }
}

const errors = issues.filter(i => i.level === 'error');
const warnings = issues.filter(i => i.level === 'warn');

console.log(`校验内容包 ${contentPack.meta.id}@${contentPack.meta.version}`);
console.log(`事件 ${contentPack.events.length}, 结局 ${contentPack.endings.length}, NPC ${contentPack.npcs.length}, 题目 ${contentPack.examBank.length}, 收入规则 ${contentPack.incomes.length}, 特质 ${contentPack.traits.length}`);
for (const issue of issues) {
  console.log(`${issue.level === 'error' ? 'ERROR' : 'WARN'} ${issue.message}`);
}
console.log(`\n完成: ${errors.length} errors, ${warnings.length} warnings`);

if (errors.length > 0) process.exit(1);
