import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控,与 random.ts / work.ts 保持一致
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

// 戏剧事件:三选项结构——1 个方向正确(可能带风险分支)、2 个负期望(其中 1 个是"看起来最聪明"的诱饵)。
// 金额摆幅刻意大于普通事件,制造大起大落。
export const dramaEvents: GameEvent[] = [
  {
    id: 'ev_drama_pig_butchering',
    pools: ['random'],
    category: 'money',
    tier: 'major',
    title: '屏幕那头的人',
    trigger: { all: [{ year: { from: 2020, to: 2023 } }, working] },
    text: '你在交友软件上认识了一个人。TA 谈吐得体，朋友圈是健身、烘焙和落地窗外的城市夜景。聊了两个月，TA 从不主动要什么，只是偶尔提起自己在做“数字资产配置”，截图里的收益率漂亮得像 PS 的。这天 TA 发来一个链接：“我带你，先玩玩小的，随时能提现。”',
    choices: [
      {
        id: 'a',
        text: '投两千试试，能提现就是真的',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'in_love' },
            text: '两千很快变成两千六，提现秒到账。你放下了最后一点戒心，在 TA 的“行情窗口期”提示下转进去五万。第二天平台“系统维护”，第三天 TA 的头像变成灰色。你盯着那个再也打不开的链接坐了一夜，手机屏幕还亮着，另一半已经在门口站了很久。',
            effects: [
              { moneyCost: { rate: 0.55, max: 70000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -14, health: -8 } },
              { setFlag: 'pig_butchered' },
              { schedule: { eventId: 'ev_drama_pig_partner_fallout', afterRounds: 0 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'in_love' } },
            text: '两千很快变成两千六，提现秒到账。你放下了最后一点戒心，在 TA 的“行情窗口期”提示下转进去五万。第二天平台“系统维护”，第三天 TA 的头像变成灰色。你盯着那个再也打不开的链接坐了一夜，终于明白：能提现的那一次，是鱼饵的一部分，你不是在钓鱼，你是鱼。',
            effects: [
              { moneyCost: { rate: 0.55, max: 70000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -14, health: -8 } },
              { setFlag: 'pig_butchered' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '既然是风口，直接上重注',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'in_love' },
            text: '你把定期存款取了大半转进去。账面翻倍那周，你已经开始看车了。然后是“缴纳保证金才能提现”、“再充值解冻账户”。等你终于报警，另一半先一步看到了银行短信：那不是一笔亏损，是你们共同生活里突然塌掉的一块地板。',
            effects: [
              { moneyCost: { rate: 0.75, max: 180000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -18, health: -10 } },
              { setFlag: 'pig_butchered' },
              { schedule: { eventId: 'ev_drama_pig_partner_fallout', afterRounds: 0 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'in_love' } },
            text: '你把定期存款取了大半转进去。账面翻倍那周，你已经开始看车了。然后是“缴纳保证金才能提现”、“再充值解冻账户”——每一步都像在救此前投进去的钱，每一步都在往深处走。等你终于报警，警察叹了口气：“这个月你是第七个。”',
            effects: [
              { moneyCost: { rate: 0.75, max: 180000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -18, health: -10 } },
              { setFlag: 'pig_butchered' },
            ],
          },
        ],
      },
      {
        id: 'd',
        text: '你早就觉得不对劲了——TA 从没发过一条语音',
        visibleIf: { flag: 'trait_sensitive' },
        outcomes: [
          {
            weight: 1,
            text: '那些细节你其实都注意到了：凌晨三点“刚下班”的秒回、永远拍不到脸的照片、还有每次你提到见面时恰到好处的出差。你没有拆穿，只是回了一句“我最近手头紧”。三天后，那个健身、烘焙、爱夜景的人间理想，把你删了。你把聊天记录从头翻到尾，像看一部自己主演的剧本围读——心思细腻的代价是骗不到你，但也瞒不住你自己：有那么几个晚上，你是真的开心过。',
            effects: [{ stats: { mindset: -2, knowledge: 4 } }, { setFlag: 'pig_dodged' }],
          },
        ],
      },
      {
        id: 'c',
        text: '搜一下“杀猪盘”，再决定',
        outcomes: [
          {
            weight: 2,
            text: '搜索结果的第一页就让你后背发凉：一样的话术，一样的“窗口期”，一样的落地窗夜景——连图都是同一批。你截图发过去，对方秒删了你。你在反诈 APP 上举报了账号，然后把这段经历讲给了爸妈听：“以后有人带你们理财，先给我打电话。”',
            effects: [{ stats: { mindset: 3, knowledge: 3 } }, { setFlag: 'pig_dodged' }],
          },
          {
            weight: 1,
            text: '你识破了局，但心里还是空了一块——那两个月的晚安不是机器人发的，是一个耐心执行剧本的人发的。你分不清哪个更让人难受：差点被骗走的钱，还是确实被骗走的那点真心。',
            effects: [{ stats: { mindset: -4, knowledge: 3 } }, { setFlag: 'pig_dodged' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_pig_partner_fallout',
    pools: [],
    category: 'relationship',
    tier: 'major',
    title: '聊天记录被看见',
    text: '你以为最难的是报警，后来才发现，最难的是解释那两个月的聊天记录。那些“晚安”“今天想你了”“我带你赚点钱”，每一句都像被单独拎出来审判。{{ta}}没有立刻吵，只是把手机推回给你，问：“这件事，你准备瞒到什么时候？”',
    choices: [
      {
        id: 'a',
        text: '全部坦白，一起报警和冻结账户',
        outcomes: [
          {
            weight: 1,
            text: '你从第一条聊天记录讲起，讲到转账、讲到提现失败、讲到自己为什么不敢说。{{ta}}气得手都在抖，但还是陪你去派出所，帮你把流水一笔笔标出来。信任没有立刻回来，可至少你们站在了同一边。',
            effects: [
              { stats: { money: -2000, mindset: -8, knowledge: 3 } },
              { npcFavor: 'first_love', delta: -6 },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先删聊天记录，想办法自己补上窟窿',
        outcomes: [
          {
            weight: 1,
            text: '你删掉了聊天框，却删不掉账单。几周后信用卡短信还是露了馅，{{ta}}看着你新编的解释，忽然笑了一下：“被骗可以一起扛，骗我就不一样了。”那天之后，屋子里安静得像多了第三个人。',
            outcomeTag: 'failure',
            effects: [
              { stats: { money: -10000, mindset: -16, network: -4 } },
              { setFlag: 'in_love', value: false },
              { npcFavor: 'first_love', delta: -25 },
              { npcStage: 'first_love', stage: 'separated' },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '把它变成一次家庭财务复盘',
        outcomes: [
          {
            weight: 1,
            text: '你们摊开银行卡、信用卡、理财账户和每月固定开销，第一次把钱聊得这么具体。{{ta}}仍然生气，但也承认以前你们太少谈风险、边界和共同账户。这次亏损没有被轻轻翻篇，它变成了一条新规则：以后任何“窗口期”，都要先过两个人这一关。',
            effects: [
              { stats: { mindset: -5, knowledge: 4 } },
              { npcFavor: 'first_love', delta: 4 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_stock_options',
    pools: ['work'],
    category: 'money',
    tier: 'major',
    title: '期权行权书',
    // 大厂线的专属里程碑,和 career-cs.ts 里逐年的强制事件同级:只影响 big_platform_start 这个子分支,
    // 不应该跟普通 work 池事件抢 eventSlots 名额(否则窗口期很窄,大样本模拟里可能永远抽不到)。
    mandatory: true,
    trigger: {
      all: [{ flag: 'career_cs' }, { flag: 'big_platform_start' }, { year: { from: 2020, to: 2021 } }],
    },
    text: '公司递交了上市申请，HR 发来邮件：你入职时的期权进入行权窗口，行权需要一笔真金白银。工位四周炸开了锅：有人已经在算“上市当天值多少”，有人翻出了隔壁公司破发的新闻。财务自由和接盘侠，只隔着一次敲钟。',
    choices: [
      {
        id: 'a',
        text: '按自己能承受的额度行权',
        outcomes: [
          {
            weight: 1,
            text: '敲钟那天，交易大厅的直播在会议室循环播放。开盘价高开 60%，锁定期结束那天你卖掉了一半，落袋的数字比你三年工资加起来还多。你请全组喝了奶茶，然后照常改需求——钱到账那一刻你才发现，自己最想要的其实是“可以随时说不”的底气。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 200000, mindset: 10 } }],
          },
          {
            weight: 1,
            text: '上市是上市了，开盘即巅峰。锁定期六个月，你眼睁睁看着股价从发行价跌到脚踝，解禁那天卖出的钱刚够覆盖行权成本的零头。你把证券 APP 挪到了文件夹最后一页，安慰自己：就当交了一笔“亲历资本市场”的学费。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.35, max: 60000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -6 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '借钱顶格行权，富贵险中求',
        outcomes: [
          {
            weight: 1,
            text: '你刷了信用贷，把额度全用上了。上市后股价争气，你在高位清仓还清贷款，剩下的数字让你半夜笑醒。你知道这是赌赢了，不是算赢了——但赢了就是赢了。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 400000, mindset: 12 } }],
          },
          {
            weight: 2,
            text: '破发、阴跌、锁定期，三个词组成了你这一年的噩梦。股票市值抵不上贷款本金，每月还款日像第二个房贷。你终于理解了那句话：用杠杆接住的从来不是财富，是风险。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.65, max: 180000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -10, health: -5 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '不行权，纸面富贵不如现金',
        outcomes: [
          {
            weight: 1,
            text: '上市当天股价翻倍，同组行权的同事在工位上红了眼眶。你反复计算自己错过的数字，算到第三遍把计算器关了。没有亏一分钱，但那种感觉很难和别人解释：你输给了一个平行世界的自己。',
            effects: [{ stats: { mindset: -6 } }],
          },
          {
            weight: 1,
            text: '破发的新闻出来那天，行权的同事们集体沉默，你默默把“谨慎”两个字在心里描了一遍。没赚到钱，但也没被套住——在 2021 年，不亏就是一种胜利。',
            effects: [{ stats: { mindset: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_parent_hospital',
    pools: ['random'],
    category: 'family',
    tier: 'major',
    title: '爸爸的检查单',
    trigger: { all: [{ year: { from: 2023, to: 2025 } }, working, { not: { flag: 'parent_ill' } }] },
    text: '妈妈的电话在工作日上午打来——这个时间点本身就是坏消息。“你爸体检查出个东西，医生说要住院做个大检查，可能得手术。”她的声音很稳，稳得像排练过。你订机票的手一直在抖：成年人的世界里，最怕的不是自己生病，是父母在电话里说“没什么大事”。',
    choices: [
      {
        id: 'a',
        text: '请长假回去，陪完手术再走',
        outcomes: [
          {
            weight: 2,
            text: '你在医院走廊的长椅上睡了一周，学会了看化验单上的箭头，记住了主刀医生查房的时间。手术很顺利。推出手术室那刻，爸爸虚弱地冲你摆手：“多大点事，害你请假。”你转过身去买水，眼泪掉在自动售货机上。钱和假期都能再挣，有些陪伴错过就是错过了。',
            effects: [
              { moneyCost: { rate: 0.2, max: 30000, roundTo: 1000, reason: 'medical' } },
              { stats: { mindset: 5, health: -4, network: -2 } },
              { setFlag: 'parent_ill' },
            ],
          },
          {
            weight: 1,
            text: '手术台上发现情况比影像里复杂，术后又进了一次 ICU。你在缴费窗口和病房之间跑了一个月，工资卡见了底，人瘦了一圈。爸爸最终挺过来了。出院那天他拉着你的手说“回去上班吧”，你在机场哭得像个高考失利的孩子。',
            effects: [
              { moneyCost: { rate: 0.35, max: 70000, roundTo: 1000, reason: 'medical' } },
              { stats: { mindset: -6, health: -8 } },
              { setFlag: 'parent_ill' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '请护工补位，自己也请假轮班',
        outcomes: [
          {
            weight: 1,
            text: '你请了护工，也把年假和调休拆开用，关键检查和手术当天都在。账单不轻，工作也被打断，但妈妈至少能睡几个整觉。你第一次明白，照顾父母不是钱和人在场二选一，而是尽量把两边都补上。',
            effects: [
              { moneyCost: { rate: 0.25, max: 50000, roundTo: 1000, reason: 'medical' } },
              { stats: { mindset: 1, health: -6, network: -2 } },
              { setFlag: 'parent_ill' },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '先让妈妈盯着，自己远程转钱',
        outcomes: [
          {
            weight: 1,
            text: '你转了钱，建了家庭群，每天要三次进展。手术顺利，但妈妈一个人在医院连轴转了半个月，回家后自己也病了一场。春节回家，你发现爸妈都老了一截，而你连他们哪天做的手术都要翻聊天记录才想得起来。有些账，账户余额里看不见。',
            effects: [
              { moneyCost: { rate: 0.2, max: 30000, roundTo: 1000, reason: 'medical' } },
              { stats: { mindset: -12, network: -5 } },
              { setFlag: 'parent_ill' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_friend_borrow',
    pools: ['random'],
    category: 'friendship',
    tier: 'major',
    title: '开口借钱的兄弟',
    trigger: { all: [{ year: { from: 2018, to: 2021 } }, working] },
    text: '深夜，一个很久没联系的好兄弟打来电话，寒暄不到三句就切入正题：他要开店，差一笔钱，“就周转半年，利息按银行两倍给”。你们一起逃过课、挨过训、在操场喝过啤酒。手机这头，你盯着自己的余额，想起一句话：借钱，借出去的是钱，赌上的是交情。',
    choices: [
      {
        id: 'a',
        text: '借三万，把借条写清楚',
        outcomes: [
          {
            weight: 1,
            text: '他愣了一下说“兄弟之间还写这个”，但还是签了。两年后店走上正轨，他连本带息转回来，还多包了个红包：“当年只有你信我。”这段交情从此过了硬度测试——能一起谈钱还没谈崩的朋友，一只手数得过来。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 14000, network: 6, mindset: 5 } }],
          },
          {
            weight: 1,
            text: '店开了十个月，倒在了最难的那个冬天。他把借条拍照发给你：“钱我记着，给我点时间。”之后每年他都还一点，还清那天他喝多了，说这三万块是他跌到谷底时唯一没变质的东西。钱回来得很慢，但人没丢。',
            outcomeTag: 'partial',
            effects: [
              { moneyCost: { rate: 0.12, max: 12000, roundTo: 1000, reason: 'other' } },
              { stats: { network: 4, mindset: -3 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '取出定期，借十万入股当合伙人',
        outcomes: [
          {
            weight: 3,
            text: '你成了“股东”，也成了免费军师、免费客服和最后的接盘人。店黄了，清算时你的十万折成了两台二手冰柜和一屋子没卖掉的货。他躲了你半年，再见面时你们聊了十分钟天气。钱和朋友，这次一起没了。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.55, max: 100000, roundTo: 1000, reason: 'other' } },
              { stats: { mindset: -10, network: -5 } },
            ],
          },
          {
            weight: 1,
            text: '店活下来了，第二年开了分店。年底分红打到你卡上时，你反复数了三遍零。他在电话里喊你“X 总”，你笑骂回去。后来你复盘，这笔钱押对的不是项目，是人——但你也清楚，下一次未必有这种运气。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 90000, network: 6, mindset: 8 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '婉拒，转两千块表心意',
        outcomes: [
          {
            weight: 1,
            text: '你说手头也紧，转了两千：“这个不用还。”他说了声谢谢，之后你们的聊天停在了那句“新年快乐”。店后来开起来了，聚会照片里没有你。你不欠他的，他也不欠你的——只是有些门，关上的时候你正好在场。',
            effects: [{ stats: { money: -2000, network: -4, mindset: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_naked_resign',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '写好的辞职信',
    trigger: { all: [{ year: { from: 2021, to: 2024 } }, working, { not: { flag: 'laid_off' } }] },
    text: '连续三个月，你都在凌晨的出租车上产生同一个念头：不想干了。辞职信在草稿箱里躺了四十天，标题改过七次。这天例会，领导把一个不属于你的锅精准地扣了过来，你捏着手机，拇指悬在“发送”上方。',
    choices: [
      {
        id: 'a',
        text: '发送。裸辞，给自己半年',
        outcomes: [
          {
            weight: 1,
            text: '你睡了半个月自然醒，把体检报告上的箭头养回去两个，去了三个城市，读完了五本买了很久的书。半年后再投简历，新工作薪资没涨，但你重新变成了一个“晚上睡得着”的人。这半年烧掉的存款，你把它记作“大修费用”。',
            effects: [
              { moneyCost: { rate: 0.35, max: 60000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: 10, health: 8 } },
            ],
          },
          {
            weight: 1,
            text: '休息是真舒服，复出是真艰难。市场比你想的更冷，空窗期在面试官眼里越来越刺眼，最后你接了个降薪三成的 offer。你不后悔那半年，只是明白了：自由是有标价的，而且不打折。',
            effects: [
              { moneyCost: { rate: 0.5, max: 100000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -2, health: 6 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '不辞，但从此“安静离职”混着',
        outcomes: [
          {
            weight: 1,
            text: '你开始上班摸鱼、开会隐身、需求能拖就拖。钱照拿，但你低估了“心里那口气没顺”的成本：白天在工位内耗，晚上刷手机报复性熬夜，绩效滑到谷底时你才发现，混日子最先混掉的，是你自己的精气神。',
            effects: [{ stats: { money: 12000, mindset: -14, health: -12 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '删掉辞职信，先把攒的年假一次休完',
        outcomes: [
          {
            weight: 2,
            text: '你消失了两周，手机调成勿扰。回来那天，压垮你的那些事一件都没少，但你发现自己又扛得动了。原来你需要的不一定是新工作，可能只是一次真正的暂停。辞职信还在草稿箱——留着，它是你的底气，不是你的命运。',
            effects: [{ stats: { mindset: 7, health: 5 } }],
          },
          {
            weight: 1,
            text: '假是休了，人没休明白：躺在海边你还在回工作消息。回来第一天，积压的活像涨潮一样漫过工位。你意识到问题不在假期长短，在于你不敢真正断开。草稿箱里的辞职信，你又打开看了一遍。',
            effects: [{ stats: { money: -8000, mindset: -2, health: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_ebike_accident',
    pools: ['random'],
    weight: 0.5,
    category: 'health',
    tier: 'major',
    title: '下班路上的三秒钟',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    text: '晚上九点，你骑着电动车过路口，一辆逆行的外卖车把你连人带车撞翻。手肘火辣辣地疼，膝盖的裤子破了，血渗出来。骑手爬起来连声道歉，一边看着手机上即将超时的订单：“哥，要不……私了？我卡里有五千。”',
    choices: [
      {
        id: 'a',
        text: '报警、定责、走保险，按流程来',
        outcomes: [
          {
            weight: 2,
            text: '交警判了对方全责，平台保险覆盖了检查和医药费，还赔了误工。流程走了一个月，该拍的片子都拍了，确认没有后患。朋友说你较真，你说：“身体的事，较真是对自己负责。”',
            effects: [{ stats: { money: 6000, mindset: -3, health: -5 } }],
          },
          {
            weight: 1,
            text: '定责、垫付、理赔，来回跑了六趟，群里的保险专员永远“正在为您加急”。钱最后是赔了，但过程耗掉了你两个周末和不少耐心。你安慰自己：至少片子拍了，骨头没事，这个结论值这些麻烦。',
            effects: [{ stats: { money: 2000, mindset: -6, health: -5 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '拿五千私了，别耽误大家时间',
        outcomes: [
          {
            weight: 1,
            text: '你收了钱，揉着胳膊回了家。淤青半个月才散，倒也没落下什么。五千块像一笔意外之财——只是之后每次过那个路口，你都会下意识捏一把刹车。',
            effects: [{ stats: { money: 5000, health: -7, mindset: -2 } }],
          },
          {
            weight: 1,
            text: '两周后手肘越来越不对劲，一查是隐性骨裂，错过了最佳处理期。手术加康复花了三万多，骑手的微信早就删了你。躺在病床上你终于算明白这笔账：当时省下的每一分钟，后来都按小时还了回去。',
            effects: [
              { moneyCost: { rate: 0.3, max: 42000, roundTo: 1000, reason: 'medical' } },
              { stats: { health: -22, mindset: -10 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '摆摆手说没事，扶起车继续走',
        outcomes: [
          {
            weight: 1,
            text: '你连对方的车牌都没看，一瘸一拐地骑回了家。疼了一个多月，右膝从此成了“天气预报”。爸妈知道后在电话里训了你半小时，训得对：你对自己身体的大方，才是最贵的浪费。',
            effects: [{ stats: { health: -16, mindset: -8 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_rental_scam',
    pools: ['random'],
    category: 'money',
    tier: 'major',
    title: '长租公寓塌了',
    trigger: {
      all: [{ year: { from: 2020, to: 2021 } }, working, { not: { flag: 'has_house' } }],
    },
    text: '你住的长租公寓上了热搜：平台资金链断裂，创始人“失联”。你交的是押一付六——为了那 95 折优惠。房东在门上贴了通知：他半年没收到平台一分钱，限所有租客一周内搬离。楼道里全是拖着行李箱打电话的年轻人，像一场没有硝烟的溃败。',
    choices: [
      {
        id: 'a',
        text: '直接找房东谈：钱我付过了，咱们重新签',
        outcomes: [
          {
            weight: 2,
            text: '你把付款凭证打印出来，和房东坐下来谈了两个小时。他也是受害者，最后各退一步：免你一个月，重新签直租合同。已经打给平台的几万块成了坏账，但至少你不用在冬天流落街头。及时止损这四个字，你用真金白银上了一课。',
            effects: [
              { moneyCost: { rate: 0.15, max: 15000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -8, network: 2 } },
            ],
          },
          {
            weight: 1,
            text: '房东态度坚决：“我只认钱，不认你们的合同。”谈崩了。你连夜找了新房子，搬家、押金、中介费又是一笔。那半年你的账单像被抢劫过，唯一的收获是：再签租房合同，你逐字逐句看了三遍。',
            effects: [
              { moneyCost: { rate: 0.2, max: 24000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -6, health: -3 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '平台公告说“resolving 中”，再等等看',
        outcomes: [
          {
            weight: 1,
            text: '你等来的是第二份公告、第三份公告，以及某天下班回家时被换掉的门锁。行李被物业堆在楼道，押金和预付的房租随着创始人的道歉信一起蒸发。你蹲在纸箱旁边订当晚的酒店，终于明白：成年人世界里，“稍安勿躁”通常翻译为“跑得越晚亏得越多”。',
            effects: [
              { moneyCost: { rate: 0.35, max: 40000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -14, health: -6 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '拉一个租客维权群，集体行动',
        outcomes: [
          {
            weight: 1,
            text: '你建的群三天涨到四百人，有人整理证据，有人联系媒体，有人对接监管热线。报道出来后，清退方案里租客的顺位提前了一档，你追回了六成。散伙那天群里刷满“谢谢群主”——这场溃败里，你至少组织了一次像样的抵抗。',
            effects: [{ stats: { money: -10000, network: 8, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '维权群很热闹，进展很缓慢。三个月里你参加了两次协调会，填了五份登记表，最后拿回一成多。有群友说“至少我们试过了”，你看着自己搬家吃泡面的照片，很难被这句话安慰到。',
            effects: [
              { moneyCost: { rate: 0.2, max: 22000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -9, network: 4 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_side_gig_viral',
    pools: ['random'],
    weight: 0.5,
    category: 'career',
    tier: 'major',
    title: '一夜十万粉',
    trigger: { all: [{ year: { from: 2022, to: 2024 } }, working] },
    text: '你随手发的一条吐槽视频，一觉醒来爆了：百万播放，十万新粉，评论区喊你“更新”。MCN 的私信排着队，广告报价单看得你心跳加速。工位上，你一边改着周报，一边看着后台曲线往上蹿——命运好像突然递过来一张彩票，就看你怎么兑。',
    choices: [
      {
        id: 'a',
        text: '主业照干，接广告恰饭',
        outcomes: [
          {
            weight: 1,
            text: '你保持周更，接了几条不违心的广告，粉丝稳在一个不大不小的量级。每月多出的收入抵得上半份工资，更重要的是，你手里第一次有了 Plan B。风口上你没有起飞，但你搭了个结实的棚子。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 30000, mindset: 5, health: -3 } }, { setFlag: 'viral_creator' }],
          },
          {
            weight: 1,
            text: '热度像潮水，来得快退得也快。三个月后数据回落，广告只接成两条。不过你没赔上什么，还白得了一门剪辑手艺和几千个真粉——这张彩票没中大奖，好歹回了本。',
            effects: [{ stats: { money: 9000, knowledge: 3, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '辞职全职做，冲一把大的',
        outcomes: [
          {
            weight: 3,
            text: '你裸辞入场才发现，爆款是概率，更新是义务。日更三个月，数据一条比一条冷，存款一天比一天薄，焦虑在凌晨的剪辑软件里越攒越厚。一年后你重新投简历，面试官问那段空窗期，你说“创业了”，他点点头，给你的报价降了一档。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.45, max: 100000, roundTo: 1000, reason: 'other' } },
              { stats: { mindset: -14, health: -12 } },
            ],
          },
          {
            weight: 1,
            text: '你赌对了。第二条、第三条爆款接踵而至，半年做到签约主播，收入翻着跟头涨。老同事在评论区问“还缺助理吗”，你笑着回了个表情。只有你自己知道每条视频背后熬了几个通宵——但这一次，熬夜是为自己熬的。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 200000, mindset: 10, health: -8, network: 8 } }, { setFlag: 'viral_creator' }],
          },
        ],
      },
      {
        id: 'c',
        text: '有人出五万收号，卖了落袋',
        outcomes: [
          {
            weight: 1,
            text: '你收了五万，交出了账号。三个月后有粉丝私信你的小号：那个号在卖三无减肥药，评论区骂声一片，骂的是“你”。钱是干净的，名字脏了。你第一次知道，有些东西卖掉的时候，价格里没算上你的脸。',
            effects: [{ stats: { money: 50000, mindset: -10, network: -8 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_lockdown',
    pools: ['random'],
    category: 'mindset',
    tier: 'major',
    title: '静默的六十天',
    trigger: { all: [{ year: { from: 2022, to: 2022 } }, working] },
    text: '小区通知：即刻起封闭管理。起初大家以为是一周，后来阳台上开始有人吹萨克斯，团购接龙成了每天最重要的社交。你的冰箱、你的耐心和你的工资，都在经历一场没有预告的压力测试。',
    choices: [
      {
        id: 'a',
        text: '站出来当团长，组织全楼团购',
        outcomes: [
          {
            weight: 2,
            text: '你建群、对接供应商、做表格、分拣到凌晨。两个月下来，你认识了住了三年都没说过话的整栋楼邻居，解封后串门比亲戚还勤。有人给你送了面锦旗，是打印的，但你挂了很久。大水漫过来的时候，你选择当了一块砖。',
            effects: [{ stats: { network: 10, mindset: 4, health: -6 } }],
          },
          {
            weight: 1,
            text: '一次供应商翻车，一整车菜坏在路上，群里的矛头齐刷刷指向你。你垫了钱、道了歉、退了款，那晚你在楼道里坐了很久。后来大多数人都私下跟你说了“辛苦了”，但你也见识了：人在焦虑里，善意是限量供应的。',
            effects: [{ stats: { money: -6000, network: 4, mindset: -8, health: -5 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '囤好自己的，躺平刷手机等解封',
        outcomes: [
          {
            weight: 1,
            text: '你把作息过成了时差党：凌晨刷手机，中午起床，靠泡面和团购续命。两个月后体重涨了八斤，颈椎和情绪一起报警。解封那天走出小区，阳光刺眼，你眯着眼想：这两个月好像被人从日历上撕走了。',
            effects: [{ stats: { mindset: -10, health: -10 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '看准紧缺物资，加价倒卖赚一笔',
        outcomes: [
          {
            weight: 2,
            text: '可乐换蔬菜、平价进高价出，你的“小生意”做了两周，赚了几千块，也被邻居截图挂上了业主群。“发国难财”四个字钉在你的门牌号后面。解封后，电梯里的沉默比封控更漫长——你赚到的钱，不够赎回你在这栋楼里的名声。',
            effects: [{ stats: { money: 6000, network: -14, mindset: -12, health: -3 } }],
          },
          {
            weight: 1,
            text: '你倒腾了两周，赚了些辛苦钱，也没闹出什么风波——毕竟你价格加得克制，跑腿是真跑。但你自己心里清楚那条线在哪儿，后来你把最后一单的利润买成糖，给楼里的小孩分了。',
            effects: [{ stats: { money: 4000, mindset: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_drama_mlm_reunion',
    pools: ['random'],
    category: 'money',
    tier: 'major',
    title: '老同学的“项目”',
    trigger: { year: { from: 2016, to: 2019 } },
    text: '一个高中同学突然热络起来，朋友圈全是酒店会场、导师合影和“感恩遇见”。他约你见面，神秘地压低声音：“有个项目，三个月回本，一年翻十倍，名额有限，我第一个想到你。”他的眼睛亮得吓人，像被什么点着了。',
    choices: [
      {
        id: 'a',
        text: '兄弟一场，交入门费占个位',
        outcomes: [
          {
            weight: 1,
            text: '交完钱你才看清这个“项目”的全貌：上线吃下线，产品只是道具。你的“事业启动金”变成了一屋子卖不掉的货，而回本的唯一方式是把镰刀递向自己的通讯录。你没递得下去，认了亏，退了群。三个月后，当初拉你的同学开始在朋友圈卖惨筹款。',
            effects: [
              { moneyCost: { rate: 0.4, max: 40000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -12, network: -6 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '去他们的“分享会”考察一下',
        outcomes: [
          {
            weight: 1,
            text: '会场的音乐、掌声和“成功学”像一台精密的洗衣机，三个小时就把人的判断力洗得发白。你亲眼看见有人当场刷爆信用卡“上车”。你借口上厕所提前离场，在停车场深吸了三口气。这趟没白来：你从此对“气氛热烈的会场”终身免疫。',
            effects: [{ stats: { knowledge: 4, mindset: -2 } }],
          },
          {
            weight: 1,
            text: '你低估了现场的功力。“考察”到第三天，你交了一万九千八的“至尊代理费”。清醒是一周后的事，退款是不可能的事。你把那套“产品”堆在墙角，像供着一座自己愚蠢的纪念碑。',
            effects: [
              { moneyCost: { rate: 0.3, max: 30000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -10 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '直接拒绝，顺手在同学群提醒一句',
        outcomes: [
          {
            weight: 2,
            text: '你在群里发了几篇资金盘崩盘的报道，配了一句“最近这种局很多，大家小心”。有两个已经心动的同学私聊谢了你。拉你的那位把你删了——这个代价，你觉得划算。',
            effects: [{ stats: { network: 3, mindset: 3, knowledge: 2 } }],
          },
          {
            weight: 1,
            text: '你的提醒在群里炸了锅：他当场翻脸，说你“见不得同学好”，还有两个已经入伙的跟着阴阳你。半年后盘子崩了，群里安静得可怕。没有人道歉，也没有人再提这件事——成年人的世界里，“我早说过”是最没用的一句话。',
            effects: [{ stats: { network: -2, mindset: -4, knowledge: 2 } }],
          },
        ],
      },
    ],
  },
];
