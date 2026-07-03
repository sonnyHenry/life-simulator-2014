import type { GameEvent } from '@life-sim/core';

export const randomEvents: GameEvent[] = [
  {
    id: 'ev_random_flu',
    pools: ['random'],
    category: 'health',
    title: '换季重感冒',
    text: '一场降温,你中招了。头晕、咳嗽、浑身发冷,外卖软件里的粥店你已经收藏了三家。',
    once: false,
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
];
