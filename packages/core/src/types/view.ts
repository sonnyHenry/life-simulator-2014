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
  | {
      kind: 'CROSSROAD';
      year: number;
      university: string;
      major: string;
      options: { id: string; label: string; text: string; recommendedFor?: readonly string[] }[];
    }
  | { kind: 'BRIEF'; phaseLabel: string; year: number; text: string }
  | {
      kind: 'EVENT';
      eventId: string;
      title: string;
      text: string;
      major: boolean;
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
      score: number;
      grade: 'S' | 'A' | 'B' | 'C' | 'D';
      historyLength: number;
      shareCard: {
        title: string;
        tagline: string;
        tone: 'triumph' | 'bitter' | 'warm';
        seed: number;
        years: string;
      };
    };

export type PlayerAction =
  | { type: 'START' }
  | { type: 'CONTINUE' }
  | { type: 'CHOOSE_SETUP'; provinceId: string; track: Track }
  | { type: 'ANSWER'; optionIndex: number }
  | { type: 'SKIP_EXAM' }
  | { type: 'APPLY'; optionId: string }
  | { type: 'CHOOSE_CROSSROAD'; optionId: string }
  | { type: 'CHOOSE'; choiceId: string };
