import type { Stats } from '@life-sim/core';

export interface ShareImageData {
  title: string;
  tagline: string;
  text: string;
  tone: 'triumph' | 'bitter' | 'warm';
  years: string;
  seed: number;
  stats: Stats;
  score: number;
  grade: string;
  gameTitle: string;
  /** 本局特质 label,空数组时不渲染该行 */
  traits?: string[];
}

const TONE_COLORS: Record<ShareImageData['tone'], { bg: string; border: string; accent: string }> = {
  triumph: { bg: '#eef6ed', border: '#c9dfcb', accent: '#3d6b45' },
  bitter: { bg: '#f8eeee', border: '#e3cccc', accent: '#8a4a4a' },
  warm: { bg: '#fff8e8', border: '#ead8b8', accent: '#8a6a2f' },
};

const W = 750;

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

// 行首禁排字符:换行时悬挂到上一行行尾,避免标点出现在行首
const NO_LINE_START = '，。、！？；：）》〉」』”’…—％·,.!?;:)]%';

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const lines: string[] = [];
  let current = '';
  for (let i = 0; i < text.length; i += 1) {
    const ch = text.charAt(i);
    if (current === '' || ctx.measureText(current + ch).width <= maxWidth) {
      current += ch;
      continue;
    }
    if (NO_LINE_START.includes(ch)) {
      current += ch;
      continue;
    }

    lines.push(current);
    current = ch;
    if (lines.length !== maxLines - 1) continue;

    for (let j = i + 1; j < text.length; j += 1) {
      const next = current + text.charAt(j);
      if (ctx.measureText(`${next}…`).width > maxWidth) break;
      current = next;
      i = j;
    }
    if (i < text.length - 1) {
      while (current && ctx.measureText(`${current}…`).width > maxWidth) {
        current = current.slice(0, -1);
      }
      current = `${current}…`;
    }
    break;
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

export function renderShareImage(data: ShareImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2d context unavailable');
  const colors = TONE_COLORS[data.tone];
  const font = (size: number, weight = 400) =>
    `${weight} ${size}px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`;
  const drawFittedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    size: number,
    weight = 400,
    minSize = 22,
  ) => {
    let fittedSize = size;
    ctx.font = font(fittedSize, weight);
    while (fittedSize > minSize && ctx.measureText(text).width > maxWidth) {
      fittedSize -= 2;
      ctx.font = font(fittedSize, weight);
    }
    ctx.fillText(text, x, y);
  };

  // 文本行数可变,先测量换行再确定画布高度
  ctx.font = font(64, 700);
  const titleLines = wrapText(ctx, data.title, W - 160, 2);
  ctx.font = font(34);
  const tagLines = wrapText(ctx, data.tagline, W - 180, 3);
  ctx.font = font(28);
  const textLines = wrapText(ctx, data.text, W - 160, 10);

  const tagY = 180 + titleLines.length * 84 + 24;
  const textY = tagY + tagLines.length * 52 + 36;
  const scoreY = textY + textLines.length * 46 + 44;
  const H = scoreY + 480;

  // 设高度会清空画布并重置绘制状态,之后逐块重设
  canvas.height = H;

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
  if (data.traits && data.traits.length > 0) {
    ctx.textAlign = 'center';
    ctx.fillText(`特质:${data.traits.join(' × ')}`, W / 2, 110);
  }

  // 结局标题
  ctx.fillStyle = '#2c2a24';
  ctx.textAlign = 'center';
  ctx.font = font(64, 700);
  let y = 180;
  for (const line of titleLines) {
    ctx.fillText(line, W / 2, y);
    y += 84;
  }

  // tagline
  ctx.fillStyle = colors.accent;
  ctx.font = font(34);
  y = tagY;
  for (const line of tagLines) {
    ctx.fillText(line, W / 2, y);
    y += 52;
  }

  // 结局详细描述
  ctx.fillStyle = '#2c2a24';
  ctx.font = font(28);
  y = textY;
  for (const line of textLines) {
    ctx.fillText(line, W / 2, y);
    y += 46;
  }

  // 总分 + 评级
  ctx.fillStyle = colors.accent;
  drawFittedText(`成绩：${data.grade}`, W / 2 - 90, scoreY + 22, 320, 76, 700, 42);
  ctx.fillStyle = '#2c2a24';
  ctx.font = font(40, 600);
  ctx.fillText(`人生总分 ${data.score}`, W / 2 + 180, scoreY + 60);

  // 五项指标用固定两行排布,避免长金额或第五项撞到底部标题。
  const statItems = [
    { label: '学识', value: String(data.stats.knowledge), x: W * 0.2, y: scoreY + 170, maxWidth: 170 },
    { label: '金钱', value: `¥${data.stats.money.toLocaleString()}`, x: W * 0.5, y: scoreY + 170, maxWidth: 230 },
    { label: '心态', value: String(data.stats.mindset), x: W * 0.8, y: scoreY + 170, maxWidth: 170 },
    { label: '人脉', value: String(data.stats.network), x: W * 0.35, y: scoreY + 285, maxWidth: 190 },
    { label: '健康', value: String(data.stats.health), x: W * 0.65, y: scoreY + 285, maxWidth: 190 },
  ];
  statItems.forEach(({ label, value, x: cx, y: cy, maxWidth }) => {
    ctx.fillStyle = '#2c2a24';
    drawFittedText(value, cx, cy, maxWidth, 40, 600, 24);
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
