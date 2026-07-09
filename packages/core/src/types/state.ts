import type { Flags, StatDeltas, Stats, Track } from './stats';

export type ScreenId =
  | 'TITLE'
  | 'BACKGROUND_DRAW'
  | 'SETUP'
  | 'EXAM'
  | 'EXAM_RESULT'
  | 'APPLICATION'
  | 'CROSSROAD'
  | 'BRIEF'
  | 'EVENT'
  | 'OUTCOME'
  | 'SETTLEMENT'
  | 'ENDING';

export interface Profile {
  background: string | null;
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
    }
  | {
      kind: 'crossroad';
      year: number;
      optionId: string;
    };

export interface NpcState {
  favor: number;
  stage: string;
}

/** 年度结算明细:进入 SETTLEMENT 屏时由引擎写入,供结算页展示收入构成 */
export interface SettlementReport {
  /** 本回合命中的收入规则(amount 为 0 的规则不列出) */
  incomes: { label: string; amount: number }[];
  /** 收入结算引起的金钱净变化(钳制后的实际值) */
  moneyDelta: number;
  /** 跨越财富里程碑时的一句话提示,无则为 null */
  milestone: string | null;
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
  pendingFlowAdvance: boolean;
  forcedEndingId: string | null;
  pendingJumpPhaseId: string | null;
  examPaper: string[];
  /** 开局特质候选(抽 4 选 2);选完清空。旧存档无此字段按空处理 */
  traitOffer?: string[];
  examCursor: number;
  examCorrect: number;
  examEarnedPoints: number;
  stats: Stats;
  profile: Profile;
  flags: Flags;
  npcs: Record<string, NpcState>;
  scheduled: { eventId: string; dueRound: number }[];
  triggeredEventIds: string[];
  history: HistoryEntry[];
  endingId: string | null;
  /** 可选:旧快照存档没有这两个字段,读取处需给默认值 */
  lastSettlement?: SettlementReport | null;
  /** 每次年度结算后的金钱快照,用于结算/结局页的趋势展示 */
  yearlySnapshots?: { year: number; money: number }[];
}
