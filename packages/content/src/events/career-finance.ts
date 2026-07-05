import type { GameEvent } from '@life-sim/core';

// 金融线专属里程碑事件(对标计算机线密度:5 个专属事件)。
// 与已有的散户视角投资事件(ev_invest_stock_2015/ev_invest_p2p 等)刻意区分开:
// 这里全部是"从业者"视角——同样的时代节点,吃瓜群众看热闹,这条线的人要扛业绩。
export const careerFinanceEvents: GameEvent[] = [
  {
    id: 'ev_college_fin_internship_2015',
    pools: ['college'],
    category: 'career',
    title: '股灾实习',
    text: '2015年暑假，你在一家券商营业部实习。你以为金融是西装革履的体面活儿，直到六月那几天——大厅里的电话没停过，客户经理的声音一天比一天哑，你身边那位从业十年的老带教，盯着屏幕突然说了句从没听过的脏话。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'finance' }, { year: { from: 2015, to: 2015 } }] },
    choices: [
      {
        id: 'a',
        text: '认真做基础工作，近距离旁观这场教育',
        outcomes: [
          {
            weight: 1,
            text: '你负责整理客户对账单和路演资料，没有自己的仓位，却比谁都看得清全貌：涨的时候没人谈风险，跌的时候没人谈仓位。这份实习没让你赚到钱，但让你比同龄人早三年看懂了"情绪"两个字怎么定价。',
            effects: [
              { stats: { money: 2000, knowledge: 7, network: 5, mindset: -2, health: -2 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '跟着营业部氛围搏一把，拿实习津贴练手',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '你把实习津贴和一部分生活费投了进去，想在带教面前证明自己"懂行"。六月那波下跌里，你的账户和客户的账户一起绿着——只是没人会补偿实习生的亏损。',
            effects: [
              { moneyCost: { rate: 0.6, max: 1500, roundTo: 100, reason: 'investment' } },
              { stats: { mindset: -6, knowledge: 3 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你运气不错，月中听带教一句"先落袋"提前跑了。津贴翻了一倍，你请全组喝了奶茶——虽然你心里清楚，这更多是带教的判断，不是你的本事。',
            effects: [
              { stats: { money: 1200, mindset: 2, knowledge: 3 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_first_job_2018',
    pools: ['work'],
    category: 'career',
    title: '第一份金融岗',
    text: '2018年，你正式进入金融行业。名片上都是"分析师"或"专员"，但坐第几排工位、握不握得到核心客户，从第一天起就分出了层次。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'front_office',
        text: '接住前台/投行的机会',
        visibleIf: { flag: 'first_job_track', equals: 'finance_elite_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你进了投行/券商前台部门。项目排得密不透风，深夜十二点的会议室灯常年亮着，但你也第一次亲眼见到一笔笔亿级交易怎么谈成。工牌挂上脖子那天，你告诉自己：这行没有"轻松的体面"，只有"昂贵的体面"。',
            effects: [
              { stats: { money: 20000, knowledge: 5, network: 6, mindset: -5 } },
              { setFlag: 'finance_front_office' },
            ],
          },
        ],
      },
      {
        id: 'back_office',
        text: '去中后台/资管做起',
        visibleIf: {
          any: [
            { flag: 'first_job_track', equals: 'finance_ordinary_candidate' },
            { flag: 'first_job_track', equals: 'finance_elite_candidate' },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你进了一家机构的中后台，做估值、清算或合规。前台的人年底聊分红，你这边聊的是流程和风控——不性感，但你渐渐明白，这行能活得久的，往往是搞懂规则的人。',
            effects: [
              { stats: { money: 11000, knowledge: 5, mindset: -2 } },
              { setFlag: 'finance_back_office' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_asset_reform_2018',
    pools: ['work'],
    category: 'career',
    title: '资管新规',
    text: '2018年，《资管新规》落地，行业里那句"保本保收益"被明令禁止。你所在机构的产品说明书要全部重写，理财经理们第一次要对客户说"这个产品可能会亏"。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2018, to: 2019 } }] },
    choices: [
      {
        id: 'a',
        text: '跟着部门啃下转型，重新设计产品',
        outcomes: [
          {
            weight: 1,
            text: '你和同事把过去十年的"刚兑"话术全部推翻重写，加班到系统凌晨强制下线。新产品上线那天，你盯着说明书里第一次出现的"不保本"三个字，心情复杂——这才是这个行业本该有的样子。',
            effects: [{ stats: { knowledge: 6, mindset: -5, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '趁行业出清，跳去监管适应更好的机构',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 20 },
            text: '你靠人脉提前打听到哪些机构转型更稳，跳槽跳在了浪头前面。新东家给的薪水不错，只是你心里清楚，这份"先知先觉"，一半是判断，一半是关系。',
            effects: [{ stats: { money: 15000, network: 5, mindset: -3 } }],
          },
          {
            weight: 1,
            text: '你投了几家看起来"转型更快"的机构，结果发现大家都在同一条起跑线上手忙脚乱。折腾一圈，你又回到了原来的工位。',
            effects: [{ stats: { mindset: -6 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_fund_boom_2020',
    pools: ['work'],
    category: 'career',
    title: '基金热',
    text: '2020年，公募基金彻底出圈。你所在机构的"顶流"基金经理被做成表情包，直播时弹幕刷的都是"求带飞"。渠道部天天催首发规模，你的产品从没被这么多人问起过。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '顺势而为，冲规模也冲奖金',
        outcomes: [
          {
            weight: 1,
            text: '你配合渠道把发行规模一波推上去，年底奖金到账那一刻很爽。只是你也清楚，这些新进来的钱，很多人连产品说明书都没翻开过。',
            effects: [{ stats: { money: 30000, mindset: -4, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳健执业，如实提示风险',
        outcomes: [
          {
            weight: 1,
            text: '你没有跟着把话说满，反而在客户群里多说了几句"高位分批""别梭哈"。奖金没有别人厚，但年底有客户特地发消息谢谢你没让他All in。',
            effects: [{ stats: { money: 12000, mindset: 3, network: 3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '自己也跟投重仓自家爆款产品',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '你把年终奖和一部分积蓄跟投进自己力推的爆款产品，笃定"自己人不会坑自己"。可惜净值这东西不认这份忠诚——它跌起来比宣传页翻得还快。',
            effects: [
              { moneyCost: { rate: 0.3, max: 30000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -8 } },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你跟投的仓位刚好踩在发行的甜蜜点上，净值曲线一路向上，你在同事群里第一次被叫"老师"。',
            effects: [{ stats: { money: 25000, mindset: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_regroup_collapse_2021',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '抱团崩塌',
    text: '2021年初，"抱团股"神话轰然倒塌。去年被捧上神坛的那几位"顶流"基金经理，画像从"信仰"变成了群嘲的表情包。你手机每天被两类消息填满：客户在微信群里问"什么时候回本"，风控在内部群里问"敞口能不能再降"。你亲手推荐过的产品净值曲线像坐上了滑梯，那些曾经在酒桌上称呼你"老师"的客户，现在连语音电话都不太接了。你盯着屏幕，第一次真切地明白：这个行业最贵的教育，从来不是亏给自己的钱，而是亲眼看着别人的信任怎么碎掉。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '顶住，留在牌桌上',
        outcomes: [
          {
            weight: 1,
            text: '你没有走。你陪着客户一个个复盘持仓，把自己跟投的部分也一起套了进去——某种意义上，这是跟客户"共担"最直接的方式。年终奖被追溯扣减，睡眠也跟着扣减，但你留住了几个真正信任你的客户。',
            effects: [
              { moneyCost: { rate: 0.25, max: 80000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -14, health: -6 } },
              { setFlag: 'fin_stayed_after_collapse' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '接受离场，转身去别处',
        outcomes: [
          {
            weight: 1,
            text: '公司这一轮"业务收缩"名单上有你的名字。谈补偿那天，HR的话术依旧标准，你却听得有点恍惚——去年这个时候，你还是被客户追着加微信的"红人"。抱着纸箱走出写字楼，你想起了自己入行时那句"这行只认业绩"，现在才明白，业绩也认周期。',
            effects: [
              { stats: { money: 35000, mindset: -16, health: 2 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
];
