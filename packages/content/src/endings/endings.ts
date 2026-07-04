import type { EndingDef } from '@life-sim/core';

export const endings: EndingDef[] = [
  {
    id: 'end_burnout_quit',
    title: '被生活按下退出键',
    text: '你不是某一天突然撑不住的。是一次次“再忍忍”、一次次凌晨回家、一次次把体检报告塞进抽屉，慢慢把人磨到了边缘。终于有天早上，你坐在床边看着手机闹钟响完，发现自己连站起来都需要很大力气。你请了长假，退掉很多计划，也第一次承认：人生不能只靠硬扛通关。',
    category: 'early',
    priority: 1,
    condition: {
      all: [
        { year: { from: 2021 } },
        { stat: 'mindset', op: '<=', value: 4 },
        { stat: 'health', op: '<=', value: 10 },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '硬扛不是韧性，硬扛到断才是。' },
  },
  {
    id: 'end_breakdown',
    title: '按下暂停键',
    text: '不知道从哪一天起，你早上睁开眼的第一个念头是“又要开始了”。你退掉了租的房子，买了一张回家的票。妈妈没问为什么，只是做了一桌你爱吃的菜。人生是长跑，中途停下来喘口气的人，不算输。',
    category: 'early',
    priority: 2,
    condition: {
      all: [
        { year: { from: 2022 } },
        { stat: 'mindset', op: '<=', value: 0 },
        { stat: 'network', op: '<=', value: 20 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '中途停下来喘口气的人，不算输。' },
  },
  {
    id: 'end_health_crash',
    title: '身体先亮了红灯',
    text: '救护车的顶灯在写字楼玻璃上一闪一闪。医生看着你的检查单说：“再晚半年，就不是住院能解决的了。”住院的两周里，工作群没有停，但你第一次没有点开。出院那天你走得很慢，阳光落在手背的留置针胶布上。你想起这些年推掉的每一次体检、扛过去的每一场感冒、凌晨两点的每一份外卖——身体都记着账，它只是比你有耐心。',
    category: 'early',
    priority: 3,
    condition: { stat: 'health', op: '<=', value: 1 },
    shareCard: { tone: 'warm', tagline: '身体都记着账，它只是比你有耐心。' },
  },
  {
    id: 'end_cashflow_break',
    title: '现金流断了',
    text: '账单不是一起砸下来的。房租、信用卡、医院押金、平台暴雷后的窟窿，它们排着队进门，每一个都说“我只要一点”。你拆东墙补西墙，最后发现墙本来就不多。那天你把所有自动扣款都关掉，给家里打了个电话，说自己可能要回去一阵。电话那头沉默了几秒，然后妈妈说：“回来吧，先吃饭。”',
    category: 'early',
    priority: 4,
    condition: {
      all: [
        { year: { from: 2020 } },
        { stat: 'money', op: '<=', value: 30000 },
        { stat: 'mindset', op: '<=', value: 5 },
        { stat: 'health', op: '>', value: 10 },
        { stat: 'network', op: '>', value: 20 },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '现金流一断，很多体面都会断。' },
  },
  {
    id: 'end_early_retire',
    title: '提前退休',
    text: '2017年那三千块钱的“彩票”，最后变成了你账户里最大的一笔数字。你没有真的退休——你只是获得了说“不”的权利：不喜欢的活可以不接，不想卷的班可以不上。财务自由的门槛其实没那么高，自由的定义才高。',
    category: 'final',
    priority: 95,
    condition: {
      all: [
        { flag: 'crypto_win' },
        { stat: 'money', op: '>=', value: 800000 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '暴富靠运气，但敢按确认键的是你自己。' },
  },
  {
    id: 'end_smalltown_win',
    title: '小镇做题家的胜利',
    text: '从村里的土路到大学的图书馆，再到写字楼的工位——你用了五年，走完了别人眼里“理所当然”的路。过年回家，爸妈在饭桌上不说什么，但给你夹菜的次数，比谁都多。做题家怎么了？做题家做出了自己的人生。',
    category: 'final',
    priority: 100,
    condition: {
      all: [
        { background: 'bg_rural' },
        { stat: 'knowledge', op: '>=', value: 65 },
        { stat: 'money', op: '>=', value: 250000 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '做题家怎么了？做题家做出了自己的人生。' },
  },
  {
    id: 'end_ai_adapter',
    title: 'AI 浪潮里的幸存者',
    text: '2026年，你已经不再把 AI 当成新闻里的词。它在你的工具栏里，也在你的焦虑里。你没有被浪潮直接托上岸，但你学会了借它省力、借它试错，也学会了把自己从“会写代码的人”升级成“能解决问题的人”。',
    category: 'final',
    priority: 106,
    condition: {
      all: [
        { flag: 'career_cs' },
        { flag: 'ai_adapted' },
        { stat: 'knowledge', op: '>=', value: 60 },
        { stat: 'mindset', op: '>=', value: 25 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '浪潮没有托你上岸，你学会了借浪前进。' },
  },
  {
    id: 'end_restart_30',
    title: '30岁，重新开始',
    text: '你被裁过，也怀疑过自己。那段时间你把简历改了二十几版，把“稳定”两个字从笑话改成愿望。后来你重新找到了位置，没有翻身逆袭的背景音乐，只有一个普通人慢慢站起来的声音。',
    category: 'final',
    priority: 107,
    condition: {
      all: [
        { flag: 'laid_off' },
        {
          any: [
            { flag: 'restarted_after_layoff' },
            { stat: 'mindset', op: '>=', value: 35 },
          ],
        },
      ],
    },
    shareCard: { tone: 'warm', tagline: '没有背景音乐，也可以慢慢站起来。' },
  },
  {
    id: 'end_double_reduction_survivor',
    title: '双减幸存者',
    text: '教育行业的地震没有把你彻底震出局。你换过课、改过简历，也在深夜怀疑过“老师”这个身份还能不能养活自己。到了2026年，你还站在教育这条线上，只是比当年更清楚：讲台从来不只在教室里。',
    category: 'final',
    priority: 108,
    condition: {
      all: [
        { flag: 'career_edu' },
        { any: [{ flag: 'edu_reinvented' }, { flag: 'teacher_public' }] },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '地震之后还站在讲台上，就是答案。' },
  },
  {
    id: 'end_stable_gov',
    title: '上岸人',
    text: '你的工位上摆着一盆绿萝，水杯里泡着菊花茶。大学同学在群里聊融资、聊期权、聊裁员，你偶尔冒个泡，发一张单位食堂三块钱的午饭。有人羡慕你，有人替你“可惜”。但日子是过给自己的，不是过给群友看的。',
    category: 'final',
    priority: 110,
    condition: { flag: 'career_gov' },
    shareCard: { tone: 'warm', tagline: '稳定不是没故事，只是故事讲得更慢。' },
  },
  {
    id: 'end_house_key',
    title: '还贷的人',
    text: '2026年，你的存款余额和房贷余额之间，隔着一条长长的河。有人说你接了盘，有人说你安了家。每天晚上，你用自己的钥匙打开自己的门，把外卖放在自己的桌上——这件小事，你用了十二年才做到。',
    category: 'final',
    priority: 115,
    condition: {
      all: [
        { flag: 'has_house' },
        { stat: 'mindset', op: '>=', value: 20 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '房价会跌会涨，自己家的灯只会亮。' },
  },
  {
    id: 'end_city_drifter',
    title: '北漂十年',
    text: '你在这座城市搬过很多次家，换过几张工卡，楼下的早餐店换了三个老板。你没有房子，没有户口，但地铁换乘不用看指示牌，加班后的夜风你也认识。这座城市没有给你一个家，但你自己活成了一个据点。',
    category: 'final',
    priority: 120,
    condition: {
      all: [
        { flag: 'no_house' },
        { stat: 'money', op: '>=', value: 100000 },
        { stat: 'mindset', op: '>=', value: 25 },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '城市没给我一个家，我把自己活成了据点。' },
  },
  {
    id: 'end_married',
    title: '围城之内',
    text: '2026年的某个周末，你们在厨房为“番茄炒蛋放不放糖”争了十分钟，最后各做了一份。从2016年图书馆的那次表白算起，你们一起走过了异地、搬家、房租和所有需要商量的日子。围城里没有童话，只有一个愿意和你把日子过下去的人——这已经是极小概率事件了。',
    category: 'final',
    priority: 112,
    condition: {
      all: [
        { npcStage: 'first_love', stage: 'married' },
        { stat: 'mindset', op: '>=', value: 25 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '爱情最好的结局，是变成生活。' },
  },
  {
    id: 'end_gold',
    title: '小有成就',
    text: '十二年攒下的存款，在这座城市还是买不起太多东西，但它是你一份一份工资、一个一个选择攒出来的。深夜加完班，你请自己吃了顿好的。账单弹出来的时候，你没有犹豫。',
    category: 'final',
    priority: 140,
    condition: {
      all: [
        { stat: 'money', op: '>=', value: 500000 },
        { stat: 'mindset', op: '>=', value: 45 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '存款不够买梦，但够证明你走过路。' },
  },
  {
    id: 'end_viral_creator',
    title: '被算法选中的人',
    text: '2026年，你的账号还在更新。粉丝数早就过了当年做梦都不敢想的数字，但你最珍惜的还是最早那一万个——他们见过你对着镜头结巴的样子。年会上有人问你成功秘诀，你说：“运气，加上运气来的时候我刚好没躺着。”',
    category: 'final',
    priority: 118,
    condition: { flag: 'viral_creator' },
    shareCard: { tone: 'triumph', tagline: '风口来的时候，我刚好没躺着。' },
  },
  {
    id: 'end_scarred_survivor',
    title: '栽过跟头的人',
    text: '2026年，你的账户余额又一次爬回了让你有安全感的数字。这些年你被骗过、亏过、在深夜算过那些再也回不来的钱。但你还是把日子过了下来，而且过得越来越稳——因为每一道疤都变成了判断力。现在亲戚朋友做任何“大决定”之前，都会先来问问你。你成了家族的防火墙。',
    category: 'final',
    priority: 160,
    condition: {
      all: [
        { any: [{ flag: 'pig_butchered' }, { flag: 'p2p_burned' }, { flag: 'stock_lesson' }] },
        { stat: 'money', op: '>=', value: 80000 },
        { stat: 'mindset', op: '>=', value: 20 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '每一道疤，后来都变成了判断力。' },
  },
  {
    id: 'end_ordinary',
    title: '平凡之路',
    text: '2026年的最后一天，你在出租屋或自己的小房间里吃了顿热饭。没有大富大贵，没有惊天动地，你只是这座城市几千万个普通人中的一个。但你知道自己走过了什么：高考、志愿、宿舍的夜谈、第一份工资、几次风口和几次失落……这些别人看不见的东西，拼成了只属于你的人生。',
    category: 'final',
    priority: 999,
    condition: { always: true },
    shareCard: { tone: 'warm', tagline: '普通人的十二年，也有自己的重量。' },
  },
];
