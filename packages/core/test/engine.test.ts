import { describe, expect, it } from 'vitest';
import {
  createEngine,
  createSaveFile,
  CURRENT_SAVE_VERSION,
  evalCondition,
  eventMindsetValence,
  migrateSaveFile,
  restoreSave,
  Rng,
  type ContentPack,
  type GameState,
  type PlayerAction,
} from '../src/index';

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
      { id: 'trait_a', label: '特质A', text: '测试特质A', poolBias: { career: 1.5 } },
      { id: 'trait_b', label: '特质B', text: '测试特质B' },
      { id: 'trait_c', label: '特质C', text: '测试特质C' },
    ],
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CHOOSE_SETUP', gender: 'male', track: '理' });
    while (engine.view(state).kind === 'EXAM') {
      state = engine.dispatch(state, { type: 'ANSWER', optionIndex: 1 });
    }
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'APPLY', optionId: 'app1' });
    state = engine.dispatch(state, { type: 'CONTINUE' });
    state = engine.dispatch(state, { type: 'CONTINUE' });

    const view = engine.view(state);
    expect(view.kind).toBe('EVENT');
    if (view.kind === 'EVENT') expect(view.eventId).toBe('ev_chain');
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
    doAct({ type: 'CONTINUE' });
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
    state = engine.dispatch(state, { type: 'CONTINUE' });
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
  it('draws exactly 2 distinct traits at background draw and exposes them on the view', () => {
    const engine = createEngine(miniPack());
    let state = engine.start(7);
    state = engine.dispatch(state, { type: 'START' });
    const traitFlags = Object.keys(state.flags).filter(k => k.startsWith('trait_'));
    expect(traitFlags).toHaveLength(2);
    expect(new Set(traitFlags).size).toBe(2);
    const view = engine.view(state);
    if (view.kind !== 'BACKGROUND_DRAW') throw new Error('expected BACKGROUND_DRAW view');
    expect(view.traits.map(t => t.id).sort()).toEqual(traitFlags.sort());
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
