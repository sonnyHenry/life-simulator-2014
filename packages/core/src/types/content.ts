import type { Condition, Effect } from './dsl';
import type { Track } from './stats';

export interface GameDate {
  year: number;
  month: number;
}

export interface ChoiceOutcome {
  weight: number;
  condition?: Condition;
  text: string;
  outcomeTag?: string;
  effects: Effect[];
}

export interface EventChoice {
  id: string;
  text: string;
  visibleIf?: Condition;
  outcomes: ChoiceOutcome[];
}

export interface GameEvent {
  id: string;
  pools: string[];
  title: string;
  text: string;
  category?: string;
  trigger?: Condition;
  weight?: number;
  once?: boolean;
  mandatory?: boolean;
  /** 同一回合内的展示顺序,越小越靠前,默认 0(如毕业散伙饭应排在当年最后) */
  order?: number;
  /** 事件等级:major=剧情转折/高光事件(UI 有关键节点标识,文案更长) */
  tier?: 'major';
  choices: EventChoice[];
}

export interface EndingDef {
  id: string;
  title: string;
  text: string;
  category: 'early' | 'final';
  priority: number;
  condition: Condition;
  shareCard?: {
    tone: 'triumph' | 'bitter' | 'warm';
    tagline: string;
  };
}

export type FlowStep =
  | 'BACKGROUND_DRAW'
  | 'SETUP'
  | 'EXAM'
  | 'APPLICATION'
  | 'CROSSROAD';

export type PhaseConfig =
  | {
      kind: 'flow';
      id: string;
      label: string;
      date: GameDate;
      steps: FlowStep[];
    }
  | {
      kind: 'rounds';
      id: string;
      label: string;
      date: GameDate;
      rounds: number;
      eventSlots: number;
      pools: string[];
      briefs: string[];
      isFinal?: boolean;
    };

export interface ExamQuestion {
  id: string;
  track: Track | 'both';
  subject: string;
  text: string;
  options: string[];
  answerIndex: number;
  difficulty?: 1 | 2 | 3 | 4 | 5;
}

export interface BackgroundCard {
  id: string;
  label: string;
  text: string;
  initialMoney: number;
  flags?: Record<string, boolean | number | string>;
}

export interface ApplicationMajor {
  id: string;
  /** 专业名,需与 CROSSROAD 分流和事件 visibleIf 里的 major 字符串一致 */
  name: string;
  /** 写入 flags.major_track 的值:cs / education / cs_applied / management / finance / medicine / psychology */
  trackFlag: string;
}

/** 志愿"批次":录取概率由引擎按(分数 - minScore)动态计算,不再静态配置 */
export interface ApplicationOption {
  id: string;
  label: string;
  university: string;
  minScore: number;
  effects?: Effect[];
  failEffects?: Effect[];
  majors: ApplicationMajor[];
}

export interface IncomeRule {
  id: string;
  label: string;
  when: Condition;
  /** 年度净储蓄(元/年,可为负) */
  amount: number;
  /** 年度心态损耗/恢复(可选,职业压力的系统性建模) */
  mindsetDelta?: number;
  /** 年度健康损耗/恢复(可选,职业强度的系统性建模) */
  healthDelta?: number;
}

export interface ScoringConfig {
  weights: { knowledge: number; money: number; mindset: number; network: number; health: number };
  moneyFullScore: number;
}

export interface NpcDef {
  id: string;
  name: string;
  initialStage: string;
  initialFavor: number;
  stages: Record<string, { advanceWhen?: Condition; eventId?: string }>;
}

export interface FnCtx {
  state: unknown;
  args?: Record<string, unknown>;
}

export type ContentFn = (ctx: FnCtx) => unknown;

export interface ContentPack {
  meta: {
    id: string;
    version: string;
    title: string;
    fallbackEndingId: string;
    examQuestionCount: number;
    scoring?: ScoringConfig;
  };
  timeline: PhaseConfig[];
  events: GameEvent[];
  incomes: IncomeRule[];
  endings: EndingDef[];
  examBank: ExamQuestion[];
  backgrounds: BackgroundCard[];
  applications: ApplicationOption[];
  npcs: NpcDef[];
  fns: Record<string, ContentFn>;
}
