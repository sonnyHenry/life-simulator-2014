import type { ApplicationOption } from '@life-sim/core';

export const applications: ApplicationOption[] = [
  {
    id: 'app_985',
    label: '985 冲一冲',
    university: '顶尖 985 高校',
    major: '计算机科学与技术',
    minScore: 570,
    admitChance: 0.55,
    effects: [{ stats: { mindset: 8, network: 10 } }],
    failEffects: [{ stats: { mindset: -10 } }],
  },
  {
    id: 'app_211',
    label: '211 稳一稳',
    university: '不错的 211 高校',
    major: '软件工程',
    minScore: 520,
    admitChance: 0.8,
    effects: [{ stats: { mindset: 5, network: 6 } }],
    failEffects: [{ stats: { mindset: -8 } }],
  },
  {
    id: 'app_yiben',
    label: '一本保底',
    university: '省属重点大学',
    major: '师范类',
    minScore: 470,
    admitChance: 1,
    effects: [{ stats: { network: 4 } }],
  },
  {
    id: 'app_erben',
    label: '二本求稳',
    university: '普通本科院校',
    major: '工商管理',
    minScore: 400,
    admitChance: 1,
  },
  {
    id: 'app_zhuanke',
    label: '专科院校',
    university: '职业技术学院',
    major: '计算机应用',
    minScore: 0,
    admitChance: 1,
  },
];
