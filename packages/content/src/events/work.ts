import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控,防止上班族语境事件打到 2018-2021 在读的考研玩家身上。
// 被裁后到重新就业前,不再触发领导反馈、年终奖这类在岗事件。
const working: Condition = {
  all: [
    {
      any: [
        { flag: 'entered_job_market_2018' },
        { flag: 'postgrad_done' },
        { flag: 'career_gov' },
        { flag: 'civil_service_failed' },
      ],
    },
    { any: [{ not: { flag: 'laid_off' } }, { flag: 'restarted_after_layoff' }] },
  ],
};

export const workEvents: GameEvent[] = [
  {
    id: 'ev_postgrad_grind',
    pools: ['work'],
    category: 'career',
    title: '考研三年',
    text: '你选择了考研，同龄人开始领工资、租房、讨论跳槽时，你还在图书馆和实验室之间来回。延迟入场不是暂停人生，它只是把焦虑换了一个形状。',
    mandatory: true,
    trigger: { all: [{ flag: 'postgrad' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'a',
        text: '稳住，把学历变成真正的能力',
        outcomes: [
          {
            weight: 1,
            text: '你没有只把研究生当成缓冲区。论文、项目、实习，每一项都往简历上长出一点真实的东西。',
            effects: [
              { stats: { knowledge: 8, network: 3, mindset: -4, health: -3 } },
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
            text: '你确实获得了学历，但也知道自己有些时间只是被延后消费了。毕业临近时，焦虑又从门缝里钻回来。',
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
    // 读研中段(2019):填补考研线 2019-2021 的内容空窗
    id: 'ev_postgrad_lab_2019',
    pools: ['work'],
    category: 'career',
    title: '横向、论文与工位',
    mandatory: true,
    trigger: {
      all: [{ flag: 'postgrad' }, { not: { flag: 'postgrad_done' } }, { year: { from: 2019, to: 2019 } }],
    },
    text: '研二这年，你终于看清了研究生生活的真实构成：三分之一是文献，三分之一是导师的横向项目，剩下三分之一是在工位上刷同龄人的朋友圈——本科直接工作的同学已经在晒年终奖，你的"年终奖"是导师群里的一句"辛苦了"。开题的日子越来越近，实验室的椅子越坐越硬。',
    choices: [
      {
        id: 'a',
        text: '跟着导师做横向项目，攒经验也攒补贴',
        outcomes: [
          {
            weight: 2,
            text: '项目验收那天，甲方的技术负责人加了你微信："毕业了来找我。"你不确定这句话的含金量，但补贴到账的短信是真的，写进简历的系统是真的，凌晨两点的实验室灯光也是真的。',
            effects: [{ stats: { money: 6000, network: 5, knowledge: 3, health: -3 } }],
          },
          {
            weight: 1,
            text: '说是做项目，你干的大多是贴发票、催合同、给师弟débug。半年下来技术没长进多少，倒是把学校财务处的报销流程摸得炉火纯青。你安慰自己：这也算一种"工程能力"。',
            effects: [{ stats: { money: 3000, mindset: -5, network: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '推掉杂活，闷头把论文往前赶',
        outcomes: [
          {
            weight: 2,
            text: '你把自己钉在工位上，文献读到眼干，实验重跑了四轮。开题一次通过，评审老师说了句"工作量很扎实"。走出会议室，你在走廊里长舒一口气——这条路清苦，但每一步都踩在自己脚下。',
            effects: [
              { stats: { knowledge: 8, mindset: -3, health: -2 } },
              { setFlag: 'postgrad_strong' },
            ],
          },
          {
            weight: 1,
            text: '你精心准备的选题被评审当场毙掉："创新点不够。"重新开题的那个月，你把"读研的意义"想了一百遍。后来你换了个方向重新来，进度慢了半年，但新方向确实更站得住——只是当时的你还看不到这一点。',
            effects: [{ stats: { knowledge: 4, mindset: -7, health: -1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '瞒着导师去实习，让简历先跑起来',
        outcomes: [
          {
            weight: 2,
            text: '你过上了双面人生：工作日在公司写代码，周末回实验室补进度，组会前夜赶 PPT 到凌晨。累到怀疑人生，但实习转正的口头 offer 和肉眼可见变厚的简历告诉你：这份辛苦是有汇率的。',
            effects: [
              { stats: { money: 9000, knowledge: 4, mindset: -3, health: -4 } },
              { setFlag: 'postgrad_strong' },
            ],
          },
          {
            weight: 1,
            text: '导师在一次临时组会点名要看你的阶段进展，你人在三十公里外的工位上。视频里你背景虚化开到最大，还是没逃过那句"你最近心思好像不在课题上"。实习照做，但接下来半年,你在导师那里的信用额度明显变薄了。',
            effects: [{ stats: { money: 5000, network: -4, mindset: -6 } }],
          },
        ],
      },
    ],
  },
  {
    // 读研后段(2020):考研玩家的疫情弧由这个事件承担
    // (工作玩家走 pandemic.ts 的《春节，暂停键》,临床医学走《出征》)
    id: 'ev_postgrad_campus_2020',
    pools: ['work'],
    category: 'era',
    tier: 'major',
    title: '封校的春天',
    mandatory: true,
    order: -10,
    trigger: {
      all: [{ flag: 'postgrad' }, { not: { flag: 'postgrad_done' } }, { year: { from: 2020, to: 2020 } }],
    },
    text: '2020年春天，疫情把校园关成了一座岛。返校要审批，进出要报备，实验室改成预约制，组会搬到了线上——导师的头像永远定格在证件照，画面卡住时像一幅肖像画。食堂的桌子贴上了十字胶带，操场围栏外的世界近在眼前，又远得离谱。更要命的是，你明年就毕业：论文数据还差一截，秋招已经宣布全面转线上。同龄人在家办公，你在校园里"办学"，焦虑隔着口罩都能闻到。',
    choices: [
      {
        id: 'a',
        text: '留校闭环，把论文和实验往死里推',
        outcomes: [
          {
            weight: 2,
            text: '整栋宿舍楼安静得像自习室，你的日程表只剩实验、跑数据、写作三件事。三个月后，论文主体章节全部成型，导师在线上组会里难得表扬了你。你看着窗外空荡的操场想：这段被按了暂停键的时间，好歹被你攥出了一点形状。',
            effects: [
              { stats: { knowledge: 8, mindset: -3, health: -2 } },
              { setFlag: 'postgrad_strong' },
            ],
          },
          {
            weight: 1,
            text: '设备维保进不了校，你的关键实验卡了两个月，每天睁眼就是干着急。你用这段时间把文献综述改了三版，也在深夜的空操场跑了人生里最多的圈。后来你论文致谢里写：“感谢那段跑步的日子，让我没有垮掉。”',
            effects: [{ stats: { knowledge: 4, mindset: -6, health: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '申请返乡，在老家的书房里远程读研',
        outcomes: [
          {
            weight: 2,
            text: '你在老家书房支起了"云实验室"，妈妈的饭点比闹钟还准。网课、云组会、远程改论文，效率打了折,睡眠和三餐倒是前所未有地规律。返校时你带回来一后备箱特产，分给了整个课题组——那学期组里最受欢迎的人是你。',
            effects: [{ stats: { mindset: 5, health: 4, knowledge: 2, network: -2 } }],
          },
          {
            weight: 1,
            text: '在家的日子舒服得危险：起床越来越晚，文献越堆越高，导师的消息你开始"晚点再回"。直到一次线上汇报被当众问住,你才惊醒——舒适区是个好地方，但论文不会在里面自己长大。',
            effects: [{ stats: { mindset: -4, knowledge: 1, health: 2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '一边赶论文，一边盯紧线上秋招',
        outcomes: [
          {
            weight: 2,
            text: '你把面试穿的衬衫挂在宿舍门后，上半身正装、下半身睡裤地面完了十几场视频面试。网络面试拉平了地域差距——往年要跨省赶场的宣讲会，如今在床上就能参加。冬天来临前，你握着两个不错的意向 offer，觉得这个荒诞的春天总算给了点补偿。',
            effects: [{ stats: { network: 5, knowledge: 3, mindset: -3, money: 3000 } }],
          },
          {
            weight: 1,
            text: '一场关键终面进行到一半，宿舍楼的网断了。你举着手机冲到楼道找信号，重连时面试官已经离开会议室。你对着"面试已结束"的提示页坐了很久。后来你给 HR 写了封长长的解释邮件，对方回了句"理解，等下一批"。你把这五个字读出了眼泪。',
            effects: [{ stats: { mindset: -8, knowledge: 2, network: 1 } }],
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
    text: '2015年上半年，连食堂打饭的阿姨都在聊股票。室友开了户，把三个月生活费投了进去，收益率截图天天发群里。他把开户二维码推到你面前：“牛市不进场，等于白活。”',
    trigger: { year: { from: 2015, to: 2015 } },
    choices: [
      {
        id: 'a',
        text: '拿出一部分生活费，跟着进场',
        outcomes: [
          {
            weight: 3,
            text: '五月你账户浮盈 40%，开始研究“财务自由要多少钱”。六月股灾来了，千股跌停，你在宿舍床上盯着绿色的分时图，第一次知道钱是怎么在十分钟里没有的。这一课，收费两千。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -2000, mindset: -6, knowledge: 3 } }, { setFlag: 'stock_lesson' }],
          },
          {
            weight: 1,
            text: '你五月底急着交学费，把钱撤了出来。六月股灾，你成了宿舍唯一“逃顶”的人。你反复强调那是运气，但没人信——从此室友炒股都先问你。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 1500, mindset: 2, network: 2 } }, { setFlag: 'stock_lesson' }],
          },
        ],
      },
      {
        id: 'b',
        text: '生活费就这么点，围观就好',
        outcomes: [
          {
            weight: 1,
            text: '你看着室友的表情从五月的意气风发变成六月的沉默寡言。那个夏天你没赚一分钱，但白捡了一门风险教育课——学费是别人交的。',
            effects: [{ stats: { knowledge: 2, mindset: 1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '找同学拼单上融资盘，放大干',
        outcomes: [
          {
            weight: 3,
            text: '五月你们的“联合账户”浮盈翻倍，宿舍夜谈会全在聊买房买车。六月股灾，杠杆把下跌放大成雪崩，强平短信来的时候你正在上毛概课。生活费、家教攒的钱、下学期的教材钱，一夜清零。你第一次明白：牛市里最危险的不是贪心，是借来的贪心。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.8, max: 15000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -14, health: -3 } },
              { setFlag: 'stock_lesson' },
            ],
          },
          {
            weight: 1,
            text: '你们运气好到离谱，五月底因为要凑学费提前清了仓，杠杆反而放大了那波收益。你请全宿舍吃了顿大餐，心里却有点发虚：这钱来得太快了，快得不像是你挣的。后来你才知道，这种“第一口甜”害人比亏损更深。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 9000, mindset: 3 } }, { setFlag: 'stock_lesson' }],
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
    text: '2016年国庆，你回家过节。刚放下行李，爸妈就把你叫到客厅，电视静了音，茶几上摊着几张打印的户型图，边角都被翻卷了——显然已经研究了不止一天。“我们和你姑姑、你舅舅都商量过了，家里凑一凑，首付够在省会买个小两居。”爸爸的手指点在其中一张图上，“你以后工作、成家，总归用得上。现在不买，以后更买不起。”电视里正在播某地楼市新政的新闻，主持人语速很快。你才大三，连毕业去哪座城市都没想好，而茶几对面，两代人的积蓄正等着你点头或摇头。',
    choices: [
      {
        id: 'a',
        text: '听家里的，把房子定下来',
        outcomes: [
          {
            weight: 1,
            text: '签合同那天，售楼处人声鼎沸，销售抱着一沓合同小跑，大喇叭每隔十分钟广播一次“X 栋 X 单元已售罄”。爸妈在一旁反复核对每一页，你在“购房人”那一栏签下自己的名字时，手心全是汗——那是你第一次在这么贵的东西上签字，笔画都比平时用力。回学校的高铁上你算了笔账：自己还没挣过一分工资，先背上了三十年。你把这件事压在心底，没跟室友说。后来的事情你还不知道：再过两年，这个决定会被亲戚们在饭桌上反复引用；再过八年，它可能是你这辈子做过最划算的一笔交易。',
            effects: [
              { moneyCost: { rate: 0.5, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: -2 } },
              { setFlag: 'has_house' },
              { setFlag: 'early_house' },
              { schedule: { eventId: 'ev_house_progress_2016', afterRounds: 0 } },
              { schedule: { eventId: 'ev_house_price_rise_2018', afterRounds: 2 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '我还在上学，买什么房',
        outcomes: [
          {
            weight: 1,
            text: '你说：“我还没毕业，连以后在哪个城市都不知道，现在买房太早了。钱留着，以后我去大城市打拼也用得上。”爸妈对视了一眼，妈妈想说什么，被爸爸摆手拦住了：“孩子有自己的想法，是好事。”户型图被收进了抽屉，这个话题在饭桌上再没被提起。第二年春天，你在新闻里看到那座城市的名字和“环比上涨”出现在同一行，你点开又关掉。到了第三年，那个小区的价格你已经不敢再查了。人生里有些门，关上的时候一点声音都没有，要过很多年，你路过原地，才听见那声迟到的“咔哒”。',
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
    text: '寒假前，爸爸开始隔三差五给你发照片：一片工地，塔吊，和一根他用红圈标出来的桩子。“看，这是咱家那栋。”其实那个角度什么都看不出来，但他每次路过都要拍一张。',
    choices: [
      {
        id: 'a',
        text: '回一句“等我毕业去住”',
        outcomes: [
          {
            weight: 1,
            text: '爸爸回了个大拇指，然后又发来三张不同角度的塔吊。你忽然明白，那不是房子的照片，那是他后半辈子的底气，一层一层往上盖。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_house_price_rise_2018',
    pools: [],
    category: 'money',
    title: '房价翻倍的新闻',
    text: '2018年春天，你刷到一条本地新闻：省会新一轮地铁规划公布，几条线路把你家那个小区圈进了“价值洼地”。亲戚群里突然热闹起来，去年还说“买早了”的人开始转发中介海报。你打开估价页面，看着那个比买入价高出一大截的数字，第一次意识到：当年压进去的那半数存款，不是被花掉了，是换成了一套会呼吸的资产。',
    choices: [
      {
        id: 'a',
        text: '把房产浮盈记进自己的资产表',
        outcomes: [
          {
            weight: 1,
            text: '你没有卖房，银行卡里也没有突然多出一笔现金。但从这天起，你不再只看银行卡余额。游戏里的金钱值把这部分房产净值折算回来：它不能拿来随便花，却实实在在改变了你的资产底盘。',
            effects: [{ stats: { money: 130000, mindset: 4 } }],
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
    text: '2017年，你常逛的论坛里有个帖子火了：楼主晒出几年前买的比特币，已经翻了几百倍。评论区一半人喊骗子，一半人问怎么买。你查了查，一个要好几千，但可以买零点几个。',
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '拿几千块买一点，就当买彩票',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'stock_lesson' },
            text: '2015年的教训还在，你只拿了三千块——亏光也不心疼的数目。转完账你把 APP 藏进手机文件夹最深处，告诉自己：五年之内不看。',
            effects: [
              { stats: { money: -3000 } },
              { schedule: { eventId: 'ev_invest_crypto_cashout', afterRounds: 4 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'stock_lesson' } },
            text: '你转了三千块进去，买了零点几个看不见摸不着的东西。室友说你疯了，你也觉得自己有点疯。你把它忘在账户里，像忘掉一张彩票。',
            effects: [
              { stats: { money: -3000 } },
              { schedule: { eventId: 'ev_invest_crypto_cashout', afterRounds: 4 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '看不懂的东西，不碰',
        outcomes: [
          {
            weight: 1,
            text: '你关掉帖子，继续改简历。很多年后你还会想起这个晚上，但你也知道：就算买了，你也拿不住。能拿住的人，当年就不会只买三千块。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '这就是未来！押上两万重仓',
        outcomes: [
          {
            weight: 1,
            text: '重仓和轻仓是两种完全不同的持有体验：三千块可以忘掉，两万块会长在你的视网膜上。2018 年初那波腰斩，你每天醒来第一件事是看盘，第七天你割了肉。多年后看着价格新高，你终于承认：你亏掉的不是运气，是仓位管理——重到拿不住的仓，涨到天上也和你没关系。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 1, min: 20000, max: 20000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -16, health: -8 } },
            ],
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
    text: '这些年你几乎忘了它。换手机的时候差点弄丢账户，助记词抄在一个笔记本的最后一页，和四级单词挤在一起。直到最近，新闻、群聊、连电梯里的陌生人都在谈论它，你才想起那笔被自己藏起来的“彩票”。深夜，你翻出笔记本，输了三次密码，登了进去。三千块，翻了几十倍，变成一串你要从个位数回来数两遍的数字。你截了图又删掉，怕自己乱发。群里有人说“这才刚开始，后面还有十倍”，有人说“这是最后的疯狂，懂的都在跑”。两种人都言之凿凿，两种人都拿不出证据。你的手指悬在“卖出”上，悬了很久。屏幕的光照着你的脸，像四年前那个决定买入的晚上。',
    choices: [
      {
        id: 'a',
        text: '卖，落袋为安',
        outcomes: [
          {
            weight: 1,
            text: '你分三次清了仓，每按一次确认键，心跳都像第一次。到账短信在工位上响起来的时候，你盯着那条短信看了很久，同事问你怎么了，你说没事，家里的猫上了体重秤。那天下班你没挤地铁，打了辆车，在后座上把短信又看了一遍。这笔钱不是工资，不是奖金，不是任何人发给你的——它是 2017 年那个敢在没人看好的时候按下确认键的自己，隔着四年寄来的包裹。你知道后面它可能还会涨，你决定不看了。拿得住的部分才是你的，这一课，你提前学会了。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 200000, mindset: 8 } }, { setFlag: 'crypto_win' }],
          },
        ],
      },
      {
        id: 'b',
        text: '再拿拿，万一还能翻倍',
        outcomes: [
          {
            weight: 1,
            text: '你决定再拿一段。那几个月你活得像个雷达：睡前看一眼，醒来看一眼，开会的间隙在腿上偷偷刷新。它真的又涨了一波，涨到连最乐观的群友都开始沉默。某个平常的下午，你忽然觉得“够了”——不是分析出来的，是胃告诉你的。你在那个疯狂的顶部附近清了仓。后来的走势证明，你卖在了几乎不可能更好的位置。你把收益截图发给当年劝你别买的室友，他隔了十分钟，回了一个字：“服。”你没告诉他的是：这不是本事，是运气。你打算这辈子只用这一次。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 450000, mindset: 10 } }, { setFlag: 'crypto_win' }],
          },
          {
            weight: 2,
            text: '你决定再拿拿——都拿了四年了，不差这一程。可后来的暴跌比上涨快得多，像有人从背后抽走了楼梯。第一次腰斩，你安慰自己“拿住，之前跌得更狠都回来了”；第二次腰斩，你不看账户了；等你终于下决心割肉，三千块变成了四万。算赚，年化算下来甚至很漂亮。但你清楚地记得最高点那串数字——和它比，现在这笔钱像被没收了一套房。你把那页写着助记词的笔记本合上，终于亲身理解了那句话：凭运气拿到的东西，凭什么凭实力拿住呢？',
            outcomeTag: 'partial',
            effects: [{ stats: { money: 40000, mindset: -6 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不卖，反而抵押信用贷加仓',
        outcomes: [
          {
            weight: 3,
            text: '你在山顶上又加了一层楼。后来的暴跌里，借来的仓位最先爆掉，连带着老仓一起清算。四年翻几十倍的神话，最后落袋一万五和一屁股利息。群里那句话你现在背得出来：“上山的人很多，下山的路只有一条，叫贪。”',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.4, max: 50000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -18, health: -8 } },
            ],
          },
          {
            weight: 1,
            text: '疯狂的顶部比所有人预期的都高，你加的仓翻了倍，并在某个手抖的深夜全部清掉。落袋的数字大到你不敢告诉任何人。你去庙里捐了一笔香火钱——不是迷信，是心虚。这种运气，一辈子透支一次就该收手了。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 600000, mindset: 8, health: -4 } }, { setFlag: 'crypto_win' }],
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
    text: '同事神秘兮兮地给你看他的收益截图：某 P2P 平台，年化 15%，“国资背景，上市系，跑了好几年了”。他已经投了半年，每月利息准时到账。',
    trigger: { all: [{ year: { from: 2018, to: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '跟投两万，搏一搏',
        outcomes: [
          {
            weight: 1,
            text: '你转了两万进去。第一个月利息 250，准时到账，像一句“你看吧”。同事拍拍你：“稳的，我研究过他们的股东背景。”你把这个 APP 挪到了手机第一屏。',
            effects: [
              { moneyCost: { rate: 1, min: 20000, max: 20000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: 2 } },
              { schedule: { eventId: 'ev_invest_p2p_collapse', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '收益这么高，必有诈',
        outcomes: [
          {
            weight: 1,
            text: '你没投。半年后平台暴雷，同事在工位上打了一下午电话。你请他吃了顿饭，他说：“早知道听你的。”这世上最贵的三个字，是“早知道”。',
            effects: [{ stats: { mindset: 1 } }, { setFlag: 'dodged_p2p' }],
          },
        ],
      },
      {
        id: 'c',
        text: '投五万上“新手加息标”，锁一年',
        outcomes: [
          {
            weight: 1,
            text: '加息标的年化写着 18%，锁定期一年——你锁进去的第七个月，平台雷了。别人还能在“暂停提现”前抢跑，你的钱连跑的资格都没有。维权两年，回款一成半。你后来把这笔账算得很清楚：多出来的 3 个点年化，代价是本金的 85%。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 1, min: 50000, max: 50000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -14, health: -6 } },
              { setFlag: 'p2p_burned' },
            ],
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
    text: '这天早上你还在刷牙，同事的电话就打了进来，声音是抖的：“出事了，提不出来了。”平台凌晨发了公告：“系统升级，暂停提现，预计恢复时间另行通知。”——每个字都认识，连起来就是灾难。维权群一夜之间从 200 人涨到 2000 人，群文件里多了《登记模板》《报案指南》和一张总部人去楼空的照片：工位整齐，绿植还活着，人没了。你点开自己的账户，余额那一栏数字还在，利息甚至还在“正常”累计，像一场还没被通知结束的戏。只有那个“取出”按钮，灰的，怎么点都点不动。你想起当初那句“国资背景，上市系”，突然觉得这两万块，从转出去那天起就没真正属于过你。',
    choices: [
      {
        id: 'a',
        text: '进维权群，登记材料，死磕到底',
        outcomes: [
          {
            weight: 1,
            text: '你跟着群友跑立案、做登记、盯进展。两年后清退方案下来，回款四成。到账那天群里刷了一排“谢谢”，你却高兴不起来——但好歹，不是零。',
            outcomeTag: 'partial',
            effects: [{ stats: { money: 8000, mindset: -14 } }, { setFlag: 'p2p_burned' }],
          },
          {
            weight: 2,
            text: '你登记了材料，进了三个维权群，换来的只有一轮轮“最新进展”和一次次失望。两万块最后变成了群文件里的一行数字。同事比你惨，他加了杠杆。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -20, health: -4 } }, { setFlag: 'p2p_burned' }],
          },
        ],
      },
      {
        id: 'b',
        text: '认栽，当交了两万块学费',
        outcomes: [
          {
            weight: 1,
            text: '你退了群，卸了 APP，把这两万块记进“人生学费”。后来再看到“年化 15%”四个字，你的手指会自动划走。有些课，一辈子只需要上一次。',
            effects: [{ stats: { mindset: -12 } }, { setFlag: 'p2p_burned' }],
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
    text: '三年过去，你把论文改到凌晨，也把简历投到了几十个系统里。学历像一张延迟入场券，它没有保证你赢，但让你换了一个入口。',
    mandatory: true,
    trigger: { all: [{ flag: 'postgrad' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'cs',
        text: '去互联网，做技术岗',
        visibleIf: { any: [{ major: '计算机科学与技术' }, { major: '软件工程' }, { major: '计算机应用' }] },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你拿到了一份不错的技术岗 offer。学历、项目和实习终于连成了一条线。你晚入场三年，但不是空着手来的。',
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
            text: '你拿到了一份技术岗 offer。入职群里大家互相报学历，你突然发现，研究生在这里不稀奇，但至少没有掉队。',
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
        text: '去学校或教培，做教育',
        visibleIf: { major: '师范类' },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你进了一所还不错的学校。读研期间磨出来的表达和研究能力，在讲台上变成了底气。',
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
            text: '你站上讲台的第一天，粉笔灰落在袖口。学生喊你老师，那一刻你有点不好意思，也有点郑重。',
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
        id: 'finance',
        text: '去金融机构，做分析或投研',
        visibleIf: { major: '金融学' },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你拿到了一份不错的金融岗 offer。研究生期间打磨的建模和报告能力，让你一进场就没有被当成"什么都不懂的新人"。晚入场三年，你带着一份更扎实的底子。',
            effects: [
              { stats: { money: 24000, knowledge: 6, network: 6, mindset: 3 } },
              { setCareer: 'finance' },
              { setFlag: 'career_finance' },
              { setFlag: 'postgrad_done' },
              { setFlag: 'finance_front_office' },
              { setFlag: 'finance_postgrad_premium' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'postgrad_strong' } },
            text: '你进了一家机构做基础分析工作。同批新人里研究生不算稀奇，但你至少不用从头补一遍行业常识。',
            effects: [
              { stats: { money: 13000, knowledge: 5, network: 4 } },
              { setCareer: 'finance' },
              { setFlag: 'career_finance' },
              { setFlag: 'postgrad_done' },
            ],
          },
        ],
      },
      {
        id: 'medicine',
        text: '回到临床，走规培并轨',
        visibleIf: { major: '临床医学' },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'postgrad_strong' },
            text: '你的专业硕士和规培"并轨"完成，直接定级进了医院编制。三年没有白读——同批规培的本科生还在熬资历，你已经站稳了脚跟。',
            effects: [
              { stats: { money: 15000, knowledge: 7, mindset: 4 } },
              { setCareer: 'medicine' },
              { setFlag: 'career_medicine' },
              { setFlag: 'postgrad_done' },
              { setFlag: 'doctor_public' },
              { setFlag: 'medicine_postgrad_premium' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'postgrad_strong' } },
            text: '你的专业硕士和规培"并轨"总算走完，进了医院体系。三年读下来，白大褂穿在身上依然是那件白大褂，只是你比刚毕业时更清楚它有多重。',
            effects: [
              { stats: { money: 7000, knowledge: 5 } },
              { setCareer: 'medicine' },
              { setFlag: 'career_medicine' },
              { setFlag: 'postgrad_done' },
              { setFlag: 'doctor_public' },
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
            text: '你没有进入想象中的光鲜行业，但也算落了脚。简历上多出的那三年，最后变成了一句“抗压能力强”。',
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
    text: '成绩出来那天，你刷新了三次网页。那串数字不像分数，更像一张生活方式的门票。门开不开，就看这一眼。',
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
            text: '你进面了，后来也上岸了。单位不大，事情不少，但爸妈终于不用在亲戚面前解释你“到底在干什么”。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10, money: 3000 } },
              { setCareer: 'gov' },
              { setFlag: 'career_gov' },
            ],
          },
          {
            weight: 1,
            text: '差了一点。真的只差一点。你盯着排名看了很久，最后关掉电脑，去楼下买了瓶冰可乐。',
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
    text: '一年过去了。你一边打着一份过渡的工，一边看着新一年的招考公告挂出来。去年那个“只差一点”的排名，你到现在还背得出来。报名截止还有一周，缴费页面在浏览器里开着。同事说你魔怔了，你妈说“要不再试一次”，你自己知道：再考，是和不甘心谈判；不考，是和不甘心和解。',
    choices: [
      {
        id: 'a',
        text: '再战一年，把那一点补回来',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '这一年你白天上班，晚上刷题，周末全天模考。出成绩那晚你的手比去年抖得更厉害——然后你看到了自己的名字，在录取线上面。你给家里打电话，你妈“哎”了一声就没了动静，过了几秒你才听出来，她在哭。有些迟到一年的门票，拿到手反而更知道珍惜。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 12, knowledge: 3, health: -4 } },
              { setCareer: 'gov' },
              { setFlag: 'career_gov' },
            ],
          },
          {
            weight: 1,
            text: '又是面试线附近。这次你没有盯着排名看很久，只是把打印的申论范文收进纸箱，和去年那摞放在一起。第二天你正常上班，把简历里“求职意向”改成了眼前这份工作。不是认输，是决定把力气花在能长出东西的地方。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -5, knowledge: 2, health: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '收手，把现在的日子过好',
        outcomes: [
          {
            weight: 1,
            text: '你关掉了缴费页面。那晚你睡得很沉，第二天把去年的教材挂上了二手平台，备注“九成新，仅刷过一遍，有缘人拿走”。三天后书被一个应届生买走，你在祝福语里写：上岸顺利。你没上的那趟船，真心希望别人赶上。',
            effects: [{ stats: { mindset: 4, health: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_startup_boom_bust_2019',
    pools: ['work'],
    category: 'career',
    title: '朋友圈两极分化',
    text: '2019年，你的朋友圈开始泾渭分明：一条是大学同学晒出创业公司的融资喜报，配图是庆功宴上举着的香槟；另一条是另一个同学转发的万字长文《裁员实录》，字字都在讲“降本增效”——这个词，比它在大厂里流行的时间还要早两年。你划着屏幕，一半是喜报，一半是实录，拇指停在中间不知道点哪个赞。',
    mandatory: true,
    trigger: { all: [{ year: { from: 2019, to: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '认真读完那篇《裁员实录》，未雨绸缪',
        outcomes: [
          {
            weight: 1,
            text: '你把长文逐字读完，顺手截了几张图存进备忘录：现金流、试用期条款、竞业协议，这些词第一次让你觉得和自己有关。焦虑是真的多了一点，但你也第一次开始认真规划“万一”这两个字。',
            effects: [{ stats: { knowledge: 4, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '只点赞不深想，继续过自己的日子',
        outcomes: [
          {
            weight: 1,
            text: '你给两条朋友圈都点了赞，然后继续刷下一条。眼下的日子过得还算安稳，未来的事，未来再说。',
            effects: [{ stats: { mindset: 2, knowledge: -1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '心动，托人内推去那家融资的创业公司',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'network', op: '>=', value: 15 },
            text: '内推链路很顺，两轮面试后对方发来了 offer。你没有立刻答应，回去把两份 offer 的画饼含量对比了一下——一份画的是“星辰大海”，一份画的是“稳定现金流”。最后你选了后者，但这一圈面试认识的人，后来还挺管用。',
            effects: [{ stats: { network: 6, mindset: 1 } }],
          },
          {
            weight: 1,
            text: '简历递过去，对方说“再等等消息”，然后就没有然后了。融资喜报和已读不回，原来可以是同一家公司的两面。',
            effects: [{ stats: { mindset: -3 } }],
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
    text: '2020年，朋友圈都在晒基金收益。白酒、新能源、医药，每条曲线都像通往财富自由的楼梯。你打开理财软件，首页写着“历史业绩不代表未来表现”。',
    trigger: { year: { from: 2020, to: 2020 } },
    choices: [
      {
        id: 'a',
        text: '每月定投，别梭哈',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'p2p_burned' },
            text: '被 P2P 咬过之后，你只敢每月定投一点宽基。收益不惊艳，但每次点开账户，你想到的不再是“暴富”，而是“这次至少跑得掉”。学费没有白交。',
            effects: [{ stats: { money: 15000, mindset: 3 } }, { setFlag: 'fund_dca' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
          },
          {
            weight: 1,
            condition: { flag: 'dodged_p2p' },
            text: '当年躲过 P2P 的那点直觉还在。你设了每月定投，涨了不追，跌了不停。同事笑你保守，你笑笑没说话。',
            effects: [{ stats: { money: 16000, mindset: 3 } }, { setFlag: 'fund_dca' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'p2p_burned' } }, { not: { flag: 'dodged_p2p' } }] },
            text: '你没有赚到截图里那种夸张收益，但也没有被波动吓跑。慢慢来这三个字，在牛市里很难听进去。',
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
            text: '短期收益很好看，你甚至开始研究提前退休。那时候你还不知道，市场最擅长在你觉得自己懂了的时候讲下一课。',
            effects: [{ stats: { money: 60000, mindset: 5 } }, { setFlag: 'fund_chased' }, { schedule: { eventId: 'ev_invest_crash_2021', afterRounds: 1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '开两融账户上杠杆，收益乘三',
        outcomes: [
          {
            weight: 2,
            text: '牛市下半场，杠杆确实把收益乘了三；抱团瓦解的时候，它也把亏损乘了三。追加保证金的短信来了两次，第三次你没钱可追，系统替你做了决定。从满仓浮盈到亏穿本金，只用了四个月。你卸载了行情软件，把“杠杆”两个字拉进了人生黑名单。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.7, max: 140000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -16, health: -8 } },
            ],
          },
          {
            weight: 1,
            text: '你在最热的那两个月里赚足了，并且——这是最难的部分——真的在年初抱团松动前撤了出来。收益让同事眼红，你却私下发誓下不为例：全程你睡不好觉，胃一直是紧的。这不是投资，这是拿命换钱的极限运动。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 110000, mindset: -2, health: -8 } }],
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
    text: '2021年，曾经闭眼买的基金开始回撤。评论区从“经理永远的神”变成“还我血汗钱”。你第一次认真看懂了什么叫最大回撤。',
    trigger: {
      all: [
        { year: { from: 2021, to: 2021 } },
        { any: [{ flag: 'fund_dca' }, { flag: 'fund_chased' }] },
      ],
    },
    choices: [
      {
        id: 'a',
        text: '承认看不懂，降仓位',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'fund_chased' },
            text: '你在半山腰割掉了大半仓位。去年梭哈进去的钱回来时瘦了一圈，但至少还认识回家的路。投资里最难的不是买入，是承认自己其实没有那么懂。',
            effects: [
              { moneyCost: { rate: 0.2, max: 30000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -3 } },
              { setFlag: 'risk_control' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'fund_chased' } },
            text: '定投的仓位本来就不重，你降了一档继续走。你少赚过，也少亏了。投资里最难的不是买入，是承认自己其实没有那么懂。',
            effects: [{ stats: { mindset: 2 } }, { setFlag: 'risk_control' }],
          },
        ],
      },
      {
        id: 'b',
        text: '逢低补仓，摊薄成本',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'fund_chased' },
            text: '你重仓在山顶，又一路补仓到山腰。去年研究“提前退休”的文档还在收藏夹里，现在你只敢在深夜打开账户。市场用真金白银给你上了第二课。',
            effects: [
              { moneyCost: { rate: 0.6, max: 120000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -18, health: -4 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'fund_chased' } },
            text: '你一路补仓，一路降低成本，也一路降低心态。账户曲线像体检报告，每次打开都需要勇气。',
            effects: [
              { moneyCost: { rate: 0.4, max: 70000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -13, health: -2 } },
            ],
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
    text: '2024年，黄金、新出海、AI 应用轮番上热搜。你已经不像刚毕业时那样相信“错过这次就没了”，但手指还是会停在买入按钮上。',
    trigger: { year: { from: 2024, to: 2024 } },
    choices: [
      {
        id: 'a',
        text: '小仓位参与，留足现金',
        outcomes: [
          {
            weight: 2,
            text: '你赚了一点，也睡得着觉。成年人最实用的投资哲学，可能是别让账户余额决定当天心情。',
            effects: [{ stats: { money: 30000, mindset: 3 } }],
          },
          {
            weight: 1,
            text: '你的小仓位买完就横盘，横了三个月，你嫌它占着现金清了仓。清完第二周，行情启动了。你安慰自己“仓位小，拿住了也赚不了多少”——这话没错，但你还是取关了那个天天晒收益的群友。',
            effects: [{ stats: { money: 3000, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '加大仓位，抓住这波主线',
        outcomes: [
          {
            weight: 1,
            text: '你买在热闹处，卖在安静时。亏损不算致命，但足够让你把几个财经博主取关。',
            effects: [
              { moneyCost: { rate: 0.25, max: 40000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -5 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '付费进大 V 的“跟单群”，跟着信号干',
        outcomes: [
          {
            weight: 2,
            text: '入群费一万八，“信号”前两周确实准——后来你才知道那叫养客。第三周开始，每次你跟单买入，K 线就精准转头。大 V 说是“洗盘”，直到某天群被解散，你才看懂这个局：你不是他的学员，你是他的对手盘。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.45, max: 90000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -12, health: -4 } },
            ],
          },
          {
            weight: 1,
            text: '你跟了三个月，小赚了一笔，然后在某次“内部信号”翻车、群里开始互相指责时果断退了群。赚的钱刚好覆盖入群费再多一点。复盘时你想明白了：那三个月赚钱靠的是行情，不是信号——牛市里，连扔飞镖都是股神。',
            effects: [{ stats: { money: 12000, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_trend_chasing_2024',
    pools: ['work'],
    category: 'career',
    title: '追风口',
    text: '2024年，朋友圈里的风口一个接一个换脸：做短剧的同学晒出“7天回本”的投流后台截图；做外贸的同学发了一组东南亚仓库的照片，配文“出海才是新蓝海”；隔壁工位每天在群里转发新能源产业链的研报，末尾都带一句“上车不晚”。你划着这些消息，盘算着自己剩下的存款和精力，够不够再赌一把。',
    mandatory: true,
    trigger: { all: [{ year: { from: 2024, to: 2024 } }, working] },
    choices: [
      {
        id: 'a',
        text: '小额入伙朋友的短剧发行项目',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '朋友说这单“投流打得好，7 天能回本”。剧确实拍完了，投流也确实打了，只是回本的那天一直没等到——平台流量突然变贵，分账周期又拖了两个月。你的本金变成了一部剧的“署名出品人”credit，挂在没人点开的片尾。',
            effects: [
              { moneyCost: { rate: 0.2, max: 8000, roundTo: 100, reason: 'investment' } },
              { stats: { mindset: -5 } },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你投的那部剧踩中了一个小爆点，分账比预期到得快。钱不多，但你第一次明白：短剧这门生意赚的不是剧情，是投流公式——谁先算明白流量成本和回本周期，谁先赚到那一波钱。',
            effects: [{ stats: { money: 6000, knowledge: 2, mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '打听同事的出海业务，考虑要不要申请调岗',
        outcomes: [
          {
            weight: 1,
            text: '你约那位做出海业务的同事吃了顿饭，听他讲了两小时东南亚市场的坑：汇率、物流、当地合规，每一项都比国内业务复杂一圈。你没有立刻申请调岗，但记下了几个联系人——这年头，多一条能走的路，不亏。',
            effects: [{ stats: { knowledge: 3, network: 4, mindset: 1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不追了，把钱和精力留给确定的事',
        outcomes: [
          {
            weight: 1,
            text: '短剧、出海、新能源，你一个都没上车。同事们讨论风口时你安静地听，偶尔插一句“听着不错”。年底盘点，你没赚到风口的钱，但也没有一笔投进去打了水漂的钱。',
            effects: [{ stats: { money: 2000, mindset: 2 } }],
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
    text: '入职几个月后，你要做第一次试用期汇报。PPT 上写着“成长与反思”，但你最想写的是“我真的尽力了”。',
    // 窗口延到 2021:考研玩家 2021 年毕业入职,同样有自己的试用期
    trigger: { all: [{ year: { from: 2018, to: 2021 } }, working, { not: { flag: 'medicine_resident' } }] },
    choices: [
      {
        id: 'a',
        text: '认真准备，把事讲清楚',
        outcomes: [
          {
            weight: 2,
            text: '你把做过的事拆成三页，问题和改进也写得实在。领导没夸很多，但说“可以转正”。那一刻你才敢松口气。',
            effects: [{ stats: { money: 5000, mindset: 4, network: 2 } }],
          },
          {
            weight: 1,
            text: '你把踩过的坑讲得太实诚。转正是过了，但从那以后，组里最烫手的活总会先想到“抗压能力强”的你。你第一次意识到，坦诚在职场是要挑剂量的。',
            effects: [{ stats: { money: 5000, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳妥一点，按模板讲',
        outcomes: [
          {
            weight: 2,
            text: '汇报过了，但也只是过了。你开始明白，职场里“没问题”和“有机会”之间隔着很长一段路。',
            effects: [{ stats: { mindset: -1 } }],
          },
          {
            weight: 1,
            text: '那周部门在救火，你的汇报只开了十五分钟，领导全程在回消息，最后说“挺好，继续保持”。你没出错，而在那个兵荒马乱的季度，没出错就是最好的表现。',
            effects: [{ stats: { money: 3000, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '汇报是虚的，饭局是实的——精力花在陪领导应酬上',
        outcomes: [
          {
            weight: 2,
            text: '你酒量见长，段子越来越熟，领导确实记住了你——三个月后他调去了别的事业部。新领导只看周报和代码，你的“酒桌资产”一夜清零，转正评审上被问到项目细节时，你卡了整整十秒。那十秒里你想明白了：关系是浮动利率，本事才是固定资产。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -8, health: -8, network: 2 } }],
          },
          {
            weight: 1,
            text: '你抱对了大腿：转正丝滑，评优有份，好项目优先想到你。只是每周三场的酒局在你的胃和肝上记着账，而且你隐约知道，把职业生涯拴在一个人身上，和把全仓押在一只股票上，是同一种风险。',
            effects: [{ stats: { money: 8000, network: 6, mindset: 2, health: -10 } }],
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
    text: '绩效沟通时，领导说你“执行不错，但要更有 owner 意识”。你点头记录，心里翻译成中文：活要多想，锅也要多背。',
    trigger: { all: [{ year: { from: 2019 } }, working, { not: { flag: 'medicine_resident' } }] },
    choices: [
      {
        id: 'a',
        text: '主动接一个难项目',
        outcomes: [
          {
            weight: 1,
            text: '项目比你想象中难，但做成后确实有人记住了你。成长常常不是变强了才上，是上了才被迫变强。',
            effects: [{ stats: { knowledge: 5, network: 4, mindset: -4, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳定交付，不抢风头',
        outcomes: [
          {
            weight: 1,
            text: '你保持稳定，也保持低调。风险少了，机会也少了。安全区的门把手，摸起来总是很舒服。',
            effects: [{ stats: { money: 8000, mindset: 2, health: 2 } }],
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
    text: '年终奖到账了。金额没有传说中那么夸张，但比你学生时代见过的大多数数字都大。你打开购物车，又打开银行卡余额。',
    trigger: { all: [{ year: { from: 2019, to: 2020 } }, working, { not: { flag: 'medicine_resident' } }] },
    choices: [
      {
        id: 'a',
        text: '先存起来',
        outcomes: [
          {
            weight: 1,
            text: '你把大部分钱转进定期。快乐少了一点，安全感多了一点。余额像一床薄被，挡不了寒冬，但能挡一阵风。',
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
            text: '你买了新手机或一件好外套。拆包装时很快乐，付款记录也很清醒。成年人的奖励，常常要自己批准。',
            effects: [{ stats: { money: 8000, mindset: 6 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '听同事的，全仓买入明星基金经理',
        outcomes: [
          {
            weight: 2,
            text: '“坤坤 yyds”的弹幕还在飘，你把年终奖全数打了进去。抱团股崩塌那几个月，你的持仓页面绿得发光，回本的执念让你又扛了一年才割肉。年终奖的意义本来是犒劳过去一年的自己，结果它变成了未来两年的心病。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.2, max: 14000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -8 } },
            ],
          },
          {
            weight: 1,
            text: '你进场早，那波行情的尾巴让年终奖胖了一圈，而且你因为要付房租提前赎回，稀里糊涂躲过了后面的崩塌。同事夸你有纪律，你没好意思说实话：救你的不是纪律，是穷。',
            effects: [{ stats: { money: 10000, mindset: 3 } }],
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
    text: '2020年，客厅变成办公室。视频会议里有人忘关麦，有人孩子在旁边哭，有人把头像停在“网络不佳”。',
    trigger: { all: [{ year: { from: 2020, to: 2020 } }, working, { not: { flag: 'medicine_resident' } }] },
    choices: [
      {
        id: 'a',
        text: '建立作息，守住边界',
        outcomes: [
          {
            weight: 2,
            text: '你给自己划了上下班时间。虽然消息还是会越界，但至少你没有彻底变成一台联网设备。',
            effects: [{ stats: { mindset: 4, knowledge: 2, health: 4 } }],
          },
          {
            weight: 1,
            text: '边界是守住了，但那几个月的新项目，都悄悄流向了消息秒回的同事。年底看绩效，你守住的作息被折算成了一个不咸不淡的评级。',
            effects: [{ stats: { mindset: 2, money: -4000 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '保持在线，抓住表现的机会',
        outcomes: [
          {
            weight: 1,
            text: '你回复得很快，也累得很快。远程办公最可怕的不是在家办公，是在家也下不了班。',
            effects: [{ stats: { money: 6000, mindset: -6, health: -5 } }],
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
    text: '家里开始问你要不要考虑买房。首付、月供、城市、通勤、未来规划，每个词都像一块砖，压在聊天窗口里。',
    trigger: {
      all: [
        { year: { from: 2021, to: 2023 } },
        { not: { flag: 'has_house' } },
      ],
    },
    choices: [
      {
        id: 'a',
        text: '先观望，不急着背房贷',
        outcomes: [
          {
            weight: 1,
            text: '你没有上车。有人说你错过，有人说你清醒。你只知道，不买也是一种选择，只是这种选择也会被反复审判。',
            effects: [{ stats: { mindset: 1 } }, { setFlag: 'no_house' }],
          },
        ],
      },
      {
        id: 'b',
        text: '凑首付，买个小的',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'money', op: '>=', value: 300000 },
            text: '你买了一个不大的房子。首付划出去的那一刻，账户余额少了一个量级。钥匙拿到手时很激动，还贷日到来时也很真实。家变成了资产，也变成了责任。',
            effects: [
              { moneyCost: { rate: 0.5, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: 5 } },
              { setFlag: 'has_house' },
              { schedule: { eventId: 'ev_mortgage_first_year', afterRounds: 1 } },
              { schedule: { eventId: 'ev_house_value_reprice_late', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: '你算了几遍，发现首付还是差一截。中介说“再不买就晚了”，但你的银行卡说“现在就很晚”。',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '父母帮一把，买通勤远一点的大两居',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'money', op: '>=', value: 250000 },
            text: '你和父母反复算了首付、月供和通勤，最后选了一个没那么核心、但能住下未来变化的房子。每天路上多花半小时，账户少了一个量级，但周末推开门时，你知道这不是一步到位，是一步站稳。',
            effects: [
              { moneyCost: { rate: 0.5, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: 4, health: -3 } },
              { setFlag: 'has_house' },
              { schedule: { eventId: 'ev_mortgage_first_year', afterRounds: 1 } },
              { schedule: { eventId: 'ev_house_value_reprice_late', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            condition: { stat: 'money', op: '>=', value: 250000 },
            text: '房子买下来了，压力也跟着住了进来。通勤、装修、月供，每一项都比中介说得更具体。你没有后悔，只是明白了：买房不是故事的结尾，是长期责任的开头。',
            effects: [
              { moneyCost: { rate: 0.5, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: -5, health: -6 } },
              { setFlag: 'has_house' },
              { schedule: { eventId: 'ev_mortgage_first_year', afterRounds: 1 } },
              { schedule: { eventId: 'ev_house_value_reprice_late', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            condition: { stat: 'money', op: '<', value: 250000 },
            text: '你们把银行卡、工资流水和父母能支持的数字摊开算了一遍，最后还是差一截。中介继续催，你把聊天窗口关了。没买成当然失落，但至少这次你没有用未来很多年的安全感去赌一个“再等等就涨”。',
            effects: [{ stats: { mindset: -3 } }, { setFlag: 'no_house' }],
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
    text: '每月 8 号，雷打不动，一条扣款短信。头几个月你还会点开看一眼，后来只扫一眼通知栏。这一年你推掉了两次换手机的念头和一次说走就走的旅行，外卖从“随便点”变成了“先看满减”。房子还是毛坯的时候你去看过一次，站在没装门的门框里，给未来的沙发选了个位置。',
    choices: [
      {
        id: 'a',
        text: '日子紧一点，但心里踏实',
        outcomes: [
          {
            weight: 1,
            text: '年底你算了笔账：这一年还进去的钱，一半交给了银行的利息。你愣了一会儿，然后想通了——上一年这时候，你交给房东的可是百分之百。紧日子是真的，踏实也是真的，成年人的账本上，这两样经常记在同一行。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_house_value_reprice_late',
    pools: [],
    category: 'money',
    title: '资产表重新算了一遍',
    text: '买房后的第一个春节，亲戚没有再问你“存了多少钱”，改问“房子现在值多少”。你打开几个估价工具，数字没有 2016 年那批人那么夸张，但也不是零。那笔压进首付的现金，换成了房子里的一部分净值，只是它不能随手转账，也不能马上花掉。',
    choices: [
      {
        id: 'a',
        text: '把较保守的净值折回资产表',
        outcomes: [
          {
            weight: 1,
            text: '你按保守估值记了一笔：比早上车的人少很多，但至少不是“买完房就只剩月供”。游戏里的金钱值把这部分房产净值折算回来——它是资产，不是现金，所以补得克制。',
            effects: [{ stats: { money: 60000, mindset: 2 } }],
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
    text: '2024年，你所在小区的挂牌价从最高点回落了一截。中介的朋友圈从“再不上车就晚了”变成了“业主诚心急售”。月供短信还是每月 8 号准时到，像什么都没发生过。',
    choices: [
      {
        id: 'a',
        text: '手里攒了点钱，提前还一部分贷款',
        outcomes: [
          {
            weight: 1,
            condition: { all: [{ flag: 'early_house' }, { stat: 'money', op: '>=', value: 200000 }] },
            text: '2016年上的车，跌掉的只是浮盈的零头。你提前还了一笔，月供轻了一大截。当年在客厅签字时手心冒汗的你，大概想不到有一天会感谢爸妈的固执。',
            effects: [
              { moneyCost: { rate: 0.6, min: 120000, max: 150000, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: 8 } },
              { setFlag: 'prepaid_mortgage' },
            ],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'early_house' } }, { stat: 'money', op: '>=', value: 200000 }] },
            text: '你提前还了一笔，月供轻了一些。房价的数字你决定不再天天看——住着的房子，跌的是别人嘴里的估值，亮的是自己家里的灯。',
            effects: [
              { moneyCost: { rate: 0.6, min: 120000, max: 150000, roundTo: 1000, reason: 'house' } },
              { stats: { mindset: 6 } },
              { setFlag: 'prepaid_mortgage' },
            ],
          },
          {
            weight: 1,
            condition: { stat: 'money', op: '<', value: 200000 },
            text: '你打开还款计算器按了半天，发现“提前还贷”这四个字，首先需要“提前有钱”。你关掉 APP，把这件事推给了明年的自己。',
            effects: [{ stats: { mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不看不问，照常还贷照常生活',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'early_house' },
            text: '你算了算，现在的价格还是 2016 年买入价的两倍多。你关掉 APP，该上班上班。上车早的人看回调，像坐在山腰看潮水——湿不到脚。',
            effects: [{ stats: { mindset: 4 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'early_house' } },
            text: '你把看房 APP 卸载了。周末你在自己家里煮火锅，窗户上全是雾气。账面浮亏是真的，锅里的热气也是真的。',
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
    text: '房东发来消息：“房子要卖，下个月麻烦搬一下。”你环顾这间住了几年的屋子，发现所谓生活，原来可以被打包成十二个纸箱。',
    choices: [
      {
        id: 'a',
        text: '搬，顺便换个离公司近点的',
        outcomes: [
          {
            weight: 1,
            text: '新房子贵了几百块，但通勤缩短了四十分钟。搬完最后一箱，你点了个外卖，坐在地板上吃。没有房产证，但这一刻，这里确实是你的家。',
            effects: [{ stats: { money: -8000, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '借这个机会，认真算算要不要离开这座城市',
        outcomes: [
          {
            weight: 1,
            text: '你打开了老家省会的招聘软件，又打开了这座城市的地铁图。算到最后你发现，让你留下的不是机会，是不甘心。你续租了另一间房，把“离开”两个字又存回了草稿箱。',
            effects: [{ stats: { money: -5000, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_mortgage_pressure_2025',
    pools: ['work'],
    category: 'money',
    title: '月供的分量',
    mandatory: true,
    trigger: { all: [{ flag: 'has_house' }, { year: { from: 2025, to: 2025 } }] },
    text: '猎头找到你，聊了个薪资更高的机会——只是要去外地，行业也没现在这份稳。你打开计算器，把每月雷打不动要还的房贷数字摆在旁边比划了半天。那一刻你才明白，“背上房贷”这四个字里，“背”是个动词，天天都在用力。',
    choices: [
      {
        id: 'a',
        text: '拒绝机会，先保住现在的收入和月供节奏',
        outcomes: [
          {
            weight: 1,
            text: '你回绝了猎头。理由说得体面，心里想的其实很简单：现在这份工作换来的确定性，够还房贷；那份新工作画的饼，不够。安全感这东西，有时候就是每月8号那条扣款短信照常发出去。',
            effects: [{ stats: { mindset: -2, health: 1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '冒险接受新机会，赌一个更高的天花板',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'knowledge', op: '>=', value: 60 },
            text: '你跳了。新城市、新行业，头三个月每天都在补功课，但薪资涨幅确实覆盖了月供压力，还多出一截。异地也意味着要重新找中介、重新适应通勤，只是这一次，你是主动选的辛苦。',
            effects: [{ stats: { money: 20000, knowledge: 4, mindset: -3, health: -4 } }],
          },
          {
            weight: 1,
            text: '你跳了，新行业却比猎头描述的更颠簸，试用期没过完公司就开始收缩。你一边还房贷一边投简历，才明白“天花板更高”这句话背后，通常也藏着“地板更不结实”这半句。',
            effects: [{ stats: { mindset: -8, health: -3 } }, { setFlag: 'cs_switch_failed' }],
          },
        ],
      },
      {
        id: 'c',
        text: '找银行申请延长贷款年限，先松口气',
        outcomes: [
          {
            weight: 1,
            text: '你跑了趟银行，把还款年限往后延了几年。总利息会多付一些，但每月划走的数字小了一截，日子松快了一点。有些选择不解决问题，只是把问题铺得更薄一些——但薄一点，也是真的轻松一点。',
            effects: [{ stats: { money: 4000, mindset: 4 } }],
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
    text: '亲戚给你介绍了一个人，理由很充分：“年龄差不多，工作也稳定。”你看着对方微信头像，想不出第一句话该说什么。',
    trigger: { all: [{ year: { from: 2022 } }, { not: { flag: 'in_love' } }] },
    choices: [
      {
        id: 'a',
        text: '见一面，别预设太多',
        outcomes: [
          {
            weight: 1,
            text: '你们吃了顿饭，聊得不算尴尬。关系未必有后续，但你发现自己已经能平静地面对这种安排。',
            effects: [{ stats: { mindset: 2, network: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '婉拒，现在没心力',
        outcomes: [
          {
            weight: 1,
            text: '你说最近太忙。亲戚回了个“理解”，后面跟着三个意味深长的句号。',
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
    text: '你发现自己开始关注体检套餐、睡眠质量和岗位天花板。曾经以为很远的三十岁，正在走近，像一个不太熟的同事。',
    // 窗口提前到 2023-2024:"暗示"是三十岁前的预感,2025 的正式节点交给《三十岁，照镜子》
    trigger: { year: { from: 2023, to: 2024 } },
    choices: [
      {
        id: 'a',
        text: '重新规划下一阶段',
        outcomes: [
          {
            weight: 2,
            text: '你写下几个真正想保住的东西：身体、现金流、少数关系、还能学习的能力。清单不长，但比愿望靠谱。',
            effects: [{ stats: { knowledge: 3, mindset: 5 } }],
          },
          {
            weight: 1,
            text: '规划做到一半，你打开了同龄人的社交主页，然后半夜两点还在对着“三十岁该有多少存款”的帖子做算术。规划没做完，焦虑倒是提前完成了指标。',
            effects: [{ stats: { knowledge: 2, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '顺其自然，先把眼前过好',
        outcomes: [
          {
            weight: 1,
            text: '你把问题往后推了推。成年人不是不知道问题在那儿，只是有时候真的需要先把今天过完。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    // 2025 全职业线"三十而立"节点:回看前面十年的选择,后期最缺的 payoff 型事件。
    // outcome 按 has_house/restarted_after_layoff/婚恋 npcStage 等长期 flag 分支,
    // 让玩家在这里"撞见"自己前几年的决定。
    id: 'ev_work_thirty_mirror_2025',
    pools: ['work'],
    category: 'mindset',
    tier: 'major',
    title: '三十岁，照镜子',
    mandatory: true,
    order: -5,
    trigger: { year: { from: 2025, to: 2025 } },
    text: '2025年，你三十岁了。生日那天没有仪式感，你在下班路上买了个小蛋糕，一个人吃掉了大半。手机里躺着几条生日祝福，有爸妈的、有老同学的，还有一条来自银行的账单提醒。你点开相册，从2014年那张考场外的照片开始往下翻：军训、宿舍、毕业照、工牌、体检报告……十一年翻完只用了五分钟。三十岁不是一道门，更像一面镜子——你站在它面前，第一次认真打量这些年自己活成的样子。',
    choices: [
      {
        id: 'a',
        text: '认真盘一次账：这十年攒下了什么',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'has_house' },
            text: '资产表的第一行是那套房子。你还记得凑首付那阵子的兵荒马乱，也记得拿到钥匙那天的踏实。房贷还有很多年，但三十岁的你至少可以说：这座城市里，有一盏灯是为你亮的。你把房产证的照片看了一会儿，又默默算了算提前还款的可能性——成年人的浪漫，大抵如此。',
            effects: [{ stats: { mindset: 5, knowledge: 2 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'has_house' } }, { flag: 'restarted_after_layoff' }] },
            text: '你的十年账本里有一段明显的断层——被裁的那年。但你也看到了断层之后的曲线：重新投简历、重新面试、重新开始。存款不算多，履历不算完美，可你比谁都清楚，账本上最值钱的一行是隐形的："跌倒过，爬起来了。"',
            effects: [{ stats: { mindset: 6, knowledge: 2 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'has_house' } }, { not: { flag: 'restarted_after_layoff' } }] },
            text: '没有房子，账户里是这些年一点点攒下的数字。你算了算收入曲线，又对照了一遍当年的选择：有的钱是熬出来的，有的钱是运气，有的坑是自己跳的。三十岁的资产负债表不算漂亮，但每一行你都能说出来历——这大概就是"自己的人生"的意思。',
            effects: [{ stats: { mindset: 3, knowledge: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '把重要的人约出来，好好吃顿饭',
        outcomes: [
          {
            weight: 1,
            condition: { npcStage: 'first_love', stage: 'married' },
            text: '生日饭是在家吃的。伴侣做了几个菜，插了根蜡烛让你许愿。你看着对面这个从校服时代一路走到婚戒的人，突然觉得十年里做过的所有选择题，答对最重要的是这一道。愿望你没说出口——它已经坐在对面了。',
            effects: [{ stats: { mindset: 8, network: 2 } }],
          },
          {
            weight: 1,
            condition: { all: [{ flag: 'in_love' }, { not: { npcStage: 'first_love', stage: 'married' } }] },
            text: '你和恋人找了家小馆子，聊起各自的三十岁计划。聊到一半，对方忽然说："那接下来的十年，也一起过吧。"不算正式的求婚，但你们碰了杯——有些约定不需要仪式，需要的是说出口的勇气。',
            effects: [{ stats: { mindset: 7, network: 2 } }],
          },
          {
            weight: 1,
            condition: { all: [{ not: { flag: 'in_love' } }, { not: { npcStage: 'first_love', stage: 'married' } }] },
            text: '你把几个老朋友约了出来，饭桌上聊的一半是当年宿舍的段子，一半是现在的房贷、体检和跳槽。散场时有人说："三十岁也就那样嘛。"你笑着点头。回家路上你想：一个人过三十岁不可怕，可怕的是没有能约出来吃这顿饭的人——还好，你有。',
            effects: [{ stats: { mindset: 5, network: 4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不总结不庆祝，把它当成普通的一天',
        outcomes: [
          {
            weight: 2,
            text: '你没有发朋友圈，没有写年度总结，蛋糕吃完就洗了盘子睡觉。三十岁的第一课是祛魅：它不是审判日，不是里程碑，只是又一个星期二。人生不靠整数节点变好，靠的是每一个普通日子的复利。',
            effects: [{ stats: { mindset: 4, health: 2 } }],
          },
          {
            weight: 1,
            text: '你想把它过成普通的一天，但凌晨一点还是没忍住，翻完了整个相册。有几张照片你盯了很久：有的人再没联系，有的路没走下去。你没哭，只是给爸妈的家庭群发了句"我挺好的"。发完你发现，妈妈秒回了一个拥抱的表情——凌晨一点，她也没睡。',
            effects: [{ stats: { mindset: -2, network: 2, health: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_life_marriage_or_kids_2025',
    pools: ['work'],
    category: 'relationship',
    title: '催婚催育',
    mandatory: true,
    trigger: { year: { from: 2025, to: 2025 } },
    text: '家庭群里，催婚催育的话题又被翻了出来。表姐晒娃、表弟晒婚戒，你妈发来一句“你看看人家”，后面跟着一个不太自然的笑脸表情。饭桌上，长辈的关心和逼问总是长得很像。',
    choices: [
      {
        id: 'plan_kids',
        text: '和伴侣认真商量要不要要孩子',
        visibleIf: { npcStage: 'first_love', stage: 'married' },
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'money', op: '>=', value: 150000 },
            text: '你们算了算账户余额和双方父母能搭把手的程度，决定要孩子。决定做出的那晚，两个人罕见地失眠——一半是期待，一半是突然意识到，往后十几年的每一个决定，都要多算一个人进去。',
            effects: [
              { moneyCost: { rate: 0.12, max: 15000, roundTo: 500, reason: 'family' } },
              { stats: { mindset: 6 } },
              { npcFavor: 'first_love', delta: 10 },
            ],
          },
          {
            weight: 1,
            text: '你们商量了很久，最后决定再等等——事业、房贷、精力，哪一项都还没到能松口气的程度。你们没有跟双方父母解释太多，只是在饭桌上笑着说“快了快了”，转头在家里认真核对了一遍两个人的体检报告。',
            effects: [{ stats: { mindset: -2 } }, { npcFavor: 'first_love', delta: 4 }],
          },
        ],
      },
      {
        id: 'push_back',
        text: '跟父母摊牌，讲清楚自己的节奏',
        outcomes: [
          {
            weight: 1,
            text: '你把工作、存款和自己的想法一条条摆给父母听，语气尽量平静。他们没有完全被说服，但至少那句“你看看人家”，之后出现的频率低了一些。',
            effects: [{ stats: { mindset: -3, network: 2 } }],
          },
        ],
      },
      {
        id: 'go_with_flow',
        text: '“随缘”糊弄过去，先岔开话题',
        outcomes: [
          {
            weight: 1,
            text: '你笑着说“随缘随缘”，然后迅速把话题引到今年的年夜饭菜单上。饭桌上的紧张气氛暂时散了，只是你知道，这个话题明年还会准时回来。',
            effects: [{ stats: { mindset: -1 } }],
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
    text: '卷王同学在朋友圈发了工牌照片。评论区一片“大佬带带我”。你替他高兴，也很难不把那张照片和自己的处境放在一起比较。',
    choices: [
      {
        id: 'a',
        text: '找他请教求职经验',
        outcomes: [
          {
            weight: 1,
            text: '他给你发来一份面试资料，还帮你改了简历。强者的帮助有时很直接，也很刺眼：原来差距真的可以被一条条列出来。',
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
        text: '点个赞，不打扰',
        outcomes: [
          {
            weight: 1,
            text: '你点了赞，关掉朋友圈。不是不想问，只是有些比较一旦开口，就会显得自己太狼狈。',
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
    text: '从操场上的那个晚上算起，你们已经走了六年多。异地熬过来了，后来终于挪到了同一座城市；合租的房子换过三次，每次搬家都扔掉一点旧东西，又莫名其妙多出一点共同的东西。你们吵过一次很凶的架，冷战三天，最后是谁先低头的，现在两个人都说是对方。这天晚饭后散步，路过一家婚纱店，她的脚步没停，眼睛停了一下。走出去半条街，她忽然说：“我爸妈问，我们到底什么打算。”路灯把你们的影子投在地上，挨得很近。你们站了一会儿，谁都没先开口。',
    choices: [
      {
        id: 'a',
        text: '打算就是：我们去领证吧',
        outcomes: [
          {
            weight: 1,
            text: '你说：“打算就是，挑个日子，去把证领了。”她愣了一下，说这算什么求婚，一点仪式感都没有，说着说着就笑了，笑着笑着眼睛就红了。你们挑了个不用请假的工作日去民政局，拍照的时候两个人都绷不住，工作人员见怪不怪：“笑可以，别太夸张。”婚礼办得不大，来的都是真心想来的人，你敬酒敬到嗓子哑，你爸喝多了，拉着她爸的手说了四十分钟“孩子交给你们家我放心”——逻辑不对，但没人纠正他。那晚宾客散尽，你看着床头的两本红本子想：十二年里做对的事不多，这件，肯定算。',
            effects: [
              { moneyCost: { rate: 0.2, max: 40000, roundTo: 1000, reason: 'family' } },
              { stats: { mindset: 12, network: 5 } },
              { npcFavor: 'first_love', delta: 20 },
              { npcStage: 'first_love', stage: 'married' },
              { schedule: { eventId: 'ev_married_first_year', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '再等等，等我再稳定一点',
        outcomes: [
          {
            weight: 1,
            text: '你说想再等等，等工作再稳定一点，存款再厚一点，“我想给你一个更好的开始”。她点点头，说理解，还反过来安慰你说不着急。那天晚上你们像平常一样回家、洗漱、道晚安，好像什么都没发生。也确实什么都没发生——这正是问题所在。那晚之后，“以后”这个词在你们的对话里出现得越来越少，她爸妈的电话她开始去阳台接。有些等待是储蓄，利息是两个人一起攒的底气；有些等待是消耗，磨掉的是对方眼里的光。当时的你，分不清这两种等待的区别。',
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
    text: '婚后的第一个春节眼看就到了，一个此前从未认真想过的问题摆上了桌：回谁家过年？两边的爸妈都在电话里说“你们商量着来，都行”，但每个“都行”后面，都拖着一点听得出来的期待。',
    choices: [
      {
        id: 'a',
        text: '一家一半，三十在这边，初二去那边',
        outcomes: [
          {
            weight: 1,
            text: '除夕在一家吃年夜饭，初二一早拖着行李赶去另一家，后备箱塞满两边互赠的特产——有两样是重的。累是累，但两桌饭你们都没缺席。回程的高速上她睡着了，你忽然觉得，所谓成家，就是从“回家过年”变成“带着家回家过年”。',
            effects: [{ stats: { money: -3000, mindset: 5 } }, { npcFavor: 'first_love', delta: 6 }],
          },
        ],
      },
      {
        id: 'b',
        text: '今年不折腾，把两边爸妈接过来',
        outcomes: [
          {
            weight: 1,
            text: '你们订了张大桌，把四位老人接到了自己的小家。厨房挤了四个指挥官，一顿年夜饭做出了满汉全席的阵仗。饭桌上两位爸爸从白酒聊到孙辈，你和她在桌下交换了一个“完了”的眼神。房子很挤，挤得很像一个家。',
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
    text: '2020年，你刷到室友在直播卖家乡的橙子。镜头前他熟练地喊着“3、2、1 上链接”，背景是他老家的果园。当年校园跑腿那股劲儿，原来一直没灭，只是换了个出口。',
    choices: [
      {
        id: 'a',
        text: '下一单，再帮他转发到朋友圈',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'roommate_startup_joined' },
            text: '你下了单，备注写了句“创始团队前来验货”。他在直播里念到这条备注时愣了一下，笑着说：“这是我第一个合伙人。”当晚他给你转了 888，你退回去，留了句：下次上新叫我。',
            effects: [
              { stats: { mindset: 6, network: 5 } },
              { npcFavor: 'roommate', delta: 15 },
              { npcStage: 'roommate', stage: 'livestream_comeback' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'roommate_startup_joined' } },
            text: '你买了两箱橙子，顺手转发了直播间。他私信你：“谢了兄弟。”橙子很甜，你想起大学阳台上那份没入伙的商业计划书，忽然有点感慨：他一直在场上，你一直在看台。',
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
        text: '点个赞就划走，各自生活',
        outcomes: [
          {
            weight: 1,
            text: '你点了个赞，继续刷下一条。后来他的直播间慢慢做起来了，你们的聊天记录停在去年的“新年快乐”。有些人没有走散，只是走远。',
            effects: [
              { stats: { network: -1 } },
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
    text: '2022年，卷王同学突然在群里说自己“毕业了”。你愣了一下才反应过来，这是大厂裁员的新黑话。原来跑得最快的人，也可能撞上时代的墙。',
    choices: [
      {
        id: 'a',
        text: '私聊问他要不要帮忙',
        outcomes: [
          {
            weight: 1,
            text: '他隔了很久回你：“没事，我先休息一下。”你们聊到深夜，第一次不是谁给谁建议，只是两个成年人互相确认还撑得住。',
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
        text: '不知道说什么，只发个表情',
        outcomes: [
          {
            weight: 1,
            text: '你发了一个抱抱的表情。他回了个笑脸。成年人之间的关心，有时薄得像一张贴纸。',
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
    text: '县城发小发来消息：他考上了本地事业单位。工资不高，但单位离家十分钟。他说中午还能回家吃饭，语气里有一种你很久没听过的安稳。',
    choices: [
      {
        id: 'a',
        text: '真心祝贺他',
        outcomes: [
          {
            weight: 1,
            text: '你发了很长一段祝福。他回你：“等你回来请你吃饭。”你突然发现，你们不是走散了，只是走在不同的地图上。',
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
            text: '他回了个“哈哈”。你知道自己没有恶意，但也知道这玩笑里藏着一点羡慕和一点不服气。',
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
    text: '2025年春节，你和发小又坐回那家烧烤摊。县城变化不大，你们都变化不少。他聊孩子和单位，你聊房价和项目。两种生活互相羡慕，也互相庆幸。',
    choices: [
      {
        id: 'a',
        text: '承认自己也羡慕稳定',
        outcomes: [
          {
            weight: 1,
            text: '他说稳定也有稳定的烦恼。你们碰了一杯，突然都笑了。原来每条路都有别人看不见的坡。',
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
            text: '他说挺好，年轻人就该闯。你听出这话像祝福，也像告别。你们都没有错，只是越来越难交换人生。',
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
    text: '一次项目复盘后，一位前辈把你叫住。他没有讲鸡汤，只指出你方案里真正值钱的部分，也指出你一直没看见的盲区。',
    choices: [
      {
        id: 'a',
        text: '认真请教，保持联系',
        outcomes: [
          {
            weight: 1,
            text: '你后来偶尔向他请教关键选择。他回消息不多，但每次都很准。贵人不是替你走路的人，是提醒你别往坑里走的人。',
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
        text: '听完就算，别麻烦别人',
        outcomes: [
          {
            weight: 1,
            text: '你礼貌道谢，没有再联系。后来你偶尔想起那次谈话，才发现有些门不是一直开着的。',
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
    text: '2024年，前辈准备离开这家公司。临走前他请你喝咖啡，说：“别把平台给你的东西，误认成自己的能力。但也别低估你扛过来的东西。”',
    choices: [
      {
        id: 'a',
        text: '记下来，重新整理方向',
        outcomes: [
          {
            weight: 1,
            text: '你回去后删掉了几个虚荣目标，留下真正能积累的技能。那杯咖啡不贵，但像一次迟来的职业体检。',
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
        text: '感谢他，但继续按原计划走',
        outcomes: [
          {
            weight: 2,
            text: '你感谢了他，也没有立刻改变。不是所有建议都会马上生效，有些话要过几年才听得懂。',
            effects: [{ stats: { mindset: 1 } }, { npcStage: 'mentor', stage: 'ally' }],
          },
          {
            weight: 1,
            text: '你按原计划走完了这一年。年底复盘，你发现自己当初的几个判断并没有错——前辈的话是地图，但路终究是自己脚下这条。信別人之前先信过自己，这一年不亏。',
            effects: [{ stats: { knowledge: 2, mindset: 3 } }, { npcStage: 'mentor', stage: 'ally' }],
          },
        ],
      },
    ],
  },
  {
    // NPC 终段(2024):卷王线收官,与玩家的"三十而立"互为镜像
    id: 'ev_npc_grinder_2024',
    pools: [],
    category: 'npc',
    title: '卷王的朋友圈停更了',
    text: '你突然发现，卷王同学的朋友圈停更半年了。上一条还是2023年的行业峰会九宫格。你正想着要不要问候一句，他先发来消息："下个月路过你的城市，见一面？"见面那天，他穿着你从没见过的休闲装，说现在在一家小公司带十个人的团队，"不卷了，卷不动了，也想明白了"。那个从大一就永远在赶路的人，第一次在你面前把语速放慢了。',
    choices: [
      {
        id: 'a',
        text: '聊聊彼此这十年，认真地',
        outcomes: [
          {
            weight: 1,
            condition: { npcStage: 'grinder', stage: 'mirror_friend' },
            text: '从保研、大厂、被裁到现在，他把十年讲成了一部行业兴衰史，你听得比任何播客都认真。分开时他说："当年在学校，我一直拿你当参照物。"你笑了："巧了，我也是。"两个互相较劲了十年的人，终于承认对方是自己的镜子。',
            effects: [
              { stats: { mindset: 6, network: 4 } },
              { npcFavor: 'grinder', delta: 10 },
              { npcStage: 'grinder', stage: 'parallel_lives' },
            ],
          },
          {
            weight: 1,
            condition: { npcStage: 'grinder', stage: 'distant_star' },
            text: '你们不算熟络，这顿饭一开始有点客气。聊到第二杯，他忽然说："2022年我被裁那阵子，你发的那个表情，我看了好几遍。"你有点愧疚当年只发了个表情，他摆摆手："那时候谁说什么都没用，但有人吱一声，就不一样。"',
            effects: [
              { stats: { mindset: 4, network: 3 } },
              { npcFavor: 'grinder', delta: 8 },
              { npcStage: 'grinder', stage: 'parallel_lives' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '寒暄几句，各自赶路',
        outcomes: [
          {
            weight: 1,
            text: '你那阵子正忙，饭吃了不到一小时就散了。回去的路上你想，有些人注定只能陪你走一段——他是你青春里的计时器，现在你们都不需要计时了。',
            effects: [
              { stats: { mindset: 1, network: -1 } },
              { npcStage: 'grinder', stage: 'parallel_lives' },
            ],
          },
        ],
      },
    ],
  },
  {
    // NPC 终段(2024):初恋 missed/separated 分支收官——设计文档"多年后朋友圈点赞"线
    id: 'ev_npc_first_love_2024',
    pools: [],
    category: 'npc',
    title: '朋友圈的红点',
    text: '深夜刷朋友圈，一条动态跳出来：是她。照片里她站在一个你不认识的城市街头，笑得和当年一样，身边的人和生活都换了一轮。你的拇指在屏幕上停了几秒——你们已经很多年没说过话了，久到连"在吗"都显得突兀。',
    choices: [
      {
        id: 'a',
        text: '点个赞，就够了',
        outcomes: [
          {
            weight: 2,
            text: '你点了赞，锁屏，睡觉。第二天她回赞了你半年前的一条动态。你们没有对话，但都收到了同一句话：我看见你过得不错，我也是。有些关系的最好结局，就是成为彼此朋友圈里安静的一个赞。',
            effects: [{ stats: { mindset: 4 } }, { npcStage: 'first_love', stage: 'memory' }],
          },
          {
            weight: 1,
            text: '赞点下去几分钟后，她发来一句："好久不见。"你们聊了半小时，全是安全话题：工作、城市、共同认识的人。结束时谁都没说"下次约"。你放下手机，心里那页纸终于翻了过去——不是因为释怀，是因为确认了彼此都好。',
            effects: [{ stats: { mindset: 5, network: 1 } }, { npcStage: 'first_love', stage: 'memory' }],
          },
        ],
      },
      {
        id: 'b',
        text: '划过去，不打扰',
        outcomes: [
          {
            weight: 1,
            text: '你没有点赞，把手机扣在床头。青春的那一页不需要仪式感地合上，它早就合上了，你只是偶尔路过时多看了一眼封面。你睡得比想象中安稳。',
            effects: [{ stats: { mindset: 2 } }, { npcStage: 'first_love', stage: 'memory' }],
          },
        ],
      },
    ],
  },
  {
    // NPC 终段(2025):室友线收官,呼应 2015 年那份创业计划书
    id: 'ev_npc_roommate_2025',
    pools: [],
    category: 'npc',
    title: '十年后的合伙人',
    text: '2025年，创业室友约你吃饭。十年前他在宿舍里跟你画"改变世界"的大饼，后来创业黄了、直播带货、几起几落。这次见面，他递给你一张新名片——一家小而稳的供应链公司，"这次不画饼了，就是门生意"。他说这些年最感谢的是当年宿舍里那些愿意听他吹牛的人："梦想没成，但听众都还在。"',
    choices: [
      {
        id: 'a',
        text: '举杯，敬这十年的折腾',
        outcomes: [
          {
            weight: 1,
            condition: { npcStage: 'roommate', stage: 'livestream_comeback' },
            text: '从创业计划书到直播间再到这张名片，你算是全程见证了他的十年。他给你倒满，说："下次融资……开玩笑的，没有下次融资了。"你们笑作一团。有的人用十年撞了一路南墙,最后撞出了一扇自己的门。',
            effects: [
              { stats: { mindset: 5, network: 4 } },
              { npcFavor: 'roommate', delta: 10 },
              { npcStage: 'roommate', stage: 'old_friend' },
            ],
          },
          {
            weight: 1,
            condition: { npcStage: 'roommate', stage: 'faded' },
            text: '你们已经很多年没正经聊过天了，这顿饭却出乎意料地不尴尬。他把这些年的起落讲成段子，你把职场的荒诞讲成相声。散场时他说："当年在宿舍，我就觉得你会一直是我朋友。"迟到了很多年的这顿饭，把断掉的线又接上了。',
            effects: [
              { stats: { mindset: 4, network: 5 } },
              { npcFavor: 'roommate', delta: 12 },
              { npcStage: 'roommate', stage: 'old_friend' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '问他还记不记得当年的计划书',
        outcomes: [
          {
            weight: 1,
            text: '他愣了一下，从手机备忘录里翻出一张照片——那份计划书他一直存着。"你看这页，\'三年上市\'，哈哈哈。"你们对着那页PPT笑了很久。笑完他说："不过说真的，谢谢你当年没笑我。"你想说其实你笑了，最后只是碰了碰他的杯子。',
            effects: [
              { stats: { mindset: 6, network: 3 } },
              { npcFavor: 'roommate', delta: 8 },
              { npcStage: 'roommate', stage: 'old_friend' },
            ],
          },
        ],
      },
    ],
  },
];
