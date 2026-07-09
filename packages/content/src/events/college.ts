import type { GameEvent } from '@life-sim/core';

export const collegeEvents: GameEvent[] = [
  {
    id: 'ev_npc_roommate_startup_pitch',
    pools: [],
    category: 'npc',
    tier: 'major',
    title: '室友的创业计划',
    text: '2015年春天，“大众创业、万众创新”刚写进政府工作报告，学校的创业大赛海报贴满了公告栏。这天晚上，室友抱着一摞打印的商业计划书回到宿舍，头发乱糟糟的，眼睛却亮得吓人。他把计划书拍在你桌上：校园跑腿——代取快递、代买奶茶、代排队。“学校这么大，外卖还进不来宿舍楼，这就是空档！”他给你看他画的流程图、算的单量、甚至已经想好的名字。然后他把你拉到阳台，外面是四月的晚风和别的宿舍的游戏声。他压低声音，像在说一个只告诉你的秘密：“一起干不？我就问了你一个。”',
    choices: [
      {
        id: 'a',
        text: '投点钱和时间，跟他试试',
        outcomes: [
          {
            weight: 1,
            text: '你把半学期攒的生活费拍了出来，他激动得差点从阳台跳下去。接下来的几个月：你们熬夜印传单，在每栋宿舍楼下贴到被宿管追；拉了十几个接单群，你的头像挂着“客服 2 号”；晚高峰你骑着借来的电动车送奶茶，雨天单量翻倍，你在雨衣里一边骂一边笑。赚的钱刚够回本，但期末总结的时候，他在群里发：“感谢创始团队。”创始团队，一共三个人，车是借的，公章是刻章店最便宜的那种。你知道这词有点虚，可那年春天听着，是真的热。',
            effects: [
              { moneyCost: { rate: 0.08, max: 1500, roundTo: 100, reason: 'investment' } },
              { stats: { network: 8, mindset: 5, knowledge: -3 } },
              { npcFavor: 'roommate', delta: 18 },
              { npcStage: 'roommate', stage: 'cofounder' },
              { setFlag: 'roommate_startup_joined' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '帮他出主意，但不入伙',
        outcomes: [
          {
            weight: 1,
            text: '你没把生活费掏出来，但陪他把 PPT 改了两个通宵：逻辑理顺了，错别字挑干净了，连配色都换成了不那么土的蓝。他说理解，真的，家里给的钱是有数的，谁都一样。项目后来真做起来了一阵，接单群热热闹闹。只是他们开会的时候，不会每次都叫你了；庆功的烧烤局，你是从朋友圈知道的。没有人做错什么。只是人和人的分岔，有时就是从那句“我先不参与”开始的——当时听起来，它明明只是一个财务决定。',
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
    tier: 'major',
    title: '项目黄了以后',
    text: '两年过去，当年的风口变成了穿堂风。外卖平台把配送站直接开进了校门口，隔壁学院又冒出两个抄作业的跑腿团队，价格战打到一单赚三毛。接单群还在，但群公告已经两个月没更新了。这天晚上，室友把一个皱巴巴的账本摊在桌上——收入、支出、退给同学的押金，一笔一笔，字迹越到后面越潦草。“散伙了。”他说，然后笑了笑，“创业嘛，哪有不交学费的。”他说得很轻松，像在讲别人的事。只是你注意到，他的手一直在抠那个笔帽，抠开，按上，再抠开。',
    choices: [
      {
        id: 'a',
        text: '陪他吃顿烧烤，别急着讲道理',
        outcomes: [
          {
            weight: 1,
            text: '你合上他的账本，说：“走，烧烤。”那晚你们坐在校门口的塑料凳上，从大一军训的教官聊到食堂三楼的阿姨，从游戏版本聊到各自的家乡，唯独没聊商业模式。他喝得不多，话却很多。回宿舍的路上，他踢着一个空瓶子走了很远，忽然说：“其实我早知道成不了。就是……还好当时有人陪我疯过。”你没接话——有些话接了反而轻了。你只是在他去上厕所的时候，把账单结了。多年以后你们各自漂在不同的城市，他还是每年记得你的生日。',
            effects: [
              { moneyCost: { rate: 0.04, max: 200, roundTo: 100, reason: 'daily' } },
              { stats: { mindset: 4, network: 4 } },
              { npcFavor: 'roommate', delta: 15 },
              { npcStage: 'roommate', stage: 'close_friend' },
              { setFlag: 'roommate_close_friend' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '认真帮他复盘，下次别这么冲动',
        outcomes: [
          {
            weight: 1,
            text: '你觉得这是帮他的最好方式：趁记忆还热，把失败拆开看清楚。你讲现金流，讲获客成本，讲平台壁垒，讲“其实从第二个学期就该止损”。每一句都对，有几句甚至说到了他自己都没想明白的点上。他一直点头，点到后来就只剩点头了。账本被他慢慢收了回去，像收回去一部分自己。那学期剩下的日子，你们在宿舍客客气气，聊天停留在“帮我带份饭”的深度。后来你才慢慢懂：人在难过的时候，要的往往不是正确答案——正确答案他自己半夜早就算过一百遍了。',
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
    trigger: { year: { from: 2014, to: 2015 } },
    title: '室友的开黑邀请',
    text: '晚上十点，宿舍里此起彼伏的键盘声。室友摘下耳机喊你：“三缺一！就差你了！”你看了看桌上摊开的高数课本——明天有早课。',
    choices: [
      {
        id: 'a',
        text: '来都来了，上号',
        outcomes: [
          {
            weight: 1,
            text: '你们打到凌晨两点，赢了七把。第二天的高数课你睡得很沉，但兄弟情谊无价——至少这一刻你是这么觉得的。',
            effects: [{ stats: { mindset: 8, knowledge: -4, health: -2 } }, { setFlag: 'dorm_bond' }],
          },
        ],
      },
      {
        id: 'c',
        text: '上号，但说好赢一把就下，回来接着刷题',
        visibleIf: { flag: 'trait_grinder' },
        outcomes: [
          {
            weight: 2,
            text: '第一把就赢了，你说到做到，摘耳机下号。室友喊“再来一把”，你已经翻开了高数。凌晨十二点半，你合上笔记，游戏和绩点你都没丢——只是觉都少睡了。',
            effects: [{ stats: { knowledge: 3, mindset: 4, health: -3 } }, { setFlag: 'dorm_bond' }],
          },
          {
            weight: 1,
            text: '第一把输了。“输了这把怎么能走？”你也是这么觉得的。回过神来已经凌晨两点，课本停在翻开的那一页。卷王也是人，人就会上头。',
            effects: [{ stats: { mindset: 3, knowledge: -3, health: -3 } }, { setFlag: 'dorm_bond' }],
          },
        ],
      },
      {
        id: 'b',
        text: '戴上耳机去图书馆',
        outcomes: [
          {
            weight: 1,
            text: '你在图书馆待到闭馆。走出来的时候，月光很好，朋友圈里室友晒出了“五杀”截图。你点了个赞，心里有点空，但笔记是实打实的。',
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
    text: '辅导员在群里发通知：年度奖学金申报开始，需要提交材料并参加答辩。你的绩点排名不上不下，拼一把也许有机会。',
    trigger: { stat: 'knowledge', op: '>=', value: 55 },
    choices: [
      {
        id: 'a',
        text: '认真准备，拼一把',
        outcomes: [
          {
            weight: 3,
            text: '答辩很顺利。名单公示那天，你反复刷新了十几次页面——你的名字在上面。奖学金五千块，你先给家里打了两千。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 5000, mindset: 5, health: -2 } }],
          },
          {
            weight: 2,
            text: '你准备了两周，答辩时却被一个问题问住了。名单公示，没有你。你安慰自己“重在参与”，但那天晚饭你没什么胃口。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '算了，不折腾',
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
    trigger: { year: { from: 2014, to: 2016 } },
    title: '家教兼职',
    text: '学长转给你一个家教单：高二数学，一周三次，一次一百五。地方有点远，倒两趟公交。',
    choices: [
      {
        id: 'a',
        text: '接了，赚点生活费',
        outcomes: [
          {
            weight: 1,
            text: '一学期下来，你赚了三千块，也重新做了一遍高中数学。家长很满意，只是每次晚上九点半坐末班公交回学校的时候，你会有点想家。',
            effects: [{ stats: { money: 3000, mindset: -2, health: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '太远了，不去',
        outcomes: [
          {
            weight: 1,
            text: '你婉拒了学长。那些晚上你用来跑步、看闲书、在天台吹风。钱没赚到，但日子是自己的。',
            effects: [{ stats: { mindset: 1, health: 3 } }],
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
    text: '社团开始换届，学长问你要不要竞选部长。职位不大，事情不少，但能认识很多人。你看着报名表，想起高中时自己连班会发言都会紧张。',
    trigger: { year: { from: 2015, to: 2016 } },
    choices: [
      {
        id: 'a',
        text: '报名竞选',
        outcomes: [
          {
            weight: 2,
            text: '你磕磕绊绊讲完竞选词，竟然选上了。后来你学会了拉赞助、排活动、调解争吵。所谓人脉，最早可能就是从搬桌子开始的。',
            effects: [{ stats: { network: 8, mindset: 3, knowledge: -2 } }],
          },
          {
            weight: 1,
            text: '你选上了，然后迎新晚会音响出了事故，你作为负责人在群里道歉到半夜。那学期你学会的第一课不是领导力，是背锅时如何保持表情管理。',
            effects: [{ stats: { network: 4, mindset: -5, knowledge: -2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不背竞选词了，上台直接即兴发挥',
        visibleIf: { flag: 'trait_social' },
        outcomes: [
          {
            weight: 3,
            text: '你上台先讲了个自己的糗事，全场笑完，你顺势把想做的三件事讲得清清楚楚。票数出来，断层第一。学妹们说你“天生该吃这碗饭”，你心想：这碗饭我从小学班会吃到现在。',
            effects: [{ stats: { network: 10, mindset: 4, knowledge: -2 } }],
          },
          {
            weight: 1,
            text: '即兴发挥有个前提：现场得接得住。那天音响出问题，你的段子没人听清，气氛一度尴尬。你落选了，但散场时好几个人来加你微信——“你刚刚那个梗其实挺好笑的”。',
            effects: [{ stats: { network: 5, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '继续当普通成员',
        outcomes: [
          {
            weight: 1,
            text: '你没有报名。活动照常参加，责任少很多。你开始明白，不是每个机会都必须抓住，有些自由也很珍贵。',
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
    trigger: { year: { from: 2014, to: 2015 } },
    title: '专业课劝退',
    text: '一门专业课把全班打沉默了。老师在黑板上写满公式或概念，你在笔记本上写下三个字：“我是谁？”',
    choices: [
      {
        id: 'a',
        text: '硬啃，先把基础补上',
        outcomes: [
          {
            weight: 1,
            text: '你借了教材，刷了网课，把最难的几章啃到能讲给别人听。学习有时不是热爱，是把恐惧拆小。',
            effects: [{ stats: { knowledge: 8, mindset: -3, health: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '战略放弃，保证不挂',
        outcomes: [
          {
            weight: 1,
            text: '你精准复习了老师画的重点，低空飘过。成绩不漂亮，但暑假很完整。',
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
    text: '大三暑假，你看到一条实习招聘。工资不高，通勤很远，但岗位名字看起来像一张通向社会的车票。',
    trigger: { year: { from: 2016, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '投简历，去试试',
        outcomes: [
          {
            weight: 1,
            text: '你第一次坐进写字楼工位，第一次发现 Excel 和邮件也能让人筋疲力尽。实习证明很薄，但它让简历不再空白。',
            effects: [{ stats: { money: 2500, network: 5, mindset: -2, health: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '留校准备考试和项目',
        outcomes: [
          {
            weight: 1,
            text: '你没有去实习，把时间投给了课程项目和考试。别人开始讲职场黑话时，你还有点插不上嘴，但成绩单更稳了。',
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
    order: 5,
    title: '论文开题',
    text: '毕业论文开题会，老师说选题不要太大。你看着自己写下的题目，感觉它大到可以装下整个宇宙，也空到什么都没有。',
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '早点写，别拖到最后',
        outcomes: [
          {
            weight: 2,
            text: '你提前搭好框架，后面虽然也改到崩溃，但至少没有在查重前夜怀疑人生。',
            effects: [{ stats: { knowledge: 5, mindset: 2, health: -2 } }],
          },
          {
            weight: 1,
            text: '你写得最早，也被毙得最早。开题会上老师一句“选题太空”，两个月的框架推倒重来。好处是你还有时间；坏处是，你亲眼看着拖到最后的同学直接绕过了这一劫——他们的选题老师根本没来得及细看。',
            effects: [{ stats: { knowledge: 3, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先把文献囤着，想清楚再动笔',
        outcomes: [
          {
            weight: 2,
            text: '你收藏了二十篇论文，真正打开的是最后三天。凌晨四点的文档光标，比辅导员还会催人。',
            effects: [{ stats: { mindset: -4, health: -4 } }],
          },
          {
            weight: 1,
            text: '想得久，动笔就快。你在截止前两周一口气写完，思路反而比早早开题的同学更顺——当然，你没敢告诉任何人这套方法论，怕害了别人。',
            effects: [{ stats: { knowledge: 3, mindset: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_roommate_farewell',
    pools: ['work'],
    category: 'friendship',
    mandatory: true,
    order: -10,
    tier: 'major',
    title: '散伙饭',
    text: '2018年6月，答辩通过的红色横幅还挂在学院楼下，宿舍楼里已经到处是打包的胶带声。行李陆续寄走，床位一张张空出来，墙上的海报撕下来后留着四个胶印。走的前一晚，宿舍凑钱在校门口那家吃了四年的馆子订了个包间——老板认得你们，送了盘花生米，说“毕业快乐”。桌上，有人明天飞南方入职，有人下周去北京找房，有人回老家等编制考试，有人的去向还写在“再看看”里。大家举杯说“以后常联系”，说“每年聚一次”，说到后来声音低下去，一个个都低头看起了手机。其实没人有消息要回。分别这件事，二十二岁的人总以为，可以用一个永远不解散的群来解决。',
    trigger: { year: { from: 2018, to: 2018 } },
    choices: [
      {
        id: 'a',
        text: '认真敬每个人一杯',
        outcomes: [
          {
            weight: 1,
            text: '你站起来，给每个人单独敬了一杯，每一杯都配了一件只有你们知道的事：谁大一军训晕倒被谁背回来，谁失恋那晚全宿舍陪着在操场坐到两点，谁抢了四年热水器的第一个名额。讲到第三个人，包间里已经有人在低头抹眼睛，嘴里还硬撑着“讲快点，菜都凉了”。那晚酒喝得不多，话说得很多，散场时你们在校门口站了很久，谁都不先说“走了”。后来群里确实慢慢安静了，大家散在各自的城市和时区里。但你一直记得那晚——有些关系不是靠热闹活着的，它们只是安静地存在，像你手机里那个从不解散的群。',
            effects: [{ stats: { network: 4, mindset: 4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '用段子撑住气氛',
        outcomes: [
          {
            weight: 2,
            text: '气氛一旦往伤感的方向滑，你就赶紧讲个段子拽回来。四年攒下的梗够你讲一晚上：考前拜过的锦鲤、寝室夜谈会立过的 flag、那次集体睡过头的早八。大家笑得很配合，你也讲得很卖力，一顿饭就这么热热闹闹地糊弄了过去。深夜回到宿舍，推开门，一半的床位已经空了，床板露着，凉席卷在角落。你在自己的床沿坐了很久，忽然明白：段子挡得住那一顿饭，挡不住这一间屋子。离别没有被你糊弄过去，它只是很有耐心，等人群散了才来找你单独结账。',
            effects: [{ stats: { mindset: -2 } }],
          },
          {
            weight: 1,
            text: '你一晚上没让冷场超过十秒。散场时班长搂着你的脖子说：“幸好有你，不然今晚得哭成什么样。”多年后群里回忆起散伙饭，大家记得的不是眼泪，是那晚笑到拍桌子的样子——这也是一种收尾，不比眼泪差。',
            effects: [{ stats: { mindset: 3, network: 3 } }],
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
    text: '你发现卷王同学的日程表精确到十五分钟：早读、实验、竞赛、论文、健身。他说自己准备保研，语气平静得像在说今天吃什么。',
    choices: [
      {
        id: 'a',
        text: '被刺激到，跟着卷一阵',
        outcomes: [
          {
            weight: 1,
            text: '你跟着早起了两周，痛苦是真的，效率也是真的。后来你没变成他，但至少知道自己不是完全没潜力。',
            effects: [
              { stats: { knowledge: 7, mindset: -4, health: -2 } },
              { npcFavor: 'grinder', delta: 8 },
              { npcStage: 'grinder', stage: 'big_tech' },
              { setFlag: 'learned_from_grinder' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '佩服，但保持自己的节奏',
        outcomes: [
          {
            weight: 1,
            text: '你承认他很强，也承认自己不是那种人。比较没有消失，只是被你放到了一个不会每天刺痛自己的位置。',
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
    text: '春节回家，县城发小骑电动车来接你。他说自己准备考本地事业单位，工资不高，但离家近。你们坐在烧烤摊前，谁也没觉得谁更正确。',
    choices: [
      {
        id: 'a',
        text: '认真听他说县城生活',
        outcomes: [
          {
            weight: 1,
            text: '他说哪里新开了商场，谁家孩子出生了，哪条路终于修好了。你突然意识到，你离开的地方也在继续长大。',
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
            text: '你讲地铁、讲实习、讲同学创业。他听得很认真，但你也听出一点距离。见过不同世界的人，有时会突然找不到共同语言。',
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
    tier: 'major',
    title: '操场上的心动',
    text: '你在社团认识了一个人。你们一起值过班、赶过策划案、办完活动一起收过场，收到最后整栋楼只剩你们俩和一串没关的灯。{{ta}}笑起来的时候，你总是会忘记自己刚才要说什么。今晚十一点半，{{ta}}发来消息：“在干嘛？”后面跟着一句，“睡不着，操场走走？”你盯着屏幕看了很久。宿舍熄灯的铃声响了，你的心跳比铃声还吵。你知道，有些话如果今晚不说，可能就要在心里存很多年。',
    choices: [
      {
        id: 'a',
        text: '鼓起勇气，表白',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'mindset', op: '>=', value: 50 },
            text: '操场很暗，你们并排走着，你把准备了一路的话说得乱七八糟，重点大概是那句“我喜欢你，不是朋友的那种”。{{ta}}停下来，沉默了很久，久到你开始盘算怎么把话收回去。然后{{ta}}说：“我等你这句话，等了一个学期了。”那天晚上你们在操场走了十圈，路灯把两个影子拉得很长。回宿舍的路上你一个人笑出了声，被查寝的宿管阿姨看了一眼。你不在乎。十九岁的那个晚上，你觉得整个世界都在替你高兴。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10 } },
              { setFlag: 'in_love' },
              { npcFavor: 'first_love', delta: 25 },
              { npcStage: 'first_love', stage: 'together' },
              { schedule: { eventId: 'ev_love_winter', afterRounds: 0 } },
            ],
          },
          {
            weight: 1,
            text: '你说完了。风把操场边的梧桐吹得哗哗响，{{ta}}低着头踢了踢脚下的塑胶跑道，然后说：“你是个很好的人……”后面的话你其实没听清，也不需要听清了。你们又并排走了半圈，谁都没说话，像在给这段还没开始的关系送行。那周你没去社团，点名表上第一次有了你的缺勤。室友问你怎么了，你说没事，降温了，嗓子疼。有些疼确实说不清位置，只能随便指一个。',
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
        id: 'c',
        text: '下楼——那些没说出口的话，你其实都读懂了',
        visibleIf: { flag: 'trait_sensitive' },
        outcomes: [
          {
            weight: 3,
            text: '你注意过{{ta}}所有细微的时刻：值班表上悄悄换到和你同一天、消息回得越来越快、上次活动散场时那句没说完的“其实我……”。所以今晚你下了楼，走到第三圈，你说：“我们别绕圈子了，好不好？”{{ta}}愣了一下，然后笑了：“我以为你要装傻装到毕业。”操场的灯十二点准时熄了，黑暗里{{ta}}牵住了你的手。心思细的人错过很多睡眠，但今晚，没有错过这个。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10 } },
              { setFlag: 'in_love' },
              { npcFavor: 'first_love', delta: 25 },
              { npcStage: 'first_love', stage: 'together' },
              { schedule: { eventId: 'ev_love_winter', afterRounds: 0 } },
            ],
          },
          {
            weight: 1,
            text: '你读懂了很多信号，但没算到操场今晚有夜跑打卡活动。人声鼎沸里，那句话你说了一半就咽了回去。{{ta}}等了一会儿，说“回去吧，明天还有课”。后来你们谁都没再提这个晚上。心思细腻的另一面是：连错过，你都感受得格外清楚。',
            outcomeTag: 'failure',
            effects: [
              { stats: { mindset: -3 } },
              { npcFavor: 'first_love', delta: -2 },
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
            text: '你回了个“没干嘛，准备睡了”，然后在黑暗里睁着眼睛躺了一个多小时。第二天你在日记本里写了很长一段，没有署名，也没有结论。后来社团换届，你们渐渐不在同一个活动里了，偶尔在食堂遇见，还是会打招呼，还是会笑。只是很多年以后，你整理旧物翻到那一页，还是会停下来想：如果那晚下楼了，会怎样？日记本不会回答。它只负责替你保管那些没敢寄出的东西。',
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
    id: 'ev_love_winter',
    pools: [],
    category: 'love',
    title: '那年冬天',
    text: '年底，你们一起跨了年。学校后街的小饭馆，一份水煮鱼两碗米饭，老板送了两罐冰糖雪梨。零点的时候外面有人放烟花——违规的，但很好看。{{ta}}靠在你肩上说：“明年也要这样。”',
    choices: [
      {
        id: 'a',
        text: '把这个冬天记下来',
        outcomes: [
          {
            weight: 1,
            text: '后来你经历过更贵的跨年：江边的酒店、有观景位的餐厅、提前一个月订的位子。但每次零点倒数，你想起的都是那家小饭馆，和那句“明年也要这样”。有些夜晚在发生的时候，你就知道自己会记它很多年。',
            effects: [{ stats: { mindset: 4 } }, { npcFavor: 'first_love', delta: 6 }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_love_distance',
    pools: [],
    category: 'love',
    tier: 'major',
    title: '异地的预兆',
    text: '毕业季越来越近，一切都在加速：论文、答辩、体检、租房群。{{ta}}家里托关系在老家省会找了个稳定的岗位，而你的机会在另一座城市——你们查过，高铁四个半小时，不堵车的话。这件事你们心照不宣地绕了一个月，聊天记录里全是别的话题，像两个人合力守着一个不敢碰的开关。今晚视频，{{ta}}的房间已经开始打包，纸箱堆在身后。{{ta}}忽然停下来，看着镜头说：“我们……以后怎么办？”你张了张嘴。四年里你们说过那么多话，这一句最难接。',
    choices: [
      {
        id: 'a',
        text: '“异地就异地，我们能撑过去”',
        outcomes: [
          {
            weight: 1,
            text: '你说：“异地就异地。别人撑不过去，是别人。”{{ta}}在屏幕那头哭了，一边哭一边骂你说得轻巧，一边骂一边点头。后来的日子确实不轻巧：每天的晚安视频、每月一次的高铁、错开的加班和假期，还有见面那天在出站口一眼认出对方的瞬间。高铁票根在你抽屉里越攒越厚，你用皮筋把它们捆成一小沓，像捆着一段咬着牙没松手的时间。累是真的累。但每次检票口的门打开，你又觉得，都值。',
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
        text: '沉默了很久，没有给出承诺',
        outcomes: [
          {
            weight: 1,
            text: '你沉默了太久。久到{{ta}}先笑了一下，说：“没事，我就是随口一问。”你们又聊了几句打包和天气，然后互道晚安。那是你们最后一次超过十分钟的通话。之后的聊天越来越短，回复的间隔越来越长，最后停在一句“最近挺忙的”，谁都没有再往下接。没有争吵，没有摊牌，甚至没有一句正式的再见。很多年后你才明白：有些关系不是断掉的，是两个都不敢先开口的人，一起把它放凉的。',
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
  {
    id: 'ev_college_mobile_wave_2014',
    pools: ['college'],
    category: 'campus',
    title: '开学季的红包大战',
    text: '2014年9月，你拖着行李箱刚在宿舍坐下，室友的手机就没停过响：抢红包的提示音一个接一个。楼下，滴滴和快的的地推举着传单在校门口拦人，喊着“打车立减”；营业厅的海报贴得比迎新横幅还显眼——“开学不换4G，流量不够用”。你摸出兜里那部用了三年的手机，忽然觉得，这个学校比高中班主任描述的“大学生活”要吵得多。',
    mandatory: true,
    trigger: { year: { from: 2014, to: 2014 } },
    choices: [
      {
        id: 'a',
        text: '跟风换4G套餐，装上打车软件到处探索',
        outcomes: [
          {
            weight: 1,
            text: '你办了张4G卡，又装了两个打车软件抢新人补贴，来回穿梭在陌生的城市里找便宜又好吃的馆子。流量费比预想的高，但你比同班同学更早摸熟了这座城市的地图。',
            effects: [{ stats: { money: -300, network: 4, mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '加入宿舍抢红包群，图个热闹',
        outcomes: [
          {
            weight: 2,
            text: '开学第一周，你的手指比脑子先学会了大学生活——抢红包。群里几十个人拼手速，你抢到的最大一个是八块八，最小的是三分钱，室友笑你“天道酬勤”。',
            effects: [{ stats: { money: 200, mindset: 4, health: -1 } }],
          },
          {
            weight: 1,
            text: '你没抢到几个大红包，倒是抢红包抢到凌晨一点，第二天军训差点晕倒在操场上。教官的眼神比太阳还毒。',
            effects: [{ stats: { money: 30, mindset: -2, health: -4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '继续用老手机，省下这笔钱',
        outcomes: [
          {
            weight: 1,
            text: '你没有跟风换套餐装软件。室友调侃你的手机是“活化石”，你也懒得反驳——省下的钱够吃半个月食堂。只是每次约饭对方发个定位链接，你都要多问一句地址在哪。',
            effects: [{ stats: { money: 300, network: -2, mindset: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_campus_trends_2016',
    pools: ['college'],
    category: 'campus',
    title: '校园里的新生意',
    text: '2016年，公告栏和宿舍楼道里贴满了花花绿绿的小广告：“无需家长同意，凭学生证秒批”“开直播，日入过百不是梦”。隔壁班有人换上了最新款手机，朋友圈配文“分期不影响生活”；还有人架起手机支架，对着镜头唱歌聊天，说这是“第二份收入”。你划着朋友圈，盘算着自己那点生活费还能怎么折腾。',
    mandatory: true,
    trigger: { year: { from: 2016, to: 2016 } },
    choices: [
      {
        id: 'a',
        text: '办个校园贷分期，买台新手机',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '“凭学生证秒批”的背后是你没细看的服务费和逾期滞纳金。分期账单一个月比一个月长，你东拆西补才把窟窿填上，手机倒是用上了，只是每次它震动，你都会先心里一紧，怕是催款短信。',
            effects: [
              { moneyCost: { rate: 0.35, max: 9000, roundTo: 100, reason: 'other' } },
              { stats: { mindset: -8, knowledge: -2 } },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你精打细算，按期还完了每一期分期，没有踩坑。手机用上了，你也第一次认真读完了一份贷款合同——这门课，学校没教，但你自己补上了。',
            effects: [{ stats: { money: -1500, knowledge: 3, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '架起手机，试试校园主播',
        outcomes: [
          {
            weight: 1,
            text: '你对着镜头唱了几首歌，聊了聊上课的糗事，攒了一小撮粉丝，也收到几个礼物打赏。钱不多，但你第一次体会到，什么叫“被陌生人看着”的紧张和上瘾。',
            effects: [{ stats: { money: 800, network: 5, mindset: 2, health: -2 } }],
          },
          {
            weight: 1,
            text: '你播了几场，观众加起来没超过十个人，倒是被高中同学截图发到了群里调侃。你把设备收进了柜子最底层，决定这事以后不提。',
            effects: [{ stats: { mindset: -4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不折腾，专心把学业过好',
        outcomes: [
          {
            weight: 1,
            text: '你没有凑这些热闹，把时间还给了图书馆和社团。室友分期买的新手机、隔壁班同学攒的粉丝，跟你没什么关系——你的绩点倒是稳稳往上走。',
            effects: [{ stats: { knowledge: 6, network: -1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_college_bike_share_2017',
    pools: ['college'],
    category: 'campus',
    title: '押金骑上共享单车',
    text: '2017年，五颜六色的共享单车一夜之间堆满了校门口，比自行车棚还壮观。扫码交99元押金就能骑走一辆，你盘算着：以后去教学楼、去实习单位、去校外约会，都能省下不少时间。只是你也隐约听说，有的平台押金退得没那么痛快。',
    mandatory: true,
    trigger: { year: { from: 2017, to: 2017 } },
    choices: [
      {
        id: 'a',
        text: '交押金骑车通勤，图个方便',
        outcomes: [
          {
            weight: 2,
            text: '你交了99元押金，从此上课、实习、约会都靠它。风里来雨里去，你确实省下了不少公交钱和等车的时间——只是押金这笔钱，你渐渐忘了它本该是能退的。',
            effects: [{ stats: { money: -99, mindset: 2, health: 3 } }],
          },
          {
            weight: 1,
            outcomeTag: 'failure',
            text: '你交了押金骑了大半年，后来想退的时候，APP 里的“退款申请”转了好几圈也没到账。你在维权群里刷到几百个和你一样的人，最后不了了之——99块钱，买了一年的方便，外加一节关于“押金”和“预付费”的公开课。',
            effects: [{ stats: { money: -99, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '兼职做单车运维，顺便赚点生活费',
        outcomes: [
          {
            weight: 1,
            text: '你接了平台的运维兼职，晚上去挨个扶起东倒西歪的单车、把堆在角落的车挪回停车区。工资不算高，但你比谁都更早看懂：风口上那些五颜六色的车，背后是密密麻麻的运维和调度成本。',
            effects: [{ stats: { money: 1200, knowledge: 3, health: -3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '继续挤公交，不凑这个热闹',
        outcomes: [
          {
            weight: 1,
            text: '你没有交押金，依旧挤着永远不准点的公交。室友吐槽你落伍，你倒觉得，至少这笔押金的钱，安安稳稳留在了自己兜里。',
            effects: [{ stats: { money: 200, mindset: 1, health: -1 } }],
          },
        ],
      },
    ],
  },
];
