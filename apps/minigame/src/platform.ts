import {
  createSaveFile,
  migrateSaveFile,
  restoreSave,
  type Engine,
  type GameState,
  type PlayerAction,
  type SaveFile,
} from '@life-sim/core';

const SAVE_KEY = 'life-sim-2014:minigame-save:v1';

export interface RestoredGame {
  state: GameState;
  actionLog: PlayerAction[];
}

function getWx(): WxGameApi | null {
  try {
    return typeof wx === 'undefined' ? null : wx;
  } catch {
    return null;
  }
}

export function createGameCanvas(): HTMLCanvasElement {
  const api = getWx();
  if (api?.createCanvas) return api.createCanvas();
  try {
    if (typeof canvas !== 'undefined') return canvas;
  } catch {
    // fall through to browser preview canvas
  }
  if (typeof document !== 'undefined') {
    const previewCanvas = document.createElement('canvas');
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
    document.body.appendChild(previewCanvas);
    return previewCanvas;
  }
  throw new Error('No canvas runtime is available.');
}

export function getGameSystemInfo(): WxSystemInfo {
  const api = getWx();
  if (api?.getSystemInfoSync) return api.getSystemInfoSync();
  if (typeof window !== 'undefined') {
    return {
      windowWidth: window.innerWidth || 375,
      windowHeight: window.innerHeight || 667,
      pixelRatio: window.devicePixelRatio || 1,
    };
  }
  return { windowWidth: 375, windowHeight: 667, pixelRatio: 1 };
}

export function loadSaveFile(): SaveFile | null {
  try {
    const api = getWx();
    const raw = api?.getStorageSync
      ? api.getStorageSync(SAVE_KEY)
      : typeof localStorage !== 'undefined'
        ? localStorage.getItem(SAVE_KEY)
        : null;
    if (!raw) return null;
    return migrateSaveFile(typeof raw === 'string' ? JSON.parse(raw) : raw);
  } catch {
    return null;
  }
}

export function loadRestoredGame(
  engine: Engine,
  currentContentVersion: string,
): RestoredGame | null {
  const save = loadSaveFile();
  const restored = save ? restoreSave(engine, save, currentContentVersion) : null;
  if (!save || !restored || restored.screen === 'TITLE' || restored.screen === 'ENDING') {
    return null;
  }
  return { state: restored, actionLog: [...save.actionLog] };
}

export function saveGame(
  contentVersion: string,
  snapshot: GameState,
  actionLog: PlayerAction[],
): void {
  try {
    const save = createSaveFile(contentVersion, snapshot, actionLog);
    const serialized = JSON.stringify(save);
    const api = getWx();
    if (api?.setStorageSync) {
      api.setStorageSync(SAVE_KEY, serialized);
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.setItem(SAVE_KEY, serialized);
  } catch {
    // Storage should never block a playable run.
  }
}

export function clearSave(): void {
  try {
    const api = getWx();
    if (api?.removeStorageSync) {
      api.removeStorageSync(SAVE_KEY);
      return;
    }
    if (typeof localStorage !== 'undefined') localStorage.removeItem(SAVE_KEY);
  } catch {
    // ignore
  }
}

export function showToast(title: string): void {
  const api = getWx();
  if (api?.showToast) {
    api.showToast({ title, icon: 'none' });
  }
}

export function copyText(text: string, successTitle = '已复制'): void {
  const api = getWx();
  if (api?.setClipboardData) {
    api.setClipboardData({
      data: text,
      success: () => showToast(successTitle),
      fail: () => showToast('复制失败'),
    });
    return;
  }
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    void navigator.clipboard.writeText(text).then(() => showToast(successTitle));
  }
}

export function bindTouchHandlers(handlers: {
  onStart: (x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onEnd: (x: number, y: number) => void;
}): void {
  const api = getWx();
  if (api?.onTouchStart && api.onTouchMove && api.onTouchEnd) {
    api.onTouchStart(event => {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (touch) handlers.onStart(touch.clientX, touch.clientY);
    });
    api.onTouchMove(event => {
      const touch = event.touches[0] ?? event.changedTouches[0];
      if (touch) handlers.onMove(touch.clientX, touch.clientY);
    });
    api.onTouchEnd(event => {
      const touch = event.changedTouches[0] ?? event.touches[0];
      if (touch) handlers.onEnd(touch.clientX, touch.clientY);
    });
    return;
  }

  if (typeof document !== 'undefined') {
    let mouseDown = false;
    document.addEventListener('mousedown', event => {
      mouseDown = true;
      handlers.onStart(event.clientX, event.clientY);
    });
    document.addEventListener('mousemove', event => {
      if (mouseDown) handlers.onMove(event.clientX, event.clientY);
    });
    document.addEventListener('mouseup', event => {
      mouseDown = false;
      handlers.onEnd(event.clientX, event.clientY);
    });
    document.addEventListener(
      'touchstart',
      event => {
        const touch = event.touches[0];
        if (touch) handlers.onStart(touch.clientX, touch.clientY);
      },
      { passive: true },
    );
    document.addEventListener(
      'touchmove',
      event => {
        const touch = event.touches[0];
        if (touch) handlers.onMove(touch.clientX, touch.clientY);
      },
      { passive: true },
    );
    document.addEventListener(
      'touchend',
      event => {
        const touch = event.changedTouches[0];
        if (touch) handlers.onEnd(touch.clientX, touch.clientY);
      },
      { passive: true },
    );
  }
}

export function enableShare(getPayload: () => { title: string; query?: string }): void {
  const api = getWx();
  api?.showShareMenu?.({ withShareTicket: true });
  api?.onShareAppMessage?.(() => getPayload());
}

export function shareNow(payload: { title: string; query?: string }): void {
  const api = getWx();
  if (api?.shareAppMessage) api.shareAppMessage(payload);
}
