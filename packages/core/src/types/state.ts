import type { Flags, StatDeltas, Stats, Track } from './stats';

export type ScreenId =
  | 'TITLE'
  | 'BACKGROUND_DRAW'
  | 'SETUP'
  | 'EXAM'
  | 'EXAM_RESULT'
  | 'APPLICATION'
  | 'BRIEF'
  | 'EVENT'
  | 'OUTCOME'
  | 'SETTLEMENT'
  | 'ENDING';

export interface Profile {
  background: string | null;
  province: string | null;
  track: Track | null;
  examScore: number | null;
  university: string | null;
  major: string | null;
  career: string | null;
}

export type HistoryEntry =
  | {
      kind: 'event';
      year: number;
      eventId: string;
      category?: string;
      choiceId: string;
      outcomeTag?: string;
    }
  | {
      kind: 'application';
      year: number;
      optionId: string;
      admitted: boolean;
    };

export interface NpcState {
  favor: number;
  stage: string;
}

export interface GameState {
  schemaVersion: 1;
  seed: number;
  rngState: number;
  screen: ScreenId;
  phaseIndex: number;
  flowStepIndex: number;
  roundIndex: number;
  roundCounter: number;
  date: { year: number; month: number };
  currentBrief: string | null;
  eventQueue: string[];
  eventCursor: number;
  pendingOutcome: { text: string; deltas: StatDeltas } | null;
  forcedEndingId: string | null;
  pendingJumpPhaseId: string | null;
  examPaper: string[];
  examCursor: number;
  examCorrect: number;
  stats: Stats;
  profile: Profile;
  flags: Flags;
  npcs: Record<string, NpcState>;
  scheduled: { eventId: string; dueRound: number }[];
  triggeredEventIds: string[];
  history: HistoryEntry[];
  endingId: string | null;
}
