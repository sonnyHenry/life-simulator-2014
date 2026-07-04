import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控,防止上班族语境事件打到 2018-2021 在读的考研玩家身上
const working: Condition = {
  any: [
    { flag: 'entered_job_market_2018' },
    { flag: 'postgrad_done' },
    { flag: 'career_gov' },
    { flag: 'civil_service_failed' },
  ],
};

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
    tier: 'major',
    title: '六个钱包',
    mandatory: true,
    trigger: {
      all: [
        { year: { from: 2016, to: 2016 } },
        { any: [{ background: 'bg_urban_middle' }, { background: 'bg_demolition' }] },
      ],
    },
    text: '2016年国庆,你回家过节。刚放下行李,爸妈就把你叫到客厅,电视静了音,茶几上摊着几张打印的户型图,边角都被翻卷了——显然已经研究了不止一天。"我们和你姑姑、你舅舅都商量过了,家里凑一凑,首付够在省会买个小两居。"爸爸的手指点在其中一张图上,"你以后工作、成家,总归用得上。现在不买,以后更买不起。"电视里正在播某地楼市新政的新闻,主持人语速很快。你才大三,连毕业去哪座城市都没想好,而茶几对面,两代人的积蓄正等着你点头或摇头。',
    choices: [
      {
        id: 'a',
        text: '听家里的,把房子定下来',
        outcomes: [
          {
            weight: 1,
            text: '签合同那天,售楼处人声鼎沸,销售抱着一沓合同小跑,大喇叭每隔十分钟广播一次"X 栋 X 单元已售罄"。爸妈在一旁反复核对每一页,你在"购房人"那一栏签下自己的名字时,手心全是汗——那是你第一次在这么贵的东西上签字,笔画都比平时用力。回学校的高铁上你算了笔账:自己还没挣过一分工资,先背上了三十年。你把这件事压在心底,没跟室友说。后来的事情你还不知道:再过两年,这个决定会被亲戚们在饭桌上反复引用;再过八年,它可能是你这辈子做过最划算的一笔交易。',
            effects: [
              { stats: { money: -10000, mindset: -2 } },
              { setFlag: 'has_house' },
              { setFlag: 'early_house' },
              { schedule: { eventId: 'ev_house_progress_2016', afterRounds: 0 } },
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
            text: '你说:"我还没毕业,连以后在哪个城市都不知道,现在买房太早了。钱留着,以后我去大城市打拼也用得上。"爸妈对视了一眼,妈妈想说什么,被爸爸摆手拦住了:"孩子有自己的想法,是好事。"户型图被收进了抽屉,这个话题在饭桌上再没被提起。第二年春天,你在新闻里看到那座城市的名字和"环比上涨"出现在同一行,你点开又关掉。到了第三年,那个小区的价格你已经不敢再查了。人生里有些门,关上的时候一点声音都没有,要过很多年,你路过原地,才听见那声迟到的"咔哒"。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_house_progress_2016',
    pools: [],
    category: 'money',
    title: '工地照片',
    text: '寒假前,爸爸开始隔三差五给你发照片:一片工地,塔吊,和一根他用红圈标出来的桩子。"看,这是咱家那栋。"其实那个角度什么都看不出来,但他每次路过都要拍一张。',
    choices: [
      {
        id: 'a',
        text: '回一句"等我毕业去住"',
        outcomes: [
          {
            weight: 1,
            text: '爸爸回了个大拇指,然后又发来三张不同角度的塔吊。你忽然明白,那不是房子的照片,那是他后半辈子的底气,一层一层往上盖。',
            effects: [{ stats: { mindset: 3 } }],
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
    tier: 'major',
    title: '下不下车',
    text: '这些年你几乎忘了它。换手机的时候差点弄丢账户,助记词抄在一个笔记本的最后一页,和四级单词挤在一起。直到最近,新闻、群聊、连电梯里的陌生人都在谈论它,你才想起那笔被自己藏起来的"彩票"。深夜,你翻出笔记本,输了三次密码,登了进去。三千块,翻了几十倍,变成一串你要从个位数回来数两遍的数字。你截了图又删掉,怕自己乱发。群里有人说"这才刚开始,后面还有十倍",有人说"这是最后的疯狂,懂的都在跑"。两种人都言之凿凿,两种人都拿不出证据。你的手指悬在"卖出"上,悬了很久。屏幕的光照着你的脸,像四年前那个决定买入的晚上。',
    choices: [
      {
        id: 'a',
        text: '卖,落袋为安',
        outcomes: [
          {
            weight: 1,
            text: '你分三次清了仓,每按一次确认键,心跳都像第一次。到账短信在工位上响起来的时候,你盯着那条短信看了很久,同事问你怎么了,你说没事,家里的猫上了体重秤。那天下班你没挤地铁,打了辆车,在后座上把短信又看了一遍。这笔钱不是工资,不是奖金,不是任何人发给你的——它是 2017 年那个敢在没人看好的时候按下确认键的自己,隔着四年寄来的包裹。你知道后面它可能还会涨,你决定不看了。拿得住的部分才是你的,这一课,你提前学会了。',
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
            text: '你决定再拿一段。那几个月你活得像个雷达:睡前看一眼,醒来看一眼,开会的间隙在腿上偷偷刷新。它真的又涨了一波,涨到连最乐观的群友都开始沉默。某个平常的下午,你忽然觉得"够了"——不是分析出来的,是胃告诉你的。你在那个疯狂的顶部附近清了仓。后来的走势证明,你卖在了几乎不可能更好的位置。你把收益截图发给当年劝你别买的室友,他隔了十分钟,回了一个字:"服。"你没告诉他的是:这不是本事,是运气。你打算这辈子只用这一次。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 450000, mindset: 10 } }, { setFlag: 'crypto_win' }],
          },
          {
            weight: 2,
            text: '你决定再拿拿——都拿了四年了,不差这一程。可后来的暴跌比上涨快得多,像有人从背后抽走了楼梯。第一次腰斩,你安慰自己"拿住,之前跌得更狠都回来了";第二次腰斩,你不看账户了;等你终于下决心割肉,三千块变成了四万。算赚,年化算下来甚至很漂亮。但你清楚地记得最高点那串数字——和它比,现在这笔钱像被没收了一套房。你把那页写着助记词的笔记本合上,终于亲身理解了那句话:凭运气拿到的东西,凭什么凭实力拿住呢?',
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
    trigger: { all: [{ year: { from: 2018, to: 2019 } }, working] },
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
    tier: 'major',
    title: '暂停提现',
    text: '这天早上你还在刷牙,同事的电话就打了进来,声音是抖的:"出事了,提不出来了。"平台凌晨发了公告:"系统升级,暂停提现,预计恢复时间另行通知。"——每个字都认识,连起来就是灾难。维权群一夜之间从 200 人涨到 2000 人,群文件里多了《登记模板》《报案指南》和一张总部人去楼空的照片:工位整齐,绿植还活着,人没了。你点开自己的账户,余额那一栏数字还在,利息甚至还在"正常"累计,像一场还没被通知结束的戏。只有那个"取出"按钮,灰的,怎么点都点不动。你想起当初那句"国资背景,上市系",突然觉得这两万块,从转出去那天起就没真正属于过你。',
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
              { schedule: { eventId: 'ev_gov_second_try', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_gov_second_try',
    pools: [],
    category: 'career',
    title: '二战还是收手',
    text: '一年过去了。你一边打着一份过渡的工,一边看着新一年的招考公告挂出来。去年那个"只差一点"的排名,你到现在还背得出来。报名截止还有一周,缴费页面在浏览器里开着。同事说你魔怔了,你妈说"要不再试一次",你自己知道:再考,是和不甘心谈判;不考,是和不甘心和解。',
    choices: [
      {
        id: 'a',
        text: '再战一年,把那一点补回来',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '这一年你白天上班,晚上刷题,周末全天模考。出成绩那晚你的手比去年抖得更厉害——然后你看到了自己的名字,在录取线上面。你给家里打电话,你妈"哎"了一声就没了动静,过了几秒你才听出来,她在哭。有些迟到一年的门票,拿到手反而更知道珍惜。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 12, knowledge: 3 } },
              { setCareer: 'gov' },
              { setFlag: 'career_gov' },
            ],
          },
          {
            weight: 1,
            text: '又是面试线附近。这次你没有盯着排名看很久,只是把打印的申论范文收进纸箱,和去年那摞放在一起。第二天你正常上班,把简历里"求职意向"改成了眼前这份工作。不是认输,是决定把力气花在能长出东西的地方。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -5, knowledge: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '收手,把现在的日子过好',
        outcomes: [
          {
            weight: 1,
            text: '你关掉了缴费页面。那晚你睡得很沉,第二天把去年的教材挂上了二手平台,备注"九成新,仅刷过一遍,有缘人拿走"。三天后书被一个应届生买走,你在祝福语里写:上岸顺利。你没上的那趟船,真心希望别人赶上。',
            effects: [{ stats: { mindset: 4 } }],
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
    tier: 'major',
    title: '毕业名单',
    text: '2022年春天,公司内网多了一个新词:"组织优化"。一开始只是传闻,某个业务线"合并"了,某个高管"个人原因"离开了。然后会议室开始被 HR 长期征用,门上贴着"占用中",一贴就是一整周。你看到平时一起吃午饭的同事被一个个叫进去,出来的时候有人平静,有人眼圈红着,共同点是当天下午工位就清空了。茶水间没人聊八卦了,大家都在低头刷手机——刷的都是脉脉。这天上午十点,你的日历上弹出一个半小时后的会议邀请,发起人是 HRBP,没有议题,没有附件。你盯着那个通知看了很久,第一次觉得胸前的工牌这么轻。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'a',
        text: '接受补偿,重新找',
        outcomes: [
          {
            weight: 1,
            text: '会议室里,HR 的话术标准得像录音:"感谢你的贡献……业务调整……N+1。"你听着,忽然发现自己在数她桌上的纸巾盒——原来是给谁准备的,现在知道了。你没有用上纸巾。签字,交电脑,退工卡,整个流程四十分钟,比入职快多了。抱着纸箱走出大堂时,春天的太阳很好,好得有点讽刺。N+1 到账那天,你的心情很复杂:钱是真的,一下子空出来的日子也是真的。那晚你把简历翻出来改到凌晨,改着改着想起上一次这么认真填自己的信息,还是高考报志愿。好,那就再考一次。',
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
            text: '那场会不是裁你,是给你选择:转岗到一个更累的业务,薪包"结构调整",干不干?你想起每个月的账单、想起家里的电话、想起脉脉上"三十岁投一百份简历无人问津"的帖子,说:干。于是你留下来了。留下来的代价是接手了三个人的活,奖金缩了一圈,团建取消,连零食柜都变得空空荡荡。离开的同事在群里发"山高水长,后会有期",配了合照。你盯着合照看了一会儿,把它保存了下来。幸存者没有掌声,只有更多的需求排期,和一个再也不敢关声音的钉钉。',
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
    tier: 'major',
    title: 'AI 来了',
    text: '2023年初,部门群里开始疯转 ChatGPT 的截图:它写的周报比组长写得像周报,它生成的代码能跑,它甚至会用你们内部黑话编冷笑话。一开始大家当乐子看,后来笑声慢慢变了味——测试组的同事用它十分钟写完了以前一下午的用例,隔壁组开始讨论"提效之后编制怎么算"。中午吃饭,有人半开玩笑地说:"咱们是不是在给自己的替代品当陪练?"没人接话,筷子声都轻了。下午你打开那个对话框,光标一闪一闪。你敲了第一个问题,像推开一扇有风的门:门后面不知道是什么,但风已经吹到脸上了。',
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
            text: '去年裁员留下来的人里,你是学得最凶的那个。别人下班你在调提示词,别人周末你在搭工作流,组里第一个把 AI 接进业务流程的方案是你写的,评审会上连一贯挑刺的架构师都点了头。你比谁都清楚自己为什么这么拼:上一轮活下来靠的是降预期,那是运气加姿态;这一轮要活,得靠真本事。年底绩效面谈,领导说了句"你今年的成长曲线很陡"。你笑了笑没解释——陡,是因为悬崖就在脚后跟。AI 没有让你变得更安全,但它确实让你变得更有用。在 2023 年,这已经是能拿到的最好的东西了。',
            effects: [
              { stats: { knowledge: 11, money: 20000, mindset: -1 } },
              { setFlag: 'ai_adapted' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'survived_layoff' } },
            text: '你决定不跟它较劲,跟它合作。先是让它写脚手架和单元测试,然后是查文档、理旧代码,再后来你的简历也让它改了一版——它把"负责若干模块开发"改成了三行带数字的成果,你看着有点脸红,但确实更好。效率实打实地上去了,焦虑却没有消失,只是换了个位置:以前怕活干不完,现在怕自己干的活太容易被描述清楚。你在某个加班的深夜想明白了一件事,并把它写进了年度总结:工具越强,越提醒你别只做工具能做的事。这句话领导画了波浪线,批注"深刻"。',
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
            weight: 2,
            text: '你见过太多风口了:O2O、区块链、元宇宙,每一个都说要改变世界,每一个都先改变了一批人的钱包。所以这次你决定等子弹飞一会儿。子弹飞得比你想的快:半年后,它进了公司的工具链,变成了周会上的"提效指标";一年后,新来的实习生用它的熟练度让你沉默。你开始补课,补得很快——基本功还在,追上不难。只是最早那波红利,和红利期里那种"我在浪潮前排"的心气,是补不回来的。你没有被割韭菜,只是这一次,谨慎本身也是有价格的。',
            effects: [{ stats: { knowledge: 3, mindset: -4 } }],
          },
          {
            weight: 1,
            text: '半年后,概念潮水退了一轮:隔壁组 all-in 的"大模型创新项目"没跑出指标,连人带项目一起被"优化"了。你按自己的节奏补课入场,工具照用、班照上,反而躲过了那轮折腾。风口上第一批起飞的和第一批摔下来的,经常是同一批人。',
            effects: [{ stats: { knowledge: 6, mindset: 2 } }],
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
            weight: 2,
            text: '你学会了用投票、弹幕和小测把学生拉回来。效果不完美,但至少屏幕那头有人开始回"老师我在"。',
            effects: [{ stats: { knowledge: 5, network: 3, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '你搬出了十八般武艺,弹幕确实活跃了——活跃成了聊天室。一节课下来进度只走了一半,你盯着"老师再见"的刷屏,分不清自己是老师还是主播。',
            effects: [{ stats: { knowledge: 2, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '按打磨多年的原课件讲',
        outcomes: [
          {
            weight: 2,
            text: '课讲完了,你也累空了。后台数据显示观看时长断崖式下跌,它比任何领导听课都诚实。',
            effects: [{ stats: { mindset: -5 } }],
          },
          {
            weight: 1,
            text: '期末你收到一条学生留言:"老师,你的课像深夜电台,我妈以为我在听睡前故事,其实我真的在记笔记。"花活会过时,把一件事讲清楚不会。',
            effects: [{ stats: { mindset: 3, network: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_double_reduction',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '双减落地',
    text: '2021年7月的那个周末,文件全文刷屏了。你逐字读完,又读了一遍,然后打开工作群——平时消息 99+ 的群,安静得像考场。周一上班,一切都在肉眼可见地塌缩:楼下那家上市机构的灯箱招牌拆了,电梯里遇到的同行在打电话问"房子能不能提前退租",家长群里有人小心翼翼地问"课还上吗",没有人敢用官方口径以外的话回答。朋友圈分成两种人:一种在转"教育回归本质"的评论文章,一种在转简历。你入行时以为教育是慢行业,慢到可以托付半生。这个夏天你才知道,行业没有快慢,只有周期——而你正站在周期折断的地方。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '转向校内和编制机会',
        outcomes: [
          {
            weight: 1,
            text: '你做了决定:回到体制内的轨道上去。白天照常上课,晚上摊开教综和学科真题,台灯一开就是三个小时。你重新背起了教育学名词,像回到大学考试周,只是这次没有室友陪你熬夜,只有出租屋的冰箱嗡嗡作响。有天深夜你合上题册,忽然觉得命运有点幽默:很多年前,你靠考试从小地方走出来;现在行业塌了,你还是只能靠考试,给自己重新找一块站得住的地面。也好。会考试,至少是这么多年风浪里,从来没有背叛过你的那门手艺。',
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
            text: '你决定不离场,换赛道。课程表推翻重写:"数学提分班"变成"思维训练营","阅读写作"变成"表达力与演讲"。你重新设计课件、重新谈场地、重新一个个跟老学员家长沟通。有意思的是,家长们嘴上说着"孩子终于能轻松点了",转头就问你:"这个思维课,对以后升学……有帮助吧?"你笑着给出一个合规的回答。深夜整理报名表时你想:焦虑是守恒的,政策能改变它的形状,改变不了它的总量。而你能做的,是在新的形状里,继续把课讲好——这一点,从来不需要换包装。',
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
            effects: [{ stats: { money: 15000, mindset: 3 } }, { setFlag: 'fund_dca' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
          },
          {
            weight: 1,
            condition: { flag: 'dodged_p2p' },
            text: '当年躲过 P2P 的那点直觉还在。你设了每月定投,涨了不追,跌了不停。同事笑你保守,你笑笑没说话。',
            effects: [{ stats: { money: 16000, mindset: 3 } }, { setFlag: 'fund_dca' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'p2p_burned' } }, { not: { flag: 'dodged_p2p' } }] },
            text: '你没有赚到截图里那种夸张收益,但也没有被波动吓跑。慢慢来这三个字,在牛市里很难听进去。',
            effects: [{ stats: { money: 15000, mindset: 2 } }, { setFlag: 'fund_dca' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
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
            effects: [{ stats: { money: 60000, mindset: 5 } }, { setFlag: 'fund_chased' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
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
        text: '逢低补仓,摊薄成本',
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
            weight: 2,
            text: '你赚了一点,也睡得着觉。成年人最实用的投资哲学,可能是别让账户余额决定当天心情。',
            effects: [{ stats: { money: 30000, mindset: 3 } }],
          },
          {
            weight: 1,
            text: '你的小仓位买完就横盘,横了三个月,你嫌它占着现金清了仓。清完第二周,行情启动了。你安慰自己"仓位小,拿住了也赚不了多少"——这话没错,但你还是取关了那个天天晒收益的群友。',
            effects: [{ stats: { money: 3000, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '加大仓位,抓住这波主线',
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
    trigger: { all: [{ year: { from: 2018, to: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '认真准备,把事讲清楚',
        outcomes: [
          {
            weight: 2,
            text: '你把做过的事拆成三页,问题和改进也写得实在。领导没夸很多,但说"可以转正"。那一刻你才敢松口气。',
            effects: [{ stats: { money: 5000, mindset: 4, network: 2 } }],
          },
          {
            weight: 1,
            text: '你把踩过的坑讲得太实诚。转正是过了,但从那以后,组里最烫手的活总会先想到"抗压能力强"的你。你第一次意识到,坦诚在职场是要挑剂量的。',
            effects: [{ stats: { money: 5000, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳妥一点,按模板讲',
        outcomes: [
          {
            weight: 2,
            text: '汇报过了,但也只是过了。你开始明白,职场里"没问题"和"有机会"之间隔着很长一段路。',
            effects: [{ stats: { mindset: -1 } }],
          },
          {
            weight: 1,
            text: '那周部门在救火,你的汇报只开了十五分钟,领导全程在回消息,最后说"挺好,继续保持"。你没出错,而在那个兵荒马乱的季度,没出错就是最好的表现。',
            effects: [{ stats: { money: 3000, mindset: 2 } }],
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
    trigger: { all: [{ year: { from: 2019 } }, working] },
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
    trigger: { all: [{ year: { from: 2019, to: 2020 } }, working] },
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
    trigger: { all: [{ year: { from: 2020, to: 2020 } }, working] },
    choices: [
      {
        id: 'a',
        text: '建立作息,守住边界',
        outcomes: [
          {
            weight: 2,
            text: '你给自己划了上下班时间。虽然消息还是会越界,但至少你没有彻底变成一台联网设备。',
            effects: [{ stats: { mindset: 4, knowledge: 2 } }],
          },
          {
            weight: 1,
            text: '边界是守住了,但那几个月的新项目,都悄悄流向了消息秒回的同事。年底看绩效,你守住的作息被折算成了一个不咸不淡的评级。',
            effects: [{ stats: { mindset: 2, money: -4000 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '保持在线,抓住表现的机会',
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
            effects: [
              { stats: { money: -300000, mindset: 5 } },
              { setFlag: 'has_house' },
              { schedule: { eventId: 'ev_mortgage_first_year', afterRounds: 1 } },
            ],
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
    id: 'ev_mortgage_first_year',
    pools: [],
    category: 'money',
    title: '还贷第一年',
    text: '每月 8 号,雷打不动,一条扣款短信。头几个月你还会点开看一眼,后来只扫一眼通知栏。这一年你推掉了两次换手机的念头和一次说走就走的旅行,外卖从"随便点"变成了"先看满减"。房子还是毛坯的时候你去看过一次,站在没装门的门框里,给未来的沙发选了个位置。',
    choices: [
      {
        id: 'a',
        text: '日子紧一点,但心里踏实',
        outcomes: [
          {
            weight: 1,
            text: '年底你算了笔账:这一年还进去的钱,一半交给了银行的利息。你愣了一会儿,然后想通了——上一年这时候,你交给房东的可是百分之百。紧日子是真的,踏实也是真的,成年人的账本上,这两样经常记在同一行。',
            effects: [{ stats: { mindset: 3 } }],
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
            effects: [{ stats: { money: -150000, mindset: 8 } }, { setFlag: 'prepaid_mortgage' }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'early_house' } }, { stat: 'money', op: '>=', value: 200000 }] },
            text: '你提前还了一笔,月供轻了一些。房价的数字你决定不再天天看——住着的房子,跌的是别人嘴里的估值,亮的是自己家里的灯。',
            effects: [{ stats: { money: -150000, mindset: 6 } }, { setFlag: 'prepaid_mortgage' }],
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
    trigger: { all: [{ year: { from: 2022 } }, { not: { flag: 'in_love' } }] },
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
            weight: 2,
            text: '你写下几个真正想保住的东西:身体、现金流、少数关系、还能学习的能力。清单不长,但比愿望靠谱。',
            effects: [{ stats: { knowledge: 3, mindset: 5 } }],
          },
          {
            weight: 1,
            text: '规划做到一半,你打开了同龄人的社交主页,然后半夜两点还在对着"三十岁该有多少存款"的帖子做算术。规划没做完,焦虑倒是提前完成了指标。',
            effects: [{ stats: { knowledge: 2, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '顺其自然,先把眼前过好',
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
    tier: 'major',
    title: '领证这件小事',
    text: '从操场上的那个晚上算起,你们已经走了六年多。异地熬过来了,后来终于挪到了同一座城市;合租的房子换过三次,每次搬家都扔掉一点旧东西,又莫名其妙多出一点共同的东西。你们吵过一次很凶的架,冷战三天,最后是谁先低头的,现在两个人都说是对方。这天晚饭后散步,路过一家婚纱店,她的脚步没停,眼睛停了一下。走出去半条街,她忽然说:"我爸妈问,我们到底什么打算。"路灯把你们的影子投在地上,挨得很近。你们站了一会儿,谁都没先开口。',
    choices: [
      {
        id: 'a',
        text: '打算就是:我们去领证吧',
        outcomes: [
          {
            weight: 1,
            text: '你说:"打算就是,挑个日子,去把证领了。"她愣了一下,说这算什么求婚,一点仪式感都没有,说着说着就笑了,笑着笑着眼睛就红了。你们挑了个不用请假的工作日去民政局,拍照的时候两个人都绷不住,工作人员见怪不怪:"笑可以,别太夸张。"婚礼办得不大,来的都是真心想来的人,你敬酒敬到嗓子哑,你爸喝多了,拉着她爸的手说了四十分钟"孩子交给你们家我放心"——逻辑不对,但没人纠正他。那晚宾客散尽,你看着床头的两本红本子想:十二年里做对的事不多,这件,肯定算。',
            effects: [
              { stats: { money: -40000, mindset: 12, network: 5 } },
              { npcFavor: 'first_love', delta: 20 },
              { npcStage: 'first_love', stage: 'married' },
              { schedule: { eventId: 'ev_married_first_year', afterRounds: 1 } },
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
            text: '你说想再等等,等工作再稳定一点,存款再厚一点,"我想给你一个更好的开始"。她点点头,说理解,还反过来安慰你说不着急。那天晚上你们像平常一样回家、洗漱、道晚安,好像什么都没发生。也确实什么都没发生——这正是问题所在。那晚之后,"以后"这个词在你们的对话里出现得越来越少,她爸妈的电话她开始去阳台接。有些等待是储蓄,利息是两个人一起攒的底气;有些等待是消耗,磨掉的是对方眼里的光。当时的你,分不清这两种等待的区别。',
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
    id: 'ev_married_first_year',
    pools: [],
    category: 'relationship',
    title: '婚后第一个春节',
    text: '婚后的第一个春节眼看就到了,一个此前从未认真想过的问题摆上了桌:回谁家过年?两边的爸妈都在电话里说"你们商量着来,都行",但每个"都行"后面,都拖着一点听得出来的期待。',
    choices: [
      {
        id: 'a',
        text: '一家一半,三十在这边,初二去那边',
        outcomes: [
          {
            weight: 1,
            text: '除夕在一家吃年夜饭,初二一早拖着行李赶去另一家,后备箱塞满两边互赠的特产——有两样是重的。累是累,但两桌饭你们都没缺席。回程的高速上她睡着了,你忽然觉得,所谓成家,就是从"回家过年"变成"带着家回家过年"。',
            effects: [{ stats: { money: -3000, mindset: 5 } }, { npcFavor: 'first_love', delta: 6 }],
          },
        ],
      },
      {
        id: 'b',
        text: '今年不折腾,把两边爸妈接过来',
        outcomes: [
          {
            weight: 1,
            text: '你们订了张大桌,把四位老人接到了自己的小家。厨房挤了四个指挥官,一顿年夜饭做出了满汉全席的阵仗。饭桌上两位爸爸从白酒聊到孙辈,你和她在桌下交换了一个"完了"的眼神。房子很挤,挤得很像一个家。',
            effects: [{ stats: { money: -6000, mindset: 6 } }, { npcFavor: 'first_love', delta: 8 }],
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
    text: '2025年春节,你和发小又坐回那家烧烤摊。县城变化不大,你们都变化不少。他聊孩子和单位,你聊房价和项目。两种生活互相羡慕,也互相庆幸。',
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
            weight: 2,
            text: '你感谢了他,也没有立刻改变。不是所有建议都会马上生效,有些话要过几年才听得懂。',
            effects: [{ stats: { mindset: 1 } }, { npcStage: 'mentor', stage: 'ally' }],
          },
          {
            weight: 1,
            text: '你按原计划走完了这一年。年底复盘,你发现自己当初的几个判断并没有错——前辈的话是地图,但路终究是自己脚下这条。信別人之前先信过自己,这一年不亏。',
            effects: [{ stats: { knowledge: 2, mindset: 3 } }, { npcStage: 'mentor', stage: 'ally' }],
          },
        ],
      },
    ],
  },
];
