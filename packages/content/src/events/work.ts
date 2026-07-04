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
    id: 'ev_invest_stock_2015',
    pools: ['invest'],
    category: 'invest',
    title: '牛市与股灾',
    text: '2015年上半年,连食堂打饭的阿姨都在聊股票。室友开了户,把三个月生活费投了进去,收益率截图天天发群里。他把开户二维码推到你面前:"牛市不进场,等于白活。"',
    trigger: { year: { from: 2015, to: 2015 } },
    choices: [
      {
        id: 'a',
        text: '拿出一部分生活费,跟着进场',
        outcomes: [
          {
            weight: 3,
            text: '五月你账户浮盈 40%,开始研究"财务自由要多少钱"。六月股灾来了,千股跌停,你在宿舍床上盯着绿色的分时图,第一次知道钱是怎么在十分钟里没有的。这一课,收费两千。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -2000, mindset: -6, knowledge: 3 } }, { setFlag: 'stock_lesson' }],
          },
          {
            weight: 1,
            text: '你五月底急着交学费,把钱撤了出来。六月股灾,你成了宿舍唯一"逃顶"的人。你反复强调那是运气,但没人信——从此室友炒股都先问你。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 1500, mindset: 2, network: 2 } }, { setFlag: 'stock_lesson' }],
          },
        ],
      },
      {
        id: 'b',
        text: '生活费就这么点,围观就好',
        outcomes: [
          {
            weight: 1,
            text: '你看着室友的表情从五月的意气风发变成六月的沉默寡言。那个夏天你没赚一分钱,但白捡了一门风险教育课——学费是别人交的。',
            effects: [{ stats: { knowledge: 2, mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_house_2016',
    pools: ['invest'],
    category: 'money',
    title: '六个钱包',
    mandatory: true,
    trigger: {
      all: [
        { year: { from: 2016, to: 2016 } },
        { any: [{ background: 'bg_urban_middle' }, { background: 'bg_demolition' }] },
      ],
    },
    text: '国庆回家,爸妈把你叫到客厅,茶几上摊着几张户型图。"家里凑一凑,首付够在省会买个小两居。你以后工作也用得上,现在不买,以后更买不起。"电视里正在播某地楼市新政的新闻。',
    choices: [
      {
        id: 'a',
        text: '听家里的,把房子定下来',
        outcomes: [
          {
            weight: 1,
            text: '房子签在你名下,首付掏空了家里大半积蓄。签字那天你手心全是汗,觉得自己还没开始工作就先背上了三十年。后来的事情你还不知道:这可能是你这辈子做过最划算的决定。',
            effects: [
              { stats: { money: -10000, mindset: -2 } },
              { setFlag: 'has_house' },
              { setFlag: 'early_house' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '我还在上学,买什么房',
        outcomes: [
          {
            weight: 1,
            text: '你说想把钱留着,以后去大城市发展。爸妈对视了一眼,没再坚持。第二年,那个小区的价格你没敢再查。人生里有些门,关上的时候一点声音都没有。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_bitcoin_2017',
    pools: ['invest'],
    category: 'invest',
    title: '论坛里的传说',
    text: '2017年,你常逛的论坛里有个帖子火了:楼主晒出几年前买的比特币,已经翻了几百倍。评论区一半人喊骗子,一半人问怎么买。你查了查,一个要好几千,但可以买零点几个。',
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '拿几千块买一点,就当买彩票',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'stock_lesson' },
            text: '2015年的教训还在,你只拿了三千块——亏光也不心疼的数目。转完账你把 APP 藏进手机文件夹最深处,告诉自己:五年之内不看。',
            effects: [
              { stats: { money: -3000 } },
              { schedule: { eventId: 'ev_invest_crypto_cashout', afterRounds: 4 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'stock_lesson' } },
            text: '你转了三千块进去,买了零点几个看不见摸不着的东西。室友说你疯了,你也觉得自己有点疯。你把它忘在账户里,像忘掉一张彩票。',
            effects: [
              { stats: { money: -3000 } },
              { schedule: { eventId: 'ev_invest_crypto_cashout', afterRounds: 4 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '看不懂的东西,不碰',
        outcomes: [
          {
            weight: 1,
            text: '你关掉帖子,继续改简历。很多年后你还会想起这个晚上,但你也知道:就算买了,你也拿不住。能拿住的人,当年就不会只买三千块。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_invest_crypto_cashout',
    pools: [],
    category: 'invest',
    title: '下不下车',
    text: '你想起了那笔被你藏起来的比特币。打开账户,这几年它翻了几十倍,三千块变成了一串你要数两遍的数字。群里有人说这才刚开始,有人说这是最后的疯狂。你的手悬在"卖出"上。',
    choices: [
      {
        id: 'a',
        text: '卖,落袋为安',
        outcomes: [
          {
            weight: 1,
            text: '你清仓了。到账短信响起来的时候,你在工位上愣了很久。这笔钱不是工资,不是奖金,是那个晚上敢按下确认键的自己寄来的包裹。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 200000, mindset: 8 } }, { setFlag: 'crypto_win' }],
          },
        ],
      },
      {
        id: 'b',
        text: '再拿拿,万一还能翻倍',
        outcomes: [
          {
            weight: 1,
            text: '它真的又涨了一波,你在下一个疯狂的顶部附近卖掉了。运气好到你自己都害怕。你把截图发给当年的室友,他回了一个字:"服。"',
            outcomeTag: 'success',
            effects: [{ stats: { money: 450000, mindset: 10 } }, { setFlag: 'crypto_win' }],
          },
          {
            weight: 2,
            text: '后来的暴跌比涨得更快。你在腰斩再腰斩之后终于割了肉,三千块变成四万,算赚,但和你在最高点看到的数字比,像被没收了一套房。你终于理解了那句话:凭运气拿到的,凭什么拿得住。',
            outcomeTag: 'partial',
            effects: [{ stats: { money: 40000, mindset: -6 } }],
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
            weight: 1,
            text: '你转了两万进去。第一个月利息 250,准时到账,像一句"你看吧"。同事拍拍你:"稳的,我研究过他们的股东背景。"你把这个 APP 挪到了手机第一屏。',
            effects: [
              { stats: { money: -20000, mindset: 2 } },
              { schedule: { eventId: 'ev_invest_p2p_collapse', afterRounds: 1 } },
            ],
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
    id: 'ev_invest_p2p_collapse',
    pools: [],
    category: 'invest',
    title: '暂停提现',
    text: '这天早上,平台公告"系统升级,暂停提现"。维权群一夜之间从 200 人涨到 2000 人,有人晒出总部人去楼空的照片。你点开自己的账户,数字还在,只是"取出"按钮再也点不动了。',
    choices: [
      {
        id: 'a',
        text: '进维权群,登记材料,死磕到底',
        outcomes: [
          {
            weight: 1,
            text: '你跟着群友跑立案、做登记、盯进展。两年后清退方案下来,回款四成。到账那天群里刷了一排"谢谢",你却高兴不起来——但好歹,不是零。',
            outcomeTag: 'partial',
            effects: [{ stats: { money: 8000, mindset: -10 } }, { setFlag: 'p2p_burned' }],
          },
          {
            weight: 2,
            text: '你登记了材料,进了三个维权群,换来的只有一轮轮"最新进展"和一次次失望。两万块最后变成了群文件里的一行数字。同事比你惨,他加了杠杆。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -15 } }, { setFlag: 'p2p_burned' }],
          },
        ],
      },
      {
        id: 'b',
        text: '认栽,当交了两万块学费',
        outcomes: [
          {
            weight: 1,
            text: '你退了群,卸了 APP,把这两万块记进"人生学费"。后来再看到"年化 15%"四个字,你的手指会自动划走。有些课,一辈子只需要上一次。',
            effects: [{ stats: { mindset: -8 } }, { setFlag: 'p2p_burned' }],
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
              { stats: { money: 90000, mindset: -12 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
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
            effects: [
              { stats: { money: 15000, mindset: -10 } },
              { setFlag: 'survived_layoff' },
              { schedule: { eventId: 'ev_cs_second_wave', afterRounds: 1 } },
            ],
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
            condition: { flag: 'survived_layoff' },
            text: '去年裁员留下来的人里,你是学得最凶的那个。你比谁都清楚:上一轮靠的是降预期,这一轮得靠真本事。AI 没有让你更安全,但让你更有用。',
            effects: [
              { stats: { knowledge: 11, money: 20000, mindset: -1 } },
              { setFlag: 'ai_adapted' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'survived_layoff' } },
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
    id: 'ev_cs_second_wave',
    pools: [],
    category: 'career',
    title: '第二轮优化',
    text: '"降本增效"进入第二季。这次没有全员大会,只有一个个被拉进小会议室的日历邀请。你去年主动降过预期,但名单从来不看苦劳。',
    choices: [
      {
        id: 'a',
        text: '主动申请转岗,去离收入最近的业务',
        outcomes: [
          {
            weight: 1,
            text: '你赶在名单敲定前转去了商业化团队。新业务节奏更狠,但至少工牌还是热的。你开始明白,大厂里最稳的岗位,是离钱最近的岗位。',
            effects: [{ stats: { money: 12000, knowledge: 4, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不折腾,赌名单上没有我',
        outcomes: [
          {
            weight: 2,
            text: '这一轮的刀落在了隔壁组。你继续留在原地,只是把工位上的私人物品,悄悄减到了一个背包能装下的量。',
            effects: [{ stats: { money: 8000, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '日历邀请最终还是来了。HR 的话术,和去年你目送同事离开时听到的一模一样。N+1 到账,你在楼下坐了很久,把去年没敢想的问题想完了。',
            outcomeTag: 'failure',
            effects: [
              { stats: { money: 80000, mindset: -14 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_reemployment',
    pools: [],
    category: 'career',
    title: '空窗期之后',
    text: '被裁后的第几个月,你已经数不清投了多少份简历。面试官的问题越来越像审讯:"这段空窗期你在做什么?"这天,你同时收到两个消息:一个降薪三成的 offer,和一句"再等等,还有更合适的"的猎头留言。',
    choices: [
      {
        id: 'a',
        text: '降薪也先上车,活下来再说',
        outcomes: [
          {
            weight: 1,
            text: '你签了。工资少了一截,心里的石头却落了地。入职第一天,你把新工卡拍照发给爸妈。他们不懂"降薪三成"意味着什么,只回了一句:"上班就好。"',
            effects: [{ stats: { money: 25000, mindset: 8 } }, { setFlag: 'restarted_after_layoff' }],
          },
        ],
      },
      {
        id: 'b',
        text: '再撑一撑,等一个不将就的机会',
        outcomes: [
          {
            weight: 1,
            text: '三个月后,你等到了那个位置——薪资没降,方向也对。回头看,那段空窗期像一场没人监考的考试,你交卷交得比想象中体面。',
            effects: [{ stats: { money: 40000, mindset: 10 } }, { setFlag: 'restarted_after_layoff' }],
          },
          {
            weight: 1,
            text: '存款以肉眼可见的速度变薄,合适的机会始终差半步。最后你接了一份过渡的工作。成年人的底气,原来是按月发放的。',
            effects: [{ stats: { money: -15000, mindset: -6 } }, { setFlag: 'restarted_after_layoff' }],
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
            condition: { flag: 'p2p_burned' },
            text: '被 P2P 咬过之后,你只敢每月定投一点宽基。收益不惊艳,但每次点开账户,你想到的不再是"暴富",而是"这次至少跑得掉"。学费没有白交。',
            effects: [{ stats: { money: 15000, mindset: 3 } }, { setFlag: 'fund_dca' }],
          },
          {
            weight: 1,
            condition: { flag: 'dodged_p2p' },
            text: '当年躲过 P2P 的那点直觉还在。你设了每月定投,涨了不追,跌了不停。同事笑你保守,你笑笑没说话。',
            effects: [{ stats: { money: 16000, mindset: 3 } }, { setFlag: 'fund_dca' }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'p2p_burned' } }, { not: { flag: 'dodged_p2p' } }] },
            text: '你没有赚到截图里那种夸张收益,但也没有被波动吓跑。慢慢来这三个字,在牛市里很难听进去。',
            effects: [{ stats: { money: 15000, mindset: 2 } }, { setFlag: 'fund_dca' }],
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
            effects: [{ stats: { money: 60000, mindset: 5 } }, { setFlag: 'fund_chased' }],
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
    trigger: {
      all: [
        { year: { from: 2021, to: 2021 } },
        { any: [{ flag: 'fund_dca' }, { flag: 'fund_chased' }] },
      ],
    },
    choices: [
      {
        id: 'a',
        text: '承认看不懂,降仓位',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'fund_chased' },
            text: '你在半山腰割掉了大半仓位。去年梭哈进去的钱回来时瘦了一圈,但至少还认识回家的路。投资里最难的不是买入,是承认自己其实没有那么懂。',
            effects: [{ stats: { money: -30000, mindset: -3 } }, { setFlag: 'risk_control' }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'fund_chased' } },
            text: '定投的仓位本来就不重,你降了一档继续走。你少赚过,也少亏了。投资里最难的不是买入,是承认自己其实没有那么懂。',
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
            condition: { flag: 'fund_chased' },
            text: '你重仓在山顶,又一路补仓到山腰。去年研究"提前退休"的文档还在收藏夹里,现在你只敢在深夜打开账户。市场用真金白银给你上了第二课。',
            effects: [{ stats: { money: -100000, mindset: -14 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'fund_chased' } },
            text: '你一路补仓,一路降低成本,也一路降低心态。账户曲线像体检报告,每次打开都需要勇气。',
            effects: [{ stats: { money: -50000, mindset: -10 } }],
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
            effects: [{ stats: { money: 30000, mindset: 3 } }],
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
            effects: [{ stats: { money: -40000, mindset: -5 } }],
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
    trigger: {
      all: [
        { year: { from: 2021, to: 2023 } },
        { not: { flag: 'has_house' } },
      ],
    },
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
            condition: { stat: 'money', op: '>=', value: 300000 },
            text: '你买了一个不大的房子。首付划出去的那一刻,账户余额少了一个量级。钥匙拿到手时很激动,还贷日到来时也很真实。家变成了资产,也变成了责任。',
            effects: [{ stats: { money: -300000, mindset: 5 } }, { setFlag: 'has_house' }],
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
    id: 'ev_house_price_correction',
    pools: ['work'],
    category: 'money',
    title: '房价回调',
    mandatory: true,
    trigger: { all: [{ flag: 'has_house' }, { year: { from: 2024, to: 2024 } }] },
    text: '2024年,你所在小区的挂牌价从最高点回落了一截。中介的朋友圈从"再不上车就晚了"变成了"业主诚心急售"。月供短信还是每月 8 号准时到,像什么都没发生过。',
    choices: [
      {
        id: 'a',
        text: '手里攒了点钱,提前还一部分贷款',
        outcomes: [
          {
            weight: 1,
            condition: { all: [{ flag: 'early_house' }, { stat: 'money', op: '>=', value: 200000 }] },
            text: '2016年上的车,跌掉的只是浮盈的零头。你提前还了一笔,月供轻了一大截。当年在客厅签字时手心冒汗的你,大概想不到有一天会感谢爸妈的固执。',
            effects: [{ stats: { money: -150000, mindset: 8 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'early_house' } }, { stat: 'money', op: '>=', value: 200000 }] },
            text: '你提前还了一笔,月供轻了一些。房价的数字你决定不再天天看——住着的房子,跌的是别人嘴里的估值,亮的是自己家里的灯。',
            effects: [{ stats: { money: -150000, mindset: 6 } }],
          },
          {
            weight: 1,
            condition: { stat: 'money', op: '<', value: 200000 },
            text: '你打开还款计算器按了半天,发现"提前还贷"这四个字,首先需要"提前有钱"。你关掉 APP,把这件事推给了明年的自己。',
            effects: [{ stats: { mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不看不问,照常还贷照常生活',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'early_house' },
            text: '你算了算,现在的价格还是 2016 年买入价的两倍多。你关掉 APP,该上班上班。上车早的人看回调,像坐在山腰看潮水——湿不到脚。',
            effects: [{ stats: { mindset: 4 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'early_house' } },
            text: '你把看房 APP 卸载了。周末你在自己家里煮火锅,窗户上全是雾气。账面浮亏是真的,锅里的热气也是真的。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_rent_moving_again',
    pools: ['work'],
    category: 'money',
    title: '第 N 次搬家',
    mandatory: true,
    trigger: { all: [{ flag: 'no_house' }, { year: { from: 2025, to: 2025 } }] },
    text: '房东发来消息:"房子要卖,下个月麻烦搬一下。"你环顾这间住了几年的屋子,发现所谓生活,原来可以被打包成十二个纸箱。',
    choices: [
      {
        id: 'a',
        text: '搬,顺便换个离公司近点的',
        outcomes: [
          {
            weight: 1,
            text: '新房子贵了几百块,但通勤缩短了四十分钟。搬完最后一箱,你点了个外卖,坐在地板上吃。没有房产证,但这一刻,这里确实是你的家。',
            effects: [{ stats: { money: -8000, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '借这个机会,认真算算要不要离开这座城市',
        outcomes: [
          {
            weight: 1,
            text: '你打开了老家省会的招聘软件,又打开了这座城市的地铁图。算到最后你发现,让你留下的不是机会,是不甘心。你续租了另一间房,把"离开"两个字又存回了草稿箱。',
            effects: [{ stats: { money: -5000, mindset: -2 } }],
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
    id: 'ev_love_marriage',
    pools: [],
    category: 'relationship',
    title: '领证这件小事',
    text: '异地熬过来了,租房换过三次,吵过架也复过合。这天吃完饭散步,她忽然说:"我爸妈问,我们到底什么打算。"你们在路灯下站了一会儿,谁都没先开口。',
    choices: [
      {
        id: 'a',
        text: '打算就是:我们去领证吧',
        outcomes: [
          {
            weight: 1,
            text: '没有跪地求婚,没有无人机灯光秀。你们挑了个工作日去了民政局,拍照的时候都有点想笑。婚礼办得不大,敬酒敬到你嗓子哑。那天晚上你想:十二年里做对的事不多,这件肯定算。',
            effects: [
              { stats: { money: -40000, mindset: 12, network: 5 } },
              { npcFavor: 'first_love', delta: 20 },
              { npcStage: 'first_love', stage: 'married' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '再等等,等我再稳定一点',
        outcomes: [
          {
            weight: 1,
            text: '你说想再攒攒钱,给她一个更好的开始。她点点头,说理解。只是那晚之后,"以后"这个词在你们的对话里出现得越来越少了。有些等待是储蓄,有些等待是消耗,当时的你分不清。',
            effects: [
              { stats: { mindset: -4 } },
              { npcFavor: 'first_love', delta: -10 },
              { npcStage: 'first_love', stage: 'steady_long' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_roommate_2020',
    pools: [],
    category: 'npc',
    title: '室友开播了',
    text: '2020年,你刷到室友在直播卖家乡的橙子。镜头前他熟练地喊着"3、2、1 上链接",背景是他老家的果园。当年校园跑腿那股劲儿,原来一直没灭,只是换了个出口。',
    choices: [
      {
        id: 'a',
        text: '下一单,再帮他转发到朋友圈',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'roommate_startup_joined' },
            text: '你下了单,备注写了句"创始团队前来验货"。他在直播里念到这条备注时愣了一下,笑着说:"这是我第一个合伙人。"当晚他给你转了 888,你退回去,留了句:下次上新叫我。',
            effects: [
              { stats: { mindset: 6, network: 5 } },
              { npcFavor: 'roommate', delta: 15 },
              { npcStage: 'roommate', stage: 'livestream_comeback' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'roommate_startup_joined' } },
            text: '你买了两箱橙子,顺手转发了直播间。他私信你:"谢了兄弟。"橙子很甜,你想起大学阳台上那份没入伙的商业计划书,忽然有点感慨:他一直在场上,你一直在看台。',
            effects: [
              { stats: { mindset: 3 } },
              { npcFavor: 'roommate', delta: 8 },
              { npcStage: 'roommate', stage: 'livestream_comeback' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '点个赞就划走,各自生活',
        outcomes: [
          {
            weight: 1,
            text: '你点了个赞,继续刷下一条。后来他的直播间慢慢做起来了,你们的聊天记录停在去年的"新年快乐"。有些人没有走散,只是走远。',
            effects: [
              { npcFavor: 'roommate', delta: -5 },
              { npcStage: 'roommate', stage: 'faded' },
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
