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
    amount: 70000,
    mindsetDelta: -5,
  },
  {
    id: 'inc_cs_normal',
    label: '普通技术岗工资',
    when: {
      all: [{ flag: 'career_cs' }, { not: { flag: 'big_platform_start' } }, employed],
    },
    amount: 45000,
    mindsetDelta: -3,
  },
  {
    id: 'inc_unemployed_gap',
    label: '空窗期消耗',
    when: {
      all: [{ flag: 'laid_off' }, { not: { flag: 'restarted_after_layoff' } }],
    },
    amount: -40000,
    mindsetDelta: -8,
  },
  {
    id: 'inc_edu',
    label: '教育行业收入',
    when: { flag: 'career_edu' },
    amount: 30000,
    mindsetDelta: -3,
  },
  {
    id: 'inc_gov',
    label: '体制内工资',
    when: { flag: 'career_gov' },
    amount: 22000,
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
    amount: -8000,
    mindsetDelta: -1,
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
      ],
    },
    amount: 30000,
    mindsetDelta: -3,
  },
];
