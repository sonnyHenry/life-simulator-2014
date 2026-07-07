import type { GameEvent } from '@life-sim/core';

// 心理学线专属里程碑事件(7 个,2018-2026 全程覆盖,与金融/医学线对齐)。
// 这条线的时代锚点:2017 咨询师资格证取消后的考证乱象、2020 疫情心理热线、
// 2021 双减与学生心理健康新政、2023 后疫情咨询需求爆发、2024 行业规范化。
// 主题与其他线刻意区分:别的线卷的是钱和编制,这条线卷的是"共情也是体力活"。
// 子状态 flag:psy_school(学校心理老师)/ psy_counselor(咨询机构)/
// psy_industry(转行 HR·用研)/ psy_private_practice(个人执业)。
export const careerPsychologyEvents: GameEvent[] = [
  {
    id: 'ev_psy_first_job_2018',
    pools: ['work'],
    category: 'career',
    title: '心理学毕业生的三岔口',
    text: '2018年,你拿着心理学学位走进招聘会,发现最扎心的问题不是"你会什么",而是"你们这个专业……是能给人算命吗?"。对口岗位少得可怜:学校心理老师要编制名额,咨询机构开的工资像实习补贴,倒是 HR 和用户研究的展位,对你的专业背景频频点头。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_psychology' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'school',
        text: '考进学校,做专职心理老师',
        visibleIf: { flag: 'first_job_track', equals: 'psy_elite_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你挤过了心理教师岗的独木桥。报到那天,你发现全校两千多个学生,心理老师算上你一共两个,你的办公室在实验楼最角落,门牌还是新钉的。工资不高,但你有了一间自己的咨询室——虽然大多数时候,它被借去开年级会。',
            effects: [
              { stats: { money: 6000, mindset: 4, network: 3 } },
              { setFlag: 'psy_school' },
            ],
          },
        ],
      },
      {
        id: 'counselor',
        text: '进心理咨询机构,从助理做起',
        outcomes: [
          {
            weight: 1,
            text: '你进了一家心理咨询机构做助理:接电话、排个案、给咨询师整理逐字稿。月薪数字让你不敢跟同学聚会,但你离真正的咨询室只隔一面单向玻璃。带你的督导说了句你记了很多年的话:"这行前五年是还债,还你想帮人这个念头的债。"',
            effects: [
              { stats: { money: 2500, knowledge: 6, mindset: -3 } },
              { setFlag: 'psy_counselor' },
            ],
          },
        ],
      },
      {
        id: 'industry',
        text: '转身进企业,做 HR 或用户研究',
        outcomes: [
          {
            weight: 1,
            text: '你把简历上的"实验设计""量表编制"翻译成"数据驱动""洞察用户",进了一家公司做用户研究。工资体面,同事友好,只是每次访谈结束,你都有点恍惚:你学了四年怎么理解人,最后用来理解的是"用户"。',
            effects: [
              { stats: { money: 10000, network: 5, mindset: -2 } },
              { setFlag: 'psy_industry' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_certificate_2019',
    pools: ['work'],
    category: 'career',
    title: '证书废墟上的生意',
    text: '2019年,距离国家取消心理咨询师职业资格证已经两年,培训市场却比从前更热闹了:"国际注册心理咨询师""高级心理疗愈师",几千到几万的课程广告塞满你的朋友圈,连你亲戚都转发问你"这个证靠谱吗"。你比谁都清楚:证没了,但这行真正的门槛——长程培训、个人体验、督导时数——一样都便宜不了。',
    mandatory: true,
    trigger: {
      all: [
        { flag: 'career_psychology' },
        { not: { flag: 'psy_industry' } },
        { year: { from: 2019, to: 2019 } },
      ],
    },
    choices: [
      {
        id: 'a',
        text: '咬牙报系统长程培训,给自己修内功',
        outcomes: [
          {
            weight: 1,
            text: '你报了一个两年制的系统培训,学费花掉你大半年积蓄,周末全部搭进去上课和写个案报告。同学里有人中途退了,说"还不如考个编"。你没退。两年后回头看,这笔钱是你职业生涯里回报率最高的一笔投资——虽然当时它看起来只像一张更贵的智商税发票。',
            effects: [
              { moneyCost: { rate: 0.35, min: 8000, max: 30000, roundTo: 1000, reason: 'other' } },
              { stats: { knowledge: 9, mindset: -3, network: 4 } },
              { setFlag: 'psy_trained' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先不砸钱,靠公开课和读书自己啃',
        outcomes: [
          {
            weight: 1,
            text: '你把省下的学费换成了一书架专业书和熬夜看完的公开课。知识是真的,但这行认"时数"和"师承",简历上"自学"两个字在督导眼里约等于空白。你安慰自己:至少没被割韭菜——只是成长这件事,好像也没有免费的近道。',
            effects: [{ stats: { knowledge: 4, mindset: -2, money: 1000 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_hotline_2020',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '热线的那一端',
    text: '2020年初,疫情把所有人关在家里,心理援助热线在一夜之间成了刚需。高校、医院、公益组织到处在招募有专业背景的接线志愿者,你的督导群里发来排班表:"缺人,能上的报名。"你戴上耳机之前以为自己准备好了,直到第一通电话接通——那一端的呼吸声,比任何教科书都重。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_psychology' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '报名接线,把专业交出去',
        outcomes: [
          {
            weight: 1,
            text: '那几个月,你接过凌晨三点的恐慌发作,接过隔离酒店里的失眠,也接过一通只是想找人说说话的电话。你第一次真切地感到,这个总被问"是不是算命"的专业,在某些时刻真的接得住人。挂掉最后一班热线那天,你在排班群里打了一行字:"随时可以再叫我。"',
            effects: [
              { stats: { mindset: 6, knowledge: 5, network: 5, health: -4 } },
              { setFlag: 'psy_hotline_volunteer' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '量力而行,先守好自己的生活',
        outcomes: [
          {
            weight: 1,
            text: '你评估了一下自己的状态,没有报名。有同行在朋友圈里连轴转,你替他们捏把汗,也替自己松口气。这行有句老话:"你不能给出你没有的东西。"照顾好自己不是逃兵,只是这个道理,要很多年后你才能理直气壮地说出口。',
            effects: [{ stats: { health: 3, mindset: -3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_youth_wave_2021',
    pools: ['work'],
    category: 'career',
    title: '被看见的青少年',
    text: '2021年,双减落地,教育部发文要求中小学配齐专职心理教师、给学生做心理健康筛查。一夜之间,"青少年心理"从冷板凳变成了热搜词:学校在抢人,机构的青少年个案排到三个月后,家长群里流传着各种版本的"抑郁筛查量表"。这个社会好像突然想起来——孩子不只是分数。',
    mandatory: true,
    trigger: {
      all: [
        { flag: 'career_psychology' },
        { not: { flag: 'psy_industry' } },
        { year: { from: 2021, to: 2021 } },
      ],
    },
    choices: [
      {
        id: 'school_wave',
        text: '接住政策的风,在学校系统里扎根',
        visibleIf: { flag: 'psy_school' },
        outcomes: [
          {
            weight: 1,
            text: '文件下来之后,你的角落办公室突然被想起来了:筛查方案要你出,危机干预流程要你写,连家长会都要你上台讲二十分钟。累是真累,但你带的第一批"重点关注"学生里,有个孩子悄悄在你桌上放了包糖。你把糖纸夹进了工作手册。',
            effects: [
              { stats: { money: 5000, mindset: 6, network: 4, health: -3 } },
              { setFlag: 'psy_school_backbone' },
            ],
          },
        ],
      },
      {
        id: 'case_wave',
        text: '在个案潮里连轴转,把口碑做出来',
        visibleIf: { not: { flag: 'psy_school' } },
        outcomes: [
          {
            weight: 1,
            text: '你的个案表第一次排满了,大半是被学校筛查"筛出来"的孩子和比孩子更焦虑的家长。你一周做二十几个小时咨询,下班路上耳朵里还嗡嗡响。督导提醒你注意耗竭,你点头,然后又加了一个周六的时段——这行等一个"被需要"的年份,等太久了。',
            effects: [
              { stats: { money: 12000, knowledge: 5, mindset: -4, health: -5 } },
              { setFlag: 'psy_caseload_boom' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_boom_2023',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '需求爆发之年',
    text: '2023年,疫情三年攒下的情绪账单开始集中兑付:咨询预约排队、冥想 App 融资、"心理咨询师"第一次出现在招聘热榜上。平台找上门来谈合作,抽成从三成起步;也有同行拉你合伙开工作室,场地租金和来访量都要自己扛。这个行业突然从"没人信"变成了"人人谈",而你要决定自己站在哪个位置收这张时代的账单。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_psychology' }, { year: { from: 2023, to: 2023 } }] },
    choices: [
      {
        id: 'private',
        text: '出来单干,挂牌个人执业',
        visibleIf: { not: { flag: 'psy_industry' } },
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'success',
            text: '你租了间小小的咨询室,墙刷成让人安心的米色。前三个月你对着空荡荡的预约表怀疑人生,第四个月开始,老来访的转介绍一个接一个。年底你算账:收入超过了从前的死工资,而且每一分钱,都来自有人在你这里被认真听过。',
            effects: [
              { moneyCost: { rate: 0.2, min: 5000, max: 25000, roundTo: 1000, reason: 'other' } },
              { stats: { money: 30000, mindset: 5, network: 4, health: -3 } },
              { setFlag: 'psy_private_practice' },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'failure',
            text: '你挂了牌才发现,执业的一半是咨询,另一半是招租广告、平台抽成和月底的场地租金。来访量始终没爬上盈亏线,一年后你把咨询室退了,回到机构挂靠。这一年你亏了钱,但也认清了一件事:会做咨询和会经营,是两门手艺。',
            effects: [
              { moneyCost: { rate: 0.3, min: 8000, max: 40000, roundTo: 1000, reason: 'other' } },
              { stats: { mindset: -8, knowledge: 4 } },
            ],
          },
        ],
      },
      {
        id: 'stay',
        text: '留在现在的位置,稳稳接住这波需求',
        visibleIf: { not: { flag: 'psy_industry' } },
        outcomes: [
          {
            weight: 1,
            text: '你没有出去单干。需求涨了,你的时薪和话语权也跟着涨,只是大头依然归机构和平台。同行群里天天有人晒工作室开业的九宫格,你偶尔心痒,但更多时候你想:先把手上这些来访者陪稳,牌子什么时候都能挂。',
            effects: [{ stats: { money: 15000, mindset: 2, health: -2 } }],
          },
        ],
      },
      {
        id: 'return',
        text: '被老同学劝说"回来吧,行业不一样了"',
        visibleIf: { flag: 'psy_industry' },
        outcomes: [
          {
            weight: 1,
            text: '做咨询的老同学半开玩笑地拉你入伙:"现在缺的就是你这种懂用户又懂专业的。"你认真考虑了两周,最后决定以合伙人身份入局,一边做企业 EAP,一边重新捡起个案。绕了五年,你又回到了这个专业身边——这次是它需要你。',
            effects: [
              { stats: { money: 8000, mindset: 6, network: 5 } },
              { setFlag: 'psy_private_practice' },
            ],
          },
          {
            weight: 1,
            text: '你听完老同学的蓝图,礼貌地举杯,没有接话。企业这几年你升了职,房贷车贷都指着这份薪水,"情怀"两个字在还款日面前很安静。散场时老同学拍拍你:"也对,你现在这样挺好。"你笑了笑,心里有个角落轻轻空了一下。',
            effects: [{ stats: { money: 6000, mindset: -4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_regulation_2024',
    pools: ['work'],
    category: 'career',
    title: '野蛮生长的尽头',
    text: '2024年,行业开始清算这几年的野蛮生长:媒体曝光"速成咨询师"乱象,地方出台管理办法,平台连夜下架一批资质存疑的从业者;另一边,AI 聊天应用开始宣称"24 小时心理陪伴,价格是人类咨询师的百分之一"。凭本事吃饭的时代好像来了,但"本事"两个字,先要经得起查,再要经得起比。',
    mandatory: true,
    trigger: {
      all: [
        { flag: 'career_psychology' },
        {
          any: [
            { flag: 'psy_school' },
            { flag: 'psy_counselor' },
            { flag: 'psy_private_practice' },
          ],
        },
        { year: { from: 2024, to: 2024 } },
      ],
    },
    choices: [
      {
        id: 'a',
        text: '把资质和时数补扎实,欢迎大浪淘沙',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'psy_trained' },
            text: '整顿的名单公布那天,你翻出这些年攒下的培训证书、督导记录和个案时数,一页页扫描上传。你早年咬牙投进去的那些学费,在这一刻变成了护城河。同行少了一批,你的预约表反而更满了——原来"慢"也可以是竞争力。',
            effects: [{ stats: { money: 10000, mindset: 5, network: 3 } }],
          },
          {
            weight: 1,
            text: '你开始恶补这些年欠下的功课:补督导、攒时数、把履历上每一行都变成经得起查的样子。过程狼狈,花钱也心疼,但你清楚,这一关躲不过去——这行最终要靠"可以被验证的专业"活下来,而不是朋友圈里的头衔。',
            effects: [
              { moneyCost: { rate: 0.15, min: 5000, max: 20000, roundTo: 1000, reason: 'other' } },
              { stats: { knowledge: 6, mindset: -4 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '研究 AI 工具,把它变成自己的副驾',
        outcomes: [
          {
            weight: 1,
            text: '你没有跟着同行焦虑"要被 AI 取代了",而是把它拆开来用:让它整理逐字稿、做心理教育素材、给来访者当两次咨询之间的"练习伙伴"。你渐渐确认了一件事:它接得住信息,接不住沉默。而这行最贵的,恰恰是接住沉默的能力。',
            effects: [{ stats: { knowledge: 7, mindset: 3, money: 5000 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_psy_decade_2026',
    pools: ['work'],
    category: 'career',
    title: '听了十二年',
    mandatory: true,
    trigger: { all: [{ flag: 'career_psychology' }, { year: { from: 2026, to: 2026 } }] },
    text: '2026年,你收拾旧物,翻出大学时的普通心理学课本,扉页上还写着当年的豪言:"我要搞懂人。"十二年过去,这个专业从"是不是算命"被问到"你们现在很吃香吧",热线、双减、需求爆发、行业整顿,每一站你都在场。你还是没有完全搞懂人——但你学会了陪人待在"搞不懂"里,而这恰好是这门手艺的全部秘密。',
    choices: [
      {
        id: 'school',
        text: '回望学校那间角落里的咨询室',
        visibleIf: { flag: 'psy_school' },
        outcomes: [
          {
            weight: 1,
            text: '你的办公室还在实验楼角落,但门牌旧了,预约本换到了第十几本。毕业的学生偶尔回来看你,坐在当年那把椅子上说"老师,我现在好多了"。编制内的工资单从来没让人心跳过,但这些时刻会。你想,这大概就是你的年终奖。',
            effects: [{ stats: { mindset: 8, network: 3 } }],
          },
        ],
      },
      {
        id: 'private',
        text: '回望自己挂牌的这几年',
        visibleIf: { flag: 'psy_private_practice' },
        outcomes: [
          {
            weight: 1,
            text: '你的咨询室墙上没有锦旗,只有一幅来访者送的画。十二年,你从接电话的助理做到有自己转介绍名单的执业者,靠的不是风口,是一小时一小时坐出来的时数。这个行业还年轻,还乱,但你已经可以对当年那个在招聘会上被问"算命吗"的自己说:你选的路,是真的。',
            effects: [{ stats: { mindset: 8, money: 8000 } }],
          },
        ],
      },
      {
        id: 'counselor',
        text: '回望在机构里熬出来的这些年',
        visibleIf: {
          all: [{ flag: 'psy_counselor' }, { not: { flag: 'psy_private_practice' } }],
        },
        outcomes: [
          {
            weight: 1,
            text: '你还在机构,只是名字从排班表的末尾挪到了督导栏。新来的助理问你"这行前几年是不是特别难",你想起当年那句"前五年是还债",笑了笑说:"是,但债还完之后,你会发现自己攒下的不是钱,是别人愿意把人生讲给你听的资格。"',
            effects: [{ stats: { mindset: 7, knowledge: 3 } }],
          },
        ],
      },
      {
        id: 'industry',
        text: '回望这条绕开咨询室的路',
        visibleIf: {
          all: [{ flag: 'psy_industry' }, { not: { flag: 'psy_private_practice' } }],
        },
        outcomes: [
          {
            weight: 1,
            text: '你最终没有坐进咨询室,但心理学一直在你身上:你做的调研更懂人,带的团队更少内耗,连裁员谈话都被 HR 部门当成教科书。有人问你后悔吗,你想了想说:"专业给了我一双眼睛,用它看哪里,是我自己的事。"',
            effects: [{ stats: { mindset: 6, money: 6000 } }],
          },
        ],
      },
    ],
  },
];
