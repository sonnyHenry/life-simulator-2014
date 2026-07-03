import {
  createEngine,
  Rng,
  type GameState,
  type PlayerAction,
  type ViewModel,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';

interface CliArgs {
  runs: number;
  seed: number | null;
  verbose: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { runs: 200, seed: null, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if ((a === '-n' || a === '--runs') && argv[i + 1]) args.runs = Number(argv[++i]);
    else if (a === '--seed' && argv[i + 1]) args.seed = Number(argv[++i]);
    else if (a === '--verbose' || a === '-v') args.verbose = true;
  }
  return args;
}

function botAction(view: ViewModel, bot: Rng): PlayerAction {
  switch (view.kind) {
    case 'TITLE':
      return { type: 'START' };
    case 'BACKGROUND_DRAW':
    case 'EXAM_RESULT':
    case 'BRIEF':
    case 'OUTCOME':
    case 'SETTLEMENT':
      return { type: 'CONTINUE' };
    case 'SETUP':
      return {
        type: 'CHOOSE_SETUP',
        provinceId: bot.pick(view.provinces).id,
        track: bot.pick(view.tracks),
      };
    case 'EXAM':
      return { type: 'ANSWER', optionIndex: bot.int(0, view.question.options.length - 1) };
    case 'APPLICATION':
      return { type: 'APPLY', optionId: bot.pick(view.options).id };
    case 'CROSSROAD':
      return { type: 'CHOOSE_CROSSROAD', optionId: bot.pick(view.options).id };
    case 'EVENT':
      return { type: 'CHOOSE', choiceId: bot.pick(view.choices).id };
    case 'ENDING':
      throw new Error('botAction called on ENDING view');
  }
}

interface RunResult {
  endingId: string;
  endingTitle: string;
  finalState: GameState;
  steps: number;
}

const engine = createEngine(contentPack);

function fmtDeltas(deltas: Record<string, number | undefined>): string {
  const parts = Object.entries(deltas)
    .filter(([, v]) => v !== undefined && v !== 0)
    .map(([k, v]) => `${k}${v! > 0 ? '+' : ''}${v}`);
  return parts.length > 0 ? `  [${parts.join(', ')}]` : '';
}

function runOne(seed: number, botSeed: number, verbose: boolean): RunResult {
  let state = engine.start(seed);
  const bot = new Rng(botSeed);
  let steps = 0;
  const log = (line: string) => {
    if (verbose) console.log(line);
  };

  while (steps < 1000) {
    const view = engine.view(state);
    if (view.kind === 'ENDING') {
      log(`\n🏁 结局:【${view.title}】`);
      log(view.text);
      log(
        `\n最终数值: 学识${state.stats.knowledge} 金钱¥${state.stats.money} 心态${state.stats.mindset} 人脉${state.stats.network}`,
      );
      return { endingId: view.endingId, endingTitle: view.title, finalState: state, steps };
    }
    const action = botAction(view, bot);
    switch (view.kind) {
      case 'BACKGROUND_DRAW':
        log(`\n🎴 家境:${view.card.label} (初始资金 ¥${view.card.initialMoney})`);
        break;
      case 'EXAM_RESULT':
        log(`\n📝 高考出分:${view.score} 分 (答对 ${view.correct}/${view.total})`);
        break;
      case 'APPLICATION':
        if (action.type === 'APPLY') {
          const opt = view.options.find(o => o.id === action.optionId);
          log(`🎓 志愿:${opt?.label}${opt?.risky ? '(有滑档风险)' : ''}`);
        }
        break;
      case 'CROSSROAD':
        if (action.type === 'CHOOSE_CROSSROAD') {
          const opt = view.options.find(o => o.id === action.optionId);
          log(`\n🎒 毕业三岔口:${opt?.label}`);
        }
        break;
      case 'BRIEF':
        log(`\n===== ${view.year} 年 · ${view.phaseLabel} =====`);
        log(view.text);
        break;
      case 'EVENT':
        if (action.type === 'CHOOSE') {
          const choice = view.choices.find(c => c.id === action.choiceId);
          log(`\n▶ ${view.title}`);
          log(`  选择:${choice?.text}`);
        }
        break;
      case 'OUTCOME':
        log(`  ${view.text}${fmtDeltas(view.deltas)}`);
        break;
      default:
        break;
    }
    state = engine.dispatch(state, action);
    steps++;
  }
  throw new Error(`Run did not finish within 1000 steps (seed=${seed})`);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));

  if (args.verbose) {
    const seed = args.seed ?? Math.floor(Math.random() * 2147483646) + 1;
    console.log(`《${contentPack.meta.title}》 seed=${seed}\n`);
    runOne(seed, seed ^ 0x5eed, true);
    return;
  }

  const baseSeed = args.seed ?? 42;
  const endingCounts = new Map<string, { title: string; count: number }>();
  const eventsSeen = new Set<string>();
  let totalRounds = 0;
  const statSums = { knowledge: 0, money: 0, mindset: 0, network: 0 };

  console.log(`模拟 ${args.runs} 局 (baseSeed=${baseSeed}) ...`);
  const t0 = Date.now();
  for (let i = 0; i < args.runs; i++) {
    const result = runOne(baseSeed + i, (baseSeed + i) ^ 0x5eed, false);
    const entry = endingCounts.get(result.endingId) ?? { title: result.endingTitle, count: 0 };
    entry.count++;
    endingCounts.set(result.endingId, entry);
    totalRounds += result.finalState.roundCounter;
    for (const h of result.finalState.history) {
      if (h.kind === 'event') eventsSeen.add(h.eventId);
    }
    statSums.knowledge += result.finalState.stats.knowledge;
    statSums.money += result.finalState.stats.money;
    statSums.mindset += result.finalState.stats.mindset;
    statSums.network += result.finalState.stats.network;
  }
  const elapsed = Date.now() - t0;

  console.log(`\n完成,耗时 ${elapsed}ms (${(elapsed / args.runs).toFixed(2)}ms/局)\n`);
  console.log('结局分布:');
  const sorted = [...endingCounts.entries()].sort((a, b) => b[1].count - a[1].count);
  for (const [id, { title, count }] of sorted) {
    const pct = ((count / args.runs) * 100).toFixed(1).padStart(5);
    console.log(`  ${pct}%  【${title}】 (${id}, ${count} 局)`);
  }
  const missingEndings = contentPack.endings.filter(e => !endingCounts.has(e.id));
  if (missingEndings.length > 0) {
    console.log(`\n⚠️  从未到达的结局: ${missingEndings.map(e => e.id).join(', ')}`);
  }
  console.log(`\n事件覆盖: ${eventsSeen.size}/${contentPack.events.length}`);
  const missedEvents = contentPack.events.filter(e => !eventsSeen.has(e.id));
  if (missedEvents.length > 0) {
    console.log(`  未触发过的事件: ${missedEvents.map(e => e.id).join(', ')}`);
  }
  console.log(`平均回合数: ${(totalRounds / args.runs).toFixed(1)}`);
  console.log(
    `平均最终数值: 学识${(statSums.knowledge / args.runs).toFixed(0)} 金钱¥${(statSums.money / args.runs).toFixed(0)} 心态${(statSums.mindset / args.runs).toFixed(0)} 人脉${(statSums.network / args.runs).toFixed(0)}`,
  );
}

main();
