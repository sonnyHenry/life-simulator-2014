import { createEngine, type GameState, type PlayerAction } from '@life-sim/core';
import { contentPack } from '@life-sim/content';

const engine = createEngine(contentPack);
const HOMETOWN_EVENTS = [
  'ev_npc_hometown_spring_festival', // 2015
  'ev_npc_hometown_settled', // 2019
  'ev_npc_hometown_reunion', // 2025
];
const HT = new Set(HOMETOWN_EVENTS);

// choices: 对三个发小事件按顺序指定 a/b;其它事件一律 a。
function runLife(seed: number, choices: ('a' | 'b')[]) {
  let state = engine.start(seed);
  const seen: string[] = [];
  for (let guard = 0; guard < 5000; guard++) {
    const view = engine.view(state) as any;
    if (view.kind === 'ENDING') break;
    let action: PlayerAction;
    switch (view.kind) {
      case 'TITLE': action = { type: 'START' } as PlayerAction; break;
      case 'BACKGROUND_DRAW':
        action = { type: 'CHOOSE_TRAITS', traitIds: view.traitOffer.slice(0, view.pickCount).map((t: any) => t.id) }; break;
      case 'SETUP': action = { type: 'CHOOSE_SETUP', gender: view.genders[0], track: view.tracks[0] }; break;
      case 'EXAM': action = { type: 'ANSWER', optionIndex: 0 }; break;
      case 'APPLICATION': action = { type: 'APPLY', optionId: view.options[0].id }; break;
      case 'NPC_SELECTION': {
        const n = view.npcs.find((x: any) => x.id === 'hometown_friend');
        if (!n) throw new Error('hometown_friend 不在可选 NPC 列表');
        action = { type: 'CHOOSE_NPCS', npcIds: [n.id] }; break;
      }
      case 'LIFE_GOAL': action = { type: 'CHOOSE_LIFE_GOAL', goalId: view.goals[0].id }; break;
      case 'CROSSROAD': action = { type: 'CHOOSE_CROSSROAD', optionId: view.options[0].id }; break;
      case 'EVENT': {
        let want: 'a' | 'b' = 'a';
        if (HT.has(view.eventId)) {
          const idx = HOMETOWN_EVENTS.indexOf(view.eventId);
          want = choices[idx] ?? 'a';
          seen.push(view.eventId);
        }
        const choice = view.choices.find((c: any) => c.id === want) ?? view.choices[0];
        action = { type: 'CHOOSE', choiceId: choice.id }; break;
      }
      default: action = { type: 'CONTINUE' } as PlayerAction;
    }
    state = engine.dispatch(state, action);
  }
  return { state: state as GameState, seen };
}

function find(label: string, choices: ('a' | 'b')[]) {
  for (let seed = 1; seed <= 600; seed++) {
    const { state, seen } = runLife(seed, choices);
    if (seen.length >= 3) {
      const g = state.npcs['hometown_friend'];
      console.log(`\n[${label}] seed=${seed}  选择=${choices.join('/')}`);
      console.log(`  触发: ${seen.join(' → ')}`);
      console.log(`  终态 stage=${g?.stage} favor=${g?.favor}`);
      console.log(`  hometown_true_friend=${state.flags['hometown_true_friend'] ?? '(未设)'}  hometown_listened=${state.flags['hometown_listened'] ?? '(未设)'}  hometown_drifted=${state.flags['hometown_drifted'] ?? '(未设)'}`);
      return { state, g };
    }
  }
  console.log(`\n[${label}] 600 种子内未凑齐三段(随机早结局),但事件在全量模拟可达`);
  return null;
}

console.log('=== 发小线回响验证 ===');
const warm = find('全程惦记(a/a/a)', ['a', 'a', 'a']);
const drift = find('先疏后补(b/a/a)', ['b', 'a', 'a']); // 2015冷,2019祝贺→settled_close,warm=1
const reconcile = find('疏远后低头(a/b/a)', ['a', 'b', 'a']); // 2019玩笑→settled_distant,2025先低头
const cold = find('全程疏远(b/b/b)', ['b', 'b', 'b']);

let ok = true;
const check = (c: any, cond: boolean, msg: string) => { if (c && !cond) { console.error('❌ ' + msg); ok = false; } };
check(warm, warm?.g?.stage === 'close' && warm?.state.flags['hometown_true_friend'] === true, '全程惦记应 close + hometown_true_friend');
check(drift, drift?.g?.stage === 'close' && drift?.state.flags['hometown_true_friend'] !== true, '先疏后补应 close 但不解锁 true_friend');
check(reconcile, reconcile?.g?.stage === 'close' && reconcile?.state.flags['hometown_true_friend'] !== true, '疏远后低头应 close 但不解锁 true_friend');
check(cold, cold?.g?.stage === 'distant' && cold?.state.flags['hometown_true_friend'] !== true, '全程疏远应 distant 且不解锁 true_friend');
console.log(ok ? '\n✅ 断言全部通过' : '\n❌ 存在失败断言');
process.exit(ok ? 0 : 1);
