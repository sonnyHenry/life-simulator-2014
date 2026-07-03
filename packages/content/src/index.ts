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

export const contentPack: ContentPack = {
  meta: {
    id: 'base',
    version: '0.1.0',
    title: '2014:我的十二年(M0 最小内容)',
    fallbackEndingId: 'end_ordinary',
    examQuestionCount: 4,
  },
  timeline: phases,
  events: [...collegeEvents, ...workEvents, ...randomEvents],
  endings,
  examBank,
  provinces,
  backgrounds,
  applications,
  npcs: [],
  fns: {},
};
