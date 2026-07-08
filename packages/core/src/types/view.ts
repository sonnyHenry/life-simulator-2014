import type { BackgroundCard } from './content';
import type { Gender, StatDeltas, Stats, Track } from './stats';

export interface PublicExamQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
}

export type ViewModel =
  | { kind: 'TITLE'; title: string }
  | { kind: 'BACKGROUND_DRAW'; card: BackgroundCard }
  | { kind: 'SETUP'; genders: Gender[]; tracks: Track[] }
  | { kind: 'EXAM'; index: number; total: number; question: PublicExamQuestion }
  | { kind: 'EXAM_RESULT'; score: number; correct: number; total: number }
  | {
      kind: 'APPLICATION';
      score: number;
      options: {
        id: string;
        label: string;
        university: string;
        /** 稳 / 较稳 / 冲 / 悬 / 基本无望 */
        chanceLabel: string;
        risky: boolean;
        majors: { id: string; name: string }[];
      }[];
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
  | {
      kind: 'SETTLEMENT';
      year: number;
      stats: Stats;
      /** 本年命中的收入规则明细("大厂工资 +¥62,000"等) */
      incomes: { label: string; amount: number }[];
      /** 收入结算引起的金钱净变化 */
      moneyDelta: number;
      /** 财富里程碑提示(跨越 10万/50万/100万),无则为 null */
      milestone: string | null;
      /** 历年年末金钱快照,用于趋势小图 */
      moneyTrend: { year: number; money: number }[];
    }
  | {
      kind: 'ENDING';
      endingId: string;
      title: string;
      text: string;
      stats: Stats;
      score: number;
      grade: 'S' | 'A' | 'B' | 'C' | 'D';
      historyLength: number;
      /** 历年年末金钱快照,供结局页/分享图做趋势展示 */
      moneyTrend: { year: number; money: number }[];
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
  | { type: 'CHOOSE_SETUP'; gender: Gender; track: Track }
  | { type: 'ANSWER'; optionIndex: number }
  | { type: 'SKIP_EXAM' }
  | { type: 'APPLY'; optionId: string; majorId?: string }
  | { type: 'CHOOSE_CROSSROAD'; optionId: string }
  | { type: 'CHOOSE'; choiceId: string };
