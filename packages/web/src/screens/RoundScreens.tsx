import { useState } from 'react';
import type { ViewModel } from '@life-sim/core';
import { contentPack } from '@life-sim/content';
import { useGame } from '../store';
import { Card, ChoiceButton, ContinueButton, DeltaChips, MoneyTrend } from '../components/ui';
import { downloadShareImage } from '../platform/shareImage';

export function BriefScreen(props: { view: Extract<ViewModel, { kind: 'BRIEF' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card>
      <p className="kicker">{props.view.phaseLabel}</p>
      <h2 className="brief-year">{props.view.year}</h2>
      <p className="event-text">{props.view.text}</p>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="这一年开始了" />
    </Card>
  );
}

export function EventScreen(props: { view: Extract<ViewModel, { kind: 'EVENT' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card className={props.view.major ? 'major-event' : undefined}>
      {props.view.major && <p className="kicker major-kicker">✦ 人生节点</p>}
      <h2>{props.view.title}</h2>
      <p className="event-text">{props.view.text}</p>
      <div className="choices">
        {props.view.choices.map(c => (
          <ChoiceButton key={c.id} onClick={() => act({ type: 'CHOOSE', choiceId: c.id })}>
            {c.text}
          </ChoiceButton>
        ))}
      </div>
    </Card>
  );
}

export function OutcomeScreen(props: { view: Extract<ViewModel, { kind: 'OUTCOME' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card>
      <p className="event-text">{props.view.text}</p>
      {props.view.relationshipHint && <p className="relationship-hint">✦ {props.view.relationshipHint}</p>}
      <DeltaChips deltas={props.view.deltas} />
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} />
    </Card>
  );
}

export function SettlementScreen(props: { view: Extract<ViewModel, { kind: 'SETTLEMENT' }> }) {
  const act = useGame(s => s.act);
  const { stats, incomes, milestone, moneyTrend } = props.view;
  return (
    <Card className="center">
      <p className="kicker">{props.view.year} 年 · 年末</p>
      {incomes.length > 0 && (
        <div className="income-list">
          {incomes.map(item => (
            <div key={item.label} className="income-row">
              <span>{item.label}</span>
              <span className={item.amount > 0 ? 'income-up' : 'income-down'}>
                {item.amount > 0 ? '+' : '-'}¥{Math.abs(item.amount).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
      {milestone && <p className="milestone-line">✦ {milestone}</p>}
      <MoneyTrend trend={moneyTrend} />
      <div className="settle-grid">
        <div>
          <span className="settle-num">{stats.knowledge}</span>
          <span className="muted">学识</span>
        </div>
        <div>
          <span className="settle-num">¥{stats.money.toLocaleString()}</span>
          <span className="muted">金钱</span>
        </div>
        <div>
          <span className="settle-num">{stats.mindset}</span>
          <span className="muted">心态</span>
        </div>
        <div>
          <span className="settle-num">{stats.network}</span>
          <span className="muted">人脉</span>
        </div>
        <div>
          <span className="settle-num">{stats.health}</span>
          <span className="muted">健康</span>
        </div>
      </div>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="翻过这一年" />
    </Card>
  );
}

export function EndingScreen(props: { view: Extract<ViewModel, { kind: 'ENDING' }> }) {
  const newGame = useGame(s => s.newGame);
  const seed = useGame(s => s.game.seed);
  const { stats } = props.view;
  const [copied, setCopied] = useState(false);
  const traitLine =
    props.view.shareCard.traits.length > 0
      ? `特质:${props.view.shareCard.traits.join(' × ')}`
      : null;
  const goalLine = props.view.shareCard.goal ? `人生目标:${props.view.shareCard.goal}` : null;
  const evolutionLine = props.view.shareCard.traitEvolutions.length > 0
    ? `性格成长:${props.view.shareCard.traitEvolutions.join(' × ')}`
    : null;
  const relationshipLine = props.view.shareCard.relationships.length > 0
    ? `同行的人:${props.view.shareCard.relationships.join(' × ')}`
    : null;
  const shareText = [
    `我在《2014：我的十二年》里达成结局：${props.view.title}`,
    props.view.shareCard.tagline,
    ...(goalLine ? [goalLine] : []),
    ...(evolutionLine ? [evolutionLine] : []),
    ...(traitLine ? [traitLine] : []),
    ...(relationshipLine ? [relationshipLine] : []),
    `人生总分 ${props.view.score}（成绩：${props.view.grade} 级）`,
    `学识${stats.knowledge} 金钱¥${stats.money.toLocaleString()} 心态${stats.mindset} 人脉${stats.network} 健康${stats.health}`,
    `人生编号 #${seed}`,
  ].join('\n');
  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };
  const [saving, setSaving] = useState(false);
  const saveImage = async () => {
    setSaving(true);
    try {
      await downloadShareImage({
        title: props.view.shareCard.title,
        tagline: props.view.shareCard.tagline,
        text: props.view.text,
        tone: props.view.shareCard.tone,
        years: props.view.shareCard.years,
        seed: props.view.shareCard.seed,
        traits: props.view.shareCard.traits,
        goal: props.view.shareCard.goal,
        traitEvolutions: props.view.shareCard.traitEvolutions,
        relationships: props.view.shareCard.relationships,
        stats,
        score: props.view.score,
        grade: props.view.grade,
        gameTitle: contentPack.meta.title,
      });
    } finally {
      setSaving(false);
    }
  };
  return (
    <Card className="center">
      <p className="kicker">你的结局</p>
      <h1 className="ending-title">{props.view.title}</h1>
      <p className="event-text ending-text">{props.view.text}</p>
      {props.view.relationships.length > 0 && (
        <section className="relationship-summary">
          <p className="kicker">同行的人</p>
          {props.view.relationships.map(relationship => (
            <article className="relationship-card" key={relationship.npcId}>
              <span>{relationship.name}</span>
              <h3>{relationship.title}</h3>
              <p>{relationship.text}</p>
              <div className="relationship-ledger">
                靠近 {relationship.warmCount} 次 · 退后 {relationship.coolCount} 次
                {relationship.moments.length > 0 && ` · ${relationship.moments.join(' / ')}`}
              </div>
            </article>
          ))}
        </section>
      )}
      <div className={`share-card tone-${props.view.shareCard.tone}`}>
        <div className="share-card-head">
          <span>{props.view.shareCard.years}</span>
          <span>#{props.view.shareCard.seed}</span>
        </div>
        <h2>{props.view.shareCard.title}</h2>
        <p>{props.view.shareCard.tagline}</p>
        {goalLine && <p className="share-traits">{goalLine}</p>}
        {evolutionLine && <p className="share-traits">{evolutionLine}</p>}
        {traitLine && <p className="share-traits">{traitLine}</p>}
        {props.view.shareCard.relationships.length > 0 && (
          <div className="share-relationship-badges">
            {props.view.shareCard.relationships.map(relationship => <span key={relationship}>{relationship}</span>)}
          </div>
        )}
        <div className="share-score">
          <span className="share-grade">成绩：{props.view.grade}</span>
          <span>人生总分 {props.view.score}</span>
        </div>
        <div className="share-stats">
          <span>学识 {stats.knowledge}</span>
          <span>金钱 ¥{stats.money.toLocaleString()}</span>
          <span>心态 {stats.mindset}</span>
          <span>人脉 {stats.network}</span>
          <span>健康 {stats.health}</span>
        </div>
      </div>
      <div className="settle-grid">
        <div>
          <span className="settle-num">{stats.knowledge}</span>
          <span className="muted">学识</span>
        </div>
        <div>
          <span className="settle-num">¥{stats.money.toLocaleString()}</span>
          <span className="muted">金钱</span>
        </div>
        <div>
          <span className="settle-num">{stats.mindset}</span>
          <span className="muted">心态</span>
        </div>
        <div>
          <span className="settle-num">{stats.network}</span>
          <span className="muted">人脉</span>
        </div>
        <div>
          <span className="settle-num">{stats.health}</span>
          <span className="muted">健康</span>
        </div>
      </div>
      <MoneyTrend trend={props.view.moneyTrend} />
      <p className="muted seed-line">人生编号 #{seed}</p>
      <button className="continue-btn secondary-btn" onClick={saveImage} disabled={saving}>
        {saving ? '生成中…' : '保存分享图'}
      </button>
      <button className="continue-btn secondary-btn" onClick={copyShare}>
        {copied ? '已复制' : '复制分享文案'}
      </button>
      <ContinueButton onClick={() => newGame()} label="再活一次" />
    </Card>
  );
}
