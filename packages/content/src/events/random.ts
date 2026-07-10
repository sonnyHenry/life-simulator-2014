import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控:求职入场 / 研究生毕业 / 考公上岸 / 考公落榜后打工。
// 上班族语境的事件(房租、副业、领导、公司体检…)都要挂这个,防止打到在读玩家身上。
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

export const randomEvents: GameEvent[] = [
  {
    id: 'ev_random_flu',
    pools: ['random'],
    weight: 0.5,
    category: 'health',
    title: '换季重感冒',
    text: '一场降温，你中招了。头晕、咳嗽、浑身发冷，外卖软件里的粥店你已经收藏了三家。',
    contextLines: [
      { condition: { flag: 'pandemic_volunteer' }, text: '体温计跳出数字时，你想起那年在小区门口给别人测过的几千次体温；轮到自己，反倒没那么会照顾人。' },
      { condition: { flag: 'pandemic_wfh' }, text: '你下意识把电脑搬到床边，像当年在老家书桌前那样准备“边病边上班”，才发现那套生存习惯一直没戒掉。' },
      { condition: { flag: 'pandemic_return' }, text: '咳嗽声在房间里一响，你又想起那趟空荡荡的返城路；身体比日历更记得那些年份。' },
    ],
    choices: [
      {
        id: 'a',
        text: '去医院，该花的钱不省',
        outcomes: [
          {
            weight: 1,
            text: '挂号、化验、输液，折腾一天花了八百块。医生说“多喝水，注意休息”——这话你的家人说过一百遍，但你只信穿白大褂的。',
            effects: [
              { moneyCost: { rate: 0.06, max: 800, roundTo: 100, reason: 'medical' } },
              { stats: { mindset: -2, health: 4 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '请一天假，把生病过成放假',
        visibleIf: { flag: 'trait_chill' },
        outcomes: [
          {
            weight: 2,
            text: '你煮了粥，睡到自然醒，下午裹着被子看了两部老电影。病好得不算快，但你一点都不慌。有些人生病是中断，你生病是暂停。',
            effects: [{ stats: { mindset: 4, health: 2 } }],
          },
          {
            weight: 1,
            text: '假是请了，觉也睡了，但工作消息还是追了过来。你顶着低烧回了一下午消息，暂停键按了个寂寞。',
            effects: [{ stats: { mindset: -2, health: -1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '硬扛，年轻人自愈快',
        outcomes: [
          {
            weight: 2,
            text: '扛了一周，总算好了。你在朋友圈发“病来如山倒”，配图是保温杯里的枸杞。年轻真好，身体是真扛造。',
            effects: [{ stats: { mindset: -1, health: -4 } }],
          },
          {
            weight: 1,
            text: '拖成了支气管炎，最后还是去了医院，花的钱是当初的三倍。医生看着你的化验单说：“你们年轻人啊。”',
            effects: [
              { moneyCost: { rate: 0.12, max: 3000, roundTo: 100, reason: 'medical' } },
              { stats: { mindset: -8, health: -8 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_family_call',
    pools: ['random'],
    weight: 0.5,
    category: 'family',
    title: '家里的电话',
    text: '晚上十点，家里打来电话。电话那头先问你吃没吃饭，又问钱够不够花，最后才装作随口一提：“最近累不累啊？”',
    contextLines: [
      { condition: { flag: 'reopen_homecoming' }, text: '你想起解封后推开家门的那顿热饭；这次不想再只回一句“都挺好”。' },
      { condition: { flag: 'has_house' }, text: '他们上次问的还是首付和月供，今天却先问你有没有按时吃饭。' },
      { condition: { flag: 'hometown_drifted' }, text: '你忽然想到春节烧烤摊上，自己也曾只顾讲大城市，忘了问故乡后来怎样。' },
      { condition: { flag: 'pandemic_wfh' }, text: '你记得那年在老家书桌前开会，家人总在门外放一盘切好的水果；当时嫌打扰，如今却很久没听见那声敲门。' },
    ],
    choices: [
      {
        id: 'a',
        text: '报喜不报忧',
        outcomes: [
          {
            weight: 1,
            text: '你说一切都好，还开了两个玩笑。挂掉电话后，房间安静下来。成年人最早学会的技能之一，是让父母放心。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '说一点真实的难处',
        outcomes: [
          {
            weight: 1,
            text: '你说最近有点累。电话那头沉默了一下，然后妈妈说：“累了就歇歇，别硬撑。”这句话没有解决问题，但让问题轻了一点。',
            effects: [{ stats: { mindset: 5 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '干脆聊满一个小时，把家里的事都问一遍',
        visibleIf: { flag: 'trait_homebody' },
        outcomes: [
          {
            weight: 1,
            text: '从邻居家的猫聊到亲戚的婚事，从菜价聊到爸爸的血压。挂电话时你看了眼时长：七十三分钟。别人觉得这是浪费时间，你觉得这是充电。',
            effects: [{ stats: { mindset: 6, network: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_old_friend',
    pools: ['random'],
    category: 'friendship',
    trigger: { year: { from: 2020 } },
    title: '老同学的朋友圈',
    text: '你刷到高中同学的朋友圈：有人晒婚纱照，有人晒工牌，有人晒孩子，有人晒国外定位。你看了很久，突然想起当年大家都穿着一样的校服。',
    contextLines: [
      { condition: { flag: 'dorm_farewell_video' }, text: '相册忽然弹出“多年前的今天”：毕业那晚，你举着手机替所有人录下了没说出口的话。' },
      { condition: { flag: 'dorm_last_game' }, text: '其中一张合照里有人穿着你熟悉的旧T恤，你想起散伙饭后那局谁也不肯先下线的游戏。' },
      { condition: { flag: 'roommate_farewell_ledger' }, text: '你又翻到那张毕业时算到最后一笔的旧账单；钱早结清了，一起冒过的险却还留着。' },
      { condition: { flag: 'dorm_bond' }, text: '大学宿舍群还躺在消息列表深处，群名没改，最后一句话却已经停在很久以前。你突然明白，共同生活过和仍在联系是两回事。' },
    ],
    choices: [
      {
        id: 'a',
        text: '点个赞，继续忙自己的',
        outcomes: [
          {
            weight: 1,
            text: '你点了赞，放下手机。别人的人生像橱窗，自己的日子像厨房，都是真的，只是展示方式不同。',
            effects: [{ stats: { mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '私聊问候一下',
        outcomes: [
          {
            weight: 1,
            text: '你们聊了十几分钟，从近况聊到班主任的口头禅。关系没有重新热络，但那段共同的青春被短暂地点亮了一下。',
            effects: [{ stats: { network: 3, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '把对比欲收回来，整理自己的近况',
        outcomes: [
          {
            weight: 1,
            text: '你没有继续刷下去，而是把这一年的工作、存款和想做的事列了一遍。列完发现自己也不是原地踏步，只是自己的进度条没有别人朋友圈那么会打光。',
            effects: [{ stats: { knowledge: 2, mindset: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_room_rent',
    pools: ['random'],
    category: 'money',
    title: '房租又涨了',
    text: '房东发来消息：下个租期每月涨三百。你打开租房软件看了一圈，发现不是房东变坏了，是整座城市都在涨价。',
    trigger: { all: [{ year: { from: 2018 } }, working, { not: { flag: 'has_house' } }] },
    choices: [
      {
        id: 'a',
        text: '搬远一点，省钱',
        outcomes: [
          {
            weight: 1,
            text: '你搬到了地铁终点站外两站公交的地方。房租降了，通勤变长了。每天早上挤上车时，你都觉得自己像被城市吞进去的一粒米。',
            effects: [{ stats: { money: 6000, mindset: -5, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '咬牙续租，少折腾',
        outcomes: [
          {
            weight: 1,
            text: '你续了租。熟悉的楼下早餐店和十分钟通勤，突然都变成了要花钱买的奢侈品。',
            effects: [
              { moneyCost: { rate: 0.08, max: 3600, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 2 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_parent_checkup',
    pools: ['random'],
    category: 'family',
    title: '家里的体检报告',
    text: '家里说体检有个指标不太好，妈妈把报告拍得歪歪斜斜发过来，还补了一句“医生说没大事”。你放大看了半天，发现最刺眼的不是指标，是爸妈开始学会把坏消息说得很轻。',
    trigger: { all: [{ year: { from: 2021 } }, { not: { flag: 'parent_ill' } }] },
    choices: [
      {
        id: 'a',
        text: '周末回家，陪他们复查一次',
        outcomes: [
          {
            weight: 1,
            text: '你陪他们去社区医院复查，又挂了一个普通门诊。医生说先观察，按时吃药，三个月后再看。不是住院，也不是手术，但你第一次认真记下了他们的用药时间。',
            effects: [
              { moneyCost: { rate: 0.06, max: 1500, roundTo: 100, reason: 'medical' } },
              { stats: { mindset: 1, knowledge: 1 } },
              { setFlag: 'parent_checkup_seen' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先把报告整理清楚，约好复查时间',
        outcomes: [
          {
            weight: 1,
            text: '你让妈妈重新拍清楚报告，把指标逐项搜了一遍，又帮他们约好复查。电话挂断后，你在日历里设了提醒。屏幕能传消息，传不了陪伴，但至少这一次你没有把担心只留给他们。',
            effects: [
              { moneyCost: { rate: 0.05, max: 1000, roundTo: 100, reason: 'medical' } },
              { stats: { knowledge: 2, mindset: -1 } },
              { setFlag: 'parent_checkup_seen' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_small_trip',
    pools: ['random'],
    weight: 0.5,
    category: 'mindset',
    title: '短途旅行',
    text: '连续忙了很久后，你突然想离开这座城市两天。不是去看什么大风景，只是想让手机信号和工作消息都慢一点。',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '买票，周末就走',
        outcomes: [
          {
            weight: 2,
            text: '你坐在陌生城市的小店里吃面，窗外下着雨。没有任何问题被解决，但你短暂地想起自己不只是一个岗位或一种身份。',
            effects: [
              { moneyCost: { rate: 0.07, max: 2500, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 8, health: 2 } },
            ],
          },
          {
            weight: 1,
            text: '你选的正是全网都在推的“小众宝藏城市”。排队两小时的面馆、举着手机的人潮、比工位还密集的日程——周日深夜到家，你瘫在床上想：下次还是在家躺着吧。',
            effects: [
              { moneyCost: { rate: 0.08, max: 3000, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: -2 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '要什么陌生城市,买张回家的票',
        visibleIf: { flag: 'trait_homebody' },
        outcomes: [
          {
            weight: 1,
            text: '周五晚上到家,周日下午返程。四十多个小时里你没看攻略、没打卡任何景点,就是睡自己的旧床、吃妈妈做的菜、陪爸爸下了两盘棋。回程车上你想:别人的诗和远方在路上,你的在户口本上。',
            effects: [
              { moneyCost: { rate: 0.05, max: 1500, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 9, health: 2 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '算了，以后再说',
        outcomes: [
          {
            weight: 1,
            text: '“以后再说”是成年人最常用的书签。你把攻略收藏起来，然后继续处理未读消息。',
            effects: [{ stats: { mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_side_hustle',
    pools: ['random'],
    weight: 0.5,
    category: 'money',
    title: '副业诱惑',
    text: '朋友拉你进了一个副业群：写稿、剪视频、带货、知识付费。群公告写着“下班后两小时，改变人生”。',
    trigger: { all: [{ year: { from: 2020 } }, working] },
    choices: [
      {
        id: 'a',
        text: '试试，反正晚上也刷手机',
        outcomes: [
          {
            weight: 1,
            text: '你忙了一个月，赚了几百块，也学会了给标题加情绪词。改变人生没有发生，改变作息倒是发生了。',
            effects: [{ stats: { money: 1200, knowledge: 2, mindset: -3, health: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不碰，先睡够觉',
        outcomes: [
          {
            weight: 1,
            text: '你退出了群。那晚你十一点就睡了，醒来时竟然有一种奢侈的清醒。',
            effects: [{ stats: { mindset: 4, health: 3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '报一个小班训练营，用交作业逼自己入门',
        outcomes: [
          {
            weight: 1,
            text: '课不算神奇，但作业是真的。你按要求剪了三条视频、改了五版报价单，最后发现自己能做，但并不喜欢每天晚上继续交付。学费有点肉疼，好在买到的是边界感，不是幻想。',
            effects: [
              { moneyCost: { rate: 0.1, max: 3000, roundTo: 100, reason: 'other' } },
              { stats: { knowledge: 3, mindset: -2, health: -3 } },
            ],
          },
          {
            weight: 1,
            text: '老师没有承诺暴富，只逼你每周交作品。三个月后，你靠零星接单赚回了学费，还留下几个能继续复用的模板。副业没有改变人生，但让你多了一条能在需要时打开的路。',
            effects: [{ stats: { money: 6000, knowledge: 5, mindset: 1, health: -4 } }],
          },
        ],
      },
      {
        id: 'd',
        text: '一次接三个单，把晚上全排满',
        visibleIf: { flag: 'trait_grinder' },
        outcomes: [
          {
            weight: 2,
            text: '写稿、剪视频、做课件，你把晚上八点到凌晨一点切成了三段。月底一算，副业收入快赶上半个月工资。只是镜子里的黑眼圈提醒你：这钱是从身体那边挪过来的。',
            effects: [{ stats: { money: 8000, knowledge: 3, mindset: -3, health: -7 } }],
          },
          {
            weight: 1,
            text: '三个单子撞了期，你连续熬了四个通宵，交付质量全线下滑，甲方拒付了一单。你第一次发现，卷也是有产能上限的。',
            effects: [{ stats: { money: 2000, mindset: -6, health: -8 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_wedding_invite',
    pools: ['random'],
    category: 'relationship',
    title: '婚礼请柬',
    text: '大学同学发来电子请柬。你点开音乐，看见两个人在海边笑得很好看。红包金额输入框像一道现实题。',
    trigger: { year: { from: 2022 } },
    choices: [
      {
        id: 'a',
        text: '去现场，见见老朋友',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'dorm_bond' },
            text: '敬酒环节，新郎特意走到你这桌：“这是当年天天带我开黑的兄弟。”你们把大学的梗一个个翻出来，笑到隔壁桌回头。散场后你在路边站了一会儿，觉得那几年没白过。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2000, roundTo: 100, reason: 'family' } },
              { stats: { network: 6, mindset: 5 } },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'dorm_bond' } },
            text: '婚礼上你们聊起宿舍和论文，笑得像当年一样。只是散场后各自打车回家，没人再说“晚上开黑”。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2000, roundTo: 100, reason: 'family' } },
              { stats: { network: 4, mindset: 3 } },
            ],
          },
          {
            weight: 1,
            text: '你被安排在“同学散客桌”，一桌九个人，你只认识新郎。从“在哪儿高就”聊到“有对象没”，你笑着接了一下午招，红包还随了两千。回程的高铁上你想：有些婚礼是去见朋友的，有些只是去证明你来过。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2000, roundTo: 100, reason: 'family' } },
              { stats: { network: 1, mindset: -3 } },
            ],
          },
        ],
      },
      {
        id: 'c',
        text: '提前一天到,主动请缨当婚礼总调度',
        visibleIf: { flag: 'trait_social' },
        outcomes: [
          {
            weight: 2,
            text: '接亲路线、敬酒顺序、堵门红包、醉倒宾客的打车安排——你把一场婚礼调度得像一场发布会。新人敬酒到你这桌时,新娘说:“今天最该被敬的是你。”那天你的通讯录多了十几个人,都是在混乱现场记住你的。社牛的婚礼没有散客桌。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2000, roundTo: 100, reason: 'family' } },
              { stats: { network: 8, mindset: 4, health: -3 } },
            ],
          },
          {
            weight: 1,
            text: '你调度得太投入,一整天没吃上一口热菜,司仪的活儿也顺手干了一半。晚上复盘,你发现自己全程没跟新郎说上一句超过十秒的话——你参加了婚礼的每个环节,除了“老朋友叙旧”这一项。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2000, roundTo: 100, reason: 'family' } },
              { stats: { network: 4, mindset: -2, health: -3 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '转红包，人不到',
        outcomes: [
          {
            weight: 1,
            text: '你发了祝福，对方回了谢谢。关系没有变坏，只是又往通讯录深处沉了一点。',
            effects: [
              { moneyCost: { rate: 0.03, max: 800, roundTo: 100, reason: 'family' } },
              { stats: { mindset: -1 } },
            ],
          },
        ],
      },
      {
        id: 'd',
        text: '提前到场帮忙，红包按关系多包一点',
        outcomes: [
          {
            weight: 1,
            text: '你提前一天到，帮着接人、搬酒、核对座位表。红包不算小，但真正让对方记住的不是金额，是忙乱时你在旁边。散场后新郎拍了拍你的肩，说下次来你那座城市一定约饭。',
            effects: [
              { moneyCost: { rate: 0.07, max: 3000, roundTo: 100, reason: 'family' } },
              { stats: { network: 5, mindset: 3, health: -2 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_gym_card',
    pools: ['random'],
    weight: 0.5,
    category: 'health',
    title: '年卡',
    text: '公司楼下的健身房在搞活动，销售小哥拦住你：“哥，办年卡吧，平均一天才六块钱，一杯奶茶都不到。”你捏了捏加班攒出来的肚子。',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '办！这次一定坚持',
        outcomes: [
          {
            weight: 2,
            text: '你去了七次：前四次拍了照，后三次只用了淋浴。年底销售问你续不续卡，你说考虑一下——考虑的过程持续到了健身房倒闭。',
            effects: [
              { moneyCost: { rate: 0.06, max: 2000, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: -2, health: 1 } },
            ],
          },
          {
            weight: 1,
            text: '出乎所有人意料，你坚持下来了。一年后你在工位抽屉里放的不再是护肝片，而是蛋白粉。体检报告第一次没有上箭头，你把它拍照发了朋友圈。',
            effects: [
              { moneyCost: { rate: 0.06, max: 2000, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 6, health: 12 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '不办，跑步不要钱',
        outcomes: [
          {
            weight: 1,
            text: '你说小区里跑跑就行。当然，“小区里跑跑”最终也停留在了口头。但至少，你省下了两千块——这是这个决定里唯一兑现的部分。',
            effects: [{ stats: { mindset: 1, health: -2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '年卡再加一万八私教包，一步到位',
        outcomes: [
          {
            weight: 2,
            text: '私教课上了六节，教练离职了；转来的新教练上了两节，门店“升级改造”了。会员群里全是要说法的人，说法最后浓缩成公告栏一张 A4 纸。两万块买来的教训贴在你的记账本首页：预付费的尽头，是老板的下一家店。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.25, max: 20000, roundTo: 1000, reason: 'scam' } },
              { stats: { mindset: -8, health: 2 } },
            ],
          },
          {
            weight: 1,
            text: '你运气不错，碰上一个真负责的教练。一年后你的体测数据全面翻新，冬天没感冒过一次，连走路的姿态都变了。两万块花得肉疼，但身体给出的回报是复利——这大概是你今年唯一没有暴雷的“高收益理财”。',
            outcomeTag: 'success',
            effects: [
              { moneyCost: { rate: 0.2, max: 20000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: 8, health: 16 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_classmates_group',
    pools: ['random'],
    category: 'friendship',
    title: '十年群聊',
    text: '大学班级群突然热闹起来——毕业快十年了，有人提议聚一次。接龙名单慢慢变长，你看到了很多熟悉又陌生的名字，包括那个你以为这辈子不会再打交道的人。',
    trigger: { year: { from: 2024 } },
    choices: [
      {
        id: 'a',
        text: '报名，去看看大家都活成了什么样',
        outcomes: [
          {
            weight: 2,
            text: '聚会上没有想象中的攀比，大家聊的都是孩子、房贷和体检。散场时班长说“十年后再聚”，所有人都笑着答应，所有人都知道很难。但今晚很好，今晚就够了。',
            effects: [
              { moneyCost: { rate: 0.04, max: 1000, roundTo: 100, reason: 'daily' } },
              { stats: { network: 5, mindset: 4 } },
            ],
          },
          {
            weight: 1,
            text: '饭吃到一半，有人开始讲保险，有人扫码拉群卖酒，还有人举着手机直播“十年重聚感动瞬间”。你和当年的同桌对视一眼，在彼此眼里看到了同一句话：再也不来了。',
            effects: [
              { moneyCost: { rate: 0.04, max: 1000, roundTo: 100, reason: 'daily' } },
              { stats: { network: 1, mindset: -3 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '潜水，看他们发照片就好',
        outcomes: [
          {
            weight: 1,
            text: '聚会那晚你刷着群里的合影，一个个认过去。有人胖了，有人白了头发，有人笑得还和军训时一样。你点了个赞，忽然有点后悔没去。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_library_night',
    pools: ['random'],
    weight: 0.7,
    category: 'campus',
    title: '图书馆闭馆铃',
    text: '晚上十点，图书馆开始放闭馆音乐。你抬头看见窗外的路灯，桌上摊着没看完的书、凉掉的奶茶和一张写满待办的便利贴。',
    trigger: { year: { from: 2014, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '再学半小时，把今天收住',
        outcomes: [
          {
            weight: 1,
            text: '你没有突然开窍，只是把最后两页笔记补完了。走出图书馆时风有点凉，但你心里很稳：有些改变不是顿悟，是每天少欠一点账。',
            effects: [{ stats: { knowledge: 4, mindset: 2, health: -1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '合上书，去操场走两圈',
        outcomes: [
          {
            weight: 1,
            text: '你绕着操场走了三圈，听见有人练歌，有人背单词，有人打电话吵架。大学忽然从成绩单里退出来，变成了很具体的一晚风。',
            effects: [{ stats: { mindset: 4, health: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_group_project',
    pools: ['random'],
    weight: 0.7,
    category: 'campus',
    title: '小组作业',
    text: '课程群里安静了三天，汇报前一晚突然所有人都活了。PPT、数据、排版、上台发言，每一项都像在问：谁来兜底？',
    trigger: { year: { from: 2014, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '自己多做一点，保证能交',
        outcomes: [
          {
            weight: 1,
            text: '你熬到凌晨两点，把缺的部分补齐。第二天展示顺利通过，老师夸了你们组。你笑着点头，心里默默把“们”字删掉。',
            effects: [{ stats: { knowledge: 3, mindset: -3, health: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '把任务拆清楚，逼大家认领',
        outcomes: [
          {
            weight: 2,
            text: '你把任务、截止时间和负责人列成表。有人不情愿，但最后都交了。汇报不算惊艳，却第一次让你明白：合作不是等别人自觉，是把模糊变成具体。',
            effects: [{ stats: { knowledge: 2, network: 3, mindset: 1 } }],
          },
          {
            weight: 1,
            text: '你拆得很清楚，大家答应得也很快，然后继续消失。最后你还是补了大半，只是这次多收获了一份对人性的课程学分。',
            effects: [{ stats: { knowledge: 2, mindset: -4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_second_hand_phone',
    pools: ['random'],
    weight: 0.6,
    category: 'money',
    title: '换手机',
    text: '手机电池一天三充，屏幕边缘也开始失灵。你打开电商软件，旗舰机、二手机、分期免息三个选项一起盯着你。',
    contextLines: [
      { condition: { flag: 'family_biz_mobile_seed' }, text: '你想起2014年替家里把第一批商品搬进手机时，用的也是一台边角磨花的旧机器；它不体面，却真的打开过一扇门。' },
      { condition: { flag: 'p2p_burned' }, text: '“分期免息”四个字让你停了一秒。经历过那次暴雷后，所有轻松付款的承诺听起来都多了一层回声。' },
      { condition: { flag: 'dodged_p2p' }, text: '你还记得当年关掉P2P页面时那一下克制；这次只是台手机，但“先算清楚”已经成了习惯。' },
      { condition: { flag: 'stock_lesson' }, text: '2015年你第一次学会，账面上涨不等于花得起。如今面对“月供只要几百”，你先点开的不是商品详情，而是计算器。' },
    ],
    trigger: { year: { from: 2015 } },
    choices: [
      {
        id: 'a',
        text: '买新款，生产力投资',
        outcomes: [
          {
            weight: 1,
            text: '新手机很流畅，拍照也好看。只是第一期账单来的时候，你突然发现“生产力”这个词有时只是欲望穿上的正装。',
            effects: [
              { moneyCost: { rate: 0.08, max: 6000, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 3 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '淘一台二手的先用',
        outcomes: [
          {
            weight: 2,
            text: '你挑了半天，买到一台成色不错的二手机。它没有带来新生活，但让旧生活继续跑得很顺。',
            effects: [
              { moneyCost: { rate: 0.04, max: 2200, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 1, knowledge: 1 } },
            ],
          },
          {
            weight: 1,
            text: '卖家说“女生自用，几乎全新”。你收到后发现电池健康只有百分之七十六。人生第一次二手交易课，学费不算太贵。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2500, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: -3, knowledge: 2 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_first_desk',
    pools: ['random'],
    weight: 2,
    category: 'career',
    title: '第一张工位',
    text: '你坐到自己的工位前，显示器还贴着资产编号，抽屉里有上一任留下的便签纸。办公软件弹出第一条消息：“欢迎加入项目群。”',
    trigger: { all: [{ year: { from: 2018, to: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '主动问清楚项目和流程',
        outcomes: [
          {
            weight: 1,
            text: '你花了两天把文档、群聊和人名对上号。没有人正式教你，但你很快知道谁能拍板、谁懂细节、谁只是喜欢发问号。',
            effects: [{ stats: { knowledge: 3, network: 2, mindset: 1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先观察，少说少错',
        outcomes: [
          {
            weight: 1,
            text: '你安静地坐在角落，记下所有缩写和黑话。没人为难你，也没人真正记住你。新人的安全感，有时就是一点点透明。',
            effects: [{ stats: { knowledge: 1, mindset: 2, network: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_commute_line',
    pools: ['random'],
    weight: 0.6,
    category: 'health',
    title: '通勤路线',
    text: '早高峰的地铁口排起长队，导航推荐了三条路线：最快的要挤，舒服的要贵，便宜的要早起。',
    trigger: { all: [{ year: { from: 2018 } }, working] },
    choices: [
      {
        id: 'a',
        text: '选择最快路线，时间最贵',
        outcomes: [
          {
            weight: 1,
            text: '你每天准点被人潮推进车厢，也准点抵达工位。时间省下来了，只是肩颈和耐心一点点交了通行费。',
            effects: [{ stats: { knowledge: 1, mindset: -2, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '多花点钱，换一段清净',
        outcomes: [
          {
            weight: 1,
            text: '你改坐了一段城际或打车接驳，路上终于能看书、听播客、发呆。钱包薄了一点，但早晨不再像战斗准备。',
            effects: [
              { moneyCost: { rate: 0.05, max: 2400, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 4, health: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_manager_one_on_one',
    pools: ['random'],
    weight: 0.6,
    category: 'career',
    title: '一对一谈话',
    text: '领导把你叫进小会议室，说“随便聊聊”。桌上的水还没开封，你已经在脑子里过了一遍最近所有可能出错的事。',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '只汇报进度，不暴露焦虑',
        outcomes: [
          {
            weight: 1,
            text: '你把项目进度讲得很稳，问题都包装成“风险已识别”。领导点点头，说继续保持。你走出会议室，才发现手心全是汗。',
            effects: [{ stats: { mindset: -1, network: 1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '顺便要资源和反馈',
        outcomes: [
          {
            weight: 2,
            text: '你把卡点摊开讲，也问了下一阶段的期待。领导没有立刻解决所有问题，但给你指了两个能帮忙的人。职场里的成熟，有时是敢把困难说成需求。',
            effects: [{ stats: { knowledge: 2, network: 3, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '你说完需求，领导沉默几秒：“这些你先自己想办法。”话不好听，但边界很清楚。你少了一点幻想，多了一点计划。',
            effects: [{ stats: { knowledge: 2, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_app_notifications',
    pools: ['random'],
    weight: 0.6,
    category: 'mindset',
    title: '红点和推送',
    text: '一天结束，你发现手机里还有几十个红点：新闻、短视频、购物券、工作群、理财收益提醒。每一个都说自己很重要。',
    trigger: { year: { from: 2019 } },
    choices: [
      {
        id: 'a',
        text: '清一遍消息再睡',
        outcomes: [
          {
            weight: 1,
            text: '你本来只想清红点，结果顺手刷了半小时。最后屏幕干净了，脑子更吵了。',
            effects: [{ stats: { mindset: -3, health: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '关掉一批通知',
        outcomes: [
          {
            weight: 1,
            text: '你把不必要的推送关掉，桌面突然安静了很多。世界没有因此错过你，你也没有因此错过世界。',
            effects: [{ stats: { mindset: 5, health: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_online_course',
    pools: ['random'],
    weight: 0.6,
    category: 'career',
    title: '收藏夹里的课程',
    text: '你收藏夹里躺着十几门课：数据分析、英语口语、项目管理、AI 入门。每一门都像一扇门，只是门口堆满了“以后再学”。',
    trigger: { all: [{ year: { from: 2020 } }, working] },
    choices: [
      {
        id: 'a',
        text: '买一门系统学完',
        outcomes: [
          {
            weight: 2,
            text: '你每周固定两晚学习，进度不快，但真的学完了。证书没有改变命运，改变的是你对“我还能学新东西”的判断。',
            effects: [
              { moneyCost: { rate: 0.04, max: 1800, roundTo: 100, reason: 'daily' } },
              { stats: { knowledge: 6, mindset: 3, health: -2 } },
            ],
          },
          {
            weight: 1,
            text: '你买课后的三天热情高涨，第四天开始加班，第十天只剩自动续费提醒。收藏夹没有少，账单多了一条。',
            effects: [
              { moneyCost: { rate: 0.04, max: 1800, roundTo: 100, reason: 'daily' } },
              { stats: { knowledge: 1, mindset: -2 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先找免费资料试水',
        outcomes: [
          {
            weight: 1,
            text: '你翻了公开课和文档，发现入门没有想象中神秘。省下的钱不多，但省下了“买了就等于学了”的幻觉。',
            effects: [{ stats: { knowledge: 3, mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_neighbor_noise',
    pools: ['random'],
    weight: 0.5,
    category: 'mindset',
    title: '楼上的脚步声',
    text: '晚上十一点半，楼上传来拖椅子和跑跳声。你盯着天花板，感觉每一声都踩在明天的精神状态上。',
    trigger: { all: [{ year: { from: 2018 } }, working, { not: { flag: 'has_house' } }] },
    choices: [
      {
        id: 'a',
        text: '上楼沟通一次',
        outcomes: [
          {
            weight: 2,
            text: '你尽量客气地说明情况。对方有点尴尬，之后确实安静了几晚。城市里的体面，有时靠一次敲门维持。',
            effects: [{ stats: { mindset: 3, network: 1 } }],
          },
          {
            weight: 1,
            text: '对方说“我们也没办法，小孩还小”。你带着一肚子火回屋，发现冲突没有解决，只是有了具体对象。',
            effects: [{ stats: { mindset: -4, health: -1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '买耳塞，忍到搬家',
        outcomes: [
          {
            weight: 1,
            text: '你买了耳塞和白噪音机器，生活质量有所改善。不是所有问题都值得正面硬刚，有些只是提醒你下一次租房要看顶楼。',
            effects: [
              { moneyCost: { rate: 0.02, max: 600, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 1, health: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_pet_video',
    pools: ['random'],
    weight: 0.5,
    category: 'mindset',
    title: '云养宠物',
    text: '你连续刷到好几条宠物视频。评论区都在说“下班回家有它等着，什么都值了”。你看了看自己的出租屋和日程表。',
    trigger: { all: [{ year: { from: 2020 } }, working] },
    choices: [
      {
        id: 'a',
        text: '先云养，别冲动',
        outcomes: [
          {
            weight: 1,
            text: '你关注了几个博主，把想养宠物的冲动留在屏幕里。每天睡前看十分钟，像给心情贴了一片创可贴。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '认真算一笔养宠成本',
        outcomes: [
          {
            weight: 1,
            text: '你把疫苗、粮、绝育、看病、寄养全列出来，表格越算越冷静。喜欢是真的，暂时不养也是真的负责。',
            effects: [{ stats: { knowledge: 2, mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_parent_smartphone',
    pools: ['random'],
    weight: 0.5,
    category: 'family',
    title: '爸妈的新手机',
    text: '家里打来视频电话，说新手机总弹广告，字也太小。镜头晃来晃去，你看到他们把说明书摊在饭桌上。',
    trigger: { year: { from: 2020 } },
    choices: [
      {
        id: 'a',
        text: '远程一步步教',
        outcomes: [
          {
            weight: 1,
            text: '你花了四十分钟教他们关通知、调字体、删清理软件。过程很慢，但电话最后妈妈说：“现在看得清楚多了。”你忽然觉得这比很多工作反馈都具体。',
            effects: [{ stats: { mindset: 4, network: 1 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '直接买一台更省心的',
        outcomes: [
          {
            weight: 1,
            text: '你下单了一台屏幕大、系统简单的手机。钱花出去了，问题少了一半。另一半还是要靠每次耐心接电话。',
            effects: [
              { moneyCost: { rate: 0.06, max: 3000, roundTo: 100, reason: 'family' } },
              { stats: { mindset: 2 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_tax_refund',
    pools: ['random'],
    weight: 0.5,
    category: 'money',
    title: '个税年度汇算',
    text: '同事在群里说个税 App 可以退钱。你点进去，专项附加扣除、奖金计税方式、补税退税几个词排成一张成年人试卷。',
    trigger: { all: [{ year: { from: 2021 } }, working] },
    choices: [
      {
        id: 'a',
        text: '认真填完',
        outcomes: [
          {
            weight: 2,
            text: '你核对租房、赡养、继续教育等信息，最后退了几百到几千不等。钱不算巨款，但像从系统缝隙里捡回一点生活费。',
            effects: [{ stats: { money: 1800, knowledge: 2, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '你填完才发现需要补税。虽然不多，但“补”这个字足够让一天的心情变钝。',
            effects: [
              { moneyCost: { rate: 0.03, max: 1200, roundTo: 100, reason: 'other' } },
              { stats: { knowledge: 2, mindset: -2 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '太麻烦，先放着',
        outcomes: [
          {
            weight: 1,
            text: '你把 App 关掉，告诉自己周末再看。周末当然也有别的事。成年人的很多钱不是亏掉的，是嫌麻烦漏掉的。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_ai_tool_trial',
    pools: ['random'],
    weight: 0.6,
    category: 'career',
    title: 'AI 工具试用',
    text: '同事开始用 AI 写周报、做表格、改邮件。你看着屏幕上几秒生成的文字，第一次觉得“工具”这个词带着一点压迫感。',
    trigger: { all: [{ year: { from: 2023 } }, working] },
    choices: [
      {
        id: 'a',
        text: '把它当新工具学',
        outcomes: [
          {
            weight: 1,
            text: '你试着让它改提纲、整理会议纪要、生成表格公式。它会胡说，也会省时间。你学到的第一课是：别迷信，也别装没看见。',
            effects: [{ stats: { knowledge: 5, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先观望，别被风口牵着走',
        outcomes: [
          {
            weight: 1,
            text: '你没有立刻注册一堆账号。几个月后，工具还在迭代，焦虑也还在迭代。观望没有错，只是不能一直把观望当判断。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
];
