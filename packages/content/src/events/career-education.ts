import type { GameEvent } from '@life-sim/core';

// 师范线专属里程碑事件。原先分散在 work.ts 里，随金融/医学线独立成文件的惯例一并搬迁到这里，
// 方便和 career-finance.ts / career-medicine.ts 对照维护、及时发现断更年份。
export const careerEducationEvents: GameEvent[] = [
  {
    id: 'ev_edu_first_class',
    pools: ['work'],
    category: 'career',
    title: '第一堂课',
    text: '你站在讲台前，下面几十双眼睛看着你。备课时写满三页纸，开口后才发现，真正难的不是讲完知识点，是让他们愿意听。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2018, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '认真磨课，慢慢站稳',
        outcomes: [
          {
            weight: 1,
            text: '你把每节课都复盘一遍，连板书顺序都改了三次。学生不一定记得你的辛苦，但成绩单会记得。',
            effects: [{ stats: { knowledge: 6, mindset: 4, money: 5000, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '先按老教师的方法来',
        outcomes: [
          {
            weight: 1,
            text: '你少走了些弯路，也少了点自己的东西。办公室里大家说你“稳”，你一时分不清这是夸奖还是提醒。',
            effects: [{ stats: { money: 4000, network: 4, health: 2 } }],
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
    text: '2020年，教室搬进了屏幕。你对着摄像头讲课，学生头像一排排灰着。点名时有人掉线，提问时全班静音。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '重新设计互动方式',
        outcomes: [
          {
            weight: 2,
            text: '你学会了用投票、弹幕和小测把学生拉回来。效果不完美，但至少屏幕那头有人开始回“老师我在”。',
            effects: [{ stats: { knowledge: 5, network: 3, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '你搬出了十八般武艺，弹幕确实活跃了——活跃成了聊天室。一节课下来进度只走了一半，你盯着“老师再见”的刷屏，分不清自己是老师还是主播。',
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
            text: '课讲完了，你也累空了。后台数据显示观看时长断崖式下跌，它比任何领导听课都诚实。',
            effects: [{ stats: { mindset: -5 } }],
          },
          {
            weight: 1,
            text: '期末你收到一条学生留言：“老师，你的课像深夜电台，我妈以为我在听睡前故事，其实我真的在记笔记。”花活会过时，把一件事讲清楚不会。',
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
    text: '2021年7月的那个周末，文件全文刷屏了。你逐字读完，又读了一遍，然后打开工作群——平时消息 99+ 的群，安静得像考场。周一上班，一切都在肉眼可见地塌缩：楼下那家上市机构的灯箱招牌拆了，电梯里遇到的同行在打电话问“房子能不能提前退租”，家长群里有人小心翼翼地问“课还上吗”，没有人敢用官方口径以外的话回答。朋友圈分成两种人：一种在转“教育回归本质”的评论文章，一种在转简历。你入行时以为教育是慢行业，慢到可以托付半生。这个夏天你才知道，行业没有快慢，只有周期——而你正站在周期折断的地方。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '转向校内和编制机会',
        outcomes: [
          {
            weight: 1,
            text: '你做了决定：回到体制内的轨道上去。白天照常上课，晚上摊开教综和学科真题，台灯一开就是三个小时。你重新背起了教育学名词，像回到大学考试周，只是这次没有室友陪你熬夜，只有出租屋的冰箱嗡嗡作响。有天深夜你合上题册，忽然觉得命运有点幽默：很多年前，你靠考试从小地方走出来；现在行业塌了，你还是只能靠考试，给自己重新找一块站得住的地面。也好。会考试，至少是这么多年风浪里，从来没有背叛过你的那门手艺。',
            effects: [
              { stats: { knowledge: 6, mindset: -4, health: -3 } },
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
            text: '你决定不离场，换赛道。课程表推翻重写：“数学提分班”变成“思维训练营”，“阅读写作”变成“表达力与演讲”。你重新设计课件、重新谈场地、重新一个个跟老学员家长沟通。有意思的是，家长们嘴上说着“孩子终于能轻松点了”，转头就问你：“这个思维课，对以后升学……有帮助吧？”你笑着给出一个合规的回答。深夜整理报名表时你想：焦虑是守恒的，政策能改变它的形状，改变不了它的总量。而你能做的，是在新的形状里，继续把课讲好——这一点，从来不需要换包装。',
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
    text: '2022年，考编群越来越热闹。每个人都在问资料、问岗位、问分数线。稳定这两个字，终于从父母的唠叨变成了年轻人的共识。',
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
            text: '你上岸了。不是童话结局，但至少暑假是真的，五险一金也是真的。',
            outcomeTag: 'success',
            effects: [
              { stats: { mindset: 10, money: 8000 } },
              { setFlag: 'teacher_public' },
            ],
          },
          {
            weight: 1,
            text: '你没考上。成绩出来后你躺了一下午，晚上还是把错题整理完了。人到这个年纪，崩溃也要排进日程表。',
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
            text: '你没去挤那条独木桥。收入更波动，自由也更多。你开始学着把课卖给真正愿意买的人。',
            effects: [{ stats: { money: 18000, network: 4, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_title_evaluation_2023',
    pools: ['work'],
    category: 'career',
    title: '评职称',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2023, to: 2023 } }] },
    text: '2023年，学校放出了新一轮职称评审名额，教研组的空气瞬间紧张起来——发表论文、公开课记录、带队竞赛获奖，每一项都要材料佐证。几位共事多年的同事，这次要在同一张名单上比出高低。',
    choices: [
      {
        id: 'public',
        text: '争取体制内这次的高级职称名额',
        visibleIf: { flag: 'teacher_public' },
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 60 },
            text: '材料交上去，答辩也顺利过了，你评上了这一轮的职称。工资条上多了一小笔职称补贴，教研组里的钦佩和暗中的较劲一样多——你只是安静地把公示名单截了个图，存进相册。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 6000, mindset: 6, knowledge: 2 } }],
          },
          {
            weight: 1,
            text: '名额有限，这次没轮到你。教研组长拍拍你肩膀说“材料再准备准备，明年继续”。你把评审材料存进一个专门的文件夹，标题是“明年”——这个文件夹，你已经建过不止一次。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -6 } }],
          },
        ],
      },
      {
        id: 'market',
        text: '在机构里争一个“金牌讲师”评级',
        visibleIf: { not: { flag: 'teacher_public' } },
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 30 },
            text: '凭这几年攒下的续报率和家长口碑，你评上了机构的“金牌讲师”。课时费跟着涨了一截，只是你也清楚，这份“职称”换一家机构，可能就得从头再评一次。',
            effects: [{ stats: { money: 8000, network: 3, mindset: 3 } }],
          },
          {
            weight: 1,
            text: '机构的评级更看重续报数字，你这学期带的班续报率没冲上去，评级没评上。你安慰自己：教得好不好，不该只用一个续报率衡量——只是工资单不太同意这个说法。',
            effects: [{ stats: { mindset: -5 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_homeroom_parents_2024',
    pools: ['work'],
    category: 'career',
    title: '班主任的家长会',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2024, to: 2024 } }] },
    text: '你接手当了班主任。这学期，两个学生因为课间的一点小摩擦闹到了办公室，一位家长直接把聊天记录截图发进了家长群，配文“老师到底管不管”。家长会定在这周六，你知道到时候不会只有这一件事被问到。',
    choices: [
      {
        id: 'a',
        text: '提前一对一沟通，把事情说清楚再开会',
        outcomes: [
          {
            weight: 1,
            text: '你提前约了双方家长分别聊了一次，把事情的经过和处理方式讲清楚。周六的家长会上，那件事只用了三分钟就翻篇了。你花掉的是两个晚上的时间和不少口舌，换回来的是家长群里少见的一句“老师费心了”。',
            effects: [{ stats: { network: 5, mindset: 3, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '按流程走，家长会上公开说明处理经过',
        outcomes: [
          {
            weight: 1,
            text: '你在家长会上按流程完整说明了处理经过和依据。多数家长表示理解，但那位截图发群的家长会后又单独堵在办公室门口，追问了很久。你第一次意识到，“按流程”能保住程序正义，却未必能保住一个家长的情绪。',
            effects: [{ stats: { mindset: -4, network: 1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '尽量大事化小，先把家长会气氛稳住',
        outcomes: [
          {
            weight: 1,
            text: '你在会上轻描淡写地带过了这件事，尽量让气氛保持轻松。家长会开得很顺，只是你也清楚，没解决的事情不会凭空消失——两周后，类似的摩擦又在另一对学生身上重演了一次。',
            effects: [{ stats: { mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_ai_classroom_2025',
    pools: ['work'],
    category: 'career',
    title: 'AI批改作业',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2025, to: 2025 } }] },
    text: '学校推了一套 AI 辅助教学系统：批改选择题和基础题只要几秒钟，还能自动生成学情分析报表。教务处开会时说这是“减负增效”，但你也听到办公室里有人小声嘀咕：“以后是不是备课也要交给它？”',
    choices: [
      {
        id: 'a',
        text: '认真学这套系统，把省下的时间花在教研上',
        outcomes: [
          {
            weight: 1,
            text: '你把批改基础题的时间彻底交给了系统，省下来的几个小时用来打磨教案、研究学情报表里那些从前没工夫细看的规律。你发现自己第一次能腾出手，去做“教学”而不只是“改作业”这件事。',
            effects: [{ stats: { knowledge: 5, mindset: 3, health: 2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '保持怀疑，继续手改作业不依赖它',
        outcomes: [
          {
            weight: 1,
            text: '你没有完全信任那套系统的判分逻辑，坚持自己把关键作业过一遍。工作量没有减少多少，但你觉得踏实——只是学期末对比同事们腾出来的时间，你也开始怀疑自己是不是太固执了。',
            effects: [{ stats: { mindset: -2, health: -3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '用它省下机械劳动，也想明白自己剩下什么不可替代',
        outcomes: [
          {
            weight: 1,
            text: '批改和统计这些机械环节，你放心交给了系统。腾出来的时间里，你想明白了一件事，写进了教研笔记：能被打分的部分，工具迟早会做得比你快；真正带不走的，是你记不记得住每个学生今天没听懂的是哪一步。这句话，你没告诉任何人，但从那天起，备课的重点悄悄变了。',
            effects: [{ stats: { knowledge: 4, mindset: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_edu_decade_2026',
    pools: ['work'],
    category: 'career',
    title: '十二年，还在讲台上',
    mandatory: true,
    trigger: { all: [{ flag: 'career_edu' }, { year: { from: 2026, to: 2026 } }] },
    text: '十二年前你第一次站上讲台，紧张到备课稿写满三页纸。十二年后，粉笔换成了触控屏，教案换成了共享文档，考编热、双减、AI 批改，一轮轮政策和工具的变化你都赶上了。讲台还是那三尺讲台，站在上面的人，已经不是当年那个人了。',
    choices: [
      {
        id: 'public',
        text: '回望这十二年在体制内站稳的日子',
        visibleIf: { flag: 'teacher_public' },
        outcomes: [
          {
            weight: 1,
            text: '编制没有让你少操一分心——带班、评职称、家长会，一样都没少。但十二年后，你确实站稳了：五险一金是真的，寒暑假是真的，讲台上那份说不清道不明的成就感，也是真的。你没有成为新闻里的名师，但教过的学生里，总有人还记得你某一句话。',
            effects: [{ stats: { mindset: 6, health: 2 } }],
          },
        ],
      },
      {
        id: 'reinvented',
        text: '回望这十二年在市场里换赛道的日子',
        visibleIf: { all: [{ not: { flag: 'teacher_public' } }, { flag: 'edu_reinvented' }] },
        outcomes: [
          {
            weight: 1,
            text: '从“数学提分班”改成“思维训练营”，你换过不止一次赛道名字，但没有真正离开教育这件事。十二年里，你的收入比体制内的同行更颠簸，也更自由。你偶尔会想，如果当年考编上岸，日子会不会更省心——但转念又想，这条路上认识的学生和家长，也是别人拿不走的一份履历。',
            effects: [{ stats: { mindset: 4, network: 3 } }],
          },
        ],
      },
      {
        id: 'other',
        text: '回望这十二年没能如愿上岸的日子',
        visibleIf: { all: [{ not: { flag: 'teacher_public' } }, { not: { flag: 'edu_reinvented' } }] },
        outcomes: [
          {
            weight: 1,
            text: '你考过编，没上岸；也想过转型，没真正转成。十二年里，你一直在教育这个行当的边缘徘徊，收入起伏，身份也含糊。但讲台前那些听懂了一道题、露出恍然大悟表情的瞬间，十二年来没有变过——那大概是这份职业留给你的，最不需要编制来证明的部分。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
    ],
  },
];
