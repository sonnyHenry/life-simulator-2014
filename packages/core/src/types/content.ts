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

export interface ProvinceOption {
  id: string;
  label: string;
  scoreShift: number;
}

export interface BackgroundCard {
  id: string;
  label: string;
  text: string;
  initialMoney: number;
  flags?: Record<string, boolean | number | string>;
}

export interface ApplicationOption {
  id: string;
  label: string;
  university: string;
  major: string;
  minScore: number;
  admitChance: number;
  effects?: Effect[];
  failEffects?: Effect[];
}

export interface IncomeRule {
  id: string;
  label: string;
  when: Condition;
  amount: number;
}

export interface ScoringConfig {
  weights: { knowledge: number; money: number; mindset: number; network: number };
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
  provinces: ProvinceOption[];
  backgrounds: BackgroundCard[];
  applications: ApplicationOption[];
  npcs: NpcDef[];
  fns: Record<string, ContentFn>;
}
