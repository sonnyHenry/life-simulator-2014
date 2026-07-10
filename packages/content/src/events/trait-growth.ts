import type { GameEvent } from '@life-sim/core';

export const traitGrowthEvents: GameEvent[] = [
  {
    id: 'ev_trait_growth_2023',
    pools: ['work'],
    category: 'mindset',
    tier: 'major',
    mandatory: true,
    trigger: {
      all: [
        { year: { from: 2023, to: 2023 } },
        {
          any: [
            { flag: 'trait_grinder' }, { flag: 'trait_chill' }, { flag: 'trait_risk_taker' },
            { flag: 'trait_homebody' }, { flag: 'trait_social' }, { flag: 'trait_sensitive' },
          ],
        },
      ],
    },
    title: '你终于看懂了自己的脾气',
    text: '三十岁越来越近。你发现，年轻时被叫作“性格”的东西，已经在一次次选择里长出了方向。两种特质都还在，但你决定让其中一条成为接下来几年的主轴。它未必更正确，只是更像现在的你。',
    contextLines: [
      { condition: { flag: 'p2p_burned' }, text: '那笔至今没有完全回来的钱提醒你：所谓性格，不只写在自我介绍里，也写在你明知高息可疑却仍按下确认的那一秒。' },
      { condition: { flag: 'dodged_p2p' }, text: '你想起当年关掉年化15%页面的那个晚上。后来你才明白，克制不是“什么都没做”，它本身就是一次选择。' },
      { condition: { flag: 'stock_lesson' }, text: '2015年那张忽红忽绿的账户截图还在相册深处。市场没有替你定义性格，却很早就照见了你面对得失时的样子。' },
      { condition: { flag: 'pandemic_volunteer' }, text: '那件红马甲早已收进柜子，但你仍记得自己在最不确定的时候，选择站到别人身边。' },
      { condition: { flag: 'pandemic_wfh' }, text: '老家书桌上的会议、门外那盘切好的水果，让你第一次看见：工作方式会变，自己真正舍不得的东西却很稳定。' },
      { condition: { flag: 'pandemic_return' }, text: '那趟几乎空无一人的返城路上，你曾相信“先把事情扛住”就是答案。三年后，你终于有机会重新判断。' },
    ],
    choices: [
      {
        id: 'grinder_disciplined', text: '把能吃苦变成可持续的节奏', visibleIf: { flag: 'trait_grinder' },
        outcomes: [{ weight: 1, text: '你不再用熬夜证明努力，而是学会安排边界。效率没有消失，身体也终于被算进长期计划。', effects: [{ stats: { knowledge: 5, health: 4, mindset: -2 } }, { setFlag: 'trait_growth_disciplined' }] }],
      },
      {
        id: 'grinder_burning', text: '趁还能冲，再把油门踩深一点', visibleIf: { flag: 'trait_grinder' },
        outcomes: [{ weight: 1, text: '你接下更难的项目，也拿到更显眼的位置。回报是真的，疲惫也是真的；你选择先燃烧，再处理灰烬。', effects: [{ stats: { money: 12000, knowledge: 4, mindset: -5, health: -6 } }, { setFlag: 'trait_growth_burning' }] }],
      },
      {
        id: 'chill_grounded', text: '松弛不是逃避，是知道什么值得', visibleIf: { flag: 'trait_chill' },
        outcomes: [{ weight: 1, text: '你把慢下来变成主动选择，而不是拖延的借口。事情仍然很多，但它们不再同时住进你的脑子。', effects: [{ stats: { mindset: 6, health: 4, knowledge: -2 } }, { setFlag: 'trait_growth_grounded' }] }],
      },
      {
        id: 'chill_avoidant', text: '世界太吵，先躲回自己的壳里', visibleIf: { flag: 'trait_chill' },
        outcomes: [{ weight: 1, text: '你推掉一部分竞争，也错过一部分窗口。生活安静下来，只是偶尔会分不清这是自由，还是害怕开始。', effects: [{ stats: { mindset: 8, network: -4, knowledge: -3 } }, { setFlag: 'trait_growth_avoidant' }] }],
      },
      {
        id: 'risk_bold', text: '冒险可以，但先算最坏结果', visibleIf: { flag: 'trait_risk_taker' },
        outcomes: [{ weight: 1, text: '你没有变胆小，只是终于学会给冲动加止损线。牌桌仍然刺激，但你开始知道什么时候该离席。', effects: [{ stats: { knowledge: 4, network: 3, mindset: -2 } }, { setFlag: 'trait_growth_bold' }] }],
      },
      {
        id: 'risk_gambler', text: '人生就一次，不妨继续加码', visibleIf: { flag: 'trait_risk_taker' },
        outcomes: [{ weight: 1, text: '你把不确定性当成氧气。有人觉得你勇敢，有人觉得你疯了；两种评价你都听得很开心。', effects: [{ stats: { money: 15000, mindset: 5, health: -5, knowledge: -3 } }, { setFlag: 'trait_growth_gambler' }] }],
      },
      {
        id: 'home_rooted', text: '把家变成支点，不是绳子', visibleIf: { flag: 'trait_homebody' },
        outcomes: [{ weight: 1, text: '你更常联系家里，也开始坦白自己的边界。亲近不再意味着事事顺从，距离也不再等于亏欠。', effects: [{ stats: { mindset: 5, network: 3, money: -2000 } }, { setFlag: 'trait_growth_rooted' }] }],
      },
      {
        id: 'home_bound', text: '离家近一点，其他事以后再说', visibleIf: { flag: 'trait_homebody' },
        outcomes: [{ weight: 1, text: '你把很多决定向家靠拢，获得了确定的温暖，也放弃了一些更远的可能。这个交换没有标准答案。', effects: [{ stats: { mindset: 8, network: 2, knowledge: -4 } }, { setFlag: 'trait_growth_bound' }] }],
      },
      {
        id: 'social_connector', text: '把认识很多人变成真正连接人', visibleIf: { flag: 'trait_social' },
        outcomes: [{ weight: 1, text: '你不再只追求热闹，而是学会把合适的人介绍给彼此。饭局少了一些，真正能互相托底的人多了一些。', effects: [{ stats: { network: 8, knowledge: 3, health: -2 } }, { setFlag: 'trait_growth_connector' }] }],
      },
      {
        id: 'social_pleaser', text: '继续照顾所有人的气氛', visibleIf: { flag: 'trait_social' },
        outcomes: [{ weight: 1, text: '你还是那个永远能把场面接住的人。只是散场以后，偶尔没人记得问一句你今天开不开心。', effects: [{ stats: { network: 12, mindset: -6, health: -3 } }, { setFlag: 'trait_growth_pleaser' }] }],
      },
      {
        id: 'sensitive_empathic', text: '把敏感变成理解别人的能力', visibleIf: { flag: 'trait_sensitive' },
        outcomes: [{ weight: 1, text: '你开始分清“感受到别人的情绪”和“替别人承担情绪”。细腻仍然会疼，但也能真正照亮关系。', effects: [{ stats: { network: 6, knowledge: 4, mindset: -2 } }, { setFlag: 'trait_growth_empathic' }] }],
      },
      {
        id: 'sensitive_overthinking', text: '再想深一点，也许答案藏在细节里', visibleIf: { flag: 'trait_sensitive' },
        outcomes: [{ weight: 1, text: '你越来越擅长看见别人忽略的东西，也越来越难关掉脑内的分析器。洞察和内耗，常常共用一双眼睛。', effects: [{ stats: { knowledge: 8, mindset: -7, health: -2 } }, { setFlag: 'trait_growth_overthinking' }] }],
      },
    ],
  },
];
