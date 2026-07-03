import { create } from 'zustand';
import {
  createEngine,
  randomSeed,
  type GameState,
  type PlayerAction,
  type ViewModel,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';
import { clearSave, loadSave, saveGame } from './platform/storage';

const engine = createEngine(contentPack);

interface GameStore {
  game: GameState;
  view: ViewModel;
  hasSave: boolean;
  act: (action: PlayerAction) => void;
  newGame: (seed?: number) => void;
  continueGame: () => void;
  clearSavedGame: () => void;
}

export const useGame = create<GameStore>((set, get) => {
  const saved = loadSave();
  const initial = engine.start();
  return {
    game: initial,
    view: engine.view(initial),
    hasSave: saved !== null && saved.screen !== 'TITLE' && saved.screen !== 'ENDING',
    act: action => {
      const next = engine.dispatch(get().game, action);
      saveGame(next);
      set({ game: next, view: engine.view(next), hasSave: next.screen !== 'ENDING' });
    },
    newGame: seed => {
      const g = engine.start(seed ?? randomSeed());
      clearSave();
      set({ game: g, view: engine.view(g), hasSave: false });
    },
    continueGame: () => {
      const savedGame = loadSave();
      if (!savedGame || savedGame.screen === 'ENDING') return;
      set({ game: savedGame, view: engine.view(savedGame), hasSave: true });
    },
    clearSavedGame: () => {
      clearSave();
      const g = engine.start();
      set({ game: g, view: engine.view(g), hasSave: false });
    },
  };
});
