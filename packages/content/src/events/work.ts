import type { GameEvent } from '@life-sim/core';

export const workEvents: GameEvent[] = [
  {
    id: 'ev_cs_first_job_2018',
    pools: ['work'],
    category: 'career',
    title: '第一份技术岗',
    text: '2018年,你正式进入技术岗。招聘网站上大家都叫自己工程师,但工牌背后的起点差异很快显现:学校、专业、实习、内推,每一项都会变成面试官的眼神。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'elite',
        text: '接住大平台的机会',
        visibleIf: { flag: 'first_job_track', equals: 'big_tech_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你进了大平台。系统复杂,同事很强,日报周报也很密。985/211 没有让你轻松,但它确实把你送到了更大的牌桌旁。',
            effects: [
              { stats: { money: 18000, knowledge: 5, network: 5, mindset: -4 } },
              { setFlag: 'big_platform_start' },
            ],
          },
        ],
      },
      {
        id: 'ordinary',
        text: '从普通技术岗做起',
        visibleIf: { flag: 'first_job_track', equals: 'ordinary_tech_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你进了一家中小公司,什么都要做:前端、后端、上线、客服群答疑。履历不够亮,就只能先靠手上的活把路凿出来。',
            effects: [
              { stats: { money: 9000, knowledge: 6, mindset: -2 } },
              { setFlag: 'ordinary_platform_start' },
            ],
          },
        ],
      },
      {
        id: 'applied',
        text: '先做实施和外包项目',
        visibleIf: { flag: 'major_track', equals: 'cs_applied' },
        outcomes: [
          {
            weight: 1,
            text: '你从实施、驻场和外包项目开始。工作不体面,但很具体。你学会了和甲方沟通,也学会了在烂需求里保住基本尊严。',
            effects: [
              { stats: { money: 6000, knowledge: 4, network: 2, mindset: -3 } },
              { setFlag: 'outsourcing_start' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_postgrad_grind',
    pools: ['work'],
    category: 'career',
    title: '考研三年',
    text: '你选择了考研,同龄人开始领工资、租房、讨论跳槽时,你还在图书馆和实验室之间来回。延迟入场不是暂停人生,它只是把焦虑换了一个形状。',
    mandatory: true,
    trigger: { all: [{ flag: 'postgrad' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'a',
        text: '稳住,把学历变成真正的能力',
        outcomes: [
          {
            weight: 1,
            text: '你没有只把研究生当成缓冲区。论文、项目、实习,每一项都往简历上长出一点真实的东西。',
            effects: [
              { stats: { knowledge: 8, network: 3, mindset: -4 } },
              { setFlag: 'postgrad_strong' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先把毕业混过去',
        outcomes: [
          {
            weight: 1,
            text: '你确实获得了学历,但也知道自己有些时间只是被延后消费了。毕业临近时,焦虑又从门缝里钻回来。',
            effects: [
              { stats: { knowledge: 4, mindset: -2 } },
              { setFlag: 'postgrad_weak' },
            ],
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
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2019, to: 2019 } }] },
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
    pools: ['invest'],
    category: 'invest',
    title: '年化 15% 的理财',
    text: '同事神秘兮兮地给你看他的收益截图:某 P2P 平台,年化 15%,"国资背景,上市系,跑了好几年了"。他已经投了半年,每月利息准时到账。',
    trigger: { year: { from: 2018, to: 2019 } },
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
  {
    id: 'ev_postgrad_exit',
    pools: ['work'],
    category: 'career',
    title: '研究生毕业',
    text: '三年过去,你把论文改到凌晨,也把简历投到了几十个系统里。学历像一张延迟入场券,它没有保证你赢,但让你换了一个入口。',
    mandatory: true,
    trigger: { all: [{ flag: 'postgrad' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'cs',
        text: '去互联网,做技术岗',
        visibleIf: { any: [{ major: '计算机科学与技术' }, { major: '软件工程' }, { major: '计算机应用' }] },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你拿到了一份不错的技术岗 offer。学历、项目和实习终于连成了一条线。你晚入场三年,但不是空着手来的。',
            effects: [
              { stats: { money: 22000, knowledge: 6, network: 7, mindset: 3 } },
              { setCareer: 'cs' },
              { setFlag: 'career_cs' },
              { setFlag: 'postgrad_done' },
              { setFlag: 'postgrad_premium' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'postgrad_strong' } },
            text: '你拿到了一份技术岗 offer。入职群里大家互相报学历,你突然发现,研究生在这里不稀奇,但至少没有掉队。',
            effects: [
              { stats: { money: 12000, knowledge: 5, network: 5 } },
              { setCareer: 'cs' },
              { setFlag: 'career_cs' },
              { setFlag: 'postgrad_done' },
            ],
          },
        ],
      },
      {
        id: 'edu',
        text: '去学校或教培,做教育',
        visibleIf: { major: '师范类' },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你进了一所还不错的学校。读研期间磨出来的表达和研究能力,在讲台上变成了底气。',
            effects: [
              { stats: { money: 8000, mindset: 7, network: 6, knowledge: 3 } },
              { setCareer: 'education' },
              { setFlag: 'career_edu' },
              { setFlag: 'postgrad_done' },
              { setFlag: 'teacher_good_start' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'postgrad_strong' } },
            text: '你站上讲台的第一天,粉笔灰落在袖口。学生喊你老师,那一刻你有点不好意思,也有点郑重。',
            effects: [
              { stats: { money: 5000, mindset: 5, network: 4 } },
              { setCareer: 'education' },
              { setFlag: 'career_edu' },
              { setFlag: 'postgrad_done' },
            ],
          },
        ],
      },
      {
        id: 'local',
        text: '先找份稳定工作',
        outcomes: [
          {
            weight: 1,
            text: '你没有进入想象中的光鲜行业,但也算落了脚。简历上多出的那三年,最后变成了一句"抗压能力强"。',
            effects: [
              { stats: { money: 4000, mindset: -2 } },
              { setCareer: 'local' },
              { setFlag: 'postgrad_done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_gov_exam_result',
    pools: ['work'],
    category: 'career',
    title: '考公放榜',
    text: '成绩出来那天,你刷新了三次网页。那串数字不像分数,更像一张生活方式的门票。门开不开,就看这一眼。',
    mandatory: true,
    trigger: { all: [{ flag: 'civil_service_track' }, { year: { from: 2018, to: 2019 } }] },
    choices: [
      {
        id: 'wait',
        text: '点开成绩',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 50 },
            text: '你进面了,后来也上岸了。单位不大,事情不少,但爸妈终于不用在亲戚面前解释你"到底在干什么"。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10, money: 3000 } },
              { setCareer: 'gov' },
              { setFlag: 'career_gov' },
            ],
          },
          {
            weight: 1,
            text: '差了一点。真的只差一点。你盯着排名看了很久,最后关掉电脑,去楼下买了瓶冰可乐。',
            outcomeTag: 'failure',
            effects: [
              { stats: { mindset: -8, money: 3000 } },
              { setCareer: 'local' },
              { setFlag: 'civil_service_failed' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_antitrust',
    pools: ['work'],
    category: 'career',
    title: '风向变了',
    text: '2021年,反垄断和平台治理成了新闻关键词。公司全员会上,老板不再讲"星辰大海",开始讲"组织健康"和"长期主义"。你听懂了:增长不再是万能答案。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '收缩预期,先保住位置',
        outcomes: [
          {
            weight: 1,
            text: '你把跳槽网站的简历状态改成了"暂不考虑"。少谈理想,多做交付。成年人的安全感,有时就是下个月工资照发。',
            effects: [{ stats: { money: 20000, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '趁窗口还在,换到更核心团队',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 20 },
            text: '你靠内推换到了更核心的业务。新团队更累,但履历更硬。你第一次感觉,人脉不是饭局,是关键时刻有人愿意把你的简历递进去。',
            effects: [{ stats: { money: 30000, network: 5, mindset: -7 } }],
          },
          {
            weight: 1,
            text: '你投了几家,都没有后续。市场突然冷了下来,HR 的已读不回也变得很有礼貌。',
            effects: [{ stats: { mindset: -6 } }, { setFlag: 'cs_switch_failed' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_layoff_2022',
    pools: ['work'],
    category: 'career',
    title: '毕业名单',
    text: '2022年,公司开始"组织优化"。会议室被临时征用,HR 的表情比天气预报还准。你看到同事一个个抱着纸箱离开,第一次觉得工牌有点轻。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'a',
        text: '接受补偿,重新找',
        outcomes: [
          {
            weight: 1,
            text: 'N+1 到账那天,你的心情很复杂。钱是真的,空出来的日子也是真的。你开始每天投简历,像重新参加一次高考。',
            effects: [
              { stats: { money: 60000, mindset: -12 } },
              { setFlag: 'laid_off' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '主动降预期,留在船上',
        outcomes: [
          {
            weight: 1,
            text: '你留下来了,代价是更重的活和更小的奖金。幸存者没有掌声,只有更多需求排期。',
            effects: [{ stats: { money: 15000, mindset: -10 } }, { setFlag: 'survived_layoff' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_ai_2023',
    pools: ['work'],
    category: 'career',
    title: 'AI 来了',
    text: '2023年,同事开始在群里转 ChatGPT 截图。有人用它写周报,有人用它生成代码,也有人认真讨论"我们会不会被替代"。你打开网页,像打开一扇有风的门。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2023, to: 2023 } }] },
    choices: [
      {
        id: 'a',
        text: '把它当新工具,立刻学',
        outcomes: [
          {
            weight: 1,
            text: '你开始用 AI 写脚手架、查文档、改简历。效率确实上去了,焦虑也没有消失。工具越强,越提醒你别只做工具能做的事。',
            effects: [
              { stats: { knowledge: 10, money: 20000, mindset: -2 } },
              { setFlag: 'ai_adapted' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先观望,别被概念割韭菜',
        outcomes: [
          {
            weight: 1,
            text: '你没有第一时间跟进。半年后,它已经进了公司的工具链。你补课补得很快,只是错过了最早那波红利。',
            effects: [{ stats: { knowledge: 3, mindset: -4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_first_class',
    pools: ['work'],
    category: 'career',
    title: '第一堂课',
    text: '你站在讲台前,下面几十双眼睛看着你。备课时写满三页纸,开口后才发现,真正难的不是讲完知识点,是让他们愿意听。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2018, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '认真磨课,慢慢站稳',
        outcomes: [
          {
            weight: 1,
            text: '你把每节课都复盘一遍,连板书顺序都改了三次。学生不一定记得你的辛苦,但成绩单会记得。',
            effects: [{ stats: { knowledge: 6, mindset: 4, money: 5000 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先按老教师的方法来',
        outcomes: [
          {
            weight: 1,
            text: '你少走了些弯路,也少了点自己的东西。办公室里大家说你"稳",你一时分不清这是夸奖还是提醒。',
            effects: [{ stats: { money: 4000, network: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_online_2020',
    pools: ['work'],
    category: 'career',
    title: '网课时代',
    text: '2020年,教室搬进了屏幕。你对着摄像头讲课,学生头像一排排灰着。点名时有人掉线,提问时全班静音。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '重新设计互动方式',
        outcomes: [
          {
            weight: 1,
            text: '你学会了用投票、弹幕和小测把学生拉回来。效果不完美,但至少屏幕那头有人开始回"老师我在"。',
            effects: [{ stats: { knowledge: 5, network: 3, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '按原课件硬讲',
        outcomes: [
          {
            weight: 1,
            text: '课讲完了,你也累空了。后台数据显示观看时长断崖式下跌,它比任何领导听课都诚实。',
            effects: [{ stats: { mindset: -5 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_double_reduction',
    pools: ['work'],
    category: 'career',
    title: '双减落地',
    text: '2021年,双减政策落地。教培群一夜之间安静下来,有人退租,有人转行,有人说"先放个长假"。如果你在学校,压力换了形状;如果你在教培,地面突然塌了一块。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '转向校内和编制机会',
        outcomes: [
          {
            weight: 1,
            text: '你开始备考编制,白天上课,晚上刷题。很多年前你靠考试走出来,现在又靠考试给自己找稳定。',
            effects: [
              { stats: { knowledge: 6, mindset: -4 } },
              { setFlag: 'edu_to_public_school' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '做素质教育和线上小课',
        outcomes: [
          {
            weight: 1,
            text: '你换了赛道,课程名从"提分班"变成了"表达力训练"。家长还是焦虑,只是焦虑换了包装。',
            effects: [
              { stats: { money: 12000, network: 5, mindset: -6 } },
              { setFlag: 'edu_reinvented' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_exam_heat',
    pools: ['work'],
    category: 'career',
    title: '考编热',
    text: '2022年,考编群越来越热闹。每个人都在问资料、问岗位、问分数线。稳定这两个字,终于从父母的唠叨变成了年轻人的共识。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'a',
        text: '全力考编',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '你上岸了。不是童话结局,但至少暑假是真的,五险一金也是真的。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10, money: 8000 } },
              { setFlag: 'career_gov' },
              { setFlag: 'teacher_public' },
            ],
          },
          {
            weight: 1,
            text: '你没考上。成绩出来后你躺了一下午,晚上还是把错题整理完了。人到这个年纪,崩溃也要排进日程表。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -7, knowledge: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '继续在市场化教育里找机会',
        outcomes: [
          {
            weight: 1,
            text: '你没去挤那条独木桥。收入更波动,自由也更多。你开始学着把课卖给真正愿意买的人。',
            effects: [{ stats: { money: 18000, network: 4, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_fund_2020',
    pools: ['invest'],
    category: 'invest',
    title: '基金上车',
    text: '2020年,朋友圈都在晒基金收益。白酒、新能源、医药,每条曲线都像通往财富自由的楼梯。你打开理财软件,首页写着"历史业绩不代表未来表现"。',
    trigger: { year: { from: 2020, to: 2020 } },
    choices: [
      {
        id: 'a',
        text: '每月定投,别梭哈',
        outcomes: [
          {
            weight: 1,
            text: '你没有赚到截图里那种夸张收益,但也没有被波动吓跑。慢慢来这三个字,在牛市里很难听进去。',
            effects: [{ stats: { money: 6000, mindset: 2 } }, { setFlag: 'fund_dca' }],
          },
        ],
      },
      {
        id: 'b',
        text: '热门赛道一把梭',
        outcomes: [
          {
            weight: 1,
            text: '短期收益很好看,你甚至开始研究提前退休。那时候你还不知道,市场最擅长在你觉得自己懂了的时候讲下一课。',
            effects: [{ stats: { money: 20000, mindset: 5 } }, { setFlag: 'fund_chased' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_crash_2021',
    pools: ['invest'],
    category: 'invest',
    title: '抱团松动',
    text: '2021年,曾经闭眼买的基金开始回撤。评论区从"经理永远的神"变成"还我血汗钱"。你第一次认真看懂了什么叫最大回撤。',
    trigger: { year: { from: 2021, to: 2021 } },
    choices: [
      {
        id: 'a',
        text: '承认看不懂,降仓位',
        outcomes: [
          {
            weight: 1,
            text: '你少赚过,也少亏了。投资里最难的不是买入,是承认自己其实没有那么懂。',
            effects: [{ stats: { mindset: 2 } }, { setFlag: 'risk_control' }],
          },
        ],
      },
      {
        id: 'b',
        text: '越跌越买,信仰充值',
        outcomes: [
          {
            weight: 1,
            text: '你一路补仓,一路降低成本,也一路降低心态。账户曲线像体检报告,每次打开都需要勇气。',
            effects: [{ stats: { money: -18000, mindset: -10 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_gold_2024',
    pools: ['invest'],
    category: 'invest',
    title: '黄金和出海',
    text: '2024年,黄金、新出海、AI 应用轮番上热搜。你已经不像刚毕业时那样相信"错过这次就没了",但手指还是会停在买入按钮上。',
    trigger: { year: { from: 2024, to: 2024 } },
    choices: [
      {
        id: 'a',
        text: '小仓位参与,留足现金',
        outcomes: [
          {
            weight: 1,
            text: '你赚了一点,也睡得着觉。成年人最实用的投资哲学,可能是别让账户余额决定当天心情。',
            effects: [{ stats: { money: 12000, mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '追热门,这次别错过',
        outcomes: [
          {
            weight: 1,
            text: '你买在热闹处,卖在安静时。亏损不算致命,但足够让你把几个财经博主取关。',
            effects: [{ stats: { money: -12000, mindset: -5 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_probation',
    pools: ['work'],
    category: 'career',
    title: '试用期汇报',
    text: '入职几个月后,你要做第一次试用期汇报。PPT 上写着"成长与反思",但你最想写的是"我真的尽力了"。',
    trigger: { year: { from: 2018, to: 2019 } },
    choices: [
      {
        id: 'a',
        text: '认真准备,把事讲清楚',
        outcomes: [
          {
            weight: 1,
            text: '你把做过的事拆成三页,问题和改进也写得实在。领导没夸很多,但说"可以转正"。那一刻你才敢松口气。',
            effects: [{ stats: { money: 5000, mindset: 4, network: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '套模板,别太暴露自己',
        outcomes: [
          {
            weight: 1,
            text: '汇报过了,但也只是过了。你开始明白,职场里"没问题"和"有机会"之间隔着很长一段路。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_manager_feedback',
    pools: ['work'],
    category: 'career',
    title: '领导的反馈',
    text: '绩效沟通时,领导说你"执行不错,但要更有 owner 意识"。你点头记录,心里翻译成中文:活要多想,锅也要多背。',
    trigger: { year: { from: 2019 } },
    choices: [
      {
        id: 'a',
        text: '主动接一个难项目',
        outcomes: [
          {
            weight: 1,
            text: '项目比你想象中难,但做成后确实有人记住了你。成长常常不是变强了才上,是上了才被迫变强。',
            effects: [{ stats: { knowledge: 5, network: 4, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳定交付,不抢风头',
        outcomes: [
          {
            weight: 1,
            text: '你保持稳定,也保持低调。风险少了,机会也少了。安全区的门把手,摸起来总是很舒服。',
            effects: [{ stats: { money: 8000, mindset: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_first_bonus',
    pools: ['work'],
    category: 'money',
    title: '第一笔年终奖',
    text: '年终奖到账了。金额没有传说中那么夸张,但比你学生时代见过的大多数数字都大。你打开购物车,又打开银行卡余额。',
    trigger: { year: { from: 2019, to: 2020 } },
    choices: [
      {
        id: 'a',
        text: '先存起来',
        outcomes: [
          {
            weight: 1,
            text: '你把大部分钱转进定期。快乐少了一点,安全感多了一点。余额像一床薄被,挡不了寒冬,但能挡一阵风。',
            effects: [{ stats: { money: 20000, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '买点一直舍不得的东西',
        outcomes: [
          {
            weight: 1,
            text: '你买了新手机或一件好外套。拆包装时很快乐,付款记录也很清醒。成年人的奖励,常常要自己批准。',
            effects: [{ stats: { money: 8000, mindset: 6 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_remote_office',
    pools: ['work'],
    category: 'career',
    title: '远程办公',
    text: '2020年,客厅变成办公室。视频会议里有人忘关麦,有人孩子在旁边哭,有人把头像停在"网络不佳"。',
    trigger: { year: { from: 2020, to: 2020 } },
    choices: [
      {
        id: 'a',
        text: '建立作息,守住边界',
        outcomes: [
          {
            weight: 1,
            text: '你给自己划了上下班时间。虽然消息还是会越界,但至少你没有彻底变成一台联网设备。',
            effects: [{ stats: { mindset: 4, knowledge: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '随叫随到,别掉链子',
        outcomes: [
          {
            weight: 1,
            text: '你回复得很快,也累得很快。远程办公最可怕的不是在家办公,是在家也下不了班。',
            effects: [{ stats: { money: 6000, mindset: -6 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_buy_house_question',
    pools: ['work'],
    category: 'money',
    title: '买房问题',
    text: '家里开始问你要不要考虑买房。首付、月供、城市、通勤、未来规划,每个词都像一块砖,压在聊天窗口里。',
    trigger: { year: { from: 2021, to: 2023 } },
    choices: [
      {
        id: 'a',
        text: '先观望,不急着背房贷',
        outcomes: [
          {
            weight: 1,
            text: '你没有上车。有人说你错过,有人说你清醒。你只知道,不买也是一种选择,只是这种选择也会被反复审判。',
            effects: [{ stats: { mindset: 1 } }, { setFlag: 'no_house' }],
          },
        ],
      },
      {
        id: 'b',
        text: '凑首付,买个小的',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'money', op: '>=', value: 80000 },
            text: '你买了一个不大的房子。钥匙拿到手时很激动,还贷日到来时也很真实。家变成了资产,也变成了责任。',
            effects: [{ stats: { money: -80000, mindset: 5 } }, { setFlag: 'has_house' }],
          },
          {
            weight: 1,
            text: '你算了几遍,发现首付还是差一截。中介说"再不买就晚了",但你的银行卡说"现在就很晚"。',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_blind_date',
    pools: ['work'],
    category: 'relationship',
    title: '相亲局',
    text: '亲戚给你介绍了一个人,理由很充分:"年龄差不多,工作也稳定。"你看着对方微信头像,想不出第一句话该说什么。',
    trigger: { year: { from: 2022 } },
    choices: [
      {
        id: 'a',
        text: '见一面,别预设太多',
        outcomes: [
          {
            weight: 1,
            text: '你们吃了顿饭,聊得不算尴尬。关系未必有后续,但你发现自己已经能平静地面对这种安排。',
            effects: [{ stats: { mindset: 2, network: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '婉拒,现在没心力',
        outcomes: [
          {
            weight: 1,
            text: '你说最近太忙。亲戚回了个"理解",后面跟着三个意味深长的句号。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_midlife_hint',
    pools: ['work'],
    category: 'mindset',
    title: '三十岁的暗示',
    text: '你发现自己开始关注体检套餐、睡眠质量和岗位天花板。曾经以为很远的三十岁,现在坐在对面,像一个不太熟的同事。',
    trigger: { year: { from: 2025, to: 2026 } },
    choices: [
      {
        id: 'a',
        text: '重新规划下一阶段',
        outcomes: [
          {
            weight: 1,
            text: '你写下几个真正想保住的东西:身体、现金流、少数关系、还能学习的能力。清单不长,但比愿望靠谱。',
            effects: [{ stats: { knowledge: 3, mindset: 5 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先别想,过一天算一天',
        outcomes: [
          {
            weight: 1,
            text: '你把问题往后推了推。成年人不是不知道问题在那儿,只是有时候真的需要先把今天过完。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_grinder_big_tech',
    pools: [],
    category: 'npc',
    title: '卷王进了大厂',
    text: '卷王同学在朋友圈发了工牌照片。评论区一片"大佬带带我"。你替他高兴,也很难不把那张照片和自己的处境放在一起比较。',
    choices: [
      {
        id: 'a',
        text: '找他请教求职经验',
        outcomes: [
          {
            weight: 1,
            text: '他给你发来一份面试资料,还帮你改了简历。强者的帮助有时很直接,也很刺眼:原来差距真的可以被一条条列出来。',
            effects: [
              { stats: { knowledge: 4, network: 4, mindset: -2 } },
              { npcFavor: 'grinder', delta: 8 },
              { npcStage: 'grinder', stage: 'layoff_pending' },
              { setFlag: 'grinder_resume_help' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '点个赞,不打扰',
        outcomes: [
          {
            weight: 1,
            text: '你点了赞,关掉朋友圈。不是不想问,只是有些比较一旦开口,就会显得自己太狼狈。',
            effects: [
              { stats: { mindset: -1 } },
              { npcFavor: 'grinder', delta: -2 },
              { npcStage: 'grinder', stage: 'layoff_pending' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_grinder_layoff',
    pools: [],
    category: 'npc',
    title: '卷王也被优化了',
    text: '2022年,卷王同学突然在群里说自己"毕业了"。你愣了一下才反应过来,这是大厂裁员的新黑话。原来跑得最快的人,也可能撞上时代的墙。',
    choices: [
      {
        id: 'a',
        text: '私聊问他要不要帮忙',
        outcomes: [
          {
            weight: 1,
            text: '他隔了很久回你:"没事,我先休息一下。"你们聊到深夜,第一次不是谁给谁建议,只是两个成年人互相确认还撑得住。',
            effects: [
              { stats: { mindset: 3, network: 3 } },
              { npcFavor: 'grinder', delta: 12 },
              { npcStage: 'grinder', stage: 'mirror_friend' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '不知道说什么,只发个表情',
        outcomes: [
          {
            weight: 1,
            text: '你发了一个抱抱的表情。他回了个笑脸。成年人之间的关心,有时薄得像一张贴纸。',
            effects: [
              { stats: { mindset: -1 } },
              { npcStage: 'grinder', stage: 'distant_star' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_hometown_settled',
    pools: [],
    category: 'npc',
    title: '发小上岸了',
    text: '县城发小发来消息:他考上了本地事业单位。工资不高,但单位离家十分钟。他说中午还能回家吃饭,语气里有一种你很久没听过的安稳。',
    choices: [
      {
        id: 'a',
        text: '真心祝贺他',
        outcomes: [
          {
            weight: 1,
            text: '你发了很长一段祝福。他回你:"等你回来请你吃饭。"你突然发现,你们不是走散了,只是走在不同的地图上。',
            effects: [
              { stats: { mindset: 4, network: 2 } },
              { npcFavor: 'hometown_friend', delta: 8 },
              { npcStage: 'hometown_friend', stage: 'settled' },
              { setFlag: 'hometown_friend_settled' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '开玩笑说他提前退休',
        outcomes: [
          {
            weight: 1,
            text: '他回了个"哈哈"。你知道自己没有恶意,但也知道这玩笑里藏着一点羡慕和一点不服气。',
            effects: [
              { stats: { mindset: -1 } },
              { npcFavor: 'hometown_friend', delta: -3 },
              { npcStage: 'hometown_friend', stage: 'settled' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_hometown_reunion',
    pools: [],
    category: 'npc',
    title: '再回县城',
    text: '2025年春节,你和发小又坐回那家烧烤摊。县城变化不大,你们都变化不少。他聊孩子和单位,你聊房租和项目。两种生活互相羡慕,也互相庆幸。',
    choices: [
      {
        id: 'a',
        text: '承认自己也羡慕稳定',
        outcomes: [
          {
            weight: 1,
            text: '他说稳定也有稳定的烦恼。你们碰了一杯,突然都笑了。原来每条路都有别人看不见的坡。',
            effects: [
              { stats: { mindset: 5 } },
              { npcFavor: 'hometown_friend', delta: 8 },
              { npcStage: 'hometown_friend', stage: 'close' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '继续说大城市机会多',
        outcomes: [
          {
            weight: 1,
            text: '他说挺好,年轻人就该闯。你听出这话像祝福,也像告别。你们都没有错,只是越来越难交换人生。',
            effects: [
              { stats: { network: -1, mindset: -2 } },
              { npcStage: 'hometown_friend', stage: 'distant' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_mentor_intro',
    pools: [],
    category: 'npc',
    title: '职场贵人',
    text: '一次项目复盘后,一位前辈把你叫住。他没有讲鸡汤,只指出你方案里真正值钱的部分,也指出你一直没看见的盲区。',
    choices: [
      {
        id: 'a',
        text: '认真请教,保持联系',
        outcomes: [
          {
            weight: 1,
            text: '你后来偶尔向他请教关键选择。他回消息不多,但每次都很准。贵人不是替你走路的人,是提醒你别往坑里走的人。',
            effects: [
              { stats: { knowledge: 4, network: 6, mindset: 2 } },
              { npcFavor: 'mentor', delta: 25 },
              { npcStage: 'mentor', stage: 'available' },
              { setFlag: 'mentor_connected' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '听完就算,别麻烦别人',
        outcomes: [
          {
            weight: 1,
            text: '你礼貌道谢,没有再联系。后来你偶尔想起那次谈话,才发现有些门不是一直开着的。',
            effects: [
              { stats: { knowledge: 2 } },
              { npcStage: 'mentor', stage: 'missed' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_mentor_advice',
    pools: [],
    category: 'npc',
    title: '前辈的临别赠言',
    text: '2024年,前辈准备离开这家公司。临走前他请你喝咖啡,说:"别把平台给你的东西,误认成自己的能力。但也别低估你扛过来的东西。"',
    choices: [
      {
        id: 'a',
        text: '记下来,重新整理方向',
        outcomes: [
          {
            weight: 1,
            text: '你回去后删掉了几个虚荣目标,留下真正能积累的技能。那杯咖啡不贵,但像一次迟来的职业体检。',
            effects: [
              { stats: { knowledge: 6, network: 3, mindset: 4 } },
              { npcFavor: 'mentor', delta: 8 },
              { npcStage: 'mentor', stage: 'ally' },
              { setFlag: 'mentor_lesson' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '感谢他,但继续按原计划走',
        outcomes: [
          {
            weight: 1,
            text: '你感谢了他,也没有立刻改变。不是所有建议都会马上生效,有些话要过几年才听得懂。',
            effects: [{ stats: { mindset: 1 } }, { npcStage: 'mentor', stage: 'ally' }],
          },
        ],
      },
    ],
  },
];
