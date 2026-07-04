import type { ContentPack } from '@life-sim/core';
import { phases } from './timeline/phases';
import { backgrounds } from './setup/backgrounds';
import { provinces } from './setup/provinces';
import { applications } from './setup/applications';
import { examBank } from './exam/questions';
import { collegeEvents } from './events/college';
import { workEvents } from './events/work';
import { randomEvents } from './events/random';
import { endings } from './endings/endings';
import { npcs } from './npcs/npcs';
import { incomes } from './economy/incomes';

export const contentPack: ContentPack = {
  meta: {
    id: 'base',
    version: '0.12.0',
    title: '2014:我的十二年',
    fallbackEndingId: 'end_ordinary',
    examQuestionCount: 10,
    scoring: {
      weights: { knowledge: 0.25, money: 0.3, mindset: 0.25, network: 0.2 },
      moneyFullScore: 600000,
    },
  },
  timeline: phases,
  events: [...collegeEvents, ...workEvents, ...randomEvents],
  incomes,
  endings,
  examBank,
  provinces,
  backgrounds,
  applications,
  npcs,
  fns: {},
};
