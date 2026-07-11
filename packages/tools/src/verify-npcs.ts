import assert from 'node:assert/strict';
import {
  applyEffects,
  createEngine,
  evalCondition,
  Rng,
  type EventChoice,
  type GameEvent,
  type GameState,
  type ChoiceOutcome,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';

function makeState(npcId: string, stage: string, warmTag: string, warmCount: number): GameState {
  const state = createEngine(contentPack).start(53);
  state.date = { year: 2026, month: 1 };
  state.npcs = { [npcId]: { favor: 50, stage } };
  state.history = Array.from({ length: warmCount }, (_, index) => ({
    kind: 'event' as const,
    year: 2015 + index,
    eventId: `fixture_${warmTag}_${index}`,
    category: 'npc',
    choiceId: 'warm',
    outcomeTag: warmTag,
  }));
  return state;
}

function event(eventId: string): GameEvent {
  const found = contentPack.events.find(candidate => candidate.id === eventId);
  assert.ok(found, `missing event ${eventId}`);
  return found;
}

function conditionMatches(state: GameState, condition: EventChoice['visibleIf'] | ChoiceOutcome['condition']): boolean {
  return evalCondition(condition, { state, pack: contentPack, rng: new Rng(53) });
}

function visibleChoiceIds(eventId: string, state: GameState): string[] {
  return event(eventId).choices.filter(choice => conditionMatches(state, choice.visibleIf)).map(choice => choice.id);
}

function resolveUniqueOutcome(eventId: string, choiceId: string, state: GameState): ChoiceOutcome {
  const choice = event(eventId).choices.find(candidate => candidate.id === choiceId);
  assert.ok(choice, `missing choice ${eventId}/${choiceId}`);
  const eligible = choice.outcomes.filter(outcome => conditionMatches(state, outcome.condition));
  assert.equal(eligible.length, 1, `${eventId}/${choiceId} should have exactly one eligible outcome`);
  return eligible[0]!;
}

function applyChoice(eventId: string, choiceId: string, state: GameState): void {
  const outcome = resolveUniqueOutcome(eventId, choiceId, state);
  applyEffects(outcome.effects, state, contentPack);
}

// 卷王:三次暖回应只命中“真正的镜子”,普通 mirror_friend outcome 必须被排除。
{
  const warm = makeState('grinder', 'mirror_friend', 'grinder_warm', 3);
  applyChoice('ev_npc_grinder_2024', 'a', warm);
  assert.equal(warm.npcs.grinder?.stage, 'parallel_lives');
  assert.equal(warm.flags.grinder_true_mirror, true);

  const fallback = makeState('grinder', 'mirror_friend', 'grinder_warm', 2);
  const outcome = resolveUniqueOutcome('ev_npc_grinder_2024', 'a', fallback);
  assert.equal(outcome.effects.some(effect => 'setFlag' in effect && effect.setFlag === 'grinder_true_mirror'), false);
}

// 发小:累计两次暖意时专属选项和“重新讲讲”兜底严格互斥。
{
  const warm = makeState('hometown_friend', 'settled_close', 'hometown_warm', 2);
  assert.ok(visibleChoiceIds('ev_npc_hometown_reunion', warm).includes('a_true_friend'));
  assert.ok(!visibleChoiceIds('ev_npc_hometown_reunion', warm).includes('a_reconnected'));
  applyChoice('ev_npc_hometown_reunion', 'a_true_friend', warm);
  assert.equal(warm.flags.hometown_true_friend, true);
  assert.equal(warm.npcs.hometown_friend?.stage, 'close');

  const fallback = makeState('hometown_friend', 'settled_close', 'hometown_warm', 1);
  assert.ok(!visibleChoiceIds('ev_npc_hometown_reunion', fallback).includes('a_true_friend'));
  assert.ok(visibleChoiceIds('ev_npc_hometown_reunion', fallback).includes('a_reconnected'));
}

// 初恋:三次暖意解锁高铁票领证;2024 的累积告别 outcome 也与普通文案互斥。
{
  const marriage = makeState('first_love', 'steady', 'love_warm', 3);
  const marriageChoices = visibleChoiceIds('ev_love_marriage', marriage);
  assert.ok(marriageChoices.includes('a_true_companion'));
  assert.ok(!marriageChoices.includes('a'));
  applyChoice('ev_love_marriage', 'a_true_companion', marriage);
  assert.equal(marriage.flags.love_true_companion, true);
  assert.equal(marriage.npcs.first_love?.stage, 'married');

  const closure = makeState('first_love', 'separated', 'love_warm', 2);
  applyChoice('ev_npc_first_love_2024', 'b', closure);
  assert.equal(closure.flags.love_history_closure, true);
  assert.equal(closure.npcs.first_love?.stage, 'memory');

  const fallback = makeState('first_love', 'separated', 'love_warm', 1);
  const outcome = resolveUniqueOutcome('ev_npc_first_love_2024', 'b', fallback);
  assert.equal(outcome.effects.some(effect => 'setFlag' in effect && effect.setFlag === 'love_history_closure'), false);
}

// 室友:三次靠近只显示“创始团队重新报到”,普通举杯选项退为兜底。
{
  const warm = makeState('roommate', 'livestream_comeback', 'roommate_warm', 3);
  const choices = visibleChoiceIds('ev_npc_roommate_2025', warm);
  assert.ok(choices.includes('a_true_partner'));
  assert.ok(!choices.includes('a'));
  applyChoice('ev_npc_roommate_2025', 'a_true_partner', warm);
  assert.equal(warm.flags.roommate_true_partner, true);
  assert.equal(warm.npcs.roommate?.stage, 'old_friend');

  const fallback = makeState('roommate', 'livestream_comeback', 'roommate_warm', 2);
  const fallbackChoices = visibleChoiceIds('ev_npc_roommate_2025', fallback);
  assert.ok(!fallbackChoices.includes('a_true_partner'));
  assert.ok(fallbackChoices.includes('a'));
}

// 贵人:两次独立承担形成传承;交易关系和错过关系各自只有自己的修复选项。
{
  const legacy = makeState('mentor', 'trusted_ally', 'mentor_warm', 2);
  assert.deepEqual(visibleChoiceIds('ev_npc_mentor_advice', legacy), ['a_true_legacy']);
  applyChoice('ev_npc_mentor_advice', 'a_true_legacy', legacy);
  assert.equal(legacy.flags.mentor_true_legacy, true);
  assert.equal(legacy.npcs.mentor?.stage, 'ally');

  const transactional = makeState('mentor', 'transactional', 'mentor_warm', 1);
  assert.deepEqual(visibleChoiceIds('ev_npc_mentor_advice', transactional), ['a_boundary']);

  const missed = makeState('mentor', 'missed', 'mentor_warm', 0);
  assert.deepEqual(visibleChoiceIds('ev_npc_mentor_advice', missed), ['a_missed']);
}

console.log('NPC 专项验证通过:5 条人物线的 historyCount 专属收束、互斥兜底、最终 stage 与 flag 均正确');
