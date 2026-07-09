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
    id: 'end_finance_survivor',
    title: '牛熊过客',
    text: '2015年股灾、2018年资管新规、2021年抱团崩塌——这个行业每隔几年就要洗一次牌，你亲眼见过多少"顶流"从神坛跌下来，连朋友圈都不敢再发业绩截图。2026年，你还站在这个牌桌上。没有人再问你信不信"这次不一样"，因为你早就知道，牛熊都会过去，过去的人才算数。',
    category: 'final',
    priority: 109,
    // 金融线本身就是全职业线里 mandatory 剧情最狠的一条(2015/2018/2018-19/2020/2021 五个强制节点全是负向心态),
    // "牛熊过客"的门槛应该是"没被行业淘汰",不是"心态还很好"——25 分的心态门槛在这条线的数值曲线下基本摸不到。
    condition: {
      all: [
        { flag: 'career_finance' },
        { not: { flag: 'laid_off' } },
        { stat: 'mindset', op: '>=', value: 5 },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '牛熊都会过去，留下来的人才算数。' },
  },
  {
    id: 'end_medicine_frontline',
    title: '白衣执甲',
    text: '2020年那个除夕夜，你在请战书上按下手印的时候，没有想那么多以后的事。2026年回头看，编制定没定、留没留在临床，好像都不再是最重要的问题——重要的是那一年，穿上防护服的人里，有你一个。白大褂后来换了又换，但那份手印，一直算数。',
    category: 'final',
    priority: 111,
    condition: {
      all: [
        { flag: 'career_medicine' },
        { flag: 'pandemic_frontline' },
        { stat: 'mindset', op: '>=', value: 30 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '那一年请战的人里，有你一个。' },
  },
  {
    id: 'end_psychology_listener',
    title: '倾听者',
    text: '十二年前，这个专业最常被问的是"能算命吗"；十二年后，你的预约表排到了下个月。热线、双减、需求爆发、行业整顿，每一站你都在场。你没有治好这个时代的焦虑，但你陪很多人在焦虑里坐稳了。这门手艺没有让你大富大贵——它只是让一些人的深夜，比原来好过了一点。',
    category: 'final',
    priority: 112,
    condition: {
      all: [
        { flag: 'career_psychology' },
        {
          any: [
            { flag: 'psy_school' },
            { flag: 'psy_counselor' },
            { flag: 'psy_private_practice' },
          ],
        },
        { stat: 'mindset', op: '>=', value: 20 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '你没有治好时代的焦虑，但你接住了很多深夜。' },
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
    // 原本 priority 140 排在 end_house_key(115)/end_city_drifter(120) 之后:但几乎每个玩家到 2026 年
    // 都会被 ev_work_buy_house_question 打上 has_house 或 no_house 之一,而这条件(money≥50万+mindset≥45)
    // 严格强于那两条结局的门槛(money≥10万+mindset≥20/25),导致 end_gold 在 priority 排序下永远被截胡、
    // 从未被 simulate 命中过。挪到 married(112) 之后、house_key(115) 之前,让它只在没有更具体职业/关系
    // 剧情线可归类、但数值上明显过得更好的玩家身上生效。
    priority: 114,
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
  // ---- 特质专属结局(151-156):在全部职业/叙事结局之后、「栽过跟头的人」(160)和兜底(999)之前,
  // 专收本来会落进「平凡之路」的玩家,给每种特质一个"这局的我"的收尾。 ----
  {
    id: 'end_trait_grinder',
    title: '燃烧过的人',
    text: '2026年年底,你翻出 2019 年那条凌晨四点的朋友圈。十二年里你几乎没有停过:课要最难的,项目要最烫的,周末要排满的。你得到了很多——简历、存款、别人口中的“靠谱”;也烧掉了一些东西——体检报告上的箭头一年比一年多,有几年你甚至想不起自己玩过什么。你妈当年问“图什么呢”,你现在有答案了吗?也许有:图的是不辜负那个从考场里走出来、什么都没有、只有一身力气的自己。只是下一个十二年,你想学着留一点力气,给生活。',
    category: 'final',
    priority: 151,
    condition: { all: [{ flag: 'trait_grinder' }, { stat: 'knowledge', op: '>=', value: 70 }, { stat: 'health', op: '<=', value: 45 }] },
    shareCard: { tone: 'bitter', tagline: '把自己当柴烧的人,照亮过,也疼过。' },
  },
  {
    id: 'end_trait_risk',
    title: '还坐在牌桌上的人',
    text: '十二年,你进过的场子比大多数人一辈子都多:2015 的股市、2017 的币圈、P2P、基金、黄金、风口。你赢过快钱,交过学费,被收割过,也真金白银地落袋过。2026年盘点,你的账户余额说不上传奇,但有一样东西比余额珍贵:你还坐在牌桌上——没有梭哈过人生,没有借过下不了台的杠杆,输的每一把都在承受范围内。赌性是天生的,分寸是摔出来的。老了以后你大概还会是家族群里最先转发行情的人,但你会附一句:小仓位,玩玩就好。',
    category: 'final',
    priority: 152,
    condition: {
      all: [
        { flag: 'trait_risk_taker' },
        { any: [{ flag: 'stock_lesson' }, { flag: 'pig_butchered' }, { flag: 'p2p_burned' }, { flag: 'fund_chased' }, { flag: 'crypto_win' }] },
        { stat: 'money', op: '>=', value: 150000 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '输过很多把,但没下过牌桌。' },
  },
  {
    id: 'end_trait_social',
    title: '朋友遍地的人',
    text: '2026年跨年,你的手机从早响到晚:大学室友、前同事、婚礼上认识的、疫情时线上局的,连楼下水果店老板都给你发了句新年快乐。十二年里你没攒下让人羡慕的存款,但你攒下了另一种资产——你搬过的每次家都有人来帮忙,你失落的每个深夜都有人接电话,你随口提的每个需求总有人说“我认识人”。人这一生的兜底,除了存款和社保,还有一种叫“有人管你”。你是别人的人脉,别人也是你的。这张网结了十二年,密得能接住你。',
    category: 'final',
    priority: 153,
    condition: { all: [{ flag: 'trait_social' }, { stat: 'network', op: '>=', value: 70 }] },
    shareCard: { tone: 'warm', tagline: '存款会花完,人缘一直在生利息。' },
  },
  {
    id: 'end_trait_homebody',
    title: '离家不远的人',
    text: '十二年里你去过一些地方,但你的手机相册置顶永远是家里的饭桌。别人的年度总结是项目和存款,你的是:陪爸妈过了几个春节、教会了他们多少手机功能、家里每年的体检报告你都存了档。2026年,爸妈明显老了,但他们老得很安心——因为不管你在哪个城市,他们知道你“随时都在”。这个时代把“出息”定义成走得远,你偏要证明另一种活法:走得不算远,但守得足够近。房子会涨会跌,工作会来会去,饭桌上那两双碗筷,是你人生的锚。',
    category: 'final',
    priority: 154,
    condition: { all: [{ flag: 'trait_homebody' }, { stat: 'mindset', op: '>=', value: 55 }] },
    shareCard: { tone: 'warm', tagline: '走遍世界的人很多,守住饭桌的人很少。' },
  },
  {
    id: 'end_trait_sensitive',
    title: '把日子过成日记的人',
    text: '十二年,别人记住的是结果:考了多少分、赚了多少钱、升了什么职。你记住的是别的:2014年考场外那阵风的温度,操场那晚的灯,散伙饭上没人敢先说的那句“走了”,爸妈鬓角第一根让你心口一紧的白发。你活得比别人累——每种情绪在你这里都是原价,从不打折。但2026年回头看,你的十二年比别人厚:同样的事,别人过了一遍,你过了三遍——经历一遍,感受一遍,记住一遍。世界属于钝感的人,但世界的细节,属于你。',
    category: 'final',
    priority: 155,
    condition: { all: [{ flag: 'trait_sensitive' }, { stat: 'mindset', op: '>=', value: 50 }, { stat: 'knowledge', op: '>=', value: 55 }] },
    shareCard: { tone: 'warm', tagline: '感受得更多的人,活得更厚。' },
  },
  {
    id: 'end_trait_chill',
    title: '慢慢来的人',
    text: '这十二年,你被劝过很多次“再拼一点”:高考时、找工作时、别人买房时、风口起来时。你听着,点头,然后继续按自己的节奏走。2026年年底,当年劝你的人有的确实跑到了你前面,有的中途折了,还有的至今没睡过一个好觉。你呢?存款中不溜,职位中不溜,但心态和体检报告是朋友圈里少有的干净。“躺平”上热搜那年你就想说:你不是躺平,你只是很早就想明白了——人生不是竞速赛,是巡航。油门踩到底的人看不到风景,你看到了整整十二年。',
    category: 'final',
    priority: 156,
    condition: { all: [{ flag: 'trait_chill' }, { stat: 'mindset', op: '>=', value: 70 }] },
    shareCard: { tone: 'warm', tagline: '不慌不忙,也走完了十二年。' },
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
