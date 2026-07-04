import type { Condition, Effect } from '@life-sim/core';
import { contentPack } from '@life-sim/content';

interface Issue {
  level: 'error' | 'warn';
  message: string;
}

const issues: Issue[] = [];

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
checkUnique('background', contentPack.backgrounds.map(b => b.id));

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
      visitCondition(outcome.condition, cond => {
        if ('fn' in cond && !fnIds.has(cond.fn)) error(`outcome ${event.id}.${choice.id} references missing condition fn: ${cond.fn}`);
      });
      visitEffects(outcome.effects, effect => {
        if ('schedule' in effect && !eventIds.has(effect.schedule.eventId)) {
          error(`event ${event.id} schedules missing event: ${effect.schedule.eventId}`);
        } else if ('triggerEnding' in effect && !endingIds.has(effect.triggerEnding)) {
          error(`event ${event.id} triggers missing ending: ${effect.triggerEnding}`);
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

const errors = issues.filter(i => i.level === 'error');
const warnings = issues.filter(i => i.level === 'warn');

console.log(`校验内容包 ${contentPack.meta.id}@${contentPack.meta.version}`);
console.log(`事件 ${contentPack.events.length}, 结局 ${contentPack.endings.length}, NPC ${contentPack.npcs.length}, 题目 ${contentPack.examBank.length}, 收入规则 ${contentPack.incomes.length}`);
for (const issue of issues) {
  console.log(`${issue.level === 'error' ? 'ERROR' : 'WARN'} ${issue.message}`);
}
console.log(`\n完成: ${errors.length} errors, ${warnings.length} warnings`);

if (errors.length > 0) process.exit(1);
