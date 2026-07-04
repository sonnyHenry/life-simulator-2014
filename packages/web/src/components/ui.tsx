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
] as const;

function formatDelta(key: string, value: number): string {
  const sign = value >= 0 ? '+' : '';
  if (key === 'money') return `${sign}¥${value.toLocaleString()}`;
  return `${sign}${value}`;
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
