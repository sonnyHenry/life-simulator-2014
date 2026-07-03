import type { EndingDef } from '@life-sim/core';

export const endings: EndingDef[] = [
  {
    id: 'end_breakdown',
    title: '按下暂停键',
    text: '不知道从哪一天起,你早上睁开眼的第一个念头是"又要开始了"。你退掉了租的房子,买了一张回家的票。妈妈没问为什么,只是做了一桌你爱吃的菜。人生是长跑,中途停下来喘口气的人,不算输。',
    category: 'early',
    priority: 1,
    condition: { stat: 'mindset', op: '<=', value: 12 },
    shareCard: { tone: 'warm', tagline: '中途停下来喘口气的人,不算输。' },
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
    shareCard: { tone: 'triumph', tagline: '做题家怎么了?做题家做出了自己的人生。' },
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
    shareCard: { tone: 'triumph', tagline: '六位数存款不够买梦,但够证明你走过路。' },
  },
  {
    id: 'end_ai_adapter',
    title: 'AI 浪潮里的幸存者',
    text: '2026年,你已经不再把 AI 当成新闻里的词。它在你的工具栏里,也在你的焦虑里。你没有被浪潮直接托上岸,但你学会了借它省力、借它试错,也学会了把自己从"会写代码的人"升级成"能解决问题的人"。',
    category: 'final',
    priority: 106,
    condition: {
      all: [
        { flag: 'career_cs' },
        { flag: 'ai_adapted' },
        { stat: 'mindset', op: '>=', value: 35 },
      ],
    },
    shareCard: { tone: 'triumph', tagline: '浪潮没有托你上岸,你学会了借浪前进。' },
  },
  {
    id: 'end_restart_30',
    title: '30岁,重新开始',
    text: '你被裁过,也怀疑过自己。那段时间你把简历改了二十几版,把"稳定"两个字从笑话改成愿望。后来你重新找到了位置,没有翻身逆袭的背景音乐,只有一个普通人慢慢站起来的声音。',
    category: 'final',
    priority: 107,
    condition: {
      all: [
        { flag: 'laid_off' },
        { stat: 'mindset', op: '>=', value: 35 },
      ],
    },
    shareCard: { tone: 'warm', tagline: '没有背景音乐,也可以慢慢站起来。' },
  },
  {
    id: 'end_double_reduction_survivor',
    title: '双减幸存者',
    text: '教育行业的地震没有把你彻底震出局。你换过课、改过简历,也在深夜怀疑过"老师"这个身份还能不能养活自己。到了2026年,你还站在教育这条线上,只是比当年更清楚:讲台从来不只在教室里。',
    category: 'final',
    priority: 108,
    condition: {
      all: [
        { flag: 'career_edu' },
        { any: [{ flag: 'edu_reinvented' }, { flag: 'teacher_public' }] },
      ],
    },
    shareCard: { tone: 'bitter', tagline: '地震之后还站在讲台上,就是答案。' },
  },
  {
    id: 'end_stable_gov',
    title: '上岸人',
    text: '你的工位上摆着一盆绿萝,水杯里泡着菊花茶。大学同学在群里聊融资、聊期权、聊裁员,你偶尔冒个泡,发一张单位食堂三块钱的午饭。有人羡慕你,有人替你"可惜"。但日子是过给自己的,不是过给群友看的。',
    category: 'final',
    priority: 110,
    condition: { flag: 'career_gov' },
    shareCard: { tone: 'warm', tagline: '稳定不是没故事,只是故事讲得更慢。' },
  },
  {
    id: 'end_ordinary',
    title: '平凡之路',
    text: '2026年的最后一天,你在出租屋或自己的小房间里吃了顿热饭。没有大富大贵,没有惊天动地,你只是这座城市几千万个普通人中的一个。但你知道自己走过了什么:高考、志愿、宿舍的夜谈、第一份工资、几次风口和几次失落……这些别人看不见的东西,拼成了只属于你的人生。',
    category: 'final',
    priority: 999,
    condition: { always: true },
    shareCard: { tone: 'warm', tagline: '普通人的十二年,也有自己的重量。' },
  },
];
