import type { BackgroundCard, ProvinceOption } from './content';
import type { StatDeltas, Stats, Track } from './stats';

export interface PublicExamQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
}

export type ViewModel =
  | { kind: 'TITLE'; title: string }
  | { kind: 'BACKGROUND_DRAW'; card: BackgroundCard }
  | { kind: 'SETUP'; provinces: ProvinceOption[]; tracks: Track[] }
  | { kind: 'EXAM'; index: number; total: number; question: PublicExamQuestion }
  | { kind: 'EXAM_RESULT'; score: number; correct: number; total: number }
  | {
      kind: 'APPLICATION';
      score: number;
      options: { id: string; label: string; university: string; major: string; risky: boolean }[];
    }
  | { kind: 'BRIEF'; phaseLabel: string; year: number; text: string }
  | {
      kind: 'EVENT';
      eventId: string;
      title: string;
      text: string;
      choices: { id: string; text: string }[];
    }
  | { kind: 'OUTCOME'; text: string; deltas: StatDeltas }
  | { kind: 'SETTLEMENT'; year: number; stats: Stats }
  | {
      kind: 'ENDING';
      endingId: string;
      title: string;
      text: string;
      stats: Stats;
      historyLength: number;
    };

export type PlayerAction =
  | { type: 'START' }
  | { type: 'CONTINUE' }
  | { type: 'CHOOSE_SETUP'; provinceId: string; track: Track }
  | { type: 'ANSWER'; optionIndex: number }
  | { type: 'APPLY'; optionId: string }
  | { type: 'CHOOSE'; choiceId: string };
