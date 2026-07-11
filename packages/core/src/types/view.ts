import type { BackgroundCard, TraitCard } from './content';
import type { Gender, StatDeltas, Stats, Track } from './stats';

export interface PublicExamQuestion {
  id: string;
  subject: string;
  text: string;
  options: string[];
}

export type ViewModel =
  | { kind: 'TITLE'; title: string }
  | {
      kind: 'BACKGROUND_DRAW';
      card: BackgroundCard;
      /** 特质候选卡(抽 4 选 2),玩家通过 CHOOSE_TRAITS 提交选择 */
      traitOffer: TraitCard[];
      pickCount: number;
    }
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
      kind: 'NPC_SELECTION';
      requiredNpcs: { id: string; name: string; description: string; routeLabel: string }[];
      npcs: { id: string; name: string; description: string; routeLabel: string }[];
      pickCount: number;
    }
  | {
      kind: 'LIFE_GOAL';
      goals: { id: string; label: string; text: string }[];
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
  | { kind: 'OUTCOME'; text: string; deltas: StatDeltas; relationshipHint?: string }
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
      /** 本局真正完成的 NPC 关系收束,由核心层统一解释内部 flags。 */
      relationships: {
        npcId: string;
        name: string;
        title: string;
        text: string;
        warmCount: number;
        coolCount: number;
        moments: string[];
      }[];
      shareCard: {
        title: string;
        tagline: string;
        tone: 'triumph' | 'bitter' | 'warm';
        seed: number;
        years: string;
        /** 本局选择的特质 label(如 ['天生胆大','恋家']),旧存档可能为空 */
        traits: string[];
        /** 2023 年形成的成年性格路线 */
        traitEvolutions: string[];
        /** 分享卡和分享文案使用的精简关系称号。 */
        relationships: string[];
        /** 2018 年选择的人生目标,旧存档可能为空 */
        goal?: string;
      };
    };

export type PlayerAction =
  | { type: 'START' }
  | { type: 'CONTINUE' }
  | { type: 'CHOOSE_TRAITS'; traitIds: string[] }
  | { type: 'CHOOSE_SETUP'; gender: Gender; track: Track }
  | { type: 'ANSWER'; optionIndex: number }
  | { type: 'SKIP_EXAM' }
  | { type: 'APPLY'; optionId: string; majorId?: string }
  | { type: 'CHOOSE_NPCS'; npcIds: string[] }
  | { type: 'CHOOSE_LIFE_GOAL'; goalId: string }
  | { type: 'CHOOSE_CROSSROAD'; optionId: string }
  | { type: 'CHOOSE'; choiceId: string };
