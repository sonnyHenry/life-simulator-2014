import type { ContentPack, GameEvent, PhaseConfig } from '../types/content';
import type { GameState } from '../types/state';
import type { Rng } from '../rng/rng';
import { evalCondition } from '../dsl/evaluate';

export function pickRoundEvents(
  state: GameState,
  pack: ContentPack,
  rng: Rng,
  phase: Extract<PhaseConfig, { kind: 'rounds' }>,
): string[] {
  const picked: string[] = [];

  const due = state.scheduled.filter(s => s.dueRound <= state.roundCounter);
  state.scheduled = state.scheduled.filter(s => s.dueRound > state.roundCounter);
  for (const d of due) picked.push(d.eventId);

  const ctx = { state, pack, rng };
  const isEligible = (ev: GameEvent): boolean => {
    if (!ev.pools.some(p => phase.pools.includes(p))) return false;
    if (ev.once !== false && state.triggeredEventIds.includes(ev.id)) return false;
    if (picked.includes(ev.id)) return false;
    return evalCondition(ev.trigger, ctx);
  };

  for (const ev of pack.events) {
    if (ev.mandatory && isEligible(ev)) picked.push(ev.id);
  }

  while (picked.length < phase.eventSlots) {
    const candidates = pack.events.filter(ev => !ev.mandatory && isEligible(ev));
    if (candidates.length === 0) break;
    const chosen = rng.weightedPick(candidates, ev => ev.weight ?? 1);
    picked.push(chosen.id);
  }

  return picked;
}
