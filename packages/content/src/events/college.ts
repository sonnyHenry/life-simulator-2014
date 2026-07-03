import type { GameEvent } from '@life-sim/core';

export const collegeEvents: GameEvent[] = [
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
    id: 'ev_college_confession',
    pools: ['college'],
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
              { schedule: { eventId: 'ev_love_distance', afterRounds: 1 } },
            ],
          },
          {
            weight: 1,
            text: 'TA 回复:"你是个很好的人。"后面的话你没看完就锁了屏。那周你没去社团,点名表上第一次有了你的缺勤。',
            outcomeTag: 'failure',
            effects: [{ stats: { mindset: -8 } }],
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
            effects: [{ stats: { mindset: 2 } }],
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
            effects: [{ stats: { mindset: 4, knowledge: -3 } }],
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
            effects: [{ stats: { mindset: -5 } }, { setFlag: 'in_love', value: false }],
          },
        ],
      },
    ],
  },
];
