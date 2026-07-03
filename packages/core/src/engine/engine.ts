import type { ContentPack, ExamQuestion, PhaseConfig } from '../types/content';
import type { GameState } from '../types/state';
import type { PlayerAction, ViewModel } from '../types/view';
import { Rng, randomSeed } from '../rng/rng';
import { applyEffects } from '../dsl/apply';
import { evalCondition } from '../dsl/evaluate';
import { pickRoundEvents } from '../systems/scheduler';
import { findEnding } from '../systems/ending';

export interface Engine {
  start(seed?: number): GameState;
  view(state: GameState): ViewModel;
  dispatch(state: GameState, action: PlayerAction): GameState;
}

const EXAM_BASE_SCORE = 330;
const EXAM_SCORE_RANGE = 270;

function clone(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState;
}

function invalid(state: GameState, action: PlayerAction): never {
  throw new Error(`Invalid action ${action.type} on screen ${state.screen}`);
}

export function createEngine(pack: ContentPack): Engine {
  const eventsById = new Map(pack.events.map(e => [e.id, e]));
  const questionsById = new Map(pack.examBank.map(q => [q.id, q]));

  function phaseAt(index: number): PhaseConfig {
    const phase = pack.timeline[index];
    if (!phase) throw new Error(`Timeline has no phase at index ${index}`);
    return phase;
  }

  function admissionScore(state: GameState): number {
    const province = pack.provinces.find(p => p.id === state.profile.province);
    return (state.profile.examScore ?? 0) + (province?.scoreShift ?? 0);
  }

  function availableApplications(state: GameState) {
    return pack.applications.filter(opt => admissionScore(state) >= opt.minScore);
  }

  function start(seed?: number): GameState {
    const actualSeed = seed ?? randomSeed();
    const npcs: GameState['npcs'] = {};
    for (const npc of pack.npcs) {
      npcs[npc.id] = { favor: npc.initialFavor, stage: npc.initialStage };
    }
    return {
      schemaVersion: 1,
      seed: actualSeed,
      rngState: actualSeed,
      screen: 'TITLE',
      phaseIndex: -1,
      flowStepIndex: 0,
      roundIndex: 0,
      roundCounter: 0,
      date: { year: 2014, month: 6 },
      currentBrief: null,
      eventQueue: [],
      eventCursor: 0,
      pendingOutcome: null,
      forcedEndingId: null,
      pendingJumpPhaseId: null,
      examPaper: [],
      examCursor: 0,
      examCorrect: 0,
      stats: { knowledge: 40, money: 0, mindset: 70, network: 10 },
      profile: {
        background: null,
        province: null,
        track: null,
        examScore: null,
        university: null,
        major: null,
        career: null,
      },
      flags: {},
      npcs,
      scheduled: [],
      triggeredEventIds: [],
      history: [],
      endingId: null,
    };
  }

  function view(state: GameState): ViewModel {
    switch (state.screen) {
      case 'TITLE':
        return { kind: 'TITLE', title: pack.meta.title };
      case 'BACKGROUND_DRAW': {
        const card = pack.backgrounds.find(b => b.id === state.profile.background);
        if (!card) throw new Error('BACKGROUND_DRAW screen without a drawn card');
        return { kind: 'BACKGROUND_DRAW', card };
      }
      case 'SETUP':
        return { kind: 'SETUP', provinces: pack.provinces, tracks: ['文', '理'] };
      case 'EXAM': {
        const qid = state.examPaper[state.examCursor];
        const q = qid ? questionsById.get(qid) : undefined;
        if (!q) throw new Error('EXAM screen without a current question');
        return {
          kind: 'EXAM',
          index: state.examCursor,
          total: state.examPaper.length,
          question: { id: q.id, subject: q.subject, text: q.text, options: q.options },
        };
      }
      case 'EXAM_RESULT':
        return {
          kind: 'EXAM_RESULT',
          score: state.profile.examScore ?? 0,
          correct: state.examCorrect,
          total: state.examPaper.length,
        };
      case 'APPLICATION':
        return {
          kind: 'APPLICATION',
          score: state.profile.examScore ?? 0,
          options: availableApplications(state).map(opt => ({
            id: opt.id,
            label: opt.label,
            university: opt.university,
            major: opt.major,
            risky: opt.admitChance < 1,
          })),
        };
      case 'BRIEF': {
        const phase = phaseAt(state.phaseIndex);
        return {
          kind: 'BRIEF',
          phaseLabel: phase.label,
          year: state.date.year,
          text: state.currentBrief ?? '',
        };
      }
      case 'EVENT': {
        const evId = state.eventQueue[state.eventCursor];
        const ev = evId ? eventsById.get(evId) : undefined;
        if (!ev) throw new Error('EVENT screen without a current event');
        const rng = new Rng(state.rngState);
        const visible = ev.choices.filter(c =>
          evalCondition(c.visibleIf, { state, pack, rng }),
        );
        return {
          kind: 'EVENT',
          eventId: ev.id,
          title: ev.title,
          text: ev.text,
          choices: visible.map(c => ({ id: c.id, text: c.text })),
        };
      }
      case 'OUTCOME':
        return {
          kind: 'OUTCOME',
          text: state.pendingOutcome?.text ?? '',
          deltas: state.pendingOutcome?.deltas ?? {},
        };
      case 'SETTLEMENT':
        return { kind: 'SETTLEMENT', year: state.date.year, stats: state.stats };
      case 'ENDING': {
        const ending = pack.endings.find(e => e.id === state.endingId);
        if (!ending) throw new Error(`ENDING screen with unknown ending: ${state.endingId}`);
        return {
          kind: 'ENDING',
          endingId: ending.id,
          title: ending.title,
          text: ending.text,
          stats: state.stats,
          historyLength: state.history.length,
        };
      }
    }
  }

  function enterPhase(state: GameState, rng: Rng, index: number): void {
    state.phaseIndex = index;
    const phase = phaseAt(index);
    state.date = { ...phase.date };
    if (phase.kind === 'flow') {
      state.flowStepIndex = 0;
      enterFlowStep(state, rng);
    } else {
      state.roundIndex = 0;
      startRound(state, rng, phase);
    }
  }

  function enterFlowStep(state: GameState, rng: Rng): void {
    const phase = phaseAt(state.phaseIndex);
    if (phase.kind !== 'flow') throw new Error('enterFlowStep outside flow phase');
    const step = phase.steps[state.flowStepIndex];
    if (!step) {
      enterPhase(state, rng, state.phaseIndex + 1);
      return;
    }
    switch (step) {
      case 'BACKGROUND_DRAW': {
        const card = rng.pick(pack.backgrounds);
        state.profile.background = card.id;
        state.stats.money = card.initialMoney;
        Object.assign(state.flags, card.flags ?? {});
        state.screen = 'BACKGROUND_DRAW';
        break;
      }
      case 'SETUP':
        state.screen = 'SETUP';
        break;
      case 'EXAM': {
        const track = state.profile.track;
        const bank = pack.examBank.filter(q => q.track === 'both' || q.track === track);
        state.examPaper = rng.sample(bank, pack.meta.examQuestionCount).map(q => q.id);
        state.examCursor = 0;
        state.examCorrect = 0;
        state.screen = 'EXAM';
        break;
      }
      case 'APPLICATION':
        state.screen = 'APPLICATION';
        break;
    }
  }

  function nextFlowStep(state: GameState, rng: Rng): void {
    state.flowStepIndex += 1;
    enterFlowStep(state, rng);
  }

  function startRound(
    state: GameState,
    rng: Rng,
    phase: Extract<PhaseConfig, { kind: 'rounds' }>,
  ): void {
    state.eventQueue = pickRoundEvents(state, pack, rng, phase);
    state.eventCursor = 0;
    state.currentBrief =
      phase.briefs[state.roundIndex % Math.max(1, phase.briefs.length)] ?? '';
    state.screen = 'BRIEF';
  }

  function finishWithEnding(state: GameState, endingId: string): void {
    state.endingId = endingId;
    state.screen = 'ENDING';
  }

  function settleRound(state: GameState, rng: Rng): void {
    const phase = phaseAt(state.phaseIndex);
    if (phase.kind !== 'rounds') throw new Error('settleRound outside rounds phase');
    state.roundIndex += 1;
    state.roundCounter += 1;
    if (state.roundIndex < phase.rounds) {
      state.date.year += 1;
      startRound(state, rng, phase);
      return;
    }
    if (phase.isFinal) {
      const ending = findEnding(state, pack, rng, ['early', 'final']);
      finishWithEnding(state, ending?.id ?? pack.meta.fallbackEndingId);
      return;
    }
    enterPhase(state, rng, state.phaseIndex + 1);
  }

  function resolveExamScore(state: GameState, rng: Rng): void {
    const total = Math.max(1, state.examPaper.length);
    const rate = state.examCorrect / total;
    const raw = Math.round(EXAM_BASE_SCORE + rate * EXAM_SCORE_RANGE + rng.int(-15, 15));
    state.profile.examScore = Math.max(0, Math.min(750, raw));
    state.stats.knowledge = Math.round(20 + rate * 55);
    state.screen = 'EXAM_RESULT';
  }

  function handleApplication(state: GameState, rng: Rng, optionId: string): void {
    const option = availableApplications(state).find(o => o.id === optionId);
    if (!option) throw new Error(`Application option not available: ${optionId}`);
    const admitted = rng.chance(option.admitChance);
    if (admitted) {
      state.profile.university = option.university;
      state.profile.major = option.major;
      if (option.effects) applyEffects(option.effects, state, pack);
    } else {
      const fallback = pack.applications
        .filter(o => o.admitChance >= 1 && admissionScore(state) >= o.minScore)
        .sort((a, b) => b.minScore - a.minScore)[0];
      if (!fallback) throw new Error('No fallback application option; content must provide one');
      state.profile.university = fallback.university;
      state.profile.major = fallback.major;
      state.flags['slipped'] = true;
      if (option.failEffects) applyEffects(option.failEffects, state, pack);
    }
    state.history.push({
      kind: 'application',
      year: state.date.year,
      optionId: option.id,
      admitted,
    });
  }

  function resolveChoice(state: GameState, rng: Rng, choiceId: string): void {
    const evId = state.eventQueue[state.eventCursor];
    const ev = evId ? eventsById.get(evId) : undefined;
    if (!ev) throw new Error('CHOOSE without a current event');
    const ctx = { state, pack, rng };
    const choice = ev.choices.find(
      c => c.id === choiceId && evalCondition(c.visibleIf, ctx),
    );
    if (!choice) throw new Error(`Choice not available: ${choiceId} on ${ev.id}`);
    const eligible = choice.outcomes.filter(o => evalCondition(o.condition, ctx));
    const outcomePool = eligible.length > 0 ? eligible : choice.outcomes;
    const outcome = rng.weightedPick(outcomePool, o => o.weight);
    const { deltas } = applyEffects(outcome.effects, state, pack);
    state.triggeredEventIds.push(ev.id);
    state.history.push({
      kind: 'event',
      year: state.date.year,
      eventId: ev.id,
      category: ev.category,
      choiceId: choice.id,
      outcomeTag: outcome.outcomeTag,
    });
    state.pendingOutcome = { text: outcome.text, deltas };
    state.screen = 'OUTCOME';
  }

  function continueAfterOutcome(state: GameState, rng: Rng): void {
    state.pendingOutcome = null;
    if (state.forcedEndingId) {
      finishWithEnding(state, state.forcedEndingId);
      return;
    }
    if (state.pendingJumpPhaseId) {
      const idx = pack.timeline.findIndex(p => p.id === state.pendingJumpPhaseId);
      if (idx < 0) throw new Error(`jumpToPhase target not found: ${state.pendingJumpPhaseId}`);
      state.pendingJumpPhaseId = null;
      enterPhase(state, rng, idx);
      return;
    }
    const early = findEnding(state, pack, rng, ['early']);
    if (early) {
      finishWithEnding(state, early.id);
      return;
    }
    state.eventCursor += 1;
    if (state.eventCursor < state.eventQueue.length) {
      state.screen = 'EVENT';
    } else {
      state.screen = 'SETTLEMENT';
    }
  }

  function handle(state: GameState, action: PlayerAction, rng: Rng): void {
    switch (state.screen) {
      case 'TITLE':
        if (action.type !== 'START') invalid(state, action);
        enterPhase(state, rng, 0);
        return;
      case 'BACKGROUND_DRAW':
        if (action.type !== 'CONTINUE') invalid(state, action);
        nextFlowStep(state, rng);
        return;
      case 'SETUP': {
        if (action.type !== 'CHOOSE_SETUP') invalid(state, action);
        if (!pack.provinces.some(p => p.id === action.provinceId)) {
          throw new Error(`Unknown province: ${action.provinceId}`);
        }
        state.profile.province = action.provinceId;
        state.profile.track = action.track;
        nextFlowStep(state, rng);
        return;
      }
      case 'EXAM': {
        if (action.type !== 'ANSWER') invalid(state, action);
        const qid = state.examPaper[state.examCursor];
        const q: ExamQuestion | undefined = qid ? questionsById.get(qid) : undefined;
        if (!q) throw new Error('ANSWER without a current question');
        if (action.optionIndex === q.answerIndex) state.examCorrect += 1;
        state.examCursor += 1;
        if (state.examCursor >= state.examPaper.length) resolveExamScore(state, rng);
        return;
      }
      case 'EXAM_RESULT':
        if (action.type !== 'CONTINUE') invalid(state, action);
        nextFlowStep(state, rng);
        return;
      case 'APPLICATION':
        if (action.type !== 'APPLY') invalid(state, action);
        handleApplication(state, rng, action.optionId);
        nextFlowStep(state, rng);
        return;
      case 'BRIEF':
        if (action.type !== 'CONTINUE') invalid(state, action);
        if (state.eventQueue.length > 0) {
          state.screen = 'EVENT';
        } else {
          state.screen = 'SETTLEMENT';
        }
        return;
      case 'EVENT':
        if (action.type !== 'CHOOSE') invalid(state, action);
        resolveChoice(state, rng, action.choiceId);
        return;
      case 'OUTCOME':
        if (action.type !== 'CONTINUE') invalid(state, action);
        continueAfterOutcome(state, rng);
        return;
      case 'SETTLEMENT':
        if (action.type !== 'CONTINUE') invalid(state, action);
        settleRound(state, rng);
        return;
      case 'ENDING':
        invalid(state, action);
    }
  }

  function dispatch(state: GameState, action: PlayerAction): GameState {
    const next = clone(state);
    const rng = new Rng(next.rngState);
    try {
      handle(next, action, rng);
    } finally {
      next.rngState = rng.state;
    }
    return next;
  }

  return { start, view, dispatch };
}
