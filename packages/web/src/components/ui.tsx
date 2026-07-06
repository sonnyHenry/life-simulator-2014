import type { ReactNode } from 'react';
import type { StatDeltas } from '@life-sim/core';

export function Card(props: { children: ReactNode; className?: string }) {
  return <div className={`card ${props.className ?? ''}`}>{props.children}</div>;
}

export function ChoiceButton(props: {
  onClick: () => void;
  children: ReactNode;
  sub?: string;
}) {
  return (
    <button className="choice-btn" onClick={props.onClick}>
      <span>{props.children}</span>
      {props.sub && <span className="choice-sub">{props.sub}</span>}
    </button>
  );
}

export function ContinueButton(props: { onClick: () => void; label?: string }) {
  return (
    <button className="continue-btn" onClick={props.onClick}>
      {props.label ?? '继续'}
    </button>
  );
}

const STAT_LABELS = [
  ['knowledge', '学识'],
  ['money', '金钱'],
  ['mindset', '心态'],
  ['network', '人脉'],
  ['health', '健康'],
] as const;

function formatDelta(key: string, value: number): string {
  const sign = value >= 0 ? '+' : '';
  if (key === 'money') return `${sign}¥${value.toLocaleString()}`;
  return `${sign}${value}`;
}

/** 历年金钱趋势 sparkline(内联 SVG,不引库) */
export function MoneyTrend(props: { trend: { year: number; money: number }[] }) {
  const { trend } = props;
  if (trend.length < 2) return null;
  const w = 280;
  const h = 56;
  const pad = 4;
  const max = Math.max(...trend.map(p => p.money), 1);
  const min = Math.min(...trend.map(p => p.money), 0);
  const range = Math.max(1, max - min);
  const x = (i: number) => pad + (i / (trend.length - 1)) * (w - pad * 2);
  const y = (m: number) => h - pad - ((m - min) / range) * (h - pad * 2);
  const points = trend.map((p, i) => `${x(i).toFixed(1)},${y(p.money).toFixed(1)}`).join(' ');
  const last = trend[trend.length - 1]!;
  return (
    <div className="money-trend">
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <circle cx={x(trend.length - 1)} cy={y(last.money)} r="3" fill="currentColor" />
      </svg>
      <div className="money-trend-axis">
        <span>{trend[0]!.year}</span>
        <span>{last.year}</span>
      </div>
    </div>
  );
}

export function DeltaChips(props: { deltas: StatDeltas }) {
  const changed = STAT_LABELS.filter(([k]) => (props.deltas[k] ?? 0) !== 0);
  if (changed.length === 0) return null;
  return (
    <div className="delta-chips">
      {changed.map(([k, label]) => {
        const value = props.deltas[k] ?? 0;
        return (
          <span key={k} className={`chip ${value > 0 ? 'chip-up' : 'chip-down'}`}>
            {label} {formatDelta(k, value)}
          </span>
        );
      })}
    </div>
  );
}
