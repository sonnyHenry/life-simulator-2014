interface WxTouch {
  clientX: number;
  clientY: number;
}

interface WxTouchEvent {
  touches: WxTouch[];
  changedTouches: WxTouch[];
}

interface WxSystemInfo {
  windowWidth: number;
  windowHeight: number;
  pixelRatio?: number;
}

interface WxGameApi {
  createCanvas?: () => HTMLCanvasElement;
  getSystemInfoSync?: () => WxSystemInfo;
  getStorageSync?: (key: string) => unknown;
  setStorageSync?: (key: string, value: string) => void;
  removeStorageSync?: (key: string) => void;
  onTouchStart?: (handler: (event: WxTouchEvent) => void) => void;
  onTouchMove?: (handler: (event: WxTouchEvent) => void) => void;
  onTouchEnd?: (handler: (event: WxTouchEvent) => void) => void;
  showToast?: (options: { title: string; icon?: 'success' | 'loading' | 'none' }) => void;
  setClipboardData?: (options: { data: string; success?: () => void; fail?: () => void }) => void;
  shareAppMessage?: (options: { title: string; query?: string }) => void;
  showShareMenu?: (options?: { withShareTicket?: boolean }) => void;
  onShareAppMessage?: (handler: () => { title: string; query?: string }) => void;
}

declare const wx: WxGameApi | undefined;
declare const canvas: HTMLCanvasElement | undefined;
