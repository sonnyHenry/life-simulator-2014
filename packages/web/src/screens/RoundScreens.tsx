import { useState } from 'react';
import type { ViewModel } from '@life-sim/core';
import { contentPack } from '@life-sim/content';
import { useGame } from '../store';
import { Card, ChoiceButton, ContinueButton, DeltaChips } from '../components/ui';
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
    <Card>
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
      <DeltaChips deltas={props.view.deltas} />
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} />
    </Card>
  );
}

export function SettlementScreen(props: { view: Extract<ViewModel, { kind: 'SETTLEMENT' }> }) {
  const act = useGame(s => s.act);
  const { stats } = props.view;
  return (
    <Card className="center">
      <p className="kicker">{props.view.year} 年 · 年末</p>
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
  const shareText = [
    `我在《2014:我的十二年》里达成结局: ${props.view.title}`,
    props.view.shareCard.tagline,
    `人生总分 ${props.view.score} (${props.view.grade} 级)`,
    `学识${stats.knowledge} 金钱¥${stats.money.toLocaleString()} 心态${stats.mindset} 人脉${stats.network}`,
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
        tone: props.view.shareCard.tone,
        years: props.view.shareCard.years,
        seed: props.view.shareCard.seed,
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
      <div className={`share-card tone-${props.view.shareCard.tone}`}>
        <div className="share-card-head">
          <span>{props.view.shareCard.years}</span>
          <span>#{props.view.shareCard.seed}</span>
        </div>
        <h2>{props.view.shareCard.title}</h2>
        <p>{props.view.shareCard.tagline}</p>
        <div className="share-score">
          <span className="share-grade">{props.view.grade}</span>
          <span>人生总分 {props.view.score}</span>
        </div>
        <div className="share-stats">
          <span>学识 {stats.knowledge}</span>
          <span>金钱 ¥{stats.money.toLocaleString()}</span>
          <span>心态 {stats.mindset}</span>
          <span>人脉 {stats.network}</span>
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
      </div>
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
