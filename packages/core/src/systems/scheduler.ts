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

  // NPC 阶段事件和强制事件一样保证入队,不受 eventSlots 限制:
  // 阶段推进窗口多为单一年份,被挤掉一次就会永久卡死整条 NPC 线。
  for (const def of pack.npcs) {
    const npc = state.npcs[def.id];
    if (!npc) continue;
    const stage = def.stages[npc.stage];
    if (!stage?.eventId || !evalCondition(stage.advanceWhen, ctx)) continue;
    if (picked.includes(stage.eventId)) continue;
    if (state.triggeredEventIds.includes(stage.eventId)) continue;
    picked.push(stage.eventId);
  }

  while (picked.length < phase.eventSlots) {
    const candidates = pack.events.filter(ev => !ev.mandatory && isEligible(ev));
    if (candidates.length === 0) break;
    const chosen = rng.weightedPick(candidates, ev => ev.weight ?? 1);
    picked.push(chosen.id);
  }

  // 同回合内按 order 稳定排序(默认 0),让"毕业散伙饭"这类年末事件排在最后
  const orderOf = new Map(pack.events.map(ev => [ev.id, ev.order ?? 0]));
  return picked
    .map((id, index) => ({ id, index }))
    .sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0) || a.index - b.index)
    .map(entry => entry.id);
}
