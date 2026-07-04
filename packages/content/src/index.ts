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

export const contentPack: ContentPack = {
  meta: {
    id: 'base',
    version: '0.8.0',
    title: '2014:我的十二年(M3 社会线原型)',
    fallbackEndingId: 'end_ordinary',
    examQuestionCount: 10,
  },
  timeline: phases,
  events: [...collegeEvents, ...workEvents, ...randomEvents],
  endings,
  examBank,
  provinces,
  backgrounds,
  applications,
  npcs,
  fns: {},
};
