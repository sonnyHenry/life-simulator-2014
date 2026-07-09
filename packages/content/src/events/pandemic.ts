import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控,与 work.ts / random.ts 保持一致。
// 读研玩家的疫情弧由 work.ts 的《封校的春天》承担;临床医学玩家有自己的
// 《出征》(career-medicine.ts),心理学玩家有自己的《热线的那一端》
// (career-psychology.ts),2020 暂停键对两者排除,避免同年双 major 事件叠加。
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

// 疫情三年事件弧(2020 暂停键 → 2021 常态化 → 2022 静默/放开)。
// 2020/2022 两端 mandatory 保证人人经历;2021 由 2020 的 outcome schedule 链出;
// 《静默的六十天》(drama.ts)由 2021 的部分 outcome 链出,保留"不是每个人都被封"的真实感。
export const pandemicEvents: GameEvent[] = [
  {
    id: 'ev_pandemic_2020_pause',
    pools: ['work'],
    category: 'era',
    tier: 'major',
    title: '春节，暂停键',
    mandatory: true,
    order: -10,
    trigger: {
      all: [working, { not: { major: '临床医学' } }, { not: { major: '心理学' } }, { year: { from: 2020, to: 2020 } }],
    },
    text: '2020年1月，你拖着行李箱回老家过年。年夜饭桌上，长辈们还在劝你多吃点，手机里的新闻已经一条比一条短促：武汉封城、口罩售罄、返程航班取消。大年初二，公司群里弹出通知：延迟复工，等候安排。你原定初六的车票躺在钱包里，突然不知道该退还是该留。窗外的县城安静得出奇，没有拜年的鞭炮，只有大喇叭在循环播放"不串门、不聚集"。你第一次意识到，有些改变来的时候不打招呼，一来就是很多年。',
    choices: [
      {
        id: 'a',
        text: '就地远程办公，在老家的书桌前上班',
        outcomes: [
          {
            weight: 2,
            text: '你把高中时的书桌收拾出来，贴了张"开会勿入"的纸条。妈妈还是会在你汇报到一半时推门送水果，爸爸在客厅看电视的音量永远比你的会议大。但说实话，这是你工作以来吃得最好、睡得最足的两个月。返城那天，后备箱塞满了腊肉和青菜，你妈说：“在外面，好好吃饭。”',
            effects: [
              { stats: { mindset: 4, health: 3, network: -2 } },
              { setFlag: 'pandemic_wfh' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: '县城的网速撑不起视频会议，你举着手机在院子里找信号，像举着一炷香。一次关键汇报卡成 PPT，领导在群里点名"请注意远程办公纪律"。你对着满格又瞬间消失的信号，头一次对"数字鸿沟"有了肉身体会。',
            effects: [
              { stats: { mindset: -5, network: -3, knowledge: 2 } },
              { setFlag: 'pandemic_wfh' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '抢一张票逆行回城，做第一批复工的人',
        outcomes: [
          {
            weight: 2,
            text: '你回到空城。地铁车厢常常只有你一个人，写字楼电梯里贴着"请勿交谈"。整层楼只有你和绿萝上班，外卖只能送到园区门口。但项目没停，你成了组里那段时间最靠得住的人——后来晋升答辩时，领导提的第一件事就是这个春天。',
            effects: [
              { stats: { money: 4000, network: 5, mindset: -4, health: -3 } },
              { setFlag: 'pandemic_return' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: '你落地就被拉去集中隔离十四天，酒店窗户只能开一条缝，一日三餐挂在门把手上。你对着天花板开完了人生中最多的电话会，隔离费自理。解除隔离那天，你闻到街上的空气，觉得自由真贵，贵得值。',
            effects: [
              { stats: { money: -4000, mindset: -6, health: -2, knowledge: 2 } },
              { setFlag: 'pandemic_return' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'd',
        text: '既然回不去,就把这个假期当成偷来的团圆',
        visibleIf: { flag: 'trait_homebody' },
        outcomes: [
          {
            weight: 2,
            text: '别人在焦虑复工,你在院子里陪爸爸腌腊肉、跟妈妈学了三道家常菜。工作照常远程,但下班就是饭桌。这是你工作以后第一次在家待满两个月——用的是全世界最糟糕的理由,过的却是你想了很多年的日子。返城那天你妈没哭,你在高速上哭了一小段。',
            effects: [
              { stats: { mindset: 8, health: 3, network: -3 } },
              { setFlag: 'pandemic_wfh' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: '团圆到第六周,温情开始被现实磨损:爸妈的作息和你的会议冲突,你的“再待几天”和领导的“何时返岗”也开始冲突。第七周你订了返程票。走的时候后备箱照样塞满,只是你懂了:恋家的人也需要和家保持一点距离,想念才有地方住。',
            effects: [
              { stats: { mindset: 2, network: -4 } },
              { setFlag: 'pandemic_wfh' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '报名社区志愿者，帮着测温、登记、送菜',
        outcomes: [
          {
            weight: 2,
            text: '红马甲一穿就是一个多月。你在小区门口测过几千次体温，帮独居老人代购过降压药，也在深夜帮忙抬过物资。楼里的阿姨们从此记住了你，后来你搬家，是三个邻居帮你抬的冰箱。那年春天很冷，但你记住的都是热的。',
            effects: [
              { stats: { network: 8, mindset: 5, health: -4 } },
              { setFlag: 'pandemic_volunteer' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: '你被排到最冷的夜班岗，凌晨两点的小区门口，风像刀子。有住户嫌登记麻烦冲你发火，你笑着解释完，回头在执勤本上画了个哭脸。一个月后你冻出了重感冒，但居委会送来的那面"热心居民"锦旗，你爸妈在视频里看了三遍。',
            effects: [
              { stats: { network: 4, health: -7, mindset: -3 } },
              { setFlag: 'pandemic_volunteer' },
              { schedule: { eventId: 'ev_pandemic_2021_normalize', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    // schedule-only:由 2020《春节，暂停键》全部 outcome 链出,不进随机池
    id: 'ev_pandemic_2021_normalize',
    pools: [],
    category: 'era',
    title: '绿码时代',
    text: '第二年，口罩从"暂时戴戴"变成了出门标配，健康码成了新的身份证。进小区扫码，进公司扫码，买感冒药也要登记。核酸亭像便利店一样长满街角，"你做核酸了吗"取代了"吃了吗"。生活好像恢复了，又好像一直悬着——你的日程表上，所有计划后面都默默加了一个括号：（视情况而定）。',
    choices: [
      {
        id: 'a',
        text: '照常上班过日子，把不确定当背景音',
        outcomes: [
          {
            weight: 2,
            condition: { flag: 'pandemic_wfh' },
            text: '经历过老家书桌办公的你，对"随时切换"已经很熟练了。电脑包里常备洗漱包，工位抽屉里有一箱泡面。同事说你活得像个特工，你说这叫"新常态生存包"。',
            effects: [{ stats: { mindset: 3, knowledge: 2 } }],
          },
          {
            weight: 2,
            condition: { not: { flag: 'pandemic_wfh' } },
            text: '你把绿码截图设成了手机快捷方式，把"非必要不出市"过成了默认设置。日子照常往前走，只是每次刷到别处的封控新闻，你都会下意识看一眼自家冰箱。',
            effects: [{ stats: { mindset: 2, knowledge: 2 } }],
          },
          {
            weight: 1,
            text: '一次出差，目的地突然调升风险等级，你的码黄了。你在高速服务区滞留了一天一夜，靠一包饼干和三个充电宝开完了所有会。回来后你在日历上写：以后出差，先看流行病学通报，再看天气预报。',
            effects: [
              { stats: { money: -3000, mindset: -6, health: -2 } },
              { schedule: { eventId: 'ev_drama_lockdown', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '重新算一遍家底，给生活留出冗余',
        outcomes: [
          {
            weight: 2,
            text: '你砍掉了几个可有可无的会员和预付卡，第一次给自己建了"应急六个月"的备用金档案。世界越不确定，你越想在存款数字里找一点确定。年底看着账户，你心里踏实了一些——这不是抠门，这是压舱石。',
            effects: [{ stats: { money: 8000, mindset: 3, network: -2 } }],
          },
          {
            weight: 1,
            text: '你把"极简储蓄"执行得过了头，推掉了太多聚会，连老同学婚礼都只随了礼没到场。钱包厚了一点，通讯录冷了一片。年底你盯着存款想：留出冗余是对的，但日子不能只剩冗余。',
            effects: [
              { stats: { money: 10000, network: -5, mindset: -4 } },
              { schedule: { eventId: 'ev_drama_lockdown', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '趁着能动，把攒的年假用在路上',
        outcomes: [
          {
            weight: 2,
            text: '你研究着各地政策，挑了个低风险城市短途旅行。景区人不多，落日很完整。你拍了很多照片，配文只有一句：“出来看看，世界还在。”那趟旅行不远，但你记了很久。',
            effects: [{ stats: { mindset: 7, health: 2, money: -4000 } }],
          },
          {
            weight: 1,
            text: '返程前一天，同行程的航班出现阳性，你的行程卡带了星。你在酒店自费隔离了一周，退了后面所有计划。你躺在陌生的床上想：这个时代旅行，行李箱里最重的是运气。',
            effects: [
              { stats: { money: -6000, mindset: -8, health: -1 } },
              { schedule: { eventId: 'ev_drama_lockdown', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'd',
        text: '把不确定性变成计划表:证书、作品集、备选简历一起推进',
        visibleIf: { flag: 'trait_grinder' },
        outcomes: [
          {
            weight: 2,
            text: '别人说“等稳定了再说”,你把稳定这件事从计划里删掉了。白天照常扫码上班,晚上刷课、改简历、整理作品集。年底你手里多了一个证书和一份能随时投出去的简历,只是日历上连续三个月没有一个真正空白的周末。',
            effects: [{ stats: { knowledge: 7, mindset: -3, health: -5, network: 2 } }],
          },
          {
            weight: 1,
            text: '你把计划排得太满,满到任何一次临时核酸、封控通知、线上会议都能把它撞歪。三个月后,课程开了三门,证书报了两个,真正完成的只有一半。你第一次意识到:卷王也需要冗余,不只是硬盘需要。',
            effects: [{ stats: { knowledge: 4, mindset: -5, health: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_pandemic_2022_reopen',
    pools: ['work'],
    category: 'era',
    tier: 'major',
    title: '十二月的退烧药',
    mandatory: true,
    order: 10,
    trigger: { year: { from: 2022, to: 2022 } },
    text: '2022年12月，持续了三年的防控在几周之内落幕。核酸亭一夜之间关了门，健康码从手机首屏悄悄退场。紧接着，几乎每个人的家庭群都变成了体温播报台：谁阳了，谁还是"天选打工人"，谁家还有布洛芬。药店门口排起长队，朋友圈开始流行晒抗原和电解质水。三年里你无数次想象过"结束"的样子，真到了这一天，它安静得让人恍惚——没有庆典，只有此起彼伏的咳嗽声，和终于可以随便买的火车票。',
    choices: [
      {
        id: 'a',
        text: '第一波就中招，居家硬扛',
        outcomes: [
          {
            weight: 2,
            text: '高烧那两天，你烧得把被子汗透了三次，嗓子像吞了刀片。楼上的邻居把最后一板退烧药分了你一半，附了张便利贴："扛住。"你妈每天三个视频电话，看你喝没喝水。阳康那天你下楼买了碗热汤面，觉得能正常咽下食物这件事，值得郑重庆祝一次。',
            effects: [{ stats: { health: -8, mindset: -2, network: 3 } }],
          },
          {
            weight: 1,
            text: '你烧退了又反复，咳嗽拖了快一个月，爬三层楼要歇两次。你第一次认真读完了体检报告的每一行，把"身体是本钱"从口头禅变成了日程表——报了个恢复性的慢跑班，周末真的去了。',
            effects: [{ stats: { health: -12, mindset: -4, knowledge: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '翻出家里的药，分给楼里需要的人',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'pandemic_volunteer' },
            text: '你又一次在业主群里冒了头——2020年那个穿红马甲的人，邻居们还记得。你把退烧药拆成单板，挨家挂在门把手上。后来你自己也阳了，门把手上陆续出现了梨、罐头和一张字条："三年了，谢谢你还是你。"',
            effects: [{ stats: { network: 9, mindset: 6, health: -6 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'pandemic_volunteer' } },
            text: '你在业主群里发了句"家里有多的退烧药，需要的邻居说一声"，五分钟收到十几条回复。你把药拆成单板挨家送，隔着门听到一声声"谢谢"。后来你自己阳了，门把手上出现了别人回赠的水果。你想，三年了，大家都在学着把日子过成互相搭把手的样子。',
            effects: [{ stats: { network: 7, mindset: 5, health: -6 } }],
          },
        ],
      },
      {
        id: 'd',
        text: '阳康之后,把三年没聚齐的人全约出来',
        visibleIf: { flag: 'trait_social' },
        outcomes: [
          {
            weight: 2,
            text: '你在群里发起“阳康重聚局”,报名接龙排到了二十多人,最后订了个能拼三桌的馆子。三年没见的人坐在一起,聊谁被封在公司、谁在方舱唱歌、谁的婚礼推迟了三次。散场时老班长拍你肩膀:“还得是你,不然这群人这辈子凑不齐。”有些群三年没人说话,不是散了,是在等一个开口的人。',
            effects: [{ stats: { network: 9, mindset: 7, money: -1500 } }],
          },
          {
            weight: 1,
            text: '局是攒起来了,但一半人临时“又阳了”“家里有事”,三桌缩成一桌。到场的人喝得很尽兴,你却盯着那些空座位有点出神。饭后你把没来的人挨个私聊了一遍——热闹你可以组织,但重逢这件事,急不来。',
            effects: [{ stats: { network: 4, mindset: -2, money: -1000 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '阳康之后第一件事：买一张回家的票',
        outcomes: [
          {
            weight: 1,
            text: '你抢了张春运的票——这一次不用查政策、不用报备、不用隔离。站台上人山人海，广播嘈杂，你却听得眼眶发热。到家推开门，饭菜是热的，爸妈明显老了一些。你妈说："回来就好。"你在心里补了后半句：这三年，谁都不容易。',
            effects: [{ stats: { mindset: 9, health: -4, money: -3000 } }],
          },
        ],
      },
    ],
  },
];
