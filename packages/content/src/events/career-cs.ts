import type { GameEvent } from '@life-sim/core';

// 计算机线专属里程碑事件。原先分散在 work.ts 里，随金融/医学线独立成文件的惯例一并搬迁到这里，
// 方便和 career-finance.ts / career-medicine.ts 对照维护、及时发现断更年份。
export const careerCsEvents: GameEvent[] = [
  {
    id: 'ev_cs_first_job_2018',
    pools: ['work'],
    category: 'career',
    title: '第一份技术岗',
    text: '2018年，你正式进入技术岗。招聘网站上大家都叫自己工程师，但工牌背后的起点差异很快显现：学校、专业、实习、内推，每一项都会变成面试官的眼神。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'elite',
        text: '接住大平台的机会',
        visibleIf: { flag: 'first_job_track', equals: 'big_tech_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你进了大平台。系统复杂，同事很强，日报周报也很密。985/211 没有让你轻松，但它确实把你送到了更大的牌桌旁。',
            effects: [
              { stats: { money: 18000, knowledge: 5, network: 5, mindset: -4 } },
              { setFlag: 'big_platform_start' },
            ],
          },
        ],
      },
      {
        id: 'ordinary',
        text: '从普通技术岗做起',
        visibleIf: {
          any: [
            { flag: 'first_job_track', equals: 'ordinary_tech_candidate' },
            { flag: 'first_job_track', equals: 'big_tech_candidate' },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你进了一家中小公司，什么都要做：前端、后端、上线、客服群答疑。履历不够亮，就只能先靠手上的活把路凿出来。',
            effects: [
              { stats: { money: 9000, knowledge: 6, mindset: -2 } },
              { setFlag: 'ordinary_platform_start' },
            ],
          },
        ],
      },
      {
        id: 'applied',
        text: '先做实施和外包项目',
        visibleIf: {
          any: [
            { flag: 'major_track', equals: 'cs_applied' },
            { flag: 'first_job_track', equals: 'ordinary_tech_candidate' },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你从实施、驻场和外包项目开始。工作不体面，但很具体。你学会了和甲方沟通，也学会了在烂需求里保住基本尊严。',
            effects: [
              { stats: { money: 6000, knowledge: 4, network: 2, mindset: -3 } },
              { setFlag: 'outsourcing_start' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_work_996',
    pools: ['work'],
    category: 'career',
    title: '大小周',
    text: '部门开始执行“大小周”，加班费给得不含糊，但周日的太阳你已经一个月没见过了。组长在周会上说：“现在是业务关键期，大家再顶一顶。”这几天你刷到一个叫“996.ICU”的项目冲上了 GitHub 热榜第一，一句话简介写着“工作 996，生病 ICU”。你把这行字念给同事听，两个人对着屏幕苦笑，没人敢转发到工作群。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2019, to: 2019 } }] },
    choices: [
      {
        id: 'a',
        text: '顶就顶，趁年轻多攒钱',
        outcomes: [
          {
            weight: 1,
            text: '这一年你的工资条很好看，体检报告不太好看。你在工位抽屉里备了枸杞和护肝片，同事说你这叫“朋克养生”。',
            effects: [{ stats: { money: 15000, mindset: -16, health: -14 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '到点下班，绩效随缘',
        outcomes: [
          {
            weight: 1,
            text: '你成了组里唯一准点走的人。绩效拿了个“符合预期”，年终奖薄了一截。但你重新捡起了跑步，体重和心情都轻了一点。',
            effects: [{ stats: { mindset: 3, health: 6 } }, { setFlag: 'low_perf' }],
          },
        ],
      },
      {
        id: 'c',
        text: '只接一个周末短单，合同和交付边界写清楚',
        outcomes: [
          {
            weight: 2,
            text: '你挑了个边界清楚的小项目，只用自己的设备，也不碰公司的客户。甲方按时付款，你多攒了一笔钱，也确认了一个现实：副业不是下班后的轻松收入，它是第二份交付责任。',
            effects: [{ stats: { money: 32000, knowledge: 3, mindset: -8, health: -18 } }],
          },
          {
            weight: 1,
            text: '合同写得再清楚，需求还是会蔓延。短单拖成三个月，你白天开会，晚上改稿，主业汇报也开始掉线。钱是赚到了，但绩效面谈里那句“最近状态不太稳”，你听得很清楚。',
            effects: [{ stats: { money: 12000, knowledge: 2, mindset: -12, health: -20 } }, { setFlag: 'low_perf' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_antitrust',
    pools: ['work'],
    category: 'career',
    title: '风向变了',
    text: '2021年，反垄断和平台治理成了新闻关键词。公司全员会上，老板不再讲“星辰大海”，开始讲“组织健康”和“长期主义”。你听懂了：增长不再是万能答案。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '收缩预期，先保住位置',
        outcomes: [
          {
            weight: 1,
            text: '你把跳槽网站的简历状态改成了“暂不考虑”。少谈理想，多做交付。成年人的安全感，有时就是下个月工资照发。',
            effects: [{ stats: { money: 20000, mindset: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '趁窗口还在，换到更核心团队',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 20 },
            text: '你靠内推换到了更核心的业务。新团队更累，但履历更硬。你第一次感觉，人脉不是饭局，是关键时刻有人愿意把你的简历递进去。',
            effects: [{ stats: { money: 30000, network: 5, mindset: -7 } }],
          },
          {
            weight: 1,
            text: '你投了几家，都没有后续。市场突然冷了下来，HR 的已读不回也变得很有礼貌。',
            effects: [{ stats: { mindset: -6 } }, { setFlag: 'cs_switch_failed' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_layoff_2022',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '毕业名单',
    text: '2022年春天，公司内网多了一个新词：“组织优化”。一开始只是传闻，某个业务线“合并”了，某个高管“个人原因”离开了。然后会议室开始被 HR 长期征用，门上贴着“占用中”，一贴就是一整周。你看到平时一起吃午饭的同事被一个个叫进去，出来的时候有人平静，有人眼圈红着，共同点是当天下午工位就清空了。茶水间没人聊八卦了，大家都在低头刷手机——刷的都是脉脉。这天上午十点，你的日历上弹出一个半小时后的会议邀请，发起人是 HRBP，没有议题，没有附件。你盯着那个通知看了很久，第一次觉得胸前的工牌这么轻。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'a',
        text: '接受补偿，重新找',
        outcomes: [
          {
            weight: 1,
            text: '会议室里，HR 的话术标准得像录音：“感谢你的贡献……业务调整……N+1。”你听着，忽然发现自己在数她桌上的纸巾盒——原来是给谁准备的，现在知道了。你没有用上纸巾。签字，交电脑，退工卡，整个流程四十分钟，比入职快多了。抱着纸箱走出大堂时，春天的太阳很好，好得有点讽刺。N+1 到账那天，你的心情很复杂：钱是真的，一下子空出来的日子也是真的。那晚你把简历翻出来改到凌晨，改着改着想起上一次这么认真填自己的信息，还是高考报志愿。好，那就再考一次。',
            effects: [
              { stats: { money: 90000, mindset: -16, health: 2 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '主动降预期，留在船上',
        outcomes: [
          {
            weight: 1,
            text: '那场会不是裁你，是给你选择：转岗到一个更累的业务，薪包“结构调整”，干不干？你想起每个月的账单、想起家里的电话、想起脉脉上“三十岁投一百份简历无人问津”的帖子，说：干。于是你留下来了。留下来的代价是接手了三个人的活，奖金缩了一圈，团建取消，连零食柜都变得空空荡荡。离开的同事在群里发“山高水长，后会有期”，配了合照。你盯着合照看了一会儿，把它保存了下来。幸存者没有掌声，只有更多的需求排期，和一个再也不敢关声音的钉钉。',
            effects: [
              { stats: { money: 15000, mindset: -14, health: -8 } },
              { setFlag: 'survived_layoff' },
              { schedule: { eventId: 'ev_cs_second_wave', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_ai_2023',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: 'AI 来了',
    text: '2023年初，部门群里开始疯转 ChatGPT 的截图：它写的周报比组长写得像周报，它生成的代码能跑，它甚至会用你们内部黑话编冷笑话。一开始大家当乐子看，后来笑声慢慢变了味——测试组的同事用它十分钟写完了以前一下午的用例，隔壁组开始讨论“提效之后编制怎么算”。中午吃饭，有人半开玩笑地说：“咱们是不是在给自己的替代品当陪练？”没人接话，筷子声都轻了。下午你打开那个对话框，光标一闪一闪。你敲了第一个问题，像推开一扇有风的门：门后面不知道是什么，但风已经吹到脸上了。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2023, to: 2023 } }] },
    choices: [
      {
        id: 'a',
        text: '把它当新工具，立刻学',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'survived_layoff' },
            text: '去年裁员留下来的人里，你是学得最凶的那个。别人下班你在调提示词，别人周末你在搭工作流，组里第一个把 AI 接进业务流程的方案是你写的，评审会上连一贯挑刺的架构师都点了头。你比谁都清楚自己为什么这么拼：上一轮活下来靠的是降预期，那是运气加姿态；这一轮要活，得靠真本事。年底绩效面谈，领导说了句“你今年的成长曲线很陡”。你笑了笑没解释——陡，是因为悬崖就在脚后跟。AI 没有让你变得更安全，但它确实让你变得更有用。在 2023 年，这已经是能拿到的最好的东西了。',
            effects: [
              { stats: { knowledge: 11, money: 20000, mindset: -1, health: -4 } },
              { setFlag: 'ai_adapted' },
            ],
          },
          {
            weight: 1,
            condition: { not: { flag: 'survived_layoff' } },
            text: '你决定不跟它较劲，跟它合作。先是让它写脚手架和单元测试，然后是查文档、理旧代码，再后来你的简历也让它改了一版——它把“负责若干模块开发”改成了三行带数字的成果，你看着有点脸红，但确实更好。效率实打实地上去了，焦虑却没有消失，只是换了个位置：以前怕活干不完，现在怕自己干的活太容易被描述清楚。你在某个加班的深夜想明白了一件事，并把它写进了年度总结：工具越强，越提醒你别只做工具能做的事。这句话领导画了波浪线，批注“深刻”。',
            effects: [
              { stats: { knowledge: 10, money: 20000, mindset: -2, health: -4 } },
              { setFlag: 'ai_adapted' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '先观望，别被概念割韭菜',
        outcomes: [
          {
            weight: 2,
            text: '你见过太多风口了：O2O、区块链、元宇宙，每一个都说要改变世界，每一个都先改变了一批人的钱包。所以这次你决定等子弹飞一会儿。子弹飞得比你想的快：半年后，它进了公司的工具链，变成了周会上的“提效指标”；一年后，新来的实习生用它的熟练度让你沉默。你开始补课，补得很快——基本功还在，追上不难。只是最早那波红利，和红利期里那种“我在浪潮前排”的心气，是补不回来的。你没有被割韭菜，只是这一次，谨慎本身也是有价格的。',
            effects: [{ stats: { knowledge: 3, mindset: -4 } }],
          },
          {
            weight: 1,
            text: '半年后，概念潮水退了一轮：隔壁组 all-in 的“大模型创新项目”没跑出指标，连人带项目一起被“优化”了。你按自己的节奏补课入场，工具照用、班照上，反而躲过了那轮折腾。风口上第一批起飞的和第一批摔下来的，经常是同一批人。',
            effects: [{ stats: { knowledge: 6, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '裸辞加入朋友的 AI 创业公司，拿期权赌一把',
        outcomes: [
          {
            weight: 3,
            text: '故事的开头很热血：天使轮、路演、通宵改 demo。故事的结尾很常见：A 轮没融到，公司在第十四个月解散。期权变成一段 GitHub 链接，存款烧掉一半，你重新回到招聘软件上，把“创业经历”字斟句酌地包装成“0 到 1 项目经验”。',
            outcomeTag: 'failure',
            effects: [
              { moneyCost: { rate: 0.45, max: 100000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -12, health: -10, knowledge: 6 } },
            ],
          },
          {
            weight: 1,
            text: '你们做的方向踩中了一波真需求，第二年被一家大厂整体收购。期权按比例折了现，虽然不是财务自由的数目，但足够让你在同学群里保持沉默的微笑。更值钱的是履历：你从“用 AI 的人”变成了“做过 AI 产品的人”。',
            outcomeTag: 'success',
            effects: [{ stats: { money: 150000, knowledge: 9, network: 6, mindset: 4, health: -9 } }, { setFlag: 'ai_adapted' }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_second_wave',
    pools: [],
    category: 'career',
    title: '第二轮优化',
    text: '“降本增效”进入第二季。这次没有全员大会，只有一个个被拉进小会议室的日历邀请。你去年主动降过预期，但名单从来不看苦劳。',
    choices: [
      {
        id: 'a',
        text: '主动申请转岗，去离收入最近的业务',
        outcomes: [
          {
            weight: 1,
            text: '你赶在名单敲定前转去了商业化团队。新业务节奏更狠，但至少工牌还是热的。你开始明白，大厂里最稳的岗位，是离钱最近的岗位。',
            effects: [{ stats: { money: 12000, knowledge: 4, mindset: -2, health: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不折腾，赌名单上没有我',
        outcomes: [
          {
            weight: 2,
            text: '这一轮的刀落在了隔壁组。你继续留在原地，只是把工位上的私人物品，悄悄减到了一个背包能装下的量。',
            effects: [{ stats: { money: 8000, mindset: 2 } }],
          },
          {
            weight: 1,
            text: '日历邀请最终还是来了。HR 的话术，和去年你目送同事离开时听到的一模一样。N+1 到账，你在楼下坐了很久，把去年没敢想的问题想完了。',
            outcomeTag: 'failure',
            effects: [
              { stats: { money: 80000, mindset: -18, health: -4 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_reemployment',
    pools: [],
    category: 'career',
    title: '空窗期之后',
    text: '被裁后的第几个月，你已经数不清投了多少份简历。面试官的问题越来越像审讯：“这段空窗期你在做什么？”这天，你同时收到两个消息：一个降薪三成的 offer，和一句“再等等，还有更合适的”的猎头留言。',
    choices: [
      {
        id: 'a',
        text: '降薪也先上车，活下来再说',
        outcomes: [
          {
            weight: 1,
            text: '你签了。工资少了一截，心里的石头却落了地。入职第一天，你把新工卡拍照发给爸妈。他们不懂“降薪三成”意味着什么，只回了一句：“上班就好。”',
            effects: [{ stats: { money: 25000, mindset: 8 } }, { setFlag: 'restarted_after_layoff' }],
          },
        ],
      },
      {
        id: 'b',
        text: '再撑一撑，等一个不将就的机会',
        outcomes: [
          {
            weight: 1,
            text: '三个月后，你等到了那个位置——薪资没降，方向也对。回头看，那段空窗期像一场没人监考的考试，你交卷交得比想象中体面。',
            effects: [{ stats: { money: 40000, mindset: 10 } }, { setFlag: 'restarted_after_layoff' }],
          },
          {
            weight: 1,
            text: '存款以肉眼可见的速度变薄，合适的机会始终差半步。最后你接了一份过渡的工作。成年人的底气，原来是按月发放的。',
            effects: [
              { moneyCost: { rate: 0.15, max: 15000, roundTo: 1000, reason: 'daily' } },
              { stats: { mindset: -6 } },
              { setFlag: 'restarted_after_layoff' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_35_crisis_2024',
    pools: ['work'],
    category: 'career',
    title: '35岁红线',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2024, to: 2024 } }] },
    text: '2024年，“35岁”这个数字第一次让你觉得扎眼。组里流传的优化名单据说按“薪资倒挂 + 年龄”排序，茶水间的话题从“这个需求怎么排期”变成了“你猜下一个是谁”。你翻了翻工牌，工号已经是四位数打头——原来自己不知不觉，也成了“老员工”里的一个。',
    choices: [
      {
        id: 'a',
        text: '主动申请转管理，带团队而不是自己写代码',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'ai_adapted' },
            text: '你把这两年用 AI 提效的经验整理成了一套团队方法论，答辩时讲得比谁都具体。领导说：“你这两年的成长曲线，正好补上带人的那块。”转岗批下来，你第一次要为别人的产出负责，比自己写代码更累心，但你清楚，这条路能走得比纯写代码更远一点。',
            effects: [{ stats: { money: 15000, knowledge: 3, network: 4, mindset: -3 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'ai_adapted' } },
            text: '你也提交了转管理的申请，只是答辩时能拿出的“团队产出”故事比别人单薄一些。组里正好缺人手，你还是勉强过了，只是心里清楚，这个位置换个考核周期，随时可能被重新审视。',
            effects: [{ stats: { money: 8000, network: 2, mindset: -6 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '死磕技术，卷更高职级',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'knowledge', op: '>=', value: 70 },
            text: '答辩顺利通过，你评上了更高职级，工资跳了一档。你成了组里少数扛过“35岁红线”还往上走的人——代价是你比刚毕业那几年更清楚，这个职级答辩，可能还要再来一次。',
            effects: [{ stats: { money: 20000, mindset: 4 } }],
          },
          {
            weight: 1,
            text: '答辩没有通过，你留在原职级，继续和刚校招进来的年轻人拼手速、拼体力、拼谁的方案改得更快。你开始明白，“年轻”本身，原来也是一种竞争力，只是它会自然流逝，没法靠加班补回来。',
            effects: [{ stats: { mindset: -5, health: -4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '悄悄看出海或自由职业的机会',
        outcomes: [
          {
            weight: 1,
            condition: { any: [{ flag: 'survived_layoff' }, { flag: 'cs_switch_failed' }] },
            text: '经历过降本增效和跳槽碰壁，你早就给自己留了后手：联系了几个做海外接单的朋友，接了几单不算多但确定能落袋的私活。这条退路你悄悄铺了快一年，没跟任何同事提起过。',
            effects: [{ stats: { money: 10000, network: 3, mindset: 2 } }],
          },
          {
            weight: 1,
            condition: { not: { any: [{ flag: 'survived_layoff' }, { flag: 'cs_switch_failed' }] } },
            text: '你投了几份海外业务和自由职业的简历，回复寥寥。想想眼下手头的工作也还稳定，你决定先按兵不动，只是把这份念想存进了收藏夹。',
            effects: [{ stats: { mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_overseas_2025',
    pools: ['work'],
    category: 'career',
    title: '出海的邀请',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2025, to: 2025 } }] },
    text: '部门收到通知：明年重点押注东南亚/中东市场，要抽调一批人手支援“出海”业务，意味着要跟当地团队对时差、啃点当地语言和合规常识，还有大概率的短期出差。HR 在邮件末尾加了一句：“这是难得的国际化履历机会。”',
    choices: [
      {
        id: 'a',
        text: '接下调岗，去啃这块硬骨头',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'knowledge', op: '>=', value: 55 },
            text: '你接了这块业务。前几个月被时差和陌生的合规条款折腾得够呛，但你也第一次真正参与了一个从零跑出来的市场。年底汇报时，你的 PPT 里多了一张别人没有的地图。',
            effects: [{ stats: { knowledge: 6, network: 5, money: 12000, mindset: -4, health: -5 } }],
          },
          {
            weight: 1,
            text: '你硬着头皮接下了调岗，但语言和时差的适应比想象中难熬，产出迟迟没跑起来。你没有被撤下来，但每次周会汇报，你都觉得自己在补一门临时抱佛脚的课。',
            effects: [{ stats: { knowledge: 3, mindset: -8, health: -6 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '婉拒，继续留在国内业务',
        outcomes: [
          {
            weight: 1,
            text: '你找了个理由婉拒了调岗。国内业务的节奏你早就摸熟了，稳定，但也确实没什么新故事可讲。后来出海那批同事聚在一起总有说不完的话题，你偶尔插不上嘴，也不算太遗憾。',
            effects: [{ stats: { mindset: 1, money: 5000 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_cs_decade_2026',
    pools: ['work'],
    category: 'career',
    title: '十二年后，还在敲代码',
    mandatory: true,
    trigger: { all: [{ flag: 'career_cs' }, { year: { from: 2026, to: 2026 } }] },
    text: '十二年过去，这行当换了好几轮“颠覆自己”的说法：移动互联网、云计算、大数据，现在是 AI 协作工具。你桌面上常年开着一个 AI 助手窗口，它写脚手架、查文档，甚至能帮你订会议纪要。“程序员”这个身份被反复重新定义，但敲键盘的，还是你这双手。',
    choices: [
      {
        id: 'adapted',
        text: '回望这十二年学技术、追风口的日子',
        visibleIf: { flag: 'ai_adapted' },
        outcomes: [
          {
            weight: 1,
            text: '你没有被任何一轮技术浪潮直接拍在沙滩上，靠的不是运气好，是每一次新东西出现时，你都选择先弄懂它，而不是先恐惧它。AI 没有替代你，因为你一直在往它够不到的地方走一步。回头看，这十二年没有一次是“躺赢”，但也没有一次是真的被落下。',
            effects: [{ stats: { knowledge: 3, mindset: 6 } }],
          },
        ],
      },
      {
        id: 'survivor',
        text: '回望这十二年几起几落的日子',
        visibleIf: { any: [{ flag: 'laid_off' }, { flag: 'cs_switch_failed' }] },
        outcomes: [
          {
            weight: 1,
            text: '裁员、被优化、跳槽碰壁，这些词你都亲身经历过，不止一次。十二年后，工牌换了好几张，但你还在这个行业里。没有人给你颁发“幸存者”奖章，但你自己知道，每一次重新投简历、重新学新工具，都是在给自己发一张。',
            effects: [{ stats: { mindset: 5, health: 2 } }],
          },
        ],
      },
      {
        id: 'steady',
        text: '回望这十二年按部就班的日子',
        visibleIf: { not: { any: [{ flag: 'ai_adapted' }, { flag: 'laid_off' }, { flag: 'cs_switch_failed' }] } },
        outcomes: [
          {
            weight: 1,
            text: '你没有经历过最惨的裁员季，也没赶上最风光的期权造富，十二年里你一直平稳地写代码、按时交付、按时下班。这行当的每一轮喧哗你都看在眼里，却很少真正把自己卷进去。这不是最精彩的故事，但它是你自己选的节奏。',
            effects: [{ stats: { mindset: 4, health: 3 } }],
          },
        ],
      },
    ],
  },
];
