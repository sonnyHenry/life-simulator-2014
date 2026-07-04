import type { Stats } from '@life-sim/core';

export interface ShareImageData {
  title: string;
  tagline: string;
  tone: 'triumph' | 'bitter' | 'warm';
  years: string;
  seed: number;
  stats: Stats;
  score: number;
  grade: string;
  gameTitle: string;
}

const TONE_COLORS: Record<ShareImageData['tone'], { bg: string; border: string; accent: string }> = {
  triumph: { bg: '#eef6ed', border: '#c9dfcb', accent: '#3d6b45' },
  bitter: { bg: '#f8eeee', border: '#e3cccc', accent: '#8a4a4a' },
  warm: { bg: '#fff8e8', border: '#ead8b8', accent: '#8a6a2f' },
};

const W = 750;
const H = 1000;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (const ch of text) {
    if (ctx.measureText(current + ch).width > maxWidth) {
      lines.push(current);
      current = ch;
      if (lines.length === maxLines - 1) break;
    } else {
      current += ch;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

export function renderShareImage(data: ShareImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  const colors = TONE_COLORS[data.tone];
  const font = (size: number, weight = 400) =>
    `${weight} ${size}px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`;

  // 背景
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = colors.border;
  ctx.lineWidth = 6;
  roundRect(ctx, 24, 24, W - 48, H - 48, 20);
  ctx.stroke();

  // 头部:年份 + 人生编号
  ctx.fillStyle = '#8a8577';
  ctx.font = font(26);
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText(data.years, 64, 72);
  ctx.textAlign = 'right';
  ctx.fillText(`人生编号 #${data.seed}`, W - 64, 72);

  // 结局标题
  ctx.fillStyle = '#2c2a24';
  ctx.textAlign = 'center';
  ctx.font = font(64, 700);
  const titleLines = wrapText(ctx, data.title, W - 160, 2);
  let y = 180;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += 84;
  }

  // tagline
  ctx.fillStyle = colors.accent;
  ctx.font = font(34);
  const tagLines = wrapText(ctx, data.tagline, W - 180, 3);
  y += 24;
  for (const line of tagLines) {
    ctx.fillText(line, W / 2, y);
    y += 52;
  }

  // 总分 + 评级
  const scoreY = 520;
  ctx.fillStyle = colors.accent;
  ctx.font = font(120, 700);
  ctx.fillText(data.grade, W / 2 - 130, scoreY);
  ctx.fillStyle = '#2c2a24';
  ctx.font = font(40, 600);
  ctx.fillText(`人生总分 ${data.score}`, W / 2 + 90, scoreY + 60);

  // 四维数值 2x2
  const statItems: [string, string][] = [
    ['学识', String(data.stats.knowledge)],
    ['金钱', `¥${data.stats.money.toLocaleString()}`],
    ['心态', String(data.stats.mindset)],
    ['人脉', String(data.stats.network)],
  ];
  const gridTop = 700;
  statItems.forEach(([label, value], i) => {
    const cx = i % 2 === 0 ? W / 4 + 40 : (3 * W) / 4 - 40;
    const cy = gridTop + Math.floor(i / 2) * 110;
    ctx.fillStyle = '#2c2a24';
    ctx.font = font(44, 600);
    ctx.fillText(value, cx, cy);
    ctx.fillStyle = '#8a8577';
    ctx.font = font(26);
    ctx.fillText(label, cx, cy + 56);
  });

  // 底部游戏名
  ctx.fillStyle = '#8a8577';
  ctx.font = font(28);
  ctx.fillText(`《${data.gameTitle}》`, W / 2, H - 90);

  return canvas;
}

export async function downloadShareImage(data: ShareImageData): Promise<void> {
  const canvas = renderShareImage(data);
  const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('canvas toBlob failed');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `2014人生-${data.title}-#${data.seed}.png`;
  a.click();
  URL.revokeObjectURL(url);
}
