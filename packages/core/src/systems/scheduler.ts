import type { ContentPack, GameEvent, PhaseConfig, TraitCard } from '../types/content';
import type { GameState } from '../types/state';
import type { Rng } from '../rng/rng';
import { evalCondition } from '../dsl/evaluate';

// ---------- 导演式选择器(storyteller) ----------
// 只调整非 mandatory 事件进入随机槽位的相对概率;强制/NPC/schedule 事件不受影响。
// 所有乘数都有下限钳位,任何事件的权重不会被压成 0,n=10000 覆盖门禁依然成立。

/** 心态低于此值视为"低谷",导演倾向给喘息(正情绪事件加权) */
const LOW_MINDSET = 35;
/** 心态高于此值视为"顺风",导演倾向注入压力(负情绪事件加权) */
const HIGH_MINDSET = 75;
/** 同一年已排入同类事件时的降权 */
const SAME_YEAR_CATEGORY_PENALTY = 0.35;
/** 近两年同类事件出现 >=2 次时的冷却降权 */
const RECENT_CATEGORY_PENALTY = 0.6;
/** 导演乘数钳位区间,保证不会把事件压到抽不到 */
const MULTIPLIER_FLOOR = 0.15;
const MULTIPLIER_CEIL = 4;

const valenceCache = new WeakMap<GameEvent, number>();

/**
 * 事件的"情绪期望":对全部选项按 outcome 权重平均的名义 mindset 变化。
 * 从既有内容自动推导,不需要给 147 个事件人工打情绪标签。
 */
export function eventMindsetValence(ev: GameEvent): number {
  const cached = valenceCache.get(ev);
  if (cached !== undefined) return cached;
  let sum = 0;
  let choiceCount = 0;
  for (const choice of ev.choices) {
    let weighted = 0;
    let totalWeight = 0;
    for (const outcome of choice.outcomes) {
      let delta = 0;
      for (const eff of outcome.effects) {
        if ('stats' in eff && typeof eff.stats.mindset === 'number') delta += eff.stats.mindset;
      }
      weighted += delta * outcome.weight;
      totalWeight += outcome.weight;
    }
    if (totalWeight > 0) {
      sum += weighted / totalWeight;
      choiceCount += 1;
    }
  }
  const valence = choiceCount > 0 ? sum / choiceCount : 0;
  valenceCache.set(ev, valence);
  return valence;
}

function recentCategoryCounts(state: GameState): Map<string, number> {
  const counts = new Map<string, number>();
  const fromYear = state.date.year - 1;
  for (const entry of state.history) {
    if (entry.kind !== 'event' || !entry.category || entry.year < fromYear) continue;
    counts.set(entry.category, (counts.get(entry.category) ?? 0) + 1);
  }
  return counts;
}

function directorMultiplier(
  ev: GameEvent,
  state: GameState,
  activeTraits: TraitCard[],
  pickedCategories: ReadonlySet<string>,
  recentCounts: ReadonlyMap<string, number>,
): number {
  let m = 1;
  if (ev.category) {
    if (pickedCategories.has(ev.category)) m *= SAME_YEAR_CATEGORY_PENALTY;
    if ((recentCounts.get(ev.category) ?? 0) >= 2) m *= RECENT_CATEGORY_PENALTY;
    for (const trait of activeTraits) {
      const bias = trait.poolBias?.[ev.category];
      if (bias !== undefined) m *= bias;
    }
  }
  // 节奏调节:低谷给喘息、顺风上压力(阈值间的中段不干预)
  const valence = eventMindsetValence(ev);
  if (state.stats.mindset <= LOW_MINDSET) {
    if (valence > 0.5) m *= 1.8;
    else if (valence < -0.5) m *= 0.55;
  } else if (state.stats.mindset >= HIGH_MINDSET) {
    if (valence < -0.5) m *= 1.5;
    else if (valence > 0.5) m *= 0.75;
  }
  return Math.min(MULTIPLIER_CEIL, Math.max(MULTIPLIER_FLOOR, m));
}

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

  // 随机槽位:导演式加权抽取(基础 weight × 类别冷却 × 特质偏好 × 心态节奏)
  const activeTraits = pack.traits.filter(t => Boolean(state.flags[t.id]));
  const recentCounts = recentCategoryCounts(state);
  const eventsById = new Map(pack.events.map(ev => [ev.id, ev]));
  const pickedCategories = new Set<string>();
  for (const id of picked) {
    const cat = eventsById.get(id)?.category;
    if (cat) pickedCategories.add(cat);
  }

  while (picked.length < phase.eventSlots) {
    const candidates = pack.events.filter(ev => !ev.mandatory && isEligible(ev));
    if (candidates.length === 0) break;
    const chosen = rng.weightedPick(
      candidates,
      ev =>
        (ev.weight ?? 1) *
        directorMultiplier(ev, state, activeTraits, pickedCategories, recentCounts),
    );
    picked.push(chosen.id);
    if (chosen.category) pickedCategories.add(chosen.category);
  }

  // 同回合内按 order 稳定排序(默认 0),让"毕业散伙饭"这类年末事件排在最后
  const orderOf = new Map(pack.events.map(ev => [ev.id, ev.order ?? 0]));
  return picked
    .map((id, index) => ({ id, index }))
    .sort((a, b) => (orderOf.get(a.id) ?? 0) - (orderOf.get(b.id) ?? 0) || a.index - b.index)
    .map(entry => entry.id);
}
