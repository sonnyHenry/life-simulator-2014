import type { Condition, GameEvent } from '@life-sim/core';

// "已经在上班"的身份门控:求职入场 / 研究生毕业 / 考公上岸 / 考公落榜后打工。
// 上班族语境的事件(房租、副业、领导、公司体检…)都要挂这个,防止打到在读玩家身上。
const working: Condition = {
  any: [
    { flag: 'entered_job_market_2018' },
    { flag: 'postgrad_done' },
    { flag: 'career_gov' },
    { flag: 'civil_service_failed' },
  ],
};

export const randomEvents: GameEvent[] = [
  {
    id: 'ev_random_flu',
    pools: ['random'],
    category: 'health',
    title: '换季重感冒',
    text: '一场降温,你中招了。头晕、咳嗽、浑身发冷,外卖软件里的粥店你已经收藏了三家。',
    choices: [
      {
        id: 'a',
        text: '去医院,该花的钱不省',
        outcomes: [
          {
            weight: 1,
            text: '挂号、化验、输液,折腾一天花了八百块。医生说"多喝水,注意休息"——这话你的家人说过一百遍,但你只信穿白大褂的。',
            effects: [{ stats: { money: -800, mindset: -2, health: 4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '硬扛,年轻人自愈快',
        outcomes: [
          {
            weight: 2,
            text: '扛了一周,总算好了。你在朋友圈发"病来如山倒",配图是保温杯里的枸杞。年轻真好,身体是真扛造。',
            effects: [{ stats: { mindset: -1, health: -4 } }],
          },
          {
            weight: 1,
            text: '拖成了支气管炎,最后还是去了医院,花的钱是当初的三倍。医生看着你的化验单说:"你们年轻人啊。"',
            effects: [{ stats: { money: -3000, mindset: -8, health: -8 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_family_call',
    pools: ['random'],
    category: 'family',
    title: '家里的电话',
    text: '晚上十点,家里打来电话。电话那头先问你吃没吃饭,又问钱够不够花,最后才装作随口一提:"最近累不累啊?"',
    choices: [
      {
        id: 'a',
        text: '报喜不报忧',
        outcomes: [
          {
            weight: 1,
            text: '你说一切都好,还开了两个玩笑。挂掉电话后,房间安静下来。成年人最早学会的技能之一,是让父母放心。',
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
            text: '你说最近有点累。电话那头沉默了一下,然后妈妈说:"累了就歇歇,别硬撑。"这句话没有解决问题,但让问题轻了一点。',
            effects: [{ stats: { mindset: 5 } }],
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
    text: '你刷到高中同学的朋友圈:有人晒婚纱照,有人晒工牌,有人晒孩子,有人晒国外定位。你看了很久,突然想起当年大家都穿着一样的校服。',
    choices: [
      {
        id: 'a',
        text: '点个赞,继续忙自己的',
        outcomes: [
          {
            weight: 1,
            text: '你点了赞,放下手机。别人的人生像橱窗,自己的日子像厨房,都是真的,只是展示方式不同。',
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
            text: '你们聊了十几分钟,从近况聊到班主任的口头禅。关系没有重新热络,但那段共同的青春被短暂地点亮了一下。',
            effects: [{ stats: { network: 3, mindset: 2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '不能输:分期新手机,再安排一组旅拍',
        outcomes: [
          {
            weight: 1,
            text: '新手机、九宫格、定位和滤镜都到位了,收获五十八个赞,其中一半来自微商。分期账单则会在之后的十二个月里,每月准时提醒你这场"不能输"到底输给了谁。朋友圈是别人的橱窗,账单是自己的厨房。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -12000, mindset: -3 } }],
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
    text: '房东发来消息:下个租期每月涨三百。你打开租房软件看了一圈,发现不是房东变坏了,是整座城市都在涨价。',
    trigger: { all: [{ year: { from: 2018 } }, working, { not: { flag: 'has_house' } }] },
    choices: [
      {
        id: 'a',
        text: '搬远一点,省钱',
        outcomes: [
          {
            weight: 1,
            text: '你搬到了地铁终点站外两站公交的地方。房租降了,通勤变长了。每天早上挤上车时,你都觉得自己像被城市吞进去的一粒米。',
            effects: [{ stats: { money: 6000, mindset: -5, health: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '咬牙续租,少折腾',
        outcomes: [
          {
            weight: 1,
            text: '你续了租。熟悉的楼下早餐店和十分钟通勤,突然都变成了要花钱买的奢侈品。',
            effects: [{ stats: { money: -3600, mindset: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_parent_checkup',
    pools: ['random'],
    category: 'family',
    title: '父母体检',
    text: '家里说体检有个指标不太好,"医生说没大事"。你知道这句话通常有两层意思:真的没大事,以及他们不想让你担心。',
    trigger: { year: { from: 2021 } },
    choices: [
      {
        id: 'a',
        text: '请假陪他们复查',
        outcomes: [
          {
            weight: 1,
            text: '你请假回去,在医院走廊排队缴费。父母突然变得很听你的话,这比检查结果更让你难受。',
            effects: [{ stats: { money: -3000, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '转钱回去,远程盯着',
        outcomes: [
          {
            weight: 1,
            text: '你转了钱,反复叮嘱按时复查。屏幕能传消息,传不了陪伴。你第一次觉得离家远不是自由,是成本。',
            effects: [{ stats: { money: -5000, mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_small_trip',
    pools: ['random'],
    category: 'mindset',
    title: '短途旅行',
    text: '连续忙了很久后,你突然想离开这座城市两天。不是去看什么大风景,只是想让手机信号和工作消息都慢一点。',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '买票,周末就走',
        outcomes: [
          {
            weight: 2,
            text: '你坐在陌生城市的小店里吃面,窗外下着雨。没有任何问题被解决,但你短暂地想起自己不只是一个岗位或一种身份。',
            effects: [{ stats: { money: -2500, mindset: 8, health: 2 } }],
          },
          {
            weight: 1,
            text: '你选的正是全网都在推的"小众宝藏城市"。排队两小时的面馆、举着手机的人潮、比工位还密集的日程——周日深夜到家,你瘫在床上想:下次还是在家躺着吧。',
            effects: [{ stats: { money: -3000, mindset: -2 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '算了,以后再说',
        outcomes: [
          {
            weight: 1,
            text: '"以后再说"是成年人最常用的书签。你把攻略收藏起来,然后继续处理未读消息。',
            effects: [{ stats: { mindset: -2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_side_hustle',
    pools: ['random'],
    category: 'money',
    title: '副业诱惑',
    text: '朋友拉你进了一个副业群:写稿、剪视频、带货、知识付费。群公告写着"下班后两小时,改变人生"。',
    trigger: { all: [{ year: { from: 2020 } }, working] },
    choices: [
      {
        id: 'a',
        text: '试试,反正晚上也刷手机',
        outcomes: [
          {
            weight: 1,
            text: '你忙了一个月,赚了几百块,也学会了给标题加情绪词。改变人生没有发生,改变作息倒是发生了。',
            effects: [{ stats: { money: 1200, knowledge: 2, mindset: -3, health: -4 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不碰,先睡够觉',
        outcomes: [
          {
            weight: 1,
            text: '你退出了群。那晚你十一点就睡了,醒来时竟然有一种奢侈的清醒。',
            effects: [{ stats: { mindset: 4, health: 3 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '报名 6999 的"副业实战营",毕业保接单',
        outcomes: [
          {
            weight: 2,
            text: '课程的前三节全网免费就能搜到,后面全是"心法"和拉新任务。"保接单"的真相是:把课卖给下一个你,就是你的第一单。结营那天导师发了张电子证书,你看着那个花体英文名想:六千九买张 JPG,这单生意里唯一赚钱的副业是他的。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -6999, mindset: -7 } }],
          },
          {
            weight: 1,
            text: '课八成是水的,但你把剩下两成真学进去了:剪辑、排版、报价话术。之后一年靠零星接单把学费挣了回来,勉强打平。你的结论很中肯:这钱买不来副业,但买得来"知道这行不适合我"——也算信息费。',
            effects: [{ stats: { money: 1000, knowledge: 3, mindset: -2, health: -3 } }],
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
    text: '大学同学发来电子请柬。你点开音乐,看见两个人在海边笑得很好看。红包金额输入框像一道现实题。',
    trigger: { year: { from: 2022 } },
    choices: [
      {
        id: 'a',
        text: '去现场,见见老朋友',
        outcomes: [
          {
            weight: 1,
            condition: { flag: 'dorm_bond' },
            text: '敬酒环节,新郎特意走到你这桌:"这是当年天天带我开黑的兄弟。"你们把大学的梗一个个翻出来,笑到隔壁桌回头。散场后你在路边站了一会儿,觉得那几年没白过。',
            effects: [{ stats: { money: -2000, network: 6, mindset: 5 } }],
          },
          {
            weight: 1,
            condition: { not: { flag: 'dorm_bond' } },
            text: '婚礼上你们聊起宿舍和论文,笑得像当年一样。只是散场后各自打车回家,没人再说"晚上开黑"。',
            effects: [{ stats: { money: -2000, network: 4, mindset: 3 } }],
          },
          {
            weight: 1,
            text: '你被安排在"同学散客桌",一桌九个人,你只认识新郎。从"在哪儿高就"聊到"有对象没",你笑着接了一下午招,红包还随了两千。回程的高铁上你想:有些婚礼是去见朋友的,有些只是去证明你来过。',
            effects: [{ stats: { money: -2000, network: 1, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '转红包,人不到',
        outcomes: [
          {
            weight: 1,
            text: '你发了祝福,对方回了谢谢。关系没有变坏,只是又往通讯录深处沉了一点。',
            effects: [{ stats: { money: -800, mindset: -1 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '随 5888,让全场记住你的排面',
        outcomes: [
          {
            weight: 1,
            text: '司仪念红包名单时确实全场看了你一眼——就一眼。接下来三个月你的午饭预算降到二十块,而新人的感谢是群发的。你终于想通了红包的定价逻辑:它买的不是别人的记忆,是你自己的心理戏。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -5888, mindset: -5, network: 2 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_annual_review',
    pools: ['random'],
    category: 'career',
    title: '年度总结',
    text: '年底,你打开文档写年度总结。写着写着发现,这一年好像一直在处理问题,却很难说自己真正完成了什么。',
    trigger: { all: [{ year: { from: 2023 } }, working] },
    choices: [
      {
        id: 'a',
        text: '认真复盘,找下一年重点',
        outcomes: [
          {
            weight: 2,
            text: '你列出三件真正重要的事,删掉了一堆虚假的目标。计划不能保证未来,但至少能让你别被日程推着走。',
            effects: [{ stats: { knowledge: 3, mindset: 3 } }],
          },
          {
            weight: 1,
            text: '复盘越写越心惊:去年立的目标,一多半原样躺在今年的清单里。你合上电脑,新一年还没开始,焦虑先到账了。',
            effects: [{ stats: { knowledge: 2, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '沿用去年的框架',
        outcomes: [
          {
            weight: 2,
            text: '你复制了去年的结构,换了几个关键词。领导批了"继续努力",你也确实继续努力了。',
            effects: [{ stats: { mindset: -1 } }],
          },
          {
            weight: 1,
            text: '年底领导在忙更大的事,总结根本没人细看。你省下的两个晚上,一个用来睡觉,一个跟爸妈视频——事后看,这可能是全年性价比最高的两晚。',
            effects: [{ stats: { mindset: 3 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_gym_card',
    pools: ['random'],
    category: 'health',
    title: '年卡',
    text: '公司楼下的健身房在搞活动,销售小哥拦住你:"哥,办年卡吧,平均一天才六块钱,一杯奶茶都不到。"你捏了捏加班攒出来的肚子。',
    trigger: { all: [{ year: { from: 2019 } }, working] },
    choices: [
      {
        id: 'a',
        text: '办!这次一定坚持',
        outcomes: [
          {
            weight: 2,
            text: '你去了七次:前四次拍了照,后三次只用了淋浴。年底销售问你续不续卡,你说考虑一下——考虑的过程持续到了健身房倒闭。',
            effects: [{ stats: { money: -2000, mindset: -2, health: 1 } }],
          },
          {
            weight: 1,
            text: '出乎所有人意料,你坚持下来了。一年后你在工位抽屉里放的不再是护肝片,而是蛋白粉。体检报告第一次没有上箭头,你把它拍照发了朋友圈。',
            effects: [{ stats: { money: -2000, mindset: 6, health: 12 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '不办,跑步不要钱',
        outcomes: [
          {
            weight: 1,
            text: '你说小区里跑跑就行。当然,"小区里跑跑"最终也停留在了口头。但至少,你省下了两千块——这是这个决定里唯一兑现的部分。',
            effects: [{ stats: { mindset: 1, health: -2 } }],
          },
        ],
      },
      {
        id: 'c',
        text: '年卡再加一万八私教包,一步到位',
        outcomes: [
          {
            weight: 2,
            text: '私教课上了六节,教练离职了;转来的新教练上了两节,门店"升级改造"了。会员群里全是要说法的人,说法最后浓缩成公告栏一张 A4 纸。两万块买来的教训贴在你的记账本首页:预付费的尽头,是老板的下一家店。',
            outcomeTag: 'failure',
            effects: [{ stats: { money: -20000, mindset: -8, health: 2 } }],
          },
          {
            weight: 1,
            text: '你运气不错,碰上一个真负责的教练。一年后你的体测数据全面翻新,冬天没感冒过一次,连走路的姿态都变了。两万块花得肉疼,但身体给出的回报是复利——这大概是你今年唯一没有暴雷的"高收益理财"。',
            outcomeTag: 'success',
            effects: [{ stats: { money: -20000, mindset: 8, health: 16 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_parents_video',
    pools: ['random'],
    category: 'family',
    title: '视频通话',
    text: '疫情之后,爸妈学会了视频通话。从此每周日晚上,你的手机都会准时响起。镜头永远怼在天花板或者鼻孔上,但他们乐此不疲。',
    trigger: { year: { from: 2020 } },
    choices: [
      {
        id: 'a',
        text: '认真接,教他们把镜头端正',
        outcomes: [
          {
            weight: 1,
            text: '你教了三遍,他们终于学会了把脸放进画面里。妈妈开始给你直播家里的菜地和新买的沙发。信号经常卡,但有些东西一点都没卡:比如她每次结尾都问"钱够不够花"。',
            effects: [{ stats: { mindset: 5 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '正忙,挂了回头再说',
        outcomes: [
          {
            weight: 2,
            text: '你按掉了,想着忙完这阵回过去。等你想起来,已经是三天后。爸妈没有怪你,这比怪你更让你难受。',
            effects: [{ stats: { mindset: -3 } }],
          },
          {
            weight: 1,
            text: '你忙完回拨过去,妈妈压低声音说"你爸刚睡着"。你们轻声聊了五分钟,她说"知道你忙,我们就是看看你"。有些牵挂不挑时间,补上就还算数。',
            effects: [{ stats: { mindset: 1 } }],
          },
        ],
      },
    ],
  },
  {
    id: 'ev_random_health_report',
    pools: ['random'],
    category: 'health',
    title: '体检报告',
    text: '公司体检的报告出来了。你盯着 APP 上"查看报告"四个字看了半天,像大学时不敢查挂科成绩。点开:结节、脂肪肝倾向、几个向上的箭头。',
    trigger: { all: [{ year: { from: 2023 } }, working] },
    choices: [
      {
        id: 'a',
        text: '认真对待,复查+调作息',
        outcomes: [
          {
            weight: 1,
            text: '复查结果问题不大,医生说"多数是熬出来的,少熬就行"。你开始十二点前睡觉,外卖从"随便"改成了"少油"。身体是唯一跟你签了终身合同的同事,你想跟它搞好关系。',
            effects: [{ stats: { money: -1500, mindset: 4, health: 7 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '年轻人都这样,先放着',
        outcomes: [
          {
            weight: 1,
            text: '你把报告塞进了抽屉最深处,和去年的那份放在一起。它们在黑暗中安静地叠着,像两张还没到期的账单。',
            effects: [{ stats: { mindset: -2, health: -6 } }],
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
    text: '大学班级群突然热闹起来——毕业快十年了,有人提议聚一次。接龙名单慢慢变长,你看到了很多熟悉又陌生的名字,包括那个你以为这辈子不会再打交道的人。',
    trigger: { year: { from: 2024 } },
    choices: [
      {
        id: 'a',
        text: '报名,去看看大家都活成了什么样',
        outcomes: [
          {
            weight: 2,
            text: '聚会上没有想象中的攀比,大家聊的都是孩子、房贷和体检。散场时班长说"十年后再聚",所有人都笑着答应,所有人都知道很难。但今晚很好,今晚就够了。',
            effects: [{ stats: { money: -1000, network: 5, mindset: 4 } }],
          },
          {
            weight: 1,
            text: '饭吃到一半,有人开始讲保险,有人扫码拉群卖酒,还有人举着手机直播"十年重聚感动瞬间"。你和当年的同桌对视一眼,在彼此眼里看到了同一句话:再也不来了。',
            effects: [{ stats: { money: -1000, network: 1, mindset: -3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '潜水,看他们发照片就好',
        outcomes: [
          {
            weight: 1,
            text: '聚会那晚你刷着群里的合影,一个个认过去。有人胖了,有人白了头发,有人笑得还和军训时一样。你点了个赞,忽然有点后悔没去。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
];
