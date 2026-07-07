import type { GameEvent } from '@life-sim/core';

// 金融线专属里程碑事件(7 个,2015-2026 全程覆盖,与计算机线对齐)。
// 与已有的散户视角投资事件(ev_invest_stock_2015/ev_invest_p2p 等)刻意区分开:
// 这里全部是"从业者"视角——同样的时代节点,吃瓜群众看热闹,这条线的人要扛业绩。
export const careerFinanceEvents: GameEvent[] = [
  {
    id: 'ev_college_fin_internship_2015',
    pools: ['college'],
    category: 'career',
    title: '股灾实习',
    text: '2015年暑假，你在一家券商营业部实习。你以为金融是西装革履的体面活儿，直到六月那几天——大厅里的电话没停过，客户经理的声音一天比一天哑，你身边那位从业十年的老带教，盯着屏幕突然说了句从没听过的脏话。',
    mandatory: true,
    trigger: { all: [{ flag: 'major_track', equals: 'finance' }, { year: { from: 2015, to: 2015 } }] },
    choices: [
      {
        id: 'a',
        text: '认真做基础工作，近距离旁观这场教育',
        outcomes: [
          {
            weight: 1,
            text: '你负责整理客户对账单和路演资料，没有自己的仓位，却比谁都看得清全貌：涨的时候没人谈风险，跌的时候没人谈仓位。这份实习没让你赚到钱，但让你比同龄人早三年看懂了"情绪"两个字怎么定价。',
            effects: [
              { stats: { money: 2000, knowledge: 7, network: 5, mindset: -2, health: -2 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '跟着营业部氛围搏一把，拿实习津贴练手',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '你把实习津贴和一部分生活费投了进去，想在带教面前证明自己"懂行"。六月那波下跌里，你的账户和客户的账户一起绿着——只是没人会补偿实习生的亏损。',
            effects: [
              { moneyCost: { rate: 0.6, max: 1500, roundTo: 100, reason: 'investment' } },
              { stats: { mindset: -6, knowledge: 3 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你运气不错，月中听带教一句"先落袋"提前跑了。津贴翻了一倍，你请全组喝了奶茶——虽然你心里清楚，这更多是带教的判断，不是你的本事。',
            effects: [
              { stats: { money: 1200, mindset: 2, knowledge: 3 } },
              { setFlag: 'fin_internship_done' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_first_job_2018',
    pools: ['work'],
    category: 'career',
    title: '第一份金融岗',
    text: '2018年，你正式进入金融行业。名片上都是"分析师"或"专员"，但坐第几排工位、握不握得到核心客户，从第一天起就分出了层次。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2018, to: 2018 } }] },
    choices: [
      {
        id: 'front_office',
        text: '接住前台/投行的机会',
        visibleIf: { flag: 'first_job_track', equals: 'finance_elite_candidate' },
        outcomes: [
          {
            weight: 1,
            text: '你进了投行/券商前台部门。项目排得密不透风，深夜十二点的会议室灯常年亮着，但你也第一次亲眼见到一笔笔亿级交易怎么谈成。工牌挂上脖子那天，你告诉自己：这行没有"轻松的体面"，只有"昂贵的体面"。',
            effects: [
              { stats: { money: 20000, knowledge: 5, network: 6, mindset: -5 } },
              { setFlag: 'finance_front_office' },
            ],
          },
        ],
      },
      {
        id: 'back_office',
        text: '去中后台/资管做起',
        visibleIf: {
          any: [
            { flag: 'first_job_track', equals: 'finance_ordinary_candidate' },
            { flag: 'first_job_track', equals: 'finance_elite_candidate' },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你进了一家机构的中后台，做估值、清算或合规。前台的人年底聊分红，你这边聊的是流程和风控——不性感，但你渐渐明白，这行能活得久的，往往是搞懂规则的人。',
            effects: [
              { stats: { money: 11000, knowledge: 5, mindset: -2 } },
              { setFlag: 'finance_back_office' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_asset_reform_2018',
    pools: ['work'],
    category: 'career',
    title: '资管新规',
    text: '2018年，《资管新规》落地，行业里那句"保本保收益"被明令禁止。你所在机构的产品说明书要全部重写，理财经理们第一次要对客户说"这个产品可能会亏"。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2018, to: 2019 } }] },
    choices: [
      {
        id: 'a',
        text: '跟着部门啃下转型，重新设计产品',
        outcomes: [
          {
            weight: 1,
            text: '你和同事把过去十年的"刚兑"话术全部推翻重写，加班到系统凌晨强制下线。新产品上线那天，你盯着说明书里第一次出现的"不保本"三个字，心情复杂——这才是这个行业本该有的样子。',
            effects: [{ stats: { knowledge: 6, mindset: -5, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '趁行业出清，跳去监管适应更好的机构',
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 20 },
            text: '你靠人脉提前打听到哪些机构转型更稳，跳槽跳在了浪头前面。新东家给的薪水不错，只是你心里清楚，这份"先知先觉"，一半是判断，一半是关系。',
            effects: [{ stats: { money: 15000, network: 5, mindset: -3 } }],
          },
          {
            weight: 1,
            text: '你投了几家看起来"转型更快"的机构，结果发现大家都在同一条起跑线上手忙脚乱。折腾一圈，你又回到了原来的工位。',
            effects: [{ stats: { mindset: -6 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_fund_boom_2020',
    pools: ['work'],
    category: 'career',
    title: '基金热',
    text: '2020年，公募基金彻底出圈。你所在机构的"顶流"基金经理被做成表情包，直播时弹幕刷的都是"求带飞"。渠道部天天催首发规模，你的产品从没被这么多人问起过。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2020, to: 2020 } }] },
    choices: [
      {
        id: 'a',
        text: '顺势而为，冲规模也冲奖金',
        outcomes: [
          {
            weight: 1,
            text: '你配合渠道把发行规模一波推上去，年底奖金到账那一刻很爽。只是你也清楚，这些新进来的钱，很多人连产品说明书都没翻开过。',
            effects: [{ stats: { money: 30000, mindset: -4, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '稳健执业，如实提示风险',
        outcomes: [
          {
            weight: 1,
            text: '你没有跟着把话说满，反而在客户群里多说了几句"高位分批""别梭哈"。奖金没有别人厚，但年底有客户特地发消息谢谢你没让他All in。',
            effects: [{ stats: { money: 12000, mindset: 3, network: 3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '自己也跟投重仓自家爆款产品',
        outcomes: [
          {
            weight: 2,
            outcomeTag: 'failure',
            text: '你把年终奖和一部分积蓄跟投进自己力推的爆款产品，笃定"自己人不会坑自己"。可惜净值这东西不认这份忠诚——它跌起来比宣传页翻得还快。',
            effects: [
              { moneyCost: { rate: 0.3, max: 30000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -8 } },
            ],
          },
          {
            weight: 1,
            outcomeTag: 'success',
            text: '你跟投的仓位刚好踩在发行的甜蜜点上，净值曲线一路向上，你在同事群里第一次被叫"老师"。',
            effects: [{ stats: { money: 25000, mindset: 4 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_fin_regroup_collapse_2021',
    pools: ['work'],
    category: 'career',
    tier: 'major',
    title: '抱团崩塌',
    text: '2021年初，"抱团股"神话轰然倒塌。去年被捧上神坛的那几位"顶流"基金经理，画像从"信仰"变成了群嘲的表情包。你手机每天被两类消息填满：客户在微信群里问"什么时候回本"，风控在内部群里问"敞口能不能再降"。你亲手推荐过的产品净值曲线像坐上了滑梯，那些曾经在酒桌上称呼你"老师"的客户，现在连语音电话都不太接了。你盯着屏幕，第一次真切地明白：这个行业最贵的教育，从来不是亏给自己的钱，而是亲眼看着别人的信任怎么碎掉。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2021, to: 2021 } }] },
    choices: [
      {
        id: 'a',
        text: '顶住，留在牌桌上',
        outcomes: [
          {
            weight: 1,
            text: '你没有走。你陪着客户一个个复盘持仓，把自己跟投的部分也一起套了进去——某种意义上，这是跟客户"共担"最直接的方式。年终奖被追溯扣减，睡眠也跟着扣减，但你留住了几个真正信任你的客户。',
            effects: [
              { moneyCost: { rate: 0.25, max: 80000, roundTo: 1000, reason: 'investment' } },
              { stats: { mindset: -14, health: -6 } },
              { setFlag: 'fin_stayed_after_collapse' },
            ],
          },
        ],
      },
      {
        id: 'b',
        text: '接受离场，转身去别处',
        outcomes: [
          {
            weight: 1,
            text: '公司这一轮"业务收缩"名单上有你的名字。谈补偿那天，HR的话术依旧标准，你却听得有点恍惚——去年这个时候，你还是被客户追着加微信的"红人"。抱着纸箱走出写字楼，你想起了自己入行时那句"这行只认业绩"，现在才明白，业绩也认周期。',
            effects: [
              { stats: { money: 35000, mindset: -16, health: 2 } },
              { setFlag: 'laid_off' },
              { schedule: { eventId: 'ev_cs_reemployment', afterRounds: 1 } },
            ],
          },
        ],
      },
    ],
  },
  {
    // 2022 分支切换点:降本增效/裁员季,可在前台与中后台之间转档
    id: 'ev_fin_downsize_2022',
    pools: ['work'],
    category: 'career',
    title: '降本增效那一年',
    text: '2022年,行业的空气一天比一天紧。晨会不再聊规模,聊的是"人效"和"优化";隔壁组一夜之间空了两排工位,HR 的脚步声成了整层楼最让人心跳漏拍的背景音。递延奖金、冻结招聘、合并部门,一封封邮件把每个人的位置重新称了一遍重量。你盯着自己工牌上的部门名,第一次认真想:这张牌桌上,我到底想坐哪个位置。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2022, to: 2022 } }] },
    choices: [
      {
        id: 'front_stay',
        text: '死守前台,业绩就是你的免裁金牌',
        visibleIf: { flag: 'finance_front_office' },
        outcomes: [
          {
            weight: 2,
            text: '你把能见的客户都见了一遍,把手里的项目盯得死死的。裁员名单公布那天,你的名字不在上面——因为你手上的单子还在产钱。留下来的代价是你把自己也"降本增效"了:睡得更少,应酬更多,体检报告上多了两个箭头。',
            effects: [{ stats: { money: 12000, network: 4, mindset: -4, health: -6 } }],
          },
          {
            weight: 1,
            text: '你拼了命,但你所在的条线整体被砍,再好的个人业绩也架不住"战略收缩"四个字。你没进裁员名单,却被调去一个边缘岗位,前台的光环一夜黯淡。你留在了牌桌上,只是椅子被换到了角落。',
            effects: [{ stats: { mindset: -8, network: 2, money: 3000 } }],
          },
        ],
      },
      {
        id: 'front_to_back',
        text: '主动退到中后台,用收入换一份安稳',
        visibleIf: { flag: 'finance_front_office' },
        outcomes: [
          {
            weight: 1,
            text: '你申请转去了风控/合规这样的中后台岗位。奖金和话语权都缩了水,但你不用再把命押在市场情绪上。第一次准点下班回家吃饭那晚,你有点恍惚——原来"体面"不只有前台那一种活法,睡个整觉也是。',
            effects: [
              { setFlag: 'finance_front_office', value: false },
              { stats: { money: -4000, health: 6, mindset: 4 } },
            ],
          },
        ],
      },
      {
        id: 'back_up',
        text: '趁人员动荡,抓住空出来的前台机会',
        visibleIf: { not: { flag: 'finance_front_office' } },
        outcomes: [
          {
            weight: 1,
            condition: { stat: 'network', op: '>=', value: 18 },
            text: '前台走了人,缺口就是机会。你靠这些年在中后台攒下的业务理解和人脉,争到了一个前台岗位。收入台阶一下子抬高,但你也第一天就尝到了那份"体面"的昂贵:业绩指标像秒表一样挂在头顶,滴答作响。',
            effects: [
              { setFlag: 'finance_back_office', value: false },
              { setFlag: 'finance_front_office' },
              { stats: { money: 14000, network: 4, mindset: -3, health: -5 } },
            ],
          },
          {
            weight: 1,
            text: '你想往前台挪,可动荡时期没人敢给新人开口子,几次内部竞聘都卡在"暂缓招聘"。你退回中后台,把这份不甘心暂时收起来:先把手里的流程和风控做到无可替代,机会总会再来。',
            effects: [{ stats: { knowledge: 4, mindset: -3, money: 2000 } }],
          },
        ],
      },
      {
        id: 'back_stay',
        text: '稳守中后台,做那个不可或缺的人',
        visibleIf: { not: { flag: 'finance_front_office' } },
        outcomes: [
          {
            weight: 1,
            text: '风浪最大的时候,你所在的中后台反而成了压舱石:清算不能停,合规不能松,风控更是天天被点名。你没有前台那样的高光,却也没上任何一版裁员名单。这一年你终于确认,自己当初选的这条"不性感"的路,抗周期。',
            effects: [{ stats: { mindset: 3, knowledge: 4, health: 1, money: 3000 } }],
          },
        ],
      },
    ],
  },
  {
    // 2023:AI 进办公室 + 弱市,金融线的技术冲击
    id: 'ev_fin_ai_2023',
    pools: ['work'],
    category: 'career',
    title: '会说话的模型',
    text: '2023年,ChatGPT 把 AI 从新闻标题推到了你的工位上。研究所连夜开会讨论"大模型会不会取代初级分析师",实习生已经开始用它写初稿、跑摘要;而另一边,市场持续低迷,路演台下坐着的客户越来越少,愿意掏钱的更少。技术的浪和行情的冰同时拍过来,你得想清楚:自己那点手艺,哪部分会被替代,哪部分不会。',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2023, to: 2023 } }] },
    choices: [
      {
        id: 'front',
        text: '把 AI 变成前台的新武器',
        visibleIf: { flag: 'finance_front_office' },
        outcomes: [
          {
            weight: 1,
            text: '你不跟 AI 较劲,而是让它替你啃财报、搭模型、写初稿,把省下的时间全花在机器做不了的事上——陪客户吃饭、读人心、在关键时刻拍板。年底你发现,能被模型取代的是"分析",不能被取代的是"信任",而你恰好靠后者吃饭。',
            effects: [{ stats: { knowledge: 6, network: 4, mindset: 2, money: 5000 } }],
          },
        ],
      },
      {
        id: 'back',
        text: '在中后台,用 AI 重做那些重复流程',
        visibleIf: { not: { flag: 'finance_front_office' } },
        outcomes: [
          {
            weight: 2,
            text: '你带头把估值底稿、合规检查里最重复的部分交给脚本和大模型,一个人干出了过去小半个组的活。领导在会上表扬你"有工程思维",你却清楚地意识到:同样的效率提升,反过来也意味着这个岗位以后需要的人更少了。',
            effects: [{ stats: { knowledge: 7, mindset: -3, money: 4000, health: -2 } }],
          },
          {
            weight: 1,
            text: '你学得慢了半拍,新来的年轻人用 AI 把你熟练多年的活儿几小时就跑完。那种"经验贬值"的感觉第一次这么具体地落在你身上。你利用晚上恶补工具,一边追一边安慰自己:焦虑不解决问题,学会才行。',
            effects: [{ stats: { knowledge: 5, mindset: -6, health: -3 } }],
          },
        ],
      },
    ],
  },
  {
    // 2024 收官前奏:限薪/降本与出海,金融线 2022-2026 断更补齐(M5 handoff 遗留项)
    id: 'ev_fin_pay_cut_2024',
    pools: ['work'],
    category: 'career',
    title: '限薪令下',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2024, to: 2024 } }] },
    text: '2024年，这个曾经以年终奖论英雄的行业，开始集体谈论"限薪"和"退薪"。内部通知一封接一封：绩效递延、福利瘦身、差旅降级。与此同时，公司新设的"出海业务部"在悄悄招人——国内卷不动的钱，正在寻找新的地图。酒局上，老同事举着杯感慨："以前是选赛道，现在是选出口。"',
    choices: [
      {
        id: 'a',
        text: '接受降薪留守，把周期熬过去',
        outcomes: [
          {
            weight: 2,
            text: '你签了新的薪酬确认函，数字比三年前瘦了一圈。你把工位上的日历翻到年底，给自己写了句话："牌桌还在，就还有下一局。"降薪的日子里你反而睡得早了——欲望和焦虑，原来是同一笔账的两面。',
            effects: [{ stats: { mindset: -4, health: 4, knowledge: 3 } }],
          },
          {
            weight: 1,
            text: '降薪之后是第二轮"组织优化"，你的部门被合并，汇报线换了三次。你留了下来，但每天上班像在玩抢椅子——音乐随时会停。',
            effects: [{ stats: { mindset: -8, health: -2, money: -3000 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '内部转岗出海业务，跟着资金找出口',
        outcomes: [
          {
            weight: 2,
            text: '你转去了出海业务部，研究的东西从"国内怎么卷"变成"新加坡的牌照、中东的钱、墨西哥的厂"。半年飞了八趟国外，时差和汇率成了你的日常词汇。薪水没有回到巅峰，但你重新有了那种"在牌桌前排"的感觉。',
            effects: [
              { stats: { money: 18000, knowledge: 5, network: 4, health: -5 } },
              { setFlag: 'fin_went_overseas' },
            ],
          },
          {
            weight: 1,
            text: '出海听起来性感，落地全是琐碎：牌照卡审批、合作方跳票、汇兑损失吃掉利润。一年下来项目黄了两个，你在机场贵宾厅里改完最后一版清盘报告，突然很想念从前只用加班不用倒时差的日子。',
            effects: [{ stats: { money: 5000, mindset: -7, health: -6, knowledge: 4 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '趁早转身，把金融经验卖给实业',
        outcomes: [
          {
            weight: 1,
            text: '你跳去了一家制造业公司做投融资总监。薪水打了八折，但没有净值焦虑，没有监管窗口指导，董事长听完你第一次汇报说："你们金融口的人，讲话真是又快又密。"你笑了笑——那是从前每一个路演现场刻进骨子里的语速。',
            effects: [
              { stats: { money: 8000, mindset: 5, health: 3, network: -3 } },
              { setFlag: 'fin_left_industry' },
            ],
          },
        ],
      },
    ],
  },
  {
    // 2025:三十五岁+的行业天花板与转型焦虑
    id: 'ev_fin_ceiling_2025',
    pools: ['work'],
    category: 'career',
    title: '牌桌的天花板',
    text: '2025年,你在这行已经站到了一个尴尬的位置:再往上是有限的几把交椅,往下是源源不断、更便宜也更敢拼的年轻人。房贷的月供、孩子或父母的开销、体检单上的提醒,一起把"求稳"两个字的分量压得更实。酒局上有人半醉着说:"我们这代金融人,吃到了最后一波红利,也撞上了第一堵墙。"',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2025, to: 2025 } }] },
    choices: [
      {
        id: 'overseas',
        text: '把出海那摊事做成自己的第二曲线',
        visibleIf: { flag: 'fin_went_overseas' },
        outcomes: [
          {
            weight: 1,
            text: '这两年攒下的海外资源开始结果:一个跨境项目落地,你成了公司里少数"能出海、敢落地"的人。天花板还在,但你在旁边给自己凿了扇窗。时差和奔波依旧,只是这次你清楚自己在为什么熬。',
            effects: [{ stats: { money: 12000, network: 5, mindset: 3, health: -4 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '在实业里,继续用金融的脑子做事',
        visibleIf: { flag: 'fin_left_industry' },
        outcomes: [
          {
            weight: 1,
            text: '离开金融口进实业的第二年,你已经不再怀念净值和路演。你帮公司谈下一轮融资,董事长在庆功宴上敬你一杯"专业"。没有了那份高薪的心跳,你换来的是能睡整觉、能陪家人的日子——这笔账,过了三十五岁才算得清。',
            effects: [{ stats: { money: 8000, mindset: 6, health: 3, network: 2 } }],
          },
        ],
      },
      {
        id: 'front',
        text: '守住前台的位置,和年轻人赛跑',
        visibleIf: {
          all: [
            { flag: 'finance_front_office' },
            { not: { flag: 'fin_went_overseas' } },
            { not: { flag: 'fin_left_industry' } },
          ],
        },
        outcomes: [
          {
            weight: 2,
            text: '你把资历变成了年轻人给不了的东西:一张能随时打通的关系网,一套穿越过牛熊的判断。你带团队、扛大单,用"稳"对冲"快"。天花板顶在头上,但你把自己活成了公司离不开的那颗螺丝钉。',
            effects: [{ stats: { money: 15000, network: 5, mindset: 1, health: -5 } }],
          },
          {
            weight: 1,
            text: '你还想拼,身体却开始不答应:一次路演途中心悸送医,医生让你"减少应酬"。躺在病床上你第一次认真算了笔账——原来命才是本金,业绩只是利息。出院后你没辞职,但学会了对一些饭局说"不"。',
            effects: [{ stats: { mindset: -5, health: -8, money: 6000 } }],
          },
        ],
      },
      {
        id: 'back',
        text: '在中后台,把"不可替代"熬成护城河',
        visibleIf: {
          all: [
            { not: { flag: 'finance_front_office' } },
            { not: { flag: 'fin_went_overseas' } },
            { not: { flag: 'fin_left_industry' } },
          ],
        },
        outcomes: [
          {
            weight: 1,
            text: '你没有惊心动魄的业绩曲线,只有一年年攒下的对流程、规则和风险的理解。年轻人来了又走,系统换了一茬又一茬,而那些真正复杂、出不得错的活儿,最后还是压到你桌上。这份"没人愿意学、也没人学得快"的手艺,成了你对抗天花板的方式。',
            effects: [{ stats: { knowledge: 5, mindset: 3, money: 5000, health: -2 } }],
          },
        ],
      },
    ],
  },
  {
    // 2026 收官:与 cs/edu 线"十二年回望"对齐的金融线终章
    id: 'ev_fin_decade_2026',
    pools: ['work'],
    category: 'career',
    title: '牛熊之间，十二年',
    mandatory: true,
    trigger: { all: [{ flag: 'career_finance' }, { year: { from: 2026, to: 2026 } }] },
    text: '2026年，你整理旧物，翻出2015年股灾实习时的工牌照片。十二年，你见过散户排队开户的疯狂，也见过赎回潮里客户的眼泪；见过年终奖能买一辆车的年份，也见过"退薪"写进新闻的年份。这个行业教会你的第一课是复利，最后一课是周期——而你自己，就是这两个词共同的作品。',
    choices: [
      {
        id: 'stayed',
        text: '回望这十二年一直没下牌桌的日子',
        visibleIf: {
          not: { any: [{ flag: 'laid_off' }, { flag: 'fin_left_industry' }] },
        },
        outcomes: [
          {
            weight: 1,
            text: '牛市你没有膨胀到离场创业，熊市你没有崩溃到彻底转行。十二年后还坐在这张牌桌前的人，同期入行的十个里剩不到三个。你不算最成功的，但你是活得最久的——在这个行业，这两件事往往是同一件。',
            effects: [{ stats: { mindset: 6, knowledge: 3 } }],
          },
        ],
      },
      {
        id: 'left',
        text: '回望从金融离开之后的日子',
        visibleIf: { any: [{ flag: 'laid_off' }, { flag: 'fin_left_industry' }] },
        outcomes: [
          {
            weight: 1,
            text: '离开的时候你以为自己输了，后来才发现，K线之外的生活也有自己的涨跌，只是没有人天天盯着报价。现在偶尔有朋友问你股票，你都说"少看账户，多睡觉"——这句话，是你用十二年学费换来的研究成果。',
            effects: [{ stats: { mindset: 7, health: 3 } }],
          },
        ],
      },
    ],
  },
];
