import type { GameEvent } from '@life-sim/core';

export const workEvents: GameEvent[] = [
  {
    id: 'ev_grad_offer',
    pools: ['work'],
    category: 'career',
    title: '毕业抉择',
    text: '校招季结束,你手里有两个选择:一家互联网大厂的 offer,月薪是老家平均工资的三倍;或者回家备考公务员,爸妈已经托人打听好了岗位。',
    mandatory: true,
    trigger: { year: { from: 2018, to: 2018 } },
    choices: [
      {
        id: 'a',
        text: '签大厂,去大城市',
        outcomes: [
          {
            weight: 1,
            text: '你签了三方协议,拖着行李箱在城中村租了个单间。入职第一天,工牌挂上脖子的那一刻,你给家里发了张自拍。妈妈回复:"照顾好自己,别太累。"',
            effects: [
              { stats: { money: 8000, network: 6 } },
              { setCareer: 'cs' },
              { setFlag: 'career_cs' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '回老家考公',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '笔试面试一路过关,你考上了。领导在入职谈话时说"年轻人好好干"。爸妈请了三桌客,席间他们的腰杆挺得很直。',
            outcomeTag: 'success',
            effects: [{ stats: { mindset: 8 } }, { setCareer: 'gov' }, { setFlag: 'career_gov' }],
          },
          {
            weight: 1,
            text: '差了两分,没进面试。你在家复习的那半年,亲戚问得最多的是"考上没"。第二年你进了本地一家公司,工资不高,胜在离家近。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -6, money: 2000 } }, { setCareer: 'local' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_996',
    pools: ['work'],
    category: 'career',
    title: '大小周',
    text: '部门开始执行"大小周",加班费给得不含糊,但周日的太阳你已经一个月没见过了。组长在周会上说:"现在是业务关键期,大家再顶一顶。"',
    trigger: { flag: 'career_cs' },
    choices: [
      {
        id: 'a',
        text: '顶就顶,趁年轻多攒钱',
        outcomes: [
          {
            weight: 1,
            text: '这一年你的工资条很好看,体检报告不太好看。你在工位抽屉里备了枸杞和护肝片,同事说你这叫"朋克养生"。',
            effects: [{ stats: { money: 15000, mindset: -12 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '到点下班,绩效随缘',
        outcomes: [
          {
            weight: 1,
            text: '你成了组里唯一准点走的人。绩效拿了个"符合预期",年终奖薄了一截。但你重新捡起了跑步,体重和心情都轻了一点。',
            effects: [{ stats: { mindset: 3 } }, { setFlag: 'low_perf' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_p2p',
    pools: ['work'],
    category: 'invest',
    title: '年化 15% 的理财',
    text: '同事神秘兮兮地给你看他的收益截图:某 P2P 平台,年化 15%,"国资背景,上市系,跑了好几年了"。他已经投了半年,每月利息准时到账。',
    choices: [
      {
        id: 'a',
        text: '跟投两万,搏一搏',
        outcomes: [
          {
            weight: 3,
            text: '三个月后,平台公告"暂停提现"。维权群从 200 人涨到 2000 人,你的两万块变成了群文件里的一行登记信息。同事比你惨,他加了杠杆。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -20000, mindset: -15 } }],
          },
          {
            weight: 1,
            text: '你拿了几个月利息,总觉得不踏实,提前把本息赎回了。半年后平台暴雷,你在新闻里看到那个熟悉的 logo,后背发凉。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 8000, mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '收益这么高,必有诈',
        outcomes: [
          {
            weight: 1,
            text: '你没投。半年后平台暴雷,同事在工位上打了一下午电话。你请他吃了顿饭,他说:"早知道听你的。"这世上最贵的三个字,是"早知道"。',
            effects: [{ stats: { mindset: 1 } }, { setFlag: 'dodged_p2p' }],
          },
        ],
      },
    ],
  },
];
