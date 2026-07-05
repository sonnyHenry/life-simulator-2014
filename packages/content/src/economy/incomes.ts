import type { Condition, IncomeRule } from '@life-sim/core';

// 每个"年度回合"结算一次的净储蓄(工资 - 生活开销后攒下的钱,单位:元/年)。
// 大学阶段没有职业 flag,天然不产生收入;读研期间同理(穷但值得)。
const employed: Condition = {
  any: [{ not: { flag: 'laid_off' } }, { flag: 'restarted_after_layoff' }],
};

export const incomes: IncomeRule[] = [
  {
    id: 'inc_cs_big_platform',
    label: '大厂工资',
    when: {
      all: [{ flag: 'career_cs' }, { flag: 'big_platform_start' }, employed],
    },
    amount: 62000,
    mindsetDelta: -6,
    healthDelta: -5,
  },
  {
    id: 'inc_cs_normal',
    label: '普通技术岗工资',
    when: {
      all: [{ flag: 'career_cs' }, { not: { flag: 'big_platform_start' } }, employed],
    },
    amount: 38000,
    mindsetDelta: -4,
    healthDelta: -4,
  },
  {
    id: 'inc_unemployed_gap',
    label: '空窗期消耗',
    when: {
      all: [{ flag: 'laid_off' }, { not: { flag: 'restarted_after_layoff' } }],
    },
    amount: -50000,
    mindsetDelta: -10,
  },
  {
    id: 'inc_edu',
    label: '教育行业收入',
    when: { flag: 'career_edu' },
    amount: 26000,
    mindsetDelta: -3,
    healthDelta: -2,
  },
  {
    id: 'inc_fin_front_office',
    label: '金融前台/投行工资',
    when: { all: [{ flag: 'career_finance' }, { flag: 'finance_front_office' }] },
    amount: 78000,
    mindsetDelta: -8,
    healthDelta: -7,
  },
  {
    id: 'inc_fin_back_office',
    label: '金融中后台工资',
    when: { all: [{ flag: 'career_finance' }, { not: { flag: 'finance_front_office' } }] },
    amount: 42000,
    mindsetDelta: -4,
    healthDelta: -4,
  },
  {
    id: 'inc_med_resident',
    label: '规培津贴',
    when: { all: [{ flag: 'career_medicine' }, { flag: 'medicine_resident' }] },
    amount: 6000,
    mindsetDelta: -6,
    healthDelta: -5,
  },
  {
    id: 'inc_med_attending_public',
    label: '公立医院工资',
    when: {
      all: [{ flag: 'career_medicine' }, { flag: 'doctor_public' }, { not: { flag: 'medicine_resident' } }],
    },
    amount: 34000,
    mindsetDelta: -3,
    healthDelta: -3,
  },
  {
    id: 'inc_med_attending_private',
    label: '私立/外地医院工资',
    when: {
      all: [{ flag: 'career_medicine' }, { flag: 'doctor_private' }, { not: { flag: 'medicine_resident' } }],
    },
    amount: 50000,
    mindsetDelta: -4,
    healthDelta: -3,
  },
  {
    id: 'inc_med_left',
    label: '转行后的收入',
    when: {
      all: [{ flag: 'career_medicine' }, { flag: 'doctor_left' }, { not: { flag: 'medicine_resident' } }],
    },
    amount: 28000,
    mindsetDelta: 1,
    healthDelta: 2,
  },
  {
    id: 'inc_gov',
    label: '体制内工资',
    when: { flag: 'career_gov' },
    amount: 20000,
    mindsetDelta: -1,
  },
  {
    id: 'inc_prepaid_mortgage',
    label: '提前还贷省下的利息',
    when: { flag: 'prepaid_mortgage' },
    amount: 18000,
    mindsetDelta: 1,
  },
  {
    // 观望不买房不是白嫖:2024 起房租进入补涨周期,租房者的净储蓄被持续侵蚀
    id: 'inc_rent_inflation',
    label: '房租上涨侵蚀',
    when: { all: [{ flag: 'no_house' }, { year: { from: 2024 } }] },
    amount: -10000,
    mindsetDelta: -2,
  },
  {
    // 低谷自愈:人在谷底会自己长出茧——防止连环打击后的死亡螺旋
    id: 'inc_resilience_mindset',
    label: '低谷自愈(心态)',
    when: { stat: 'mindset', op: '<', value: 30 },
    amount: 0,
    mindsetDelta: 3,
  },
  {
    id: 'inc_resilience_health',
    label: '低谷自愈(健康)',
    when: { stat: 'health', op: '<', value: 25 },
    amount: 0,
    healthDelta: 2,
  },
  {
    id: 'inc_generic_job',
    label: '普通工作收入',
    when: {
      all: [
        {
          any: [
            { flag: 'entered_job_market_2018' },
            { flag: 'postgrad_done' },
            { flag: 'civil_service_failed' },
          ],
        },
        { not: { flag: 'career_cs' } },
        { not: { flag: 'career_edu' } },
        { not: { flag: 'career_gov' } },
        { not: { flag: 'career_finance' } },
        { not: { flag: 'career_medicine' } },
      ],
    },
    amount: 25000,
    mindsetDelta: -3,
    healthDelta: -2,
  },
];
