import type { GameState } from '@life-sim/core';
import { contentPack } from '@life-sim/content';

const SAVE_KEY = 'life-sim-2014:save:v1';

interface StoredSave {
  saveVersion: 1;
  contentVersion: string;
  savedAt: string;
  snapshot: GameState;
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadSave(): GameState | null {
  if (!canUseStorage()) return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSave>;
    if (parsed.saveVersion !== 1) return null;
    if (parsed.contentVersion !== contentPack.meta.version) return null;
    return parsed.snapshot ?? null;
  } catch {
    return null;
  }
}

export function saveGame(snapshot: GameState): void {
  if (!canUseStorage()) return;
  try {
    const save: StoredSave = {
      saveVersion: 1,
      contentVersion: contentPack.meta.version,
      savedAt: new Date().toISOString(),
      snapshot,
    };
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Storage can fail in private mode or quota pressure; gameplay should continue.
  }
}

export function clearSave(): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
