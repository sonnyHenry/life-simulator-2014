import type { LifeGoal } from '@life-sim/core';

export const lifeGoals: LifeGoal[] = [
  {
    id: 'goal_wealth',
    label: '把钱挣到手',
    text: '机会、收入和资产优先。你接受更大的波动,但希望选择权最后握在自己手里。',
    poolBias: { money: 1.35, invest: 1.3, career: 1.1 },
    scoringWeights: { knowledge: 0.15, money: 0.4, mindset: 0.15, network: 0.1, health: 0.2 },
  },
  {
    id: 'goal_stability',
    label: '把日子过稳',
    text: '现金流、身体和可预期的生活更重要。慢一点没关系,别让一次风浪掀翻整条船。',
    poolBias: { family: 1.2, health: 1.25, mindset: 1.2 },
    scoringWeights: { knowledge: 0.15, money: 0.2, mindset: 0.25, network: 0.1, health: 0.3 },
  },
  {
    id: 'goal_mastery',
    label: '在专业上留下点东西',
    text: '学历、技能和职业成就优先。你想知道自己认真做一件事,究竟能走到哪里。',
    poolBias: { campus: 1.2, career: 1.35, era: 1.1 },
    scoringWeights: { knowledge: 0.35, money: 0.2, mindset: 0.15, network: 0.1, health: 0.2 },
  },
  {
    id: 'goal_relationships',
    label: '别把重要的人弄丢',
    text: '家人、朋友和伴侣不是人生的边角料。你愿意为关系留时间,也接受它带来的牵挂。',
    poolBias: { npc: 1.25, family: 1.3, relationship: 1.35, love: 1.2 },
    scoringWeights: { knowledge: 0.1, money: 0.15, mindset: 0.25, network: 0.3, health: 0.2 },
  },
  {
    id: 'goal_freedom',
    label: '保留随时转身的自由',
    text: '不被房贷、工牌或别人的进度条完全定义。钱要够用,心里也要留一块自己的地方。',
    poolBias: { mindset: 1.3, health: 1.15, friendship: 1.15 },
    scoringWeights: { knowledge: 0.15, money: 0.25, mindset: 0.3, network: 0.1, health: 0.2 },
  },
];
