import type { GameEvent } from '@life-sim/core';

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
            effects: [{ stats: { money: -800, mindset: -2 } }],
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
            effects: [{ stats: { mindset: -1 } }],
          },
          {
            weight: 1,
            text: '拖成了支气管炎,最后还是去了医院,花的钱是当初的三倍。医生看着你的化验单说:"你们年轻人啊。"',
            effects: [{ stats: { money: -3000, mindset: -8 } }],
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
    ],
  },
  {
    id: 'ev_random_room_rent',
    pools: ['random'],
    category: 'money',
    title: '房租又涨了',
    text: '房东发来消息:下个租期每月涨三百。你打开租房软件看了一圈,发现不是房东变坏了,是整座城市都在涨价。',
    trigger: { year: { from: 2018 } },
    choices: [
      {
        id: 'a',
        text: '搬远一点,省钱',
        outcomes: [
          {
            weight: 1,
            text: '你搬到了地铁终点站外两站公交的地方。房租降了,通勤变长了。每天早上挤上车时,你都觉得自己像被城市吞进去的一粒米。',
            effects: [{ stats: { money: 6000, mindset: -5 } }],
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
    trigger: { year: { from: 2019 } },
    choices: [
      {
        id: 'a',
        text: '买票,周末就走',
        outcomes: [
          {
            weight: 1,
            text: '你坐在陌生城市的小店里吃面,窗外下着雨。没有任何问题被解决,但你短暂地想起自己不只是一个岗位或一种身份。',
            effects: [{ stats: { money: -2500, mindset: 8 } }],
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
    trigger: { year: { from: 2020 } },
    choices: [
      {
        id: 'a',
        text: '试试,反正晚上也刷手机',
        outcomes: [
          {
            weight: 1,
            text: '你忙了一个月,赚了几百块,也学会了给标题加情绪词。改变人生没有发生,改变作息倒是发生了。',
            effects: [{ stats: { money: 1200, knowledge: 2, mindset: -3 } }],
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
            effects: [{ stats: { mindset: 4 } }],
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
    ],
  },
  {
    id: 'ev_random_annual_review',
    pools: ['random'],
    category: 'career',
    title: '年度总结',
    text: '年底,你打开文档写年度总结。写着写着发现,这一年好像一直在处理问题,却很难说自己真正完成了什么。',
    trigger: { year: { from: 2023 } },
    choices: [
      {
        id: 'a',
        text: '认真复盘,找下一年重点',
        outcomes: [
          {
            weight: 1,
            text: '你列出三件真正重要的事,删掉了一堆虚假的目标。计划不能保证未来,但至少能让你别被日程推着走。',
            effects: [{ stats: { knowledge: 3, mindset: 3 } }],
          },
        ],
      },
      {
        id: 'b',
        text: '套模板,先交差',
        outcomes: [
          {
            weight: 1,
            text: '你复制了去年的结构,换了几个关键词。领导批了"继续努力",你也确实继续努力了。',
            effects: [{ stats: { mindset: -1 } }],
          },
        ],
      },
    ],
  },
];
