import type { PhaseConfig } from '@life-sim/core';

export const phases: PhaseConfig[] = [
  {
    kind: 'flow',
    id: 'gaokao',
    label: '高考季',
    date: { year: 2014, month: 6 },
    steps: ['BACKGROUND_DRAW', 'SETUP', 'EXAM', 'APPLICATION'],
  },
  {
    kind: 'rounds',
    id: 'college',
    label: '大学时代',
    date: { year: 2014, month: 9 },
    rounds: 2,
    eventSlots: 2,
    pools: ['college', 'random'],
    briefs: [
      '2014年。4G牌照刚发,微信红包一夜爆红,打车软件在校门口疯狂发补贴。你拖着行李箱走进宿舍,室友已经在用你没见过的手机玩你没见过的游戏。大学生活开始了。',
      '2015年。"大众创业、万众创新"写进了政府工作报告,学校里的创业大赛比社团招新还热闹。6月股灾来了,你第一次在食堂听到有人讨论"两融余额"。',
    ],
  },
  {
    kind: 'rounds',
    id: 'work',
    label: '初入社会',
    date: { year: 2018, month: 7 },
    rounds: 2,
    eventSlots: 2,
    pools: ['work', 'random'],
    briefs: [
      '2018年。你毕业了。P2P平台一个接一个地暴雷,资管新规落地,但互联网大厂还在疯狂扩招——校招会上,HR们抢人抢得面红耳赤。',
      '2019年。"996.ICU"登上了GitHub热榜第一,程序员们用代码抗议加班。你的朋友圈一半在晒融资喜报,一半在转发《某某公司裁员实录》。',
    ],
    isFinal: true,
  },
];
