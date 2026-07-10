import { contentPack } from '@life-sim/content';
import type { GameEvent } from '@life-sim/core';
import { runOne, type Strategy } from './simulate';

interface Args {
  runs: number;
  seed: number;
  strategy: Strategy;
  top: number;
}

interface LifeRun {
  eventIds: string[];
  eventSet: Set<string>;
  signature: string;
  presentationHits: string[];
  contextLineHits: string[];
}

type Source = '强制节点' | 'NPC线' | '职业线' | '公共池' | '主时间线';

function parseArgs(argv: string[]): Args {
  const args: Args = { runs: 300, seed: 42, strategy: 'random', top: 15 };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if ((arg === '-n' || arg === '--runs') && argv[i + 1]) args.runs = Number(argv[++i]);
    else if (arg === '--seed' && argv[i + 1]) args.seed = Number(argv[++i]);
    else if (arg === '--top' && argv[i + 1]) args.top = Number(argv[++i]);
    else if (arg === '--bot' && argv[i + 1]) {
      const strategy = argv[++i];
      if (strategy === 'random' || strategy === 'money' || strategy === 'mindset' || strategy === 'score') {
        args.strategy = strategy;
      } else throw new Error(`unknown bot strategy: ${strategy}`);
    }
  }
  if (!Number.isInteger(args.runs) || args.runs < 3) throw new Error('--runs 必须是至少 3 的整数');
  return args;
}

const eventsById = new Map(contentPack.events.map(event => [event.id, event]));
const npcEventIds = new Set(
  contentPack.npcs.flatMap(npc =>
    Object.values(npc.stages).flatMap(stage => (stage.eventId ? [stage.eventId] : [])),
  ),
);
const careerId = /^ev_(?:career|cs|edu|gov|local|fin|med|psy)_/;

function sourceOf(event: GameEvent): Source {
  if (npcEventIds.has(event.id)) return 'NPC线';
  if (careerId.test(event.id)) return '职业线';
  if (event.mandatory) return '强制节点';
  if (event.pools.includes('random') || event.pools.includes('invest')) return '公共池';
  return '主时间线';
}

function overlap(a: ReadonlySet<string>, b: ReadonlySet<string>): number {
  if (a.size === 0 && b.size === 0) return 0;
  let shared = 0;
  for (const id of a) if (b.has(id)) shared++;
  return shared / new Set([...a, ...b]).size;
}

function mean(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function pct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

function perceivedVariation(event: GameEvent): string[] {
  const labels: string[] = [];
  if (event.variantGroup) labels.push('变体池');
  if (event.presentationVariants?.length) labels.push(`条件开场${event.presentationVariants.length + 1}版`);
  if (event.contextLines?.length) labels.push(`回响${event.contextLines.length}条`);
  if (event.id === 'ev_trait_growth_2023') labels.push('内部12条成长路线');
  return labels;
}

function filtered(run: LifeRun, source?: Source): Set<string> {
  if (!source) return run.eventSet;
  return new Set([...run.eventSet].filter(id => {
    const event = eventsById.get(id);
    return event && sourceOf(event) === source;
  }));
}

function pairOverlaps(runs: LifeRun[], source?: Source): number[] {
  const values: number[] = [];
  for (let i = 1; i < runs.length; i++) values.push(overlap(filtered(runs[i - 1]!, source), filtered(runs[i]!, source)));
  return values;
}

function threeRunUniqueRatio(runs: LifeRun[]): number {
  const ratios: number[] = [];
  for (let i = 0; i + 2 < runs.length; i++) {
    const window = runs.slice(i, i + 3);
    const unique = new Set(window.flatMap(run => run.eventIds));
    const total = window.reduce((sum, run) => sum + run.eventIds.length, 0);
    ratios.push(total === 0 ? 0 : unique.size / total);
  }
  return mean(ratios);
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const runs: LifeRun[] = [];
  const appearances = new Map<string, number>();
  const gaps = new Map<string, number[]>();
  const lastSeen = new Map<string, number>();
  const presentationHits = new Map<string, number>();
  const contextLineHits = new Map<string, number>();

  for (let i = 0; i < args.runs; i++) {
    const seed = args.seed + i;
    const result = runOne(seed, seed ^ 0x5eed, args.strategy, false);
    const eventIds = result.finalState.history
      .filter(entry => entry.kind === 'event')
      .map(entry => entry.eventId);
    const eventSet = new Set(eventIds);
    const activeNpcs = Object.keys(result.finalState.npcs).sort().join('+');
    const signature = `${result.finalState.profile.career ?? 'none'}|${activeNpcs}`;
    runs.push({
      eventIds,
      eventSet,
      signature,
      presentationHits: result.presentationHits,
      contextLineHits: result.contextLineHits,
    });
    for (const key of result.presentationHits) presentationHits.set(key, (presentationHits.get(key) ?? 0) + 1);
    for (const key of result.contextLineHits) contextLineHits.set(key, (contextLineHits.get(key) ?? 0) + 1);
    for (const id of eventSet) {
      appearances.set(id, (appearances.get(id) ?? 0) + 1);
      const previous = lastSeen.get(id);
      if (previous !== undefined) {
        const list = gaps.get(id) ?? [];
        list.push(i - previous);
        gaps.set(id, list);
      }
      lastSeen.set(id, i);
    }
  }

  const sources: Source[] = ['强制节点', 'NPC线', '职业线', '公共池', '主时间线'];
  console.log(`重复率仪表盘 · ${args.runs} 局 · seed ${args.seed}–${args.seed + args.runs - 1} · ${args.strategy} bot\n`);
  console.log(`平均每局事件数: ${mean(runs.map(run => run.eventIds.length)).toFixed(1)}`);
  console.log(`相邻两局事件重合率(Jaccard): ${pct(mean(pairOverlaps(runs)))}`);
  console.log(`去除强制节点后的重合率: ${pct(mean(runs.slice(1).map((run, i) => {
    const previous = runs[i]!;
    const strip = (item: LifeRun) => new Set([...item.eventSet].filter(id => !eventsById.get(id)?.mandatory));
    return overlap(strip(previous), strip(run));
  })))}`);
  console.log(`连续 3 局独有事件比例(独有ID/三局事件总次数): ${pct(threeRunUniqueRatio(runs))}`);

  const highFrequency = [...appearances.entries()]
    .filter(([, count]) => count / args.runs >= 0.5)
    .map(([id]) => eventsById.get(id)!)
    .filter(Boolean);
  const variedHighFrequency = highFrequency.filter(event => perceivedVariation(event).length > 0);
  console.log(`高频事件感知变体覆盖(出现率≥50%): ${variedHighFrequency.length}/${highFrequency.length} (${pct(variedHighFrequency.length / highFrequency.length)})`);
  const uncovered = highFrequency.filter(event => perceivedVariation(event).length === 0);
  if (uncovered.length) console.log(`  待补: ${uncovered.map(event => `${event.title}(${event.id})`).join('、')}`);

  const contextEnabledAppearances = [...appearances.entries()].reduce((sum, [id, count]) =>
    sum + (eventsById.get(id)?.contextLines?.length ? count : 0), 0);
  const totalContextHits = [...contextLineHits.values()].reduce((sum, count) => sum + count, 0);
  const runsWithContext = runs.filter(run => run.contextLineHits.length > 0).length;
  const totalPresentationHits = [...presentationHits.values()].reduce((sum, count) => sum + count, 0);
  console.log('\n实际条件文案命中:');
  console.log(`  小回响: 平均每局 ${(totalContextHits / args.runs).toFixed(2)} 条 · ${pct(runsWithContext / args.runs)} 的对局至少看到 1 条`);
  console.log(`  带回响事件出现后命中率: ${contextEnabledAppearances ? pct(totalContextHits / contextEnabledAppearances) : '无样本'} (${totalContextHits}/${contextEnabledAppearances})`);
  console.log(`  条件开场: 平均每局 ${(totalPresentationHits / args.runs).toFixed(2)} 个`);

  const contextEvents = contentPack.events.filter(event => event.contextLines?.length);
  console.log('  各事件回响命中率:');
  for (const event of contextEvents) {
    const shown = appearances.get(event.id) ?? 0;
    const hits = event.contextLines!.reduce((sum, _line, index) => sum + (contextLineHits.get(`${event.id}#${index}`) ?? 0), 0);
    console.log(`    ${pct(shown ? hits / shown : 0).padStart(6)}  ${String(hits).padStart(3)}/${String(shown).padEnd(3)}  ${event.title}`);
  }

  const deadContextLines = contextEvents.flatMap(event => event.contextLines!.flatMap((line, index) => {
    const key = `${event.id}#${index}`;
    return contextLineHits.has(key) ? [] : [`${event.title}#${index + 1}「${line.text.slice(0, 18)}…」`];
  }));
  console.log(`  300局零命中回响: ${deadContextLines.length ? deadContextLines.join('、') : '无'}`);
  const rareContextLines = contextEvents.flatMap(event => event.contextLines!.map((line, index) => ({
    event,
    line,
    count: contextLineHits.get(`${event.id}#${index}`) ?? 0,
  }))).filter(item => item.count / args.runs < 0.03).sort((a, b) => a.count - b.count);
  console.log('  低命中回响(<总局数3%):');
  if (rareContextLines.length === 0) console.log('    无');
  else for (const item of rareContextLines) {
    console.log(`    ${String(item.count).padStart(3)} 局  ${item.event.title}「${item.line.text.slice(0, 24)}…」`);
  }

  console.log('\n按来源拆分的相邻两局重合率:');
  for (const source of sources) {
    const averageCount = mean(runs.map(run => filtered(run, source).size));
    console.log(`  ${source.padEnd(5, ' ')} ${pct(mean(pairOverlaps(runs, source))).padStart(6)}  平均每局 ${averageCount.toFixed(1)} 个`);
  }

  const same: number[] = [];
  const different: number[] = [];
  for (let i = 1; i < runs.length; i++) {
    const previous = runs[i - 1]!;
    const current = runs[i]!;
    const bucket = previous.signature === current.signature ? same : different;
    bucket.push(overlap(previous.eventSet, current.eventSet));
  }
  console.log('\n配置影响(职业 + 激活NPC):');
  console.log(`  相同配置: ${same.length ? pct(mean(same)) : '样本不足'} (${same.length} 对)`);
  console.log(`  不同配置: ${different.length ? pct(mean(different)) : '样本不足'} (${different.length} 对)`);

  console.log(`\n出现率最高的 ${args.top} 个事件:`);
  const common = [...appearances.entries()].sort((a, b) => b[1] - a[1]).slice(0, args.top);
  for (const [id, count] of common) {
    const event = eventsById.get(id)!;
    const averageGap = mean(gaps.get(id) ?? []);
    const variation = perceivedVariation(event);
    const internal = variation.length ? ` · ${variation.join(' + ')}` : '';
    console.log(`  ${pct(count / args.runs).padStart(6)}  ${sourceOf(event).padEnd(5, ' ')}  间隔${averageGap.toFixed(1).padStart(5)}局  ${event.title} (${id})${internal}`);
  }

  const variants = new Map<string, GameEvent[]>();
  for (const event of contentPack.events) {
    if (!event.variantGroup) continue;
    const group = variants.get(event.variantGroup) ?? [];
    group.push(event);
    variants.set(event.variantGroup, group);
  }
  console.log('\n固定节点变体池:');
  if (variants.size === 0) console.log('  暂无');
  else for (const [group, events] of variants) console.log(`  ${group}: ${events.length} 个变体`);
}

main();
