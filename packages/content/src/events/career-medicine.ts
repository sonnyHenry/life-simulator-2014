import type { GameEvent } from '@life-sim/core';

// 医学线专属里程碑事件(6 个,2018-2026 全程覆盖,与师范线对齐)。
// "5年本科+3年规培"完全靠 flag 在既有的固定年份上模拟,不改时间线架构:
// 2018 年求职路径统一进入 medicine_resident(规培中),2021 年结束规培、清除该 flag,
// 与"考研推迟3年入场"目前的纯 flag 模拟方式同构。
//
// ev_med_pandemic_2020 刻意按 major(而非 career_medicine)门控——career_medicine
// 的赋值时机因分流路径而异(求职路径 2018 年、考研路径要到 ev_postgrad_exit 的 2021
// 年才赋值),按 major 门控能保证所有临床医学专业玩家都不会错过这条"全游戏最高光"主线。
export const careerMedicineEvents: GameEvent[] = [
  {
    id: 'ev_med_residency_start_2018',
    pools: ['work'],
    category: 'career',
    title: '规培开始',
    text: '2018年，你正式进入规培。白大褂穿在身上，工资条却薄得像张便签——"住院医师规范化培训"这个词，没人在报考指南里跟你解释清楚它到底意味着什么。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'tertiary',
        text: '去大三甲规培，资源多但也卷得更狠',
        visibleIf: { flag: 'first_job_track', equals: 'medicine_tertiary_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你去了本省最好的三甲医院。带教是业内有名的专家，病例见得又多又难，履历含金量高——代价是排班表上几乎看不到"休息"两个字，规培津贴交完房租后所剩无几。',
            effects: [{ stats: { money: 3000, knowledge: 7, network: 4, mindset: -6, health: -5 } }],
          },
        ],
      },
      {
        id: 'ordinary',
        text: '去普通/社区医院规培',
        visibleIf: {
          any: [
            { flag: 'first_job_track', equals: 'medicine_ordinary_candidate' },
            { flag: 'first_job_track', equals: 'medicine_tertiary_candidate' },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你去了一家普通医院规培。病人没有三甲那么多疑难杂症，日子相对没那么拼命，但你也清楚，起点的平台，会一路影响到你未来能走多远。',
            effects: [{ stats: { money: 2000, knowledge: 5, mindset: -3, health: -2 } }],
          },
        ],
      },
    ],
  },
  {
    // 规培中段(2019):求职路径玩家规培第二年,读研医学线此时仍在校
    id: 'ev_med_resident_grind_2019',
    pools: ['work'],
    category: 'career',
    title: '规培第二年',
    text: '2019年,规培进入第二年,新鲜劲儿早被夜班磨没了。你管的床位越来越多,工资条却还是那张薄薄的便签;同届本科去互联网的同学晒着年终奖,你在值班室的行军床上抢一个囫囵觉。凌晨三点,一个家属堵在护士站问"医生你到底行不行",你压着火把病情又讲了第三遍——那一刻你比谁都想弄明白,自己咬牙熬的这三年,到底在攒什么。',
    mandatory: true,
    trigger: { all: [{ flag: 'medicine_resident' }, { year: { from: 2019, to: 2019 } }] },
    choices: [
      {
        id: 'grind',
        text: '把每一台手术、每一次抢救都当成攒手感',
        outcomes: [
          {
            weight: 2,
            text: '你主动多跟台、多值班,把带教随口讲的每个细节都记进小本子。半年下来,主治开始放手让你上一助,你缝的第一个漂亮切口被夸"不像规培的手"。代价是黑眼圈成了标配,体重掉了六斤——但你知道,手感这东西,只在灯下和血里长。',
            effects: [{ stats: { knowledge: 8, network: 3, mindset: -3, health: -6 } }],
          },
          {
            weight: 1,
            text: '你什么都想学,结果什么都轮不到你主导:上台永远拉钩,抢救永远打杂。你把不甘心写进值班日记,也写进第二天更早到岗的脚步里。成长慢,但你没停。',
            effects: [{ stats: { knowledge: 4, mindset: -5, health: -3 } }],
          },
        ],
      },
      {
        id: 'balance',
        text: '先把自己这条命顾好,别在规培里就垮掉',
        outcomes: [
          {
            weight: 1,
            text: '你开始认真吃饭、按点补觉,推掉了几个"锻炼机会"。同批有人卷得比你狠,进步也比你快,但你熬过了那个不少人失眠、想退培的冬天,完整地站到了第三年。这行太长,活着走完比抢跑更重要。',
            effects: [{ stats: { health: 6, mindset: 4, knowledge: 2, money: 1000 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_med_pandemic_2020',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '出征',
    text: '2020年春节前夜，医院的工作群突然活跃起来——武汉方向的消息一条接一条弹出来。大年三十，你所在的科室贴出一张请战书，纸上还没写几个名字，红手印已经先按了上去。你想起自己规培时最崩溃的那些夜班，此刻却觉得那都不算什么了。同批规培的同事，凌晨两点还在防护服里连轴转，摘下口罩时脸上勒出的印子几天都消不下去。手机里，家人的消息一条接一条："你别去，家里还等你回来过年"。科室的通知就在下一秒弹出来：请战人员，明天集合出发。',
    mandatory: true,
    trigger: { all: [{ major: '临床医学' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'frontline',
        text: '请战一线',
        outcomes: [
          {
            weight: 2,
            text: '你在请战书上按下了手印，第二天就跟着医疗队出发了。防护服里的十几个小时，护目镜上全是雾气，你几乎是凭记忆在操作。回来的时候瘦了一圈，但你成了科室里所有人提起都会肃然起敬的那个名字。',
            effects: [
              { stats: { mindset: 15, knowledge: 6, network: 6, health: -14 } },
              { setFlag: 'pandemic_frontline' },
            ],
          },
          {
            weight: 1,
            text: '你在一线扛了下来，却还是没躲过那场大规模感染。隔离病房里，你从"救人的人"变成了"被救的人"。你挺了过来，出院那天，当初一起请战的同事在楼下拉了横幅接你。这场教育太贵了，贵到让你彻底明白"一线"两个字的分量。',
            effects: [
              { stats: { mindset: 10, knowledge: 4, health: -26 } },
              { setFlag: 'pandemic_frontline' },
            ],
          },
        ],
      },
      {
        id: 'support',
        text: '后方支援',
        outcomes: [
          {
            weight: 1,
            text: '你没有报名一线，而是留在后方顶上物资调配和普通病房的班——把请战名额让给了更有经验的老师。这份"没有故事"的坚守，同样撑住了医院没有崩掉的另一半。',
            effects: [{ stats: { mindset: 5, knowledge: 3, health: -4 } }],
          },
        ],
      },
      {
        id: 'rotation',
        text: '申请轮岗',
        outcomes: [
          {
            weight: 1,
            text: '你申请轮岗去了相对清闲的科室，暂时避开了最凶险的岗位。这个决定让你活得轻松了一些，却也在很长一段时间里，不太敢跟同批规培的同事对视。',
            effects: [{ stats: { mindset: -6, health: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_med_residency_end_2021',
    pools: ['work'],
    category: 'career',
    title: '规培结束',
    text: '三年规培期满，考核结束的那天，你和同批的人在医院门口拍了张合影。往前一步是留下，往后一步是别的可能——但没人告诉你，往前一步是不是真的有编制在等你。',
    mandatory: true,
    trigger: { all: [{ flag: 'medicine_resident' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'public',
        text: '留在原医院，争取编制',
        outcomes: [
          {
            weight: 2,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '考核成绩摆在那里，你争取到了正式编制。签字那天，你妈在电话那头反复确认："是铁饭碗那种编制吗？"你说是，她沉默了几秒，然后说"这三年，值了"。',
            effects: [
              { setFlag: 'medicine_resident', value: false },
              { setFlag: 'doctor_public' },
              { stats: { money: 5000, mindset: 10, knowledge: 3 } },
            ],
          },
          {
            weight: 1,
            text: '医院给你的是合同工名额，不算编制。你留了下来——干的是同样的活，某些待遇却隔着一层。你安慰自己："先干着，以后再看机会"。',
            effects: [
              { setFlag: 'medicine_resident', value: false },
              { setFlag: 'doctor_public' },
              { stats: { money: 2000, mindset: -4, knowledge: 3 } },
            ],
          },
        ],
      },
      {
        id: 'private',
        text: '跳去薪资更高的私立/外地医院',
        outcomes: [
          {
            weight: 1,
            text: '你没有留在原医院，跳去了一家薪资更有诚意的私立医院。规培三年攒下的手感没有浪费，只是每次家庭聚会，亲戚问起"有没有编制"，你都要重新解释一遍这份工作到底算什么。',
            effects: [
              { setFlag: 'medicine_resident', value: false },
              { setFlag: 'doctor_private' },
              { stats: { money: 8000, mindset: 2, knowledge: 2 } },
            ],
          },
        ],
      },
      {
        id: 'left',
        text: '决定离开临床一线',
        outcomes: [
          {
            weight: 1,
            text: '三年规培磨掉了你对"白衣天使"这四个字最后一点滤镜。你没有再考虑留下，转身去了医药相关的其他岗位。离开那天，你第一次感觉，睡眠这件事终于要还给自己了。',
            effects: [
              { setFlag: 'medicine_resident', value: false },
              { setFlag: 'doctor_left' },
              { stats: { mindset: 6, health: 6 } },
            ],
          },
        ],
      },
    ],
  },
  {
    // 2022 分支切换点:防控最吃紧+年底放开挤兑,可在公立/民营间转档
    id: 'ev_med_wave_2022',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '这一年的白大褂',
    text: '2022年,你所在的城市在静默里数着日子,你在方舱、核酸点和病房之间连轴转,防护服一穿就是一个白班。年底政策几周内转向,门急诊在一夜之间被挤爆,发热门诊的队排到了停车场,同事一个接一个"阳"了还在硬顶。你已经记不清连续上了多少天班,只记得有天下班脱下口罩,镜子里那张勒出深痕的脸,让你认真想了一个问题:这身白大褂,你还想怎么穿下去。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'public_stay',
        text: '留在公立,把这一关扛过去',
        visibleIf: { flag: 'doctor_public' },
        outcomes: [
          {
            weight: 2,
            text: '你没走。最难的那两个月,你和科室的人互相顶着,谁"阳"了谁歇一天,退烧了又回来。挤兑的高峰过去后,主任在群里发了长长一段话谢大家,你看着看着眼眶发热。编制的工资没涨,但你对"公立医生"这四个字的理解,厚了一层。',
            effects: [{ stats: { mindset: 6, knowledge: 4, network: 3, health: -8 } }],
          },
          {
            weight: 1,
            text: '你撑住了工作,却没撑住身体,在最忙的时候重感染倒下,躺了十天。回岗那天科室缺人缺得厉害,你带病顶上,心里第一次冒出"这样值不值"的念头,又很快把它按了下去。',
            effects: [{ stats: { mindset: -4, knowledge: 2, health: -12 } }],
          },
        ],
      },
      {
        id: 'public_to_private',
        text: '心力交瘁,趁机跳去待遇更好的民营',
        visibleIf: { flag: 'doctor_public' },
        outcomes: [
          {
            weight: 1,
            text: '熬过这一年,你把简历投给了一家开价诚意十足的民营医院。离职谈话上主任叹了口气,没多留你。换了地方,排班人性化了,到手翻了近一倍,只是逢年过节亲戚那句"怎么不在公立了",你还得学着不往心里去。你告诉自己:救人的地方,不只有编制那一种。',
            effects: [
              { setFlag: 'doctor_public', value: false },
              { setFlag: 'doctor_private' },
              { stats: { money: 9000, health: 5, mindset: 1, network: -2 } },
            ],
          },
        ],
      },
      {
        id: 'private_boom',
        text: '在民营接住放开后的诊量',
        visibleIf: { flag: 'doctor_private' },
        outcomes: [
          {
            weight: 1,
            text: '放开后,民营这边也被挤爆,你连轴转到分不清白天黑夜。奖金确实厚了一截,但你也第一次体会到,市场化的医疗一样会在洪峰前手忙脚乱。忙完那阵,你请了三天假睡到自然醒。',
            effects: [{ stats: { money: 8000, knowledge: 3, mindset: -2, health: -7 } }],
          },
        ],
      },
      {
        id: 'private_to_public',
        text: '经此一役,更想要一份编制的稳',
        visibleIf: { flag: 'doctor_private' },
        outcomes: [
          {
            weight: 1,
            text: '这一年的动荡让你重新掂量"稳定"两个字。恰好原来实习的公立医院在补编制缺口,你放弃了民营的高薪,考回了体制内。到手少了一大块,但看着录用通知上"事业编制"四个字,你妈在电话那头又哭了一次。有些安全感,是要用钱换的。',
            effects: [
              { setFlag: 'doctor_private', value: false },
              { setFlag: 'doctor_public' },
              { stats: { money: -6000, mindset: 8, health: 2 } },
            ],
          },
        ],
      },
      {
        id: 'left_watch',
        text: '作为已经离开临床的人,看着这一切',
        visibleIf: { flag: 'doctor_left' },
        outcomes: [
          {
            weight: 1,
            text: '你早就离开了临床,这一年却比谁都关注前同事的朋友圈:谁病倒了,谁在硬顶,谁发了那条"太累了"。你给还在一线的老同学寄了一箱药和退烧贴,附言只有四个字"别硬扛"。放下手机你沉默了很久——离开是对的,但那份牵挂,好像一辈子都还给不了医院。',
            effects: [{ stats: { mindset: -3, network: 3, money: -2000 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_med_dignity_2023',
    pools: ['work'],
    category: 'career',
    title: '编制与尊严',
    text: '2023年，你已经在这行走了五年。饭桌上亲戚还是会问"编制的事定下来没"，你渐渐明白：这个问题问的不只是工作稳不稳定，更是这份职业到底值不值得。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2023, to: 2023 } }] },
    choices: [
      {
        id: 'public',
        text: '耐心化解一次医患摩擦，重新确认为什么留下',
        visibleIf: { flag: 'doctor_public' },
        outcomes: [
          {
            weight: 1,
            text: '一位情绪激动的患者家属堵在办公室门口，你没有回避，坐下来把病情和流程一条条讲清楚。对方最后红着眼眶说了句"谢谢，麻烦你了"。这句迟来的"谢谢"，是这份工作给你的、编制之外的另一种收入。',
            effects: [{ stats: { mindset: 6, network: 2, money: 2000 } }],
          },
        ],
      },
      {
        id: 'private',
        text: '享受私立医院的待遇，也接住随之而来的疑问',
        visibleIf: { flag: 'doctor_private' },
        outcomes: [
          {
            weight: 1,
            text: '私立医院的收入确实好看，排班也人性化不少。只是每次同学聚会聊起"体制内外"，你总要多解释两句——高薪和"正经工作"之间，好像永远隔着一层别人的滤镜。',
            effects: [{ stats: { money: 6000, mindset: -3, health: 2 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '回望这几年离开临床的决定',
        visibleIf: { flag: 'doctor_left' },
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'pandemic_frontline' },
            text: '2020年你曾经在最凶险的地方签下自己的名字，2023年你却已经不在临床一线。这中间发生的事，你说不清是谁辜负了谁，只知道离开之后，身体是第一个投票同意的。',
            effects: [{ stats: { mindset: -4, health: 4 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'pandemic_frontline' } },
            text: '离开临床一线之后，你的生活作息第一次像个正常人。偶尔想起当年白大褂加身的那份骄傲，你不后悔——只是后悔没有早一点，明白自己真正想要的是什么。',
            effects: [{ stats: { mindset: 5, health: 5 } }],
          },
        ],
      },
    ],
  },
  {
    // 2024 收官前奏:集采与绩效改革,医学线 2024-2026 断更补齐(M5 handoff 遗留项)
    id: 'ev_med_reform_2024',
    pools: ['work'],
    category: 'career',
    title: '集采之后',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2024, to: 2024 } }] },
    text: '2024年，药品集采一轮接一轮，曾经一盒几百块的"明星药"如今几块钱就能开到；DRG 按病种付费落地，科室开会的关键词从"业务量"变成了"控费"。患者的账单确实薄了，但绩效表的算法也换了——这行的收入结构，正在被重新发牌。',
    choices: [
      {
        id: 'public',
        text: '在公立体系里适应新规则',
        visibleIf: { flag: 'doctor_public' },
        outcomes: [
          {
            weight: 2,
            text: '你花了半年弄懂 DRG 的分组逻辑，把病历首页质量抓成了科室第一。绩效没有回到从前，但主任在全科会上点名表扬了你——在规则变化的年代，先读懂规则的人总是稍微好过一点。',
            effects: [{ stats: { knowledge: 5, mindset: 2, money: 4000, health: -3 } }],
          },
          {
            weight: 1,
            text: '控费指标压下来，你开每一张检查单前都要多想三秒。有位老患者问你"怎么不给我开那个进口的了"，你解释了很久。那天下班，你在停车场坐了十分钟才发动车子。',
            effects: [{ stats: { mindset: -6, knowledge: 3, health: -2 } }],
          },
        ],
      },
      {
        id: 'private',
        text: '在市场化医疗里找自己的位置',
        visibleIf: { flag: 'doctor_private' },
        outcomes: [
          {
            weight: 1,
            text: '集采的浪没有直接打到私立这边，但患者的钱包变紧了，你所在的机构开始卷"服务体验"。你学会了用患者听得懂的话解释病情，复诊率成了你的新绩效——你有点怀念只谈医术的日子，但也承认，被好好对待的患者是真的会回来。',
            effects: [{ stats: { money: 8000, network: 3, mindset: -2, health: -2 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '在行业外看这场改革',
        visibleIf: { flag: 'doctor_left' },
        outcomes: [
          {
            weight: 1,
            text: '你现在的工作和集采文件打交道比和患者多。前同事在群里吐槽绩效，你一边回"抱抱"，一边把最新政策整理成内部简报——离开临床的人，反而成了前同事们的"政策翻译"。',
            effects: [{ stats: { knowledge: 4, network: 4, money: 3000 } }],
          },
        ],
      },
    ],
  },
  {
    // 2025:三十岁的天花板,医学线各档位的中年时刻
    id: 'ev_med_ceiling_2025',
    pools: ['work'],
    category: 'career',
    title: '主治之后',
    text: '2025年,你三十出头,职业和生活的天花板同时显形:晋升副高要论文、要课题、要排队,而家里父母的体检报告开始出现你不愿细看的箭头。亲戚朋友的健康问题一股脑找上你,你成了整个家族的"私人医生"——门诊之外,还有一个永远在线的免费问诊窗口。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2025, to: 2025 } }] },
    choices: [
      {
        id: 'public',
        text: '在公立体系里,继续爬那道叫职称的坡',
        visibleIf: { flag: 'doctor_public' },
        outcomes: [
          {
            weight: 2,
            text: '你一边出门诊一边挤时间写论文、报课题,晋升的队伍很长,你排在中间不上不下。但去年你主刀的一个疑难病例被写进了科室教学案例,年轻规培医生开始喊你"老师"。天花板还在头顶,可你脚下的台阶,确实一级级垫高了。',
            effects: [{ stats: { knowledge: 5, network: 4, mindset: 2, health: -3 } }],
          },
          {
            weight: 1,
            text: '论文卡在返修,课题没中标,晋升又要等下一轮。你在深夜的办公室改标书,改到怀疑这套评价体系到底认不认真本事。最后你把父母的复查安排进了自己唯一的休息日——那天你既是医生,也是儿女。',
            effects: [{ stats: { mindset: -6, knowledge: 3, health: -4 } }],
          },
        ],
      },
      {
        id: 'private',
        text: '在民营,把经验变成实打实的收入',
        visibleIf: { flag: 'doctor_private' },
        outcomes: [
          {
            weight: 1,
            text: '没有职称的紧箍咒,你把精力全放在把病看好、把患者留住上。收入稳稳地涨,你给爸妈换了套更贵的体检套餐,自己也终于敢请年假带家人出去玩一趟。只是偶尔同学聚会聊起"学术",你会有一瞬间的走神——你选的是另一条路,不差,只是不同。',
            effects: [{ stats: { money: 9000, mindset: 3, network: 2, health: -2 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '在临床之外,用医学背景过另一种人生',
        visibleIf: { flag: 'doctor_left' },
        outcomes: [
          {
            weight: 1,
            text: '你早离开了临床,但"学医的"这个标签甩不掉,也不想甩:家族群里的健康问题你随手就答,工作里那点医学底子成了别人没有的优势。三十岁这年你终于确认,当年那个"逃兵"式的决定,其实是把医学换了种方式带在身上。',
            effects: [{ stats: { mindset: 5, network: 3, money: 3000 } }],
          },
        ],
      },
    ],
  },
  {
    // 2026 收官:与 cs/edu/金融线"十二年回望"对齐的医学线终章
    id: 'ev_med_decade_2026',
    pools: ['work'],
    category: 'career',
    title: '白大褂的十二年',
    mandatory: true,
    trigger: { all: [{ flag: 'career_medicine' }, { year: { from: 2026, to: 2026 } }] },
    text: '2026年，实习时的带教老师退休，科室聚餐给他送行。饭桌上有人提起2020年那个春节，包间突然安静了几秒，然后有人举杯："都过去了。"你想起解剖课上的第一刀、规培时的第一个夜班、还有那些没能救回来的人和救回来的人。十二年，这身白大褂教你的事，比任何教科书都厚。',
    choices: [
      {
        id: 'frontline',
        text: '回望从请战书开始的这些年',
        visibleIf: { flag: 'pandemic_frontline' },
        outcomes: [
          {
            weight: 1,
            text: '那张按了红手印的请战书，你手机里还存着照片。这些年你没跟太多人讲过那段日子，不是不愿意讲，是讲不清楚。但每次职业倦怠到想放弃时，你都会想起隔离病房外那句隔着玻璃喊的"谢谢"——然后第二天，照常查房。',
            effects: [{ stats: { mindset: 8, knowledge: 2 } }],
          },
        ],
      },
      {
        id: 'stayed',
        text: '回望一直守在临床的这些年',
        visibleIf: {
          all: [{ not: { flag: 'pandemic_frontline' } }, { not: { flag: 'doctor_left' } }],
        },
        outcomes: [
          {
            weight: 1,
            text: '你没有惊天动地的高光时刻，只有一万多个小时的门诊、查房和夜班。有位从你规培时就挂你号的老病人，今年带着孙女来，说"还是找你看着放心"。这句话不值钱，也最值钱——它是十二年临床生涯的年终总评。',
            effects: [{ stats: { mindset: 6, network: 3 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '回望离开临床之后的这些年',
        visibleIf: { flag: 'doctor_left' },
        outcomes: [
          {
            weight: 1,
            text: '你离开了临床，但没有离开医疗。这些年你做过的每一份工作，多少都带着当年白大褂的影子。同学聚会上有人问你后不后悔学医，你想了想说："后悔过，但如果重来一次，大概还是会在志愿表上写下那五个字。"',
            effects: [{ stats: { mindset: 6, health: 2 } }],
          },
        ],
      },
    ],
  },
];
