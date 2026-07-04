import { create } from 'zustand';
import Taro from '@tarojs/taro';
import {
  createEngine,
  createSaveFile,
  migrateSaveFile,
  randomSeed,
  restoreSave,
  type GameState,
  type PlayerAction,
  type SaveFile,
  type ViewModel,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';

const engine = createEngine(contentPack);
const SAVE_KEY = 'life-sim-2014:save:v1';

function loadSaveFileWx(): SaveFile | null {
  try {
    const raw = Taro.getStorageSync<string>(SAVE_KEY);
    if (!raw) return null;
    return migrateSaveFile(JSON.parse(raw));
  } catch {
    return null;
  }
}

function saveGameWx(snapshot: GameState, actionLog: PlayerAction[]): void {
  try {
    const save = createSaveFile(contentPack.meta.version, snapshot, actionLog);
    Taro.setStorageSync(SAVE_KEY, JSON.stringify(save));
  } catch {
    // 存储失败不阻断游戏
  }
}

function clearSaveWx(): void {
  try {
    Taro.removeStorageSync(SAVE_KEY);
  } catch {
    // ignore
  }
}

interface GameStore {
  game: GameState;
  view: ViewModel;
  hasSave: boolean;
  act: (action: PlayerAction) => void;
  newGame: (seed?: number) => void;
  continueGame: () => void;
}

export const useGame = create<GameStore>((set, get) => {
  const savedFile = loadSaveFileWx();
  const restored = savedFile ? restoreSave(engine, savedFile, contentPack.meta.version) : null;
  let actionLog: PlayerAction[] = restored && savedFile ? [...savedFile.actionLog] : [];
  const initial = engine.start();
  return {
    game: initial,
    view: engine.view(initial),
    hasSave: restored !== null && restored.screen !== 'TITLE' && restored.screen !== 'ENDING',
    act: action => {
      if (get().game.screen === 'TITLE') actionLog = [];
      const next = engine.dispatch(get().game, action);
      actionLog.push(action);
      saveGameWx(next, actionLog);
      set({ game: next, view: engine.view(next), hasSave: next.screen !== 'ENDING' });
    },
    newGame: seed => {
      const g = engine.start(seed ?? randomSeed());
      actionLog = [];
      clearSaveWx();
      set({ game: g, view: engine.view(g), hasSave: false });
    },
    continueGame: () => {
      if (!restored || restored.screen === 'ENDING') return;
      set({ game: restored, view: engine.view(restored), hasSave: true });
    },
  };
});
