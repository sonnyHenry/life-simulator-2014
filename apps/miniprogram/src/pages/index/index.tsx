import { useState, type ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import { useShareAppMessage } from '@tarojs/taro';
import type { StatDeltas, Track, ViewModel } from '@life-sim/core';
import { useGame } from '../../store';
import './index.scss';

function fmtMoney(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ---------- 基础组件 ----------

function Card(props: { children: ReactNode; className?: string }) {
  return <View className={`card ${props.className ?? ''}`}>{props.children}</View>;
}

function ChoiceButton(props: { onClick: () => void; children: ReactNode; sub?: string }) {
  return (
    <View className="choice-btn" hoverClass="btn-hover" onClick={props.onClick}>
      <Text>{props.children}</Text>
      {props.sub && <Text className="choice-sub">{props.sub}</Text>}
    </View>
  );
}

function ContinueButton(props: { onClick: () => void; label?: string; secondary?: boolean }) {
  return (
    <View
      className={`continue-btn ${props.secondary ? 'secondary-btn' : ''}`}
      hoverClass="btn-hover"
      onClick={props.onClick}
    >
      <Text>{props.label ?? '继续'}</Text>
    </View>
  );
}

const STAT_LABELS = [
  ['knowledge', '学识'],
  ['money', '金钱'],
  ['mindset', '心态'],
  ['network', '人脉'],
  ['health', '健康'],
] as const;

function fmtDelta(key: string, value: number): string {
  const sign = value >= 0 ? '+' : '';
  if (key === 'money') return `${sign}¥${fmtMoney(value)}`;
  return `${sign}${value}`;
}

function DeltaChips(props: { deltas: StatDeltas }) {
  const changed = STAT_LABELS.filter(([k]) => (props.deltas[k] ?? 0) !== 0);
  if (changed.length === 0) return null;
  return (
    <View className="delta-chips">
      {changed.map(([k, label]) => {
        const value = props.deltas[k] ?? 0;
        return (
          <Text key={k} className={`chip ${value > 0 ? 'chip-up' : 'chip-down'}`}>
            {label} {fmtDelta(k, value)}
          </Text>
        );
      })}
    </View>
  );
}

function StatsBar() {
  const game = useGame(s => s.game);
  const view = useGame(s => s.view);
  if (view.kind === 'TITLE') return null;
  const { knowledge, money, mindset, network, health } = game.stats;
  return (
    <View className="stats-bar">
      <Text className="stats-year">{game.date.year} 年</Text>
      <Text className="stat">学识 {knowledge}</Text>
      <Text className="stat">¥{fmtMoney(money)}</Text>
      <Text className="stat">心态 {mindset}</Text>
      <Text className="stat">人脉 {network}</Text>
      <Text className="stat">健康 {health}</Text>
    </View>
  );
}

// ---------- 流程界面 ----------

function TitleScreen() {
  const act = useGame(s => s.act);
  const hasSave = useGame(s => s.hasSave);
  const continueGame = useGame(s => s.continueGame);
  const newGame = useGame(s => s.newGame);
  return (
    <Card className="center">
      <Text className="kicker">一款关于选择的人生模拟器</Text>
      <Text className="game-title">2014：我的十二年</Text>
      <Text className="muted block">
        从高考考场到而立之年,你将替一个普通人做出所有重要的决定。
      </Text>
      {hasSave && <ContinueButton onClick={continueGame} label="继续上次人生" />}
      <ContinueButton
        secondary={hasSave}
        onClick={() => {
          if (hasSave) newGame();
          act({ type: 'START' });
        }}
        label="开始新的人生"
      />
    </Card>
  );
}

function BackgroundDrawScreen(props: { view: Extract<ViewModel, { kind: 'BACKGROUND_DRAW' }> }) {
  const act = useGame(s => s.act);
  const { card } = props.view;
  return (
    <Card className="center">
      <Text className="kicker">你的出身是——</Text>
      <View className="bg-card">
        <Text className="bg-title">{card.label}</Text>
        <Text className="block">{card.text}</Text>
        <Text className="bg-money">初始资金 ¥{fmtMoney(card.initialMoney)}</Text>
      </View>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="接受命运" />
    </Card>
  );
}

function SetupScreen(props: { view: Extract<ViewModel, { kind: 'SETUP' }> }) {
  const act = useGame(s => s.act);
  const [provinceId, setProvinceId] = useState<string | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  return (
    <Card>
      <Text className="h2">2014 年 6 月,高考报名表</Text>
      <Text className="section-label">你在哪里参加高考?</Text>
      <View className="pill-group">
        {props.view.provinces.map(p => (
          <Text
            key={p.id}
            className={`pill ${provinceId === p.id ? 'selected' : ''}`}
            onClick={() => setProvinceId(p.id)}
          >
            {p.label}
          </Text>
        ))}
      </View>
      <Text className="section-label">文科还是理科?</Text>
      <View className="pill-group">
        {props.view.tracks.map(t => (
          <Text
            key={t}
            className={`pill ${track === t ? 'selected' : ''}`}
            onClick={() => setTrack(t)}
          >
            {t}科
          </Text>
        ))}
      </View>
      <View
        className={`continue-btn ${!provinceId || !track ? 'disabled-btn' : ''}`}
        onClick={() => {
          if (provinceId && track) act({ type: 'CHOOSE_SETUP', provinceId, track });
        }}
      >
        <Text>走进考场</Text>
      </View>
    </Card>
  );
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function ExamScreen(props: { view: Extract<ViewModel, { kind: 'EXAM' }> }) {
  const act = useGame(s => s.act);
  const { question, index, total } = props.view;
  return (
    <Card>
      <View className="exam-head">
        <Text className="badge">{question.subject}</Text>
        <Text className="muted">
          第 {index + 1} / {total} 题
        </Text>
      </View>
      <Text className="event-text block">{question.text}</Text>
      <View className="choices">
        {question.options.map((opt, i) => (
          <ChoiceButton key={i} onClick={() => act({ type: 'ANSWER', optionIndex: i })}>
            {OPTION_LETTERS[i] ?? i + 1}. {opt}
          </ChoiceButton>
        ))}
      </View>
      <ContinueButton
        secondary
        onClick={() => act({ type: 'SKIP_EXAM' })}
        label="跳过答题(按默认成绩计分)"
      />
    </Card>
  );
}

function ExamResultScreen(props: { view: Extract<ViewModel, { kind: 'EXAM_RESULT' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card className="center">
      <Text className="kicker">放榜了</Text>
      <Text className="score">{props.view.score}</Text>
      <Text className="muted block">
        全卷答对 {props.view.correct} / {props.view.total}
        。分数已经出来了,接下来是那张可能改变一生的志愿表。
      </Text>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="填报志愿" />
    </Card>
  );
}

function ApplicationScreen(props: { view: Extract<ViewModel, { kind: 'APPLICATION' }> }) {
  const act = useGame(s => s.act);
  const [batchId, setBatchId] = useState<string | null>(null);
  const batch = props.view.options.find(o => o.id === batchId) ?? null;
  return (
    <Card>
      <Text className="h2">志愿填报</Text>
      <Text className="muted block">
        你的分数：{props.view.score}。先选批次，再选专业。报高于分数的批次可以冲，但冲不上就会滑档。
      </Text>
      {!batch ? (
        <View className="choices">
          {props.view.options.map(opt => (
            <ChoiceButton
              key={opt.id}
              onClick={() => setBatchId(opt.id)}
              sub={`${opt.university} · 录取把握：${opt.chanceLabel}${opt.risky ? ' · 有滑档风险' : ''}`}
            >
              {opt.label}
              {opt.risky ? ' ⚡' : ''}
            </ChoiceButton>
          ))}
        </View>
      ) : (
        <View>
          <Text className="muted block">
            {batch.label} · 录取把握:{batch.chanceLabel}。选一个专业:
          </Text>
          <View className="choices">
            {batch.majors.map(m => (
              <ChoiceButton
                key={m.id}
                onClick={() => act({ type: 'APPLY', optionId: batch.id, majorId: m.id })}
              >
                {m.name}
              </ChoiceButton>
            ))}
          </View>
          <ContinueButton secondary onClick={() => setBatchId(null)} label="← 重新选批次" />
        </View>
      )}
    </Card>
  );
}

function CrossroadScreen(props: { view: Extract<ViewModel, { kind: 'CROSSROAD' }> }) {
  const act = useGame(s => s.act);
  const { view } = props;
  return (
    <Card>
      <Text className="kicker">{view.year} 年 · 毕业季</Text>
      <Text className="h2">大四三岔口</Text>
      <Text className="muted block">
        {view.university} · {view.major}。宿舍开始收拾纸箱,每个人都在给自己找一个下一站。
      </Text>
      <View className="choices">
        {view.options.map(opt => (
          <ChoiceButton
            key={opt.id}
            onClick={() => act({ type: 'CHOOSE_CROSSROAD', optionId: opt.id })}
            sub={opt.text}
          >
            {opt.label}
            {opt.recommendedFor?.includes(view.major) ? ' · 顺势' : ''}
          </ChoiceButton>
        ))}
      </View>
    </Card>
  );
}

// ---------- 回合界面 ----------

function BriefScreen(props: { view: Extract<ViewModel, { kind: 'BRIEF' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card>
      <Text className="kicker">{props.view.phaseLabel}</Text>
      <Text className="brief-year">{props.view.year}</Text>
      <Text className="event-text block">{props.view.text}</Text>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="这一年开始了" />
    </Card>
  );
}

function EventScreen(props: { view: Extract<ViewModel, { kind: 'EVENT' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card className={props.view.major ? 'major-event' : undefined}>
      {props.view.major && <Text className="kicker major-kicker">✦ 人生节点</Text>}
      <Text className="h2">{props.view.title}</Text>
      <Text className="event-text block">{props.view.text}</Text>
      <View className="choices">
        {props.view.choices.map(c => (
          <ChoiceButton key={c.id} onClick={() => act({ type: 'CHOOSE', choiceId: c.id })}>
            {c.text}
          </ChoiceButton>
        ))}
      </View>
    </Card>
  );
}

function OutcomeScreen(props: { view: Extract<ViewModel, { kind: 'OUTCOME' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card>
      <Text className="event-text block">{props.view.text}</Text>
      <DeltaChips deltas={props.view.deltas} />
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} />
    </Card>
  );
}

function SettlementScreen(props: { view: Extract<ViewModel, { kind: 'SETTLEMENT' }> }) {
  const act = useGame(s => s.act);
  const { stats } = props.view;
  return (
    <Card className="center">
      <Text className="kicker">{props.view.year} 年 · 年末</Text>
      <View className="settle-grid">
        <View className="settle-cell">
          <Text className="settle-num">{stats.knowledge}</Text>
          <Text className="muted">学识</Text>
        </View>
        <View className="settle-cell">
          <Text className="settle-num">¥{fmtMoney(stats.money)}</Text>
          <Text className="muted">金钱</Text>
        </View>
        <View className="settle-cell">
          <Text className="settle-num">{stats.mindset}</Text>
          <Text className="muted">心态</Text>
        </View>
        <View className="settle-cell">
          <Text className="settle-num">{stats.network}</Text>
          <Text className="muted">人脉</Text>
        </View>
        <View className="settle-cell">
          <Text className="settle-num">{stats.health}</Text>
          <Text className="muted">健康</Text>
        </View>
      </View>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="翻过这一年" />
    </Card>
  );
}

function EndingScreen(props: { view: Extract<ViewModel, { kind: 'ENDING' }> }) {
  const newGame = useGame(s => s.newGame);
  const seed = useGame(s => s.game.seed);
  const { stats } = props.view;
  return (
    <Card className="center">
      <Text className="kicker">你的结局</Text>
      <Text className="ending-title">{props.view.title}</Text>
      <Text className="event-text block ending-text">{props.view.text}</Text>
      <View className={`share-card tone-${props.view.shareCard.tone}`}>
        <View className="share-card-head">
          <Text>{props.view.shareCard.years}</Text>
          <Text>#{props.view.shareCard.seed}</Text>
        </View>
        <Text className="share-title">{props.view.shareCard.title}</Text>
        <Text className="share-tagline block">{props.view.shareCard.tagline}</Text>
        <View className="share-score">
          <Text className="share-grade">成绩：{props.view.grade}</Text>
          <Text>人生总分 {props.view.score}</Text>
        </View>
        <View className="share-stats">
          <Text>学识 {stats.knowledge}</Text>
          <Text>金钱 ¥{fmtMoney(stats.money)}</Text>
          <Text>心态 {stats.mindset}</Text>
          <Text>人脉 {stats.network}</Text>
          <Text>健康 {stats.health}</Text>
        </View>
      </View>
      <Text className="muted block seed-line">
        人生编号 #{seed} · 点右上角「···」可以把这段人生转发给朋友
      </Text>
      <ContinueButton onClick={() => newGame()} label="再活一次" />
    </Card>
  );
}

// ---------- 页面 ----------

function Screen() {
  const view = useGame(s => s.view);
  switch (view.kind) {
    case 'TITLE':
      return <TitleScreen />;
    case 'BACKGROUND_DRAW':
      return <BackgroundDrawScreen view={view} />;
    case 'SETUP':
      return <SetupScreen view={view} />;
    case 'EXAM':
      return <ExamScreen view={view} />;
    case 'EXAM_RESULT':
      return <ExamResultScreen view={view} />;
    case 'APPLICATION':
      return <ApplicationScreen view={view} />;
    case 'CROSSROAD':
      return <CrossroadScreen view={view} />;
    case 'BRIEF':
      return <BriefScreen view={view} />;
    case 'EVENT':
      return <EventScreen view={view} />;
    case 'OUTCOME':
      return <OutcomeScreen view={view} />;
    case 'SETTLEMENT':
      return <SettlementScreen view={view} />;
    case 'ENDING':
      return <EndingScreen view={view} />;
  }
}

export default function Index() {
  const view = useGame(s => s.view);
  useShareAppMessage(() => ({
    title:
      view.kind === 'ENDING'
        ? `我在《2014：我的十二年》达成了「${view.title}」，总分 ${view.score}`
        : '《2014：我的十二年》——替一个普通人过完这十二年',
    path: '/pages/index/index',
  }));
  return (
    <View className="app">
      <StatsBar />
      <View className="screen-wrap">
        <Screen />
      </View>
    </View>
  );
}
