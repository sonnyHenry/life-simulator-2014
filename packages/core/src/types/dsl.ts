import type { StatKey } from './stats';

export type Op = '>' | '>=' | '<' | '<=' | '==';

export type Condition =
  | { always: true }
  | { stat: StatKey; op: Op; value: number }
  | { flag: string; equals?: boolean | number | string }
  | { year: { from?: number; to?: number } }
  | { career: string }
  | { background: string }
  | { major: string }
  | { npcFavor: string; op: Op; value: number }
  | { npcStage: string; stage: string }
  | { historyCount: { category?: string; outcomeTag?: string; op: Op; value: number } }
  | { chance: number }
  | { all: Condition[] }
  | { any: Condition[] }
  | { not: Condition }
  | { fn: string };

export type Effect =
  | { stats: Partial<Record<StatKey, number>> }
  | {
      moneyCost: {
        rate: number;
        min?: number;
        max?: number;
        roundTo?: number;
        reason?: 'daily' | 'medical' | 'family' | 'investment' | 'scam' | 'house' | 'other';
      };
    }
  | { setStat: StatKey; value: number }
  | { setFlag: string; value?: boolean | number | string }
  | { npcFavor: string; delta: number }
  | { npcStage: string; stage: string }
  | { schedule: { eventId: string; afterRounds: number } }
  | { setCareer: string }
  | { jumpToPhase: string }
  | { triggerEnding: string }
  | { fn: string; args?: Record<string, unknown> };
