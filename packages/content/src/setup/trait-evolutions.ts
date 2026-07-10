import type { TraitEvolution } from '@life-sim/core';

export const traitEvolutions: TraitEvolution[] = [
  { id: 'trait_growth_disciplined', traitId: 'trait_grinder', label: '自律者', poolBias: { career: 1.1, health: 0.9 } },
  { id: 'trait_growth_burning', traitId: 'trait_grinder', label: '燃烧模式', poolBias: { career: 1.25, health: 1.35 } },
  { id: 'trait_growth_grounded', traitId: 'trait_chill', label: '稳稳生活', poolBias: { mindset: 1.15, health: 1.15 } },
  { id: 'trait_growth_avoidant', traitId: 'trait_chill', label: '先躲一会', poolBias: { career: 0.8, mindset: 1.25 } },
  { id: 'trait_growth_bold', traitId: 'trait_risk_taker', label: '有准备的冒险', poolBias: { invest: 1.2, money: 1.1 } },
  { id: 'trait_growth_gambler', traitId: 'trait_risk_taker', label: '加码的人', poolBias: { invest: 1.5, money: 1.2 } },
  { id: 'trait_growth_rooted', traitId: 'trait_homebody', label: '有根的人', poolBias: { family: 1.25, relationship: 1.1 } },
  { id: 'trait_growth_bound', traitId: 'trait_homebody', label: '放不下家', poolBias: { family: 1.5, career: 0.85 } },
  { id: 'trait_growth_connector', traitId: 'trait_social', label: '连接者', poolBias: { npc: 1.2, friendship: 1.2 } },
  { id: 'trait_growth_pleaser', traitId: 'trait_social', label: '气氛维护者', poolBias: { npc: 1.35, mindset: 1.25 } },
  { id: 'trait_growth_empathic', traitId: 'trait_sensitive', label: '共情者', poolBias: { relationship: 1.2, love: 1.2 } },
  { id: 'trait_growth_overthinking', traitId: 'trait_sensitive', label: '过度解读', poolBias: { mindset: 1.45, era: 1.15 } },
];
