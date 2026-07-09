import type { TraitCard } from '@life-sim/core';

/**
 * 玩家特质:开局随背景抽 2 个,以 flags[trait_xxx]=true 存储。
 * poolBias 是导演选择器的类别偏好(只影响随机池抽取概率,详见 core/systems/scheduler.ts);
 * 事件内容可用 { flag: 'trait_xxx' } 做 visibleIf 专属选项或 outcome 分支。
 * category 取值需与事件 category 一致:career/campus/money/npc/invest/relationship/
 * mindset/friendship/era/love/health/family。
 */
export const traits: TraitCard[] = [
  {
    id: 'trait_grinder',
    label: '卷王体质',
    text: '别人休息你在学,别人下班你在肝。吃得了苦,也容易忘了自己在吃苦。',
    poolBias: { career: 1.4, campus: 1.25, health: 1.2 },
  },
  {
    id: 'trait_chill',
    label: '松弛感',
    text: '天塌下来先睡一觉。不太容易焦虑,也不太容易被"优秀"绑架。',
    poolBias: { career: 0.75, mindset: 1.4, health: 1.3 },
  },
  {
    id: 'trait_risk_taker',
    label: '天生胆大',
    text: '看到"高收益"三个字眼睛会亮。牌桌上最兴奋的人,往往也是下桌最晚的人。',
    poolBias: { invest: 1.8, money: 1.3 },
  },
  {
    id: 'trait_homebody',
    label: '恋家',
    text: '手机置顶永远是家里的群。走得再远,行李箱里也装着半箱家乡的味道。',
    poolBias: { family: 1.9, love: 1.2, relationship: 1.2 },
  },
  {
    id: 'trait_social',
    label: '社牛',
    text: '三分钟和陌生人称兄道弟。人脉是你的天赋树,饭局是你的主场。',
    poolBias: { friendship: 1.7, npc: 1.4, relationship: 1.3 },
  },
  {
    id: 'trait_sensitive',
    label: '心思细腻',
    text: '别人没说出口的话,你都听见了。感受得更多,也就疼得更真。',
    poolBias: { love: 1.5, mindset: 1.4, era: 1.3 },
  },
];
