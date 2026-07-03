import type { GameEvent } from '@life-sim/core';

export const collegeEvents: GameEvent[] = [
  {
    id: 'ev_npc_roommate_startup_pitch',
    pools: [],
    category: 'npc',
    title: '室友的创业计划',
    text: '2015年春天,室友抱着一摞商业计划书回到宿舍。他说校园跑腿是下一个风口,学校这么大,外卖还没那么成熟,"我们先占住这个入口。"他把你拉到阳台,压低声音问:"一起干不?"',
    choices: [
      {
        id: 'a',
        text: '投点钱和时间,跟他试试',
        outcomes: [
          {
            weight: 1,
            text: '你们印传单、拉群、晚上骑车送奶茶。赚得不多,但第一次有人叫你"创始团队"。你知道这词有点虚,可听着还是热。',
            effects: [
              { stats: { money: -1500, network: 8, mindset: 5, knowledge: -3 } },
              { npcFavor: 'roommate', delta: 18 },
              { npcStage: 'roommate', stage: 'cofounder' },
              { setFlag: 'roommate_startup_joined' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '帮他出主意,但不入伙',
        outcomes: [
          {
            weight: 1,
            text: '你陪他改了两版 PPT,但没有把奖学金投进去。他说理解,只是后来开会时不会每次都叫你。人和人的分岔,有时就是从"我先不参与"开始的。',
            effects: [
              { stats: { network: 3, mindset: -1 } },
              { npcFavor: 'roommate', delta: 5 },
              { npcStage: 'roommate', stage: 'observer' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_roommate_startup_reality',
    pools: [],
    category: 'npc',
    title: '项目黄了以后',
    text: '两年过去,校园跑腿群还在,但单量被外卖平台和校内新团队分走了。室友把账本摊在桌上,笑着说:"创业嘛,哪有不交学费的。"他说得轻松,手却一直在抠笔帽。',
    choices: [
      {
        id: 'a',
        text: '陪他吃顿烧烤,别急着讲道理',
        outcomes: [
          {
            weight: 1,
            text: '那晚你们没复盘商业模式,只聊了很多废话。回宿舍路上他突然说:"还好当时有人陪我疯过。"你没接话,只是把账单结了。',
            effects: [
              { stats: { money: -200, mindset: 4, network: 4 } },
              { npcFavor: 'roommate', delta: 15 },
              { npcStage: 'roommate', stage: 'close_friend' },
              { setFlag: 'roommate_close_friend' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '认真帮他复盘,下次别这么冲动',
        outcomes: [
          {
            weight: 1,
            text: '你说了很多正确的话:现金流、获客成本、平台壁垒。他点头,也沉默。后来你发现,人在难过的时候,并不总是想听正确答案。',
            effects: [
              { stats: { knowledge: 3, network: -2 } },
              { npcFavor: 'roommate', delta: -8 },
              { npcStage: 'roommate', stage: 'distant' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_gaming',
    pools: ['college'],
    category: 'campus',
    title: '室友的开黑邀请',
    text: '晚上十点,宿舍里此起彼伏的键盘声。室友摘下耳机喊你:"三缺一!就差你了!"你看了看桌上摊开的高数课本——明天有早课。',
    choices: [
      {
        id: 'a',
        text: '来都来了,上号',
        outcomes: [
          {
            weight: 1,
            text: '你们打到凌晨两点,赢了七把。第二天的高数课你睡得很沉,但兄弟情谊无价——至少这一刻你是这么觉得的。',
            effects: [{ stats: { mindset: 8, knowledge: -4 } }, { setFlag: 'dorm_bond' }],
          },
        ],
      },
      {
        id: 'b',
        text: '戴上耳机去图书馆',
        outcomes: [
          {
            weight: 1,
            text: '你在图书馆待到闭馆。走出来的时候,月光很好,朋友圈里室友晒出了"五杀"截图。你点了个赞,心里有点空,但笔记是实打实的。',
            effects: [{ stats: { knowledge: 6, mindset: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_scholarship',
    pools: ['college'],
    category: 'campus',
    title: '奖学金评选',
    text: '辅导员在群里发通知:年度奖学金申报开始,需要提交材料并参加答辩。你的绩点排名不上不下,拼一把也许有机会。',
    trigger: { stat: 'knowledge', op: '>=', value: 55 },
    choices: [
      {
        id: 'a',
        text: '认真准备,拼一把',
        outcomes: [
          {
            weight: 3,
            text: '答辩很顺利。名单公示那天,你反复刷新了十几次页面——你的名字在上面。奖学金五千块,你先给家里打了两千。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 5000, mindset: 5 } }],
          },
          {
            weight: 2,
            text: '你准备了两周,答辩时却被一个问题问住了。名单公示,没有你。你安慰自己"重在参与",但那天晚饭你没什么胃口。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '算了,不折腾',
        outcomes: [
          {
            weight: 1,
            text: '你把通知划走了。晚上照常打球、吃饭、刷剧。有些机会错过了不可惜——你是这么告诉自己的。',
            effects: [{ stats: { mindset: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_tutor',
    pools: ['college'],
    category: 'campus',
    title: '家教兼职',
    text: '学长转给你一个家教单:高二数学,一周三次,一次一百五。地方有点远,倒两趟公交。',
    choices: [
      {
        id: 'a',
        text: '接了,赚点生活费',
        outcomes: [
          {
            weight: 1,
            text: '一学期下来,你赚了三千块,也重新做了一遍高中数学。家长很满意,只是每次晚上九点半坐末班公交回学校的时候,你会有点想家。',
            effects: [{ stats: { money: 3000, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '太远了,不去',
        outcomes: [
          {
            weight: 1,
            text: '你婉拒了学长。那些晚上你用来跑步、看闲书、在天台吹风。钱没赚到,但日子是自己的。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_club_campaign',
    pools: ['college'],
    category: 'campus',
    title: '社团换届',
    text: '社团开始换届,学长问你要不要竞选部长。职位不大,事情不少,但能认识很多人。你看着报名表,想起高中时自己连班会发言都会紧张。',
    trigger: { year: { from: 2015, to: 2016 } },
    choices: [
      {
        id: 'a',
        text: '报名竞选',
        outcomes: [
          {
            weight: 1,
            text: '你磕磕绊绊讲完竞选词,竟然选上了。后来你学会了拉赞助、排活动、调解争吵。所谓人脉,最早可能就是从搬桌子开始的。',
            effects: [{ stats: { network: 8, mindset: 3, knowledge: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '继续当普通成员',
        outcomes: [
          {
            weight: 1,
            text: '你没有报名。活动照常参加,责任少很多。你开始明白,不是每个机会都必须抓住,有些自由也很珍贵。',
            effects: [{ stats: { mindset: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_major_doubt',
    pools: ['college'],
    category: 'campus',
    title: '专业课劝退',
    text: '一门专业课把全班打沉默了。老师在黑板上写满公式或概念,你在笔记本上写下三个字:"我是谁?"',
    choices: [
      {
        id: 'a',
        text: '硬啃,先把基础补上',
        outcomes: [
          {
            weight: 1,
            text: '你借了教材,刷了网课,把最难的几章啃到能讲给别人听。学习有时不是热爱,是把恐惧拆小。',
            effects: [{ stats: { knowledge: 8, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '战略放弃,保证不挂',
        outcomes: [
          {
            weight: 1,
            text: '你精准复习了老师画的重点,低空飘过。成绩不漂亮,但暑假很完整。',
            effects: [{ stats: { knowledge: 2, mindset: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_internship',
    pools: ['college'],
    category: 'career',
    title: '第一份实习',
    text: '大三暑假,你看到一条实习招聘。工资不高,通勤很远,但岗位名字看起来像一张通向社会的车票。',
    trigger: { year: { from: 2016, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '投简历,去试试',
        outcomes: [
          {
            weight: 1,
            text: '你第一次坐进写字楼工位,第一次发现 Excel 和邮件也能让人筋疲力尽。实习证明很薄,但它让简历不再空白。',
            effects: [{ stats: { money: 2500, network: 5, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '留校准备考试和项目',
        outcomes: [
          {
            weight: 1,
            text: '你没有去实习,把时间投给了课程项目和考试。别人开始讲职场黑话时,你还有点插不上嘴,但成绩单更稳了。',
            effects: [{ stats: { knowledge: 6, network: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_thesis',
    pools: ['college'],
    category: 'campus',
    title: '论文开题',
    text: '毕业论文开题会,老师说选题不要太大。你看着自己写下的题目,感觉它大到可以装下整个宇宙,也空到什么都没有。',
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '早点写,别拖到最后',
        outcomes: [
          {
            weight: 1,
            text: '你提前搭好框架,后面虽然也改到崩溃,但至少没有在查重前夜怀疑人生。',
            effects: [{ stats: { knowledge: 5, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先收藏资料,以后再写',
        outcomes: [
          {
            weight: 1,
            text: '你收藏了二十篇论文,真正打开的是最后三天。凌晨四点的文档光标,比辅导员还会催人。',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_roommate_farewell',
    pools: ['college'],
    category: 'friendship',
    title: '散伙饭',
    text: '毕业前,宿舍凑钱吃了顿散伙饭。大家说以后常联系,说到最后又都低头看手机。分别这件事,年轻时总以为可以用群聊解决。',
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '认真敬每个人一杯',
        outcomes: [
          {
            weight: 1,
            text: '你们喝得不多,话说了很多。那晚之后群里还是慢慢安静了,但你知道有些关系不是热闹才算存在。',
            effects: [{ stats: { network: 4, mindset: 4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '笑着糊弄过去',
        outcomes: [
          {
            weight: 1,
            text: '你讲了几个段子,把伤感压下去。回宿舍看到空了一半的床位,才发现离别没有被你糊弄过去。',
            effects: [{ stats: { mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_grinder_baoyan',
    pools: [],
    category: 'npc',
    title: '卷王同学的日程表',
    text: '你发现卷王同学的日程表精确到十五分钟:早读、实验、竞赛、论文、健身。他说自己准备保研,语气平静得像在说今天吃什么。',
    choices: [
      {
        id: 'a',
        text: '被刺激到,跟着卷一阵',
        outcomes: [
          {
            weight: 1,
            text: '你跟着早起了两周,痛苦是真的,效率也是真的。后来你没变成他,但至少知道自己不是完全没潜力。',
            effects: [
              { stats: { knowledge: 7, mindset: -4 } },
              { npcFavor: 'grinder', delta: 8 },
              { npcStage: 'grinder', stage: 'big_tech' },
              { setFlag: 'learned_from_grinder' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '佩服,但保持自己的节奏',
        outcomes: [
          {
            weight: 1,
            text: '你承认他很强,也承认自己不是那种人。比较没有消失,只是被你放到了一个不会每天刺痛自己的位置。',
            effects: [
              { stats: { mindset: 3 } },
              { npcFavor: 'grinder', delta: 2 },
              { npcStage: 'grinder', stage: 'big_tech' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_npc_hometown_spring_festival',
    pools: [],
    category: 'npc',
    title: '春节饭桌上的发小',
    text: '春节回家,县城发小骑电动车来接你。他说自己准备考本地事业单位,工资不高,但离家近。你们坐在烧烤摊前,谁也没觉得谁更正确。',
    choices: [
      {
        id: 'a',
        text: '认真听他说县城生活',
        outcomes: [
          {
            weight: 1,
            text: '他说哪里新开了商场,谁家孩子出生了,哪条路终于修好了。你突然意识到,你离开的地方也在继续长大。',
            effects: [
              { stats: { mindset: 3, network: 2 } },
              { npcFavor: 'hometown_friend', delta: 8 },
              { npcStage: 'hometown_friend', stage: 'civil_servant' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '聊大城市见闻',
        outcomes: [
          {
            weight: 1,
            text: '你讲地铁、讲实习、讲同学创业。他听得很认真,但你也听出一点距离。见过不同世界的人,有时会突然找不到共同语言。',
            effects: [
              { stats: { network: 1, mindset: -1 } },
              { npcFavor: 'hometown_friend', delta: -2 },
              { npcStage: 'hometown_friend', stage: 'civil_servant' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_confession',
    pools: [],
    category: 'love',
    title: '操场上的心动',
    text: '你在社团认识了一个人。你们一起值过班、赶过策划案、在操场散步聊到过熄灯。今晚 TA 发消息问你:"在干嘛?"你盯着屏幕,心跳有点快。',
    choices: [
      {
        id: 'a',
        text: '鼓起勇气,表白',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'mindset', op: '>=', value: 50 },
            text: 'TA 沉默了很久,然后回了一句:"我等你这句话很久了。"那天晚上你在操场走了十圈,每一圈都在笑。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10 } },
              { setFlag: 'in_love' },
              { npcFavor: 'first_love', delta: 25 },
              { npcStage: 'first_love', stage: 'together' },
            ],
          },
          {
            weight: 1,
            text: 'TA 回复:"你是个很好的人。"后面的话你没看完就锁了屏。那周你没去社团,点名表上第一次有了你的缺勤。',
            outcomeTag: 'failure',
            effects: [
              { stats: { mindset: -8 } },
              { npcFavor: 'first_love', delta: -8 },
              { npcStage: 'first_love', stage: 'missed' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '把心事写进日记',
        outcomes: [
          {
            weight: 1,
            text: '你回了个"没干嘛,准备睡了"。日记本里多了一页没有署名的心事。多年以后你会想:如果那晚说了,会怎样?',
            effects: [
              { stats: { mindset: 2 } },
              { npcStage: 'first_love', stage: 'missed' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_love_distance',
    pools: [],
    category: 'love',
    title: '异地的预兆',
    text: '毕业季越来越近,TA 打算回家乡省会发展,而你的计划在另一座城市。视频里你们都刻意不提这件事,直到 TA 先开了口:"我们……以后怎么办?"',
    choices: [
      {
        id: 'a',
        text: '"异地就异地,我们能撑过去"',
        outcomes: [
          {
            weight: 1,
            text: '你们约好每天视频、每月见一面。高铁票根在你抽屉里越攒越厚。累是真的累,但每次见面,又觉得都值。',
            effects: [
              { stats: { mindset: 4, knowledge: -3 } },
              { npcFavor: 'first_love', delta: 8 },
              { npcStage: 'first_love', stage: 'steady' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '沉默了很久,没有给出承诺',
        outcomes: [
          {
            weight: 1,
            text: '那通视频最后变成了长久的沉默。之后你们的聊天越来越短,最后停在一句"最近挺忙的"。有些关系不是断掉的,是慢慢淡掉的。',
            effects: [
              { stats: { mindset: -5 } },
              { setFlag: 'in_love', value: false },
              { npcFavor: 'first_love', delta: -12 },
              { npcStage: 'first_love', stage: 'separated' },
            ],
          },
        ],
      },
    ],
  },
];
