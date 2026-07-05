import type { ApplicationOption } from '@life-sim/core';

// 志愿批次:录取概率由引擎按(分数-批次线)动态计算,报高于分数的批次会有滑档风险。
// 专业名必须与 CROSSROAD 分流(major.includes '计算机'/'软件'/'师范'/'金融'/'临床医学')和事件 visibleIf 保持一致。
export const applications: ApplicationOption[] = [
  {
    id: 'app_985',
    label: '顶尖 985',
    university: '顶尖 985 高校',
    minScore: 570,
    effects: [
      { stats: { mindset: 8, network: 14, knowledge: 4 } },
      { setFlag: 'university_tier', value: '985' },
      { setFlag: 'elite_university' },
    ],
    failEffects: [{ stats: { mindset: -10 } }, { setFlag: 'slipped_from_985' }],
    majors: [
      { id: 'cs', name: '计算机科学与技术', trackFlag: 'cs' },
      { id: 'se', name: '软件工程', trackFlag: 'cs' },
      { id: 'mba', name: '工商管理', trackFlag: 'management' },
      { id: 'fin', name: '金融学', trackFlag: 'finance' },
      { id: 'med', name: '临床医学', trackFlag: 'medicine' },
    ],
  },
  {
    id: 'app_211',
    label: '不错的 211',
    university: '不错的 211 高校',
    minScore: 520,
    effects: [
      { stats: { mindset: 5, network: 9, knowledge: 3 } },
      { setFlag: 'university_tier', value: '211' },
    ],
    failEffects: [{ stats: { mindset: -8 } }, { setFlag: 'slipped_from_211' }],
    majors: [
      { id: 'se', name: '软件工程', trackFlag: 'cs' },
      { id: 'edu', name: '师范类', trackFlag: 'education' },
      { id: 'mba', name: '工商管理', trackFlag: 'management' },
      { id: 'fin', name: '金融学', trackFlag: 'finance' },
      { id: 'med', name: '临床医学', trackFlag: 'medicine' },
    ],
  },
  {
    id: 'app_yiben',
    label: '省属重点一本',
    university: '省属重点大学',
    minScore: 470,
    effects: [
      { stats: { network: 4, knowledge: 2 } },
      { setFlag: 'university_tier', value: 'yiben' },
    ],
    failEffects: [{ stats: { mindset: -6 } }],
    majors: [
      { id: 'edu', name: '师范类', trackFlag: 'education' },
      { id: 'cs', name: '计算机科学与技术', trackFlag: 'cs' },
      { id: 'mba', name: '工商管理', trackFlag: 'management' },
      { id: 'fin', name: '金融学', trackFlag: 'finance' },
      { id: 'med', name: '临床医学', trackFlag: 'medicine' },
    ],
  },
  {
    id: 'app_erben',
    label: '普通二本',
    university: '普通本科院校',
    minScore: 400,
    effects: [
      { stats: { network: 2 } },
      { setFlag: 'university_tier', value: 'erben' },
    ],
    failEffects: [{ stats: { mindset: -5 } }],
    majors: [
      { id: 'edu', name: '师范类', trackFlag: 'education' },
      { id: 'mba', name: '工商管理', trackFlag: 'management' },
      { id: 'csa', name: '计算机应用', trackFlag: 'cs_applied' },
      { id: 'med', name: '临床医学', trackFlag: 'medicine' },
    ],
  },
  {
    id: 'app_zhuanke',
    label: '专科院校',
    university: '职业技术学院',
    minScore: 0,
    effects: [
      { stats: { knowledge: -2, mindset: -2 } },
      { setFlag: 'university_tier', value: 'zhuanke' },
    ],
    majors: [
      { id: 'csa', name: '计算机应用', trackFlag: 'cs_applied' },
      { id: 'edu', name: '师范类', trackFlag: 'education' },
    ],
  },
];
