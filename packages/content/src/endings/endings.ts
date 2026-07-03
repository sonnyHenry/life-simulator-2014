import type { EndingDef } from '@life-sim/core';

export const endings: EndingDef[] = [
  {
    id: 'end_breakdown',
    title: '按下暂停键',
    text: '不知道从哪一天起,你早上睁开眼的第一个念头是"又要开始了"。你退掉了租的房子,买了一张回家的票。妈妈没问为什么,只是做了一桌你爱吃的菜。人生是长跑,中途停下来喘口气的人,不算输。',
    category: 'early',
    priority: 1,
    condition: { stat: 'mindset', op: '<=', value: 0 },
  },
  {
    id: 'end_smalltown_win',
    title: '小镇做题家的胜利',
    text: '从村里的土路到大学的图书馆,再到写字楼的工位——你用了五年,走完了别人眼里"理所当然"的路。过年回家,爸妈在饭桌上不说什么,但给你夹菜的次数,比谁都多。做题家怎么了?做题家做出了自己的人生。',
    category: 'final',
    priority: 100,
    condition: {
      all: [
        { background: 'bg_rural' },
        { stat: 'knowledge', op: '>=', value: 60 },
      ],
    },
  },
  {
    id: 'end_gold',
    title: '小有成就',
    text: '毕业第二年,你的存款突破了六位数。这笔钱在这座城市买不起一个厕所,但它是你一份一份工资、一个一个选择攒出来的。深夜加完班,你请自己吃了顿好的。账单弹出来的时候,你没有犹豫。',
    category: 'final',
    priority: 105,
    condition: {
      all: [
        { stat: 'money', op: '>=', value: 100000 },
        { stat: 'mindset', op: '>=', value: 45 },
      ],
    },
  },
  {
    id: 'end_stable_gov',
    title: '上岸人',
    text: '你的工位上摆着一盆绿萝,水杯里泡着菊花茶。大学同学在群里聊融资、聊期权、聊裁员,你偶尔冒个泡,发一张单位食堂三块钱的午饭。有人羡慕你,有人替你"可惜"。但日子是过给自己的,不是过给群友看的。',
    category: 'final',
    priority: 110,
    condition: { flag: 'career_gov' },
  },
  {
    id: 'end_ordinary',
    title: '平凡之路',
    text: '2019年的最后一天,你在出租屋里吃了顿火锅,跨了个年。没有大富大贵,没有惊天动地,你只是这座城市几千万个普通人中的一个。但你知道自己走过了什么:高考、志愿、宿舍的夜谈、第一份工资……这些别人看不见的东西,拼成了只属于你的人生。',
    category: 'final',
    priority: 999,
    condition: { always: true },
  },
];
