import type { Condition, Op } from '../types/dsl';
import type { ContentPack } from '../types/content';
import type { GameState } from '../types/state';
import type { Rng } from '../rng/rng';

export interface EvalCtx {
  state: GameState;
  pack: ContentPack;
  rng: Rng;
}

function compare(left: number, op: Op, right: number): boolean {
  switch (op) {
    case '>': return left > right;
    case '>=': return left >= right;
    case '<': return left < right;
    case '<=': return left <= right;
    case '==': return left === right;
  }
}

export function evalCondition(cond: Condition | undefined, ctx: EvalCtx): boolean {
  if (!cond) return true;
  const { state } = ctx;

  if ('always' in cond) return true;
  if ('stat' in cond) return compare(state.stats[cond.stat], cond.op, cond.value);
  if ('flag' in cond) {
    const v = state.flags[cond.flag];
    return cond.equals === undefined ? Boolean(v) : v === cond.equals;
  }
  if ('year' in cond) {
    const y = state.date.year;
    if (cond.year.from !== undefined && y < cond.year.from) return false;
    if (cond.year.to !== undefined && y > cond.year.to) return false;
    return true;
  }
  if ('career' in cond) return state.profile.career === cond.career;
  if ('background' in cond) return state.profile.background === cond.background;
  if ('major' in cond) return state.profile.major === cond.major;
  if ('npcFavor' in cond) {
    const npc = state.npcs[cond.npcFavor];
    return npc ? compare(npc.favor, cond.op, cond.value) : false;
  }
  if ('npcStage' in cond) {
    const npc = state.npcs[cond.npcStage];
    return npc ? npc.stage === cond.stage : false;
  }
  if ('historyCount' in cond) {
    const q = cond.historyCount;
    const count = state.history.filter(h => {
      if (h.kind !== 'event') return false;
      if (q.category !== undefined && h.category !== q.category) return false;
      if (q.outcomeTag !== undefined && h.outcomeTag !== q.outcomeTag) return false;
      return true;
    }).length;
    return compare(count, q.op, q.value);
  }
  if ('chance' in cond) return ctx.rng.chance(cond.chance);
  if ('all' in cond) return cond.all.every(c => evalCondition(c, ctx));
  if ('any' in cond) return cond.any.some(c => evalCondition(c, ctx));
  if ('not' in cond) return !evalCondition(cond.not, ctx);
  if ('fn' in cond) {
    const fn = ctx.pack.fns[cond.fn];
    if (!fn) throw new Error(`DSL condition references unknown fn: ${cond.fn}`);
    return Boolean(fn({ state }));
  }
  throw new Error(`Unknown condition shape: ${JSON.stringify(cond)}`);
}
