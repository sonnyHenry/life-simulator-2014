import { describe, expect, it } from 'vitest';
import {
  createEngine,
  createSaveFile,
  CURRENT_SAVE_VERSION,
  evalCondition,
  eventMindsetValence,
  pickRoundEvents,
  migrateSaveFile,
  restoreSave,
  Rng,
  type ContentPack,
  type Engine,
  type GameState,
  type PlayerAction,
} from '../src/index';

/** 在 BACKGROUND_DRAW 屏按 offer 顺序选满 pickCount 个特质 */
function pickTraits(engine: Engine, state: GameState): PlayerAction {
  const view = engine.view(state);
  if (view.kind !== 'BACKGROUND_DRAW') throw new Error('expected BACKGROUND_DRAW view');
  return {
    type: 'CHOOSE_TRAITS',
    traitIds: view.traitOffer.slice(0, view.pickCount).map(t => t.id),
  };
}

function miniPack(): ContentPack {
  return {
    meta: {
      id: 'test',
      version: '0.0.1',
      title: 'test pack',
      fallbackEndingId: 'end_fallback',
      examQuestionCount: 2,
    },
    timeline: [
      {
        kind: 'flow',
        id: 'gaokao',
        label: '高考',
        date: { year: 2014, month: 6 },
        steps: ['BACKGROUND_DRAW', 'SETUP', 'EXAM', 'APPLICATION'],
      },
      {
        kind: 'rounds',
        id: 'life',
        label: '人生',
        date: { year: 2014, month: 9 },
        rounds: 2,
        eventSlots: 1,
        pools: ['main'],
        briefs: ['第一年', '第二年'],
        isFinal: true,
      },
    ],
    events: [
      {
        id: 'ev_a',
        pools: ['main'],
        title: '事件A',
        text: '一个测试事件',
        choices: [
          {
            id: 'x',
            text: '选X',
            outcomes: [
              {
                weight: 1,
                text: '结果X',
                effects: [{ stats: { mindset: -10 } }, { setFlag: 'chose_x' }],
              },
            ],
          },
          {
            id: 'y',
            text: '选Y',
            outcomes: [
              { weight: 1, text: '结果Y', effects: [{ stats: { money: 1000 } }] },
            ],
          },
        ],
      },
      {
        id: 'ev_chain',
        pools: [],
        title: '链式事件',
        text: '由 schedule 触发',
        choices: [
          { id: 'ok', text: '好', outcomes: [{ weight: 1, text: '好的', effects: [] }] },
        ],
      },
    ],
    endings: [
      {
        id: 'end_fallback',
        title: '普通结局',
        text: '结束了',
        category: 'final',
        priority: 999,
        condition: { always: true },
      },
    ],
    examBank: [
      { id: 'q1', track: 'both', subject: '数学', text: '1+1=?', options: ['1', '2'], answerIndex: 1 },
      { id: 'q2', track: 'both', subject: '语文', text: '选对的', options: ['对', '错'], answerIndex: 0 },
      { id: 'q3', track: '理', subject: '物理', text: 'g≈?', options: ['9.8', '3.7'], answerIndex: 0 },
    ],
    backgrounds: [{ id: 'bg1', label: '普通家庭', text: '普通', initialMoney: 5000 }],
    traits: [
      { id: 'trait_a', label: '特质A', text: '测试特质A', poolBias: { career: 1.5 }, statMods: { knowledge: 5 } },
      { id: 'trait_b', label: '特质B', text: '测试特质B' },
      { id: 'trait_c', label: '特质C', text: '测试特质C' },
    ],
    traitEvolutions: [],
    lifeGoals: [],
    applications: [
      { id: 'app1', label: '保底大学', university: '某大学', minScore: 0, majors: [{ id: 'm1', name: '某专业', trackFlag: 'management' }] },
    ],
    npcs: [],
    incomes: [],
    fns: {},
  };
}

function autoPlay(pack: ContentPack, seed: number): GameState {
  const engine = createEngine(pack);
  let state = engine.start(seed);
  let guard = 0;
  while (guard++ < 500) {
    const view = engine.view(state);
    if (view.kind === 'ENDING') return state;
    let action: PlayerAction;
    switch (view.kind) {
      case 'TITLE':
        action = { type: 'START' };
        break;
      case 'BACKGROUND_DRAW':
        action = pickTraits(engine, state);
        break;
      case 'SETUP':
        action = { type: 'CHOOSE_SETUP', gender: 'male', track: '理' };
        break;
      case 'EXAM':
        action = { type: 'ANSWER', optionIndex: 0 };
        break;
      case 'APPLICATION':
        action = { type: 'APPLY', optionId: view.options[0]!.id };
        break;
      case 'EVENT':
        action = { type: 'CHOOSE', choiceId: view.choices[0]!.id };
        break;
      default:
        action = { type: 'CONTINUE' };
    }
    state = engine.dispatch(state, action);
  }
  throw new Error('autoPlay did not finish');
}

describe('Rng', () => {
  it('is deterministic for the same seed', () => {
    const a = new Rng(12345);
    const b = new Rng(12345);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });

  it('produces values in [0, 1)', () => {
    const rng = new Rng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('M2 flow support', () => {
  it('supports a crossroad flow step before later phases', () => {
    const pack = miniPack();
    pack.timeline.splice(1, 0, {
      kind: 'flow',
      id: 'crossroad',
      label: '三岔口',
      date: { year: 2018, month: 3 },
      steps: ['CROSSROAD'],
    });
    const engine = createEngine(pack);
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    while (engine.view(state).kind === 'EXAM') {
      state = engine.dispatch(state, { type: 'ANSWER', optionIndex: 1 });
    }
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });

    let view = engine.view(state);
    expect(view.kind).toBe('OUTCOME');
    state = engine.dispatch(state, { type: 'CONTINUE' });
    view = engine.view(state);
    expect(view.kind).toBe('CROSSROAD');
    state = engine.dispatch(state, { type: 'CHOOSE_CROSSROAD', optionId: 'job' });
    expect(state.history.some(h => h.kind === 'crossroad' && h.optionId === 'job')).toBe(true);
    expect(engine.view(state).kind).toBe('OUTCOME');
    state = engine.dispatch(state, { type: 'CONTINUE' });
    expect(engine.view(state).kind).toBe('BRIEF');
  });

  it('schedules NPC stage events when their stage condition becomes true', () => {
    const pack = miniPack();
    const flow = pack.timeline[0]!;
    if (flow.kind !== 'flow') throw new Error('expected flow phase');
    flow.steps.push('NPC_SELECTION');
    pack.npcs = [
      {
        id: 'friend',
        name: '朋友',
        initialFavor: 10,
        initialStage: 'start',
        stages: {
          start: {
            advanceWhen: { year: { from: 2014, to: 2014 } },
            eventId: 'ev_chain',
          },
        },
      },
    ];
    const engine = createEngine(pack);
    let state = engine.start(3);
    state = engine.dispatch(state, { type: 'START' });
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    while (engine.view(state).kind === 'EXAM') {
      state = engine.dispatch(state, { type: 'ANSWER', optionIndex: 1 });
    }
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    expect(engine.view(state).kind).toBe('NPC_SELECTION');
    state = engine.dispatch(state, { type: 'CHOOSE_NPCS', npcIds: ['friend'] });
    state = engine.dispatch(state, { type: 'CONTINUE' });

    const view = engine.view(state);
    expect(view.kind).toBe('EVENT');
    if (view.kind === 'EVENT') expect(view.eventId).toBe('ev_chain');
  });
});

describe('event scheduling variety', () => {
  it('always activates the romance NPC and lets the player choose one other NPC', () => {
    const pack = miniPack();
    pack.npcs = ['first_love', 'roommate', 'grinder', 'hometown_friend', 'mentor'].map(id => ({
      id,
      name: id,
      initialFavor: 10,
      initialStage: 'start',
      stages: { start: {} },
    }));
    const flow = pack.timeline[0]!;
    if (flow.kind !== 'flow') throw new Error('expected flow phase');
    flow.steps.push('NPC_SELECTION');
    const engine = createEngine(pack);
    let state = engine.start(42);
    state.screen = 'NPC_SELECTION';
    state.phaseIndex = 0;
    state.flowStepIndex = flow.steps.length - 1;
    const view = engine.view(state);
    expect(view.kind).toBe('NPC_SELECTION');
    if (view.kind !== 'NPC_SELECTION') throw new Error('expected NPC_SELECTION view');
    expect(view.requiredNpcs.map(npc => npc.id)).toEqual(['first_love']);
    expect(view.npcs).toHaveLength(4);
    expect(view.pickCount).toBe(1);
    state = engine.dispatch(state, {
      type: 'CHOOSE_NPCS',
      npcIds: view.npcs.slice(0, view.pickCount).map(npc => npc.id),
    });
    expect(Object.keys(state.npcs)).toEqual(['first_love', 'roommate']);
  });

  it('uses the chosen life goal to score the same life differently', () => {
    const pack = miniPack();
    pack.meta.scoring = {
      weights: { knowledge: 0.2, money: 0.2, mindset: 0.2, network: 0.2, health: 0.2 },
      moneyFullScore: 600000,
    };
    pack.lifeGoals = [
      {
        id: 'goal_money', label: '财富', text: '财富优先',
        scoringWeights: { knowledge: 0, money: 1, mindset: 0, network: 0, health: 0 },
      },
      {
        id: 'goal_mindset', label: '心态', text: '心态优先',
        scoringWeights: { knowledge: 0, money: 0, mindset: 1, network: 0, health: 0 },
      },
    ];
    const engine = createEngine(pack);
    const state = engine.start(42);
    state.screen = 'ENDING';
    state.endingId = 'end_fallback';
    state.stats = { knowledge: 0, money: 600000, mindset: 10, network: 0, health: 0 };
    state.flags.life_goal = 'goal_money';
    const moneyView = engine.view(state);
    state.flags.life_goal = 'goal_mindset';
    const mindsetView = engine.view(state);
    expect(moneyView.kind).toBe('ENDING');
    expect(mindsetView.kind).toBe('ENDING');
    if (moneyView.kind !== 'ENDING' || mindsetView.kind !== 'ENDING') return;
    expect(moneyView.score).toBe(100);
    expect(mindsetView.score).toBe(10);
  });

  it('exposes completed NPC relationships on the ending view', () => {
    const pack = miniPack();
    const engine = createEngine(pack);
    const state = engine.start(42);
    state.screen = 'ENDING';
    state.endingId = 'end_fallback';
    state.flags.roommate_true_partner = true;
    state.flags.mentor_true_legacy = true;
    const view = engine.view(state);
    expect(view.kind).toBe('ENDING');
    if (view.kind !== 'ENDING') return;
    expect(view.relationships.map(relationship => relationship.npcId)).toEqual(['roommate', 'mentor']);
    expect(view.relationships.map(relationship => relationship.title)).toEqual([
      '没散的创始团队',
      '传下去的那支笔',
    ]);
  });

  it('limits eligible NPC stage events to one per round and defers the rest', () => {
    const pack = miniPack();
    pack.events = ['ev_npc_a', 'ev_npc_b', 'ev_npc_c'].map(id => ({
      id,
      pools: [],
      title: id,
      text: id,
      choices: [
        {
          id: 'ok',
          text: '好',
          outcomes: [{ weight: 1, text: '好', effects: [{ stats: { mindset: 1 } }] }],
        },
      ],
    }));
    pack.npcs = pack.events.map((ev, i) => ({
      id: `npc_${i}`,
      name: `NPC ${i}`,
      initialFavor: 10,
      initialStage: 'start',
      stages: {
        start: { advanceWhen: { year: { from: 2014, to: 2014 } }, eventId: ev.id },
      },
    }));
    const state = createEngine(pack).start(7);
    state.npcs = Object.fromEntries(
      pack.npcs.map(npc => [npc.id, { favor: npc.initialFavor, stage: npc.initialStage }]),
    );
    const phase = pack.timeline.find(p => p.kind === 'rounds')!;
    const picked = pickRoundEvents(state, pack, new Rng(7), phase);
    expect(picked).toHaveLength(1);
    expect(pack.events.map(e => e.id)).toContain(picked[0]);
    expect(state.pendingNpcEvents).toHaveLength(2);
  });

  it('plays deferred NPC events after their original year window instead of dropping the chain', () => {
    const pack = miniPack();
    pack.events = ['ev_npc_a', 'ev_npc_b', 'ev_npc_c'].map(id => ({
      id,
      pools: [],
      title: id,
      text: id,
      choices: [
        {
          id: 'ok',
          text: '好',
          outcomes: [{ weight: 1, text: '好', effects: [] }],
        },
      ],
    }));
    pack.npcs = pack.events.map((ev, i) => ({
      id: `npc_${i}`,
      name: `NPC ${i}`,
      initialFavor: 10,
      initialStage: 'start',
      stages: {
        start: { advanceWhen: { year: { from: 2014, to: 2014 } }, eventId: ev.id },
      },
    }));
    const state = createEngine(pack).start(7);
    state.npcs = Object.fromEntries(
      pack.npcs.map(npc => [npc.id, { favor: npc.initialFavor, stage: npc.initialStage }]),
    );
    const phase = pack.timeline.find(p => p.kind === 'rounds')!;
    const seen: string[] = [];
    for (let round = 0; round < 3; round++) {
      state.date.year = 2014 + round;
      state.roundCounter = round;
      const picked = pickRoundEvents(state, pack, new Rng(7 + round), phase);
      expect(picked).toHaveLength(1);
      seen.push(picked[0]!);
      state.triggeredEventIds.push(picked[0]!);
    }
    expect(new Set(seen)).toEqual(new Set(['ev_npc_a', 'ev_npc_b', 'ev_npc_c']));
    expect(state.pendingNpcEvents).toHaveLength(0);
  });

  it('drops a deferred NPC event when another effect has already changed that NPC stage', () => {
    const pack = miniPack();
    pack.events = [{
      id: 'ev_stale_npc', pools: [], title: '旧阶段事件', text: '不应再出现',
      choices: [{ id: 'ok', text: '好', outcomes: [{ weight: 1, text: '好', effects: [] }] }],
    }];
    pack.npcs = [{
      id: 'friend', name: '朋友', initialFavor: 10, initialStage: 'start',
      stages: {
        start: { advanceWhen: { year: { from: 2014, to: 2014 } }, eventId: 'ev_stale_npc' },
        changed: {},
      },
    }];
    const state = createEngine(pack).start(7);
    state.npcs = { friend: { favor: 10, stage: 'changed' } };
    state.pendingNpcEvents = [{ npcId: 'friend', eventId: 'ev_stale_npc' }];
    state.date.year = 2015;
    const phase = pack.timeline.find(p => p.kind === 'rounds')!;
    const picked = pickRoundEvents(state, pack, new Rng(7), phase);
    expect(picked).not.toContain('ev_stale_npc');
    expect(state.pendingNpcEvents).toHaveLength(0);
  });

  it('picks only one mandatory event from the same variant group', () => {
    const pack = miniPack();
    pack.events = [
      {
        id: 'ev_variant_a',
        pools: ['main'],
        title: '变体A',
        text: '变体A',
        mandatory: true,
        variantGroup: 'era_test',
        choices: [
          {
            id: 'ok',
            text: '好',
            outcomes: [{ weight: 1, text: '好', effects: [{ stats: { mindset: 1 } }] }],
          },
        ],
      },
      {
        id: 'ev_variant_b',
        pools: ['main'],
        title: '变体B',
        text: '变体B',
        mandatory: true,
        variantGroup: 'era_test',
        choices: [
          {
            id: 'ok',
            text: '好',
            outcomes: [{ weight: 1, text: '好', effects: [{ stats: { mindset: 1 } }] }],
          },
        ],
      },
    ];
    const state = createEngine(pack).start(7);
    const phase = pack.timeline.find(p => p.kind === 'rounds')!;
    const picked = pickRoundEvents(state, pack, new Rng(7), phase);
    expect(picked).toHaveLength(1);
    expect(['ev_variant_a', 'ev_variant_b']).toContain(picked[0]);
  });
});

describe('career crossroad branches', () => {
  function reachCrossroad(seed: number) {
    const pack = miniPack();
    pack.timeline.splice(1, 0, {
      kind: 'flow',
      id: 'crossroad',
      label: '三岔口',
      date: { year: 2018, month: 3 },
      steps: ['CROSSROAD'],
    });
    const engine = createEngine(pack);
    let state = engine.start(seed);
    state = engine.dispatch(state, { type: 'START' });
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    state = engine.dispatch(state, { type: 'SKIP_EXAM' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    return { engine, state };
  }

  it('routes a finance major choosing 求职 into career_finance', () => {
    const { engine, state } = reachCrossroad(3);
    state.profile.major = '金融学';
    expect(engine.view(state).kind).toBe('CROSSROAD');
    const after = engine.dispatch(state, { type: 'CHOOSE_CROSSROAD', optionId: 'job' });
    expect(after.profile.career).toBe('finance');
    expect(after.flags['career_finance']).toBe(true);
    expect(after.flags['first_job_track']).toBe('finance_ordinary_candidate');
  });

  it('routes a clinical-medicine major choosing 求职 into career_medicine + medicine_resident', () => {
    const { engine, state } = reachCrossroad(3);
    state.profile.major = '临床医学';
    expect(engine.view(state).kind).toBe('CROSSROAD');
    const after = engine.dispatch(state, { type: 'CHOOSE_CROSSROAD', optionId: 'job' });
    expect(after.profile.career).toBe('medicine');
    expect(after.flags['career_medicine']).toBe(true);
    expect(after.flags['medicine_resident']).toBe(true);
    expect(after.flags['first_job_track']).toBe('medicine_ordinary_candidate');
  });
});

describe('evalCondition', () => {
  const pack = miniPack();
  const engine = createEngine(pack);
  const state = engine.start(1);
  const ctx = { state, pack, rng: new Rng(1) };

  it('evaluates stat comparisons', () => {
    expect(evalCondition({ stat: 'mindset', op: '>=', value: 70 }, ctx)).toBe(true);
    expect(evalCondition({ stat: 'mindset', op: '<', value: 70 }, ctx)).toBe(false);
  });

  it('evaluates flag / all / any / not combinators', () => {
    state.flags['foo'] = true;
    expect(evalCondition({ flag: 'foo' }, ctx)).toBe(true);
    expect(evalCondition({ not: { flag: 'foo' } }, ctx)).toBe(false);
    expect(
      evalCondition({ all: [{ flag: 'foo' }, { stat: 'mindset', op: '>', value: 0 }] }, ctx),
    ).toBe(true);
    expect(evalCondition({ any: [{ flag: 'nope' }, { flag: 'foo' }] }, ctx)).toBe(true);
  });

  it('throws on unknown fn reference', () => {
    expect(() => evalCondition({ fn: 'missing' }, ctx)).toThrow(/unknown fn/);
  });
});

describe('engine full game', () => {
  it('plays to an ending', () => {
    const final = autoPlay(miniPack(), 99);
    expect(final.endingId).toBe('end_fallback');
    expect(final.screen).toBe('ENDING');
    expect(final.history.length).toBeGreaterThan(0);
  });

  it('is fully deterministic: same seed, same policy, same final state', () => {
    const a = autoPlay(miniPack(), 2024);
    const b = autoPlay(miniPack(), 2024);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('different seeds can draw different exam papers', () => {
    const results = new Set<string>();
    for (let seed = 1; seed <= 20; seed++) {
      results.add(JSON.stringify(autoPlay(miniPack(), seed).examPaper));
    }
    expect(results.size).toBeGreaterThan(1);
  });
});

describe('same-round consequence (afterRounds: 0)', () => {
  it('appends the scheduled event to the current round queue', () => {
    const pack = miniPack();
    const evA = pack.events.find(e => e.id === 'ev_a')!;
    evA.choices[0]!.outcomes[0]!.effects.push({
      schedule: { eventId: 'ev_chain', afterRounds: 0 },
    });
    const engine = createEngine(pack);
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    while (engine.view(state).kind === 'EXAM') {
      state = engine.dispatch(state, { type: 'ANSWER', optionIndex: 0 });
    }
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' }); // OUTCOME → BRIEF(第一年)
    state = engine.dispatch(state, { type: 'CONTINUE' }); // BRIEF → EVENT(ev_a)
    const yearAtEvA = state.date.year;
    state = engine.dispatch(state, { type: 'CHOOSE', choiceId: 'x' }); // 触发 schedule 0
    state = engine.dispatch(state, { type: 'CONTINUE' }); // OUTCOME → 应追加 ev_chain
    const view = engine.view(state);
    expect(view.kind).toBe('EVENT');
    if (view.kind === 'EVENT') expect(view.eventId).toBe('ev_chain');
    expect(state.date.year).toBe(yearAtEvA); // 同一年内弹出
  });
});

describe('save replay & migration', () => {
  it('restores via snapshot when content version matches, replay when it differs', () => {
    const pack = miniPack();
    const engine = createEngine(pack);
    let state = engine.start(9);
    const log: PlayerAction[] = [];
    const doAct = (action: PlayerAction) => {
      log.push(action);
      state = engine.dispatch(state, action);
    };
    doAct({ type: 'START' });
    doAct(pickTraits(engine, state));
    doAct({ type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    doAct({ type: 'SKIP_EXAM' });

    const save = createSaveFile('1.0.0', state, log);
    expect(restoreSave(engine, save, '1.0.0')).toBe(save.snapshot);

    const replayed = restoreSave(engine, save, '2.0.0');
    expect(replayed).not.toBeNull();
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(state));
  });

  it('migrates v1 snapshot-only saves and refuses replaying them', () => {
    const pack = miniPack();
    const engine = createEngine(pack);
    const snapshot = autoPlay(pack, 5);
    const v1 = {
      saveVersion: 1,
      contentVersion: '0.9.0',
      savedAt: '2026-01-01T00:00:00.000Z',
      snapshot,
    };
    const migrated = migrateSaveFile(v1);
    expect(migrated).not.toBeNull();
    expect(migrated!.saveVersion).toBe(CURRENT_SAVE_VERSION);
    expect(migrated!.seed).toBe(snapshot.seed);
    // 同版本 → 快照可用;换版本 → 空日志不可重放,判为不可恢复
    expect(restoreSave(engine, migrated!, '0.9.0')).toBe(migrated!.snapshot);
    expect(restoreSave(engine, migrated!, '1.0.0')).toBeNull();
  });

  it('rejects unknown or corrupted saves', () => {
    expect(migrateSaveFile(null)).toBeNull();
    expect(migrateSaveFile({ saveVersion: 99 })).toBeNull();
    expect(migrateSaveFile({ saveVersion: 2, snapshot: null, actionLog: [] })).toBeNull();
  });
});

describe('exam skip', () => {
  it('skips remaining questions and resolves a default-rate score', () => {
    const pack = miniPack();
    const engine = createEngine(pack);
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    expect(engine.view(state).kind).toBe('EXAM');
    state = engine.dispatch(state, { type: 'SKIP_EXAM' });
    const view = engine.view(state);
    expect(view.kind).toBe('EXAM_RESULT');
    if (view.kind === 'EXAM_RESULT') {
      expect(view.score).toBeGreaterThan(330);
      expect(view.score).toBeLessThanOrEqual(750);
    }
    expect(state.stats.knowledge).toBeGreaterThan(20);
  });
});

describe('income & scoring', () => {
  it('supports setting a stat to an exact value and reports the real delta', () => {
    const pack = miniPack();
    const evA = pack.events.find(e => e.id === 'ev_a')!;
    evA.choices[0]!.outcomes[0]!.effects = [{ setStat: 'money', value: 0 }];
    const engine = createEngine(pack);
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    state.stats.money = 12345;
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    state = engine.dispatch(state, { type: 'SKIP_EXAM' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CHOOSE', choiceId: 'x' });
    expect(state.stats.money).toBe(0);
    expect(state.pendingOutcome?.deltas.money).toBe(-12345);
  });

  it('supports proportional money costs capped by the current balance', () => {
    const pack = miniPack();
    const evA = pack.events.find(e => e.id === 'ev_a')!;
    evA.choices[0]!.outcomes[0]!.effects = [{ moneyCost: { rate: 0.5, roundTo: 1000 } }];
    const engine = createEngine(pack);
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    state.stats.money = 12345;
    state = engine.dispatch(state, pickTraits(engine, state));
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    state = engine.dispatch(state, { type: 'SKIP_EXAM' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CHOOSE', choiceId: 'x' });
    expect(state.stats.money).toBe(6345);
    expect(state.pendingOutcome?.deltas.money).toBe(-6000);
  });

  it('applies matching income rules once per settled round', () => {
    const base = autoPlay(miniPack(), 11);
    const pack = miniPack();
    pack.incomes = [{ id: 'inc_test', label: '测试收入', when: { always: true }, amount: 1000 }];
    const withIncome = autoPlay(pack, 11);
    expect(withIncome.roundCounter).toBe(base.roundCounter);
    expect(withIncome.stats.money - base.stats.money).toBe(withIncome.roundCounter * 1000);
  });

  it('settles income on entering SETTLEMENT and exposes the breakdown in the view', () => {
    const pack = miniPack();
    pack.incomes = [{ id: 'inc_test', label: '测试收入', when: { always: true }, amount: 1000 }];
    const engine = createEngine(pack);
    let state = engine.start(11);
    let guard = 0;
    while (guard++ < 100 && engine.view(state).kind !== 'SETTLEMENT') {
      const view = engine.view(state);
      let action: PlayerAction;
      switch (view.kind) {
        case 'TITLE':
          action = { type: 'START' };
          break;
        case 'BACKGROUND_DRAW':
          action = pickTraits(engine, state);
          break;
        case 'SETUP':
          action = { type: 'CHOOSE_SETUP', gender: 'male', track: '理' };
          break;
        case 'EXAM':
          action = { type: 'SKIP_EXAM' };
          break;
        case 'APPLICATION':
          action = { type: 'APPLY', optionId: 'app1' };
          break;
        case 'EVENT':
          action = { type: 'CHOOSE', choiceId: view.choices[0]!.id };
          break;
        default:
          action = { type: 'CONTINUE' };
      }
      state = engine.dispatch(state, action);
    }
    const view = engine.view(state);
    if (view.kind !== 'SETTLEMENT') throw new Error('expected SETTLEMENT view');
    // 结算屏上的金钱已含本年收入,明细与趋势同步透出
    expect(view.incomes).toEqual([{ label: '测试收入', amount: 1000 }]);
    expect(view.moneyDelta).toBe(1000);
    expect(view.moneyTrend.length).toBe(1);
    expect(view.moneyTrend[0]!.money).toBe(view.stats.money);
  });

  it('exposes a weighted score and grade on the ending view', () => {
    const pack = miniPack();
    const engine = createEngine(pack);
    const state = autoPlay(pack, 11);
    const view = engine.view(state);
    if (view.kind !== 'ENDING') throw new Error('expected ENDING view');
    expect(view.score).toBeGreaterThanOrEqual(0);
    expect(view.score).toBeLessThanOrEqual(100);
    expect(['S', 'A', 'B', 'C', 'D']).toContain(view.grade);
  });
});

describe('traits and director', () => {
  it('offers trait candidates and applies statMods on CHOOSE_TRAITS', () => {
    const engine = createEngine(miniPack());
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    // 抽卡阶段:只有候选,还没有特质 flag
    expect(Object.keys(state.flags).some(k => k.startsWith('trait_'))).toBe(false);
    const view = engine.view(state);
    if (view.kind !== 'BACKGROUND_DRAW') throw new Error('expected BACKGROUND_DRAW view');
    // miniPack 只有 3 张特质:offer = min(4, 3),pick = 2
    expect(view.traitOffer).toHaveLength(3);
    expect(view.pickCount).toBe(2);

    // 非法选择:数量不对 / 不在 offer 内
    expect(() =>
      engine.dispatch(state, { type: 'CHOOSE_TRAITS', traitIds: [view.traitOffer[0]!.id] }),
    ).toThrow();
    expect(() =>
      engine.dispatch(state, {
        type: 'CHOOSE_TRAITS',
        traitIds: [view.traitOffer[0]!.id, view.traitOffer[0]!.id],
      }),
    ).toThrow();
    expect(() =>
      engine.dispatch(state, {
        type: 'CHOOSE_TRAITS',
        traitIds: view.traitOffer.map(t => t.id),
      }),
    ).toThrow();
    expect(() =>
      engine.dispatch(state, { type: 'CHOOSE_TRAITS', traitIds: ['trait_nope', 'trait_nah'] }),
    ).toThrow();

    // 合法选择:写入 flags + 应用 statMods
    const chosen = view.traitOffer.slice(0, 2).map(t => t.id);
    const knowledgeBefore = state.stats.knowledge;
    const modSum = view.traitOffer
      .slice(0, 2)
      .reduce((sum, t) => sum + (t.statMods?.knowledge ?? 0), 0);
    state = engine.dispatch(state, { type: 'CHOOSE_TRAITS', traitIds: chosen });
    for (const id of chosen) expect(state.flags[id]).toBe(true);
    expect(state.stats.knowledge).toBe(
      Math.max(0, Math.min(100, knowledgeBefore + modSum)),
    );
    expect(state.traitOffer).toEqual([]);
    expect(engine.view(state).kind).toBe('SETUP');
  });

  it('derives event mindset valence from weighted outcome deltas', () => {
    const ev = {
      id: 'ev_valence',
      pools: ['main'],
      title: 't',
      text: 't',
      choices: [
        {
          id: 'a',
          text: 'a',
          outcomes: [
            { weight: 3, text: 'good', effects: [{ stats: { mindset: 4 } }] },
            { weight: 1, text: 'bad', effects: [{ stats: { mindset: -4 } }] },
          ],
        },
        {
          id: 'b',
          text: 'b',
          outcomes: [{ weight: 1, text: 'flat', effects: [{ stats: { money: 100 } }] }],
        },
      ],
    } as const;
    // choice a: (4*3 + -4*1)/4 = 2, choice b: 0 → 平均 1
    expect(eventMindsetValence(ev as unknown as Parameters<typeof eventMindsetValence>[0])).toBe(1);
  });
});

describe('trait tag rendering', () => {
  it('tags trait-gated events and choices with the trait label', () => {
    const pack = miniPack();
    // 只放 2 个特质,抽 2 必然全中,断言不依赖随机
    pack.traits = [
      { id: 'trait_a', label: '特质A', text: 'A' },
      { id: 'trait_b', label: '特质B', text: 'B' },
    ];
    pack.events[0]!.trigger = { all: [{ flag: 'trait_a' }] };
    pack.events[0]!.choices[1]!.visibleIf = { flag: 'trait_b' };
    const engine = createEngine(pack);
    let state = engine.start(5);
    let guard = 0;
    while (guard++ < 100) {
      const view = engine.view(state);
      if (view.kind === 'EVENT') {
        expect(view.title).toBe('【特质A】事件A');
        expect(view.choices.find(c => c.id === 'y')?.text).toBe('【特质B】选Y');
        return;
      }
      let action: PlayerAction;
      switch (view.kind) {
        case 'TITLE': action = { type: 'START' }; break;
        case 'BACKGROUND_DRAW': action = pickTraits(engine, state); break;
        case 'SETUP': action = { type: 'CHOOSE_SETUP', gender: 'male', track: '理' }; break;
        case 'EXAM': action = { type: 'ANSWER', optionIndex: 0 }; break;
        case 'APPLICATION': action = { type: 'APPLY', optionId: 'app1' }; break;
        default: action = { type: 'CONTINUE' };
      }
      state = engine.dispatch(state, action);
    }
    throw new Error('never reached EVENT view');
  });
});

describe('event presentation variants', () => {
  it('uses the first matching conditional title and text without changing the event id', () => {
    const pack = miniPack();
    pack.events[0]!.presentationVariants = [
      { condition: { always: true }, title: '情境标题', text: '属于这一局的开场' },
    ];
    pack.events[0]!.contextLines = [
      { condition: { always: true }, text: '你还记得上一年的选择。' },
    ];
    const engine = createEngine(pack);
    let state = engine.start(7);
    for (let guard = 0; guard < 100; guard++) {
      const view = engine.view(state);
      if (view.kind === 'EVENT') {
        expect(view.eventId).toBe('ev_a');
        expect(view.title).toBe('情境标题');
        expect(view.text).toBe('属于这一局的开场\n\n你还记得上一年的选择。');
        return;
      }
      const action: PlayerAction = view.kind === 'TITLE' ? { type: 'START' }
        : view.kind === 'BACKGROUND_DRAW' ? pickTraits(engine, state)
        : view.kind === 'SETUP' ? { type: 'CHOOSE_SETUP', gender: 'male', track: '理' }
        : view.kind === 'EXAM' ? { type: 'ANSWER', optionIndex: 0 }
        : view.kind === 'APPLICATION' ? { type: 'APPLY', optionId: 'app1' }
        : { type: 'CONTINUE' };
      state = engine.dispatch(state, action);
    }
    throw new Error('never reached EVENT view');
  });
});
