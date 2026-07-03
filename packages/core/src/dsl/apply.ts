import type { Effect } from '../types/dsl';
import type { ContentPack } from '../types/content';
import type { GameState } from '../types/state';
import type { StatDeltas, StatKey } from '../types/stats';

function clampStat(key: StatKey, value: number): number {
  if (key === 'money') return Math.max(0, Math.round(value));
  return Math.max(0, Math.min(100, Math.round(value)));
}

export interface ApplyResult {
  deltas: StatDeltas;
}

export function applyEffects(effects: Effect[], state: GameState, pack: ContentPack): ApplyResult {
  const deltas: StatDeltas = {};

  for (const effect of effects) {
    if ('stats' in effect) {
      for (const [k, delta] of Object.entries(effect.stats) as [StatKey, number][]) {
        const before = state.stats[k];
        state.stats[k] = clampStat(k, before + delta);
        deltas[k] = (deltas[k] ?? 0) + (state.stats[k] - before);
      }
    } else if ('setFlag' in effect) {
      state.flags[effect.setFlag] = effect.value ?? true;
    } else if ('npcFavor' in effect) {
      const npc = state.npcs[effect.npcFavor];
      if (npc) npc.favor = Math.max(0, Math.min(100, npc.favor + effect.delta));
    } else if ('npcStage' in effect) {
      const npc = state.npcs[effect.npcStage];
      if (npc) npc.stage = effect.stage;
    } else if ('schedule' in effect) {
      state.scheduled.push({
        eventId: effect.schedule.eventId,
        dueRound: state.roundCounter + effect.schedule.afterRounds,
      });
    } else if ('setCareer' in effect) {
      state.profile.career = effect.setCareer;
    } else if ('jumpToPhase' in effect) {
      state.pendingJumpPhaseId = effect.jumpToPhase;
    } else if ('triggerEnding' in effect) {
      state.forcedEndingId = effect.triggerEnding;
    } else if ('fn' in effect) {
      const fn = pack.fns[effect.fn];
      if (!fn) throw new Error(`DSL effect references unknown fn: ${effect.fn}`);
      fn({ state, args: effect.args });
    } else {
      throw new Error(`Unknown effect shape: ${JSON.stringify(effect)}`);
    }
  }

  return { deltas };
}
