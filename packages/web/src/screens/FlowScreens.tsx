import { useState } from 'react';
import type { Gender, Track, ViewModel } from '@life-sim/core';

const GENDER_LABELS: Record<Gender, string> = { male: '男生', female: '女生' };
import { useGame } from '../store';
import { Card, ChoiceButton, ContinueButton } from '../components/ui';

export function TitleScreen(props: { view: Extract<ViewModel, { kind: 'TITLE' }> }) {
  const act = useGame(s => s.act);
  const hasSave = useGame(s => s.hasSave);
  const continueGame = useGame(s => s.continueGame);
  const newGame = useGame(s => s.newGame);
  return (
    <Card className="center">
      <p className="kicker">一款关于选择的人生模拟器</p>
      <h1 className="game-title">2014：我的十二年</h1>
      <p className="muted">
        从高考考场到而立之年,你将替一个普通人做出所有重要的决定。
      </p>
      {hasSave && (
        <ContinueButton onClick={continueGame} label="继续上次人生" />
      )}
      <button
        className={`continue-btn ${hasSave ? 'secondary-btn' : ''}`}
        onClick={() => {
          if (hasSave) newGame();
          act({ type: 'START' });
        }}
      >
        开始新的人生
      </button>
    </Card>
  );
}

const STAT_LABELS: Record<string, string> = {
  knowledge: '学识',
  money: '金钱',
  mindset: '心态',
  network: '人脉',
  health: '健康',
};

export function formatStatMods(mods: Record<string, number> | undefined): string {
  return Object.entries(mods ?? {})
    .map(([key, v]) => `${STAT_LABELS[key] ?? key} ${v > 0 ? '+' : '−'}${Math.abs(v)}`)
    .join(' · ');
}

export function BackgroundDrawScreen(props: {
  view: Extract<ViewModel, { kind: 'BACKGROUND_DRAW' }>;
}) {
  const act = useGame(s => s.act);
  const { card, traitOffer, pickCount } = props.view;
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : prev.length < pickCount
          ? [...prev, id]
          : prev,
    );
  };
  return (
    <Card className="center">
      <p className="kicker">你的出身是——</p>
      <div className="bg-card">
        <h2>{card.label}</h2>
        <p>{card.text}</p>
        <p className="bg-money">初始资金 ¥{card.initialMoney.toLocaleString()}</p>
      </div>
      {traitOffer.length > 0 && (
        <div className="trait-list">
          <p className="kicker">
            命运给了你 {traitOffer.length} 张特质卡,选 {pickCount} 张带进这一生——
          </p>
          {traitOffer.map(t => (
            <button
              type="button"
              className={`trait-card selectable ${selected.includes(t.id) ? 'selected' : ''}`}
              key={t.id}
              onClick={() => toggle(t.id)}
            >
              <h3>{t.label}</h3>
              <p>{t.text}</p>
              {t.statMods && <p className="trait-mods">{formatStatMods(t.statMods)}</p>}
            </button>
          ))}
        </div>
      )}
      <button
        className="continue-btn"
        disabled={selected.length !== pickCount}
        onClick={() => act({ type: 'CHOOSE_TRAITS', traitIds: selected })}
      >
        {selected.length === pickCount
          ? '接受命运'
          : `再选 ${pickCount - selected.length} 张特质卡`}
      </button>
    </Card>
  );
}

export function SetupScreen(props: { view: Extract<ViewModel, { kind: 'SETUP' }> }) {
  const act = useGame(s => s.act);
  const [gender, setGender] = useState<Gender | null>(null);
  const [track, setTrack] = useState<Track | null>(null);
  return (
    <Card>
      <h2>2014 年 6 月,高考报名表</h2>
      <p className="section-label">你是男生还是女生?</p>
      <div className="pill-group">
        {props.view.genders.map(g => (
          <button
            key={g}
            className={`pill ${gender === g ? 'selected' : ''}`}
            onClick={() => setGender(g)}
          >
            {GENDER_LABELS[g]}
          </button>
        ))}
      </div>
      <p className="section-label">文科还是理科?</p>
      <div className="pill-group">
        {props.view.tracks.map(t => (
          <button
            key={t}
            className={`pill ${track === t ? 'selected' : ''}`}
            onClick={() => setTrack(t)}
          >
            {t}科
          </button>
        ))}
      </div>
      <button
        className="continue-btn confirm-btn"
        disabled={!gender || !track}
        onClick={() => {
          if (gender && track) {
            act({ type: 'CHOOSE_SETUP', gender, track });
          }
        }}
      >
        走进考场
      </button>
    </Card>
  );
}

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function ExamScreen(props: { view: Extract<ViewModel, { kind: 'EXAM' }> }) {
  const act = useGame(s => s.act);
  const { question, index, total } = props.view;
  return (
    <Card>
      <div className="exam-head">
        <span className="badge">{question.subject}</span>
        <span className="muted">
          第 {index + 1} / {total} 题
        </span>
      </div>
      <p className="event-text">{question.text}</p>
      <div className="choices">
        {question.options.map((opt, i) => (
          <ChoiceButton key={i} onClick={() => act({ type: 'ANSWER', optionIndex: i })}>
            {OPTION_LETTERS[i] ?? i + 1}. {opt}
          </ChoiceButton>
        ))}
      </div>
      <button
        className="continue-btn secondary-btn"
        onClick={() => act({ type: 'SKIP_EXAM' })}
      >
        跳过答题(按默认成绩计分)
      </button>
    </Card>
  );
}

export function ExamResultScreen(props: { view: Extract<ViewModel, { kind: 'EXAM_RESULT' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card className="center">
      <p className="kicker">放榜了</p>
      <p className="score">{props.view.score}</p>
      <p className="muted">
        全卷答对 {props.view.correct} / {props.view.total}。分数已经出来了,接下来是那张可能改变一生的志愿表。
      </p>
      <ContinueButton onClick={() => act({ type: 'CONTINUE' })} label="填报志愿" />
    </Card>
  );
}

export function ApplicationScreen(props: { view: Extract<ViewModel, { kind: 'APPLICATION' }> }) {
  const act = useGame(s => s.act);
  const [batchId, setBatchId] = useState<string | null>(null);
  const batch = props.view.options.find(o => o.id === batchId) ?? null;
  return (
    <Card>
      <h2>志愿填报</h2>
      <p className="muted">
        你的分数：{props.view.score}。先选批次，再选专业。报高于分数的批次可以冲，但冲不上就会滑档。
      </p>
      {!batch ? (
        <div className="choices">
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
        </div>
      ) : (
        <>
          <p className="section-label">
            {batch.label} · 录取把握：{batch.chanceLabel}。选一个专业：
          </p>
          <div className="choices">
            {batch.majors.map(m => (
              <ChoiceButton
                key={m.id}
                onClick={() => act({ type: 'APPLY', optionId: batch.id, majorId: m.id })}
              >
                {m.name}
              </ChoiceButton>
            ))}
          </div>
          <button className="continue-btn secondary-btn" onClick={() => setBatchId(null)}>
            ← 重新选批次
          </button>
        </>
      )}
    </Card>
  );
}

export function NpcSelectionScreen(props: {
  view: Extract<ViewModel, { kind: 'NPC_SELECTION' }>;
}) {
  const act = useGame(s => s.act);
  const [selected, setSelected] = useState<string[]>([]);
  const { requiredNpcs, npcs, pickCount } = props.view;
  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(value => value !== id)
        : prev.length < pickCount
          ? [...prev, id]
          : prev,
    );
  };
  return (
    <Card>
      <p className="kicker">大学生活即将开始</p>
      <h2>谁会成为重要的人？</h2>
      <p className="muted">恋爱线必然出现。再从另外四个人里选择 {pickCount} 位重点关系。</p>
      <div className="trait-list npc-selection-list">
        {requiredNpcs.map(npc => (
          <div className="trait-card selected" key={npc.id}>
            <h3>必然同行 · {npc.name}</h3>
            <p>{npc.description}</p>
          </div>
        ))}
        {npcs.map(npc => (
          <button
            type="button"
            className={`trait-card selectable ${selected.includes(npc.id) ? 'selected' : ''}`}
            key={npc.id}
            onClick={() => toggle(npc.id)}
          >
            <h3>{selected.includes(npc.id) ? '✓ ' : ''}{npc.name}</h3>
            <p>{npc.description}</p>
          </button>
        ))}
      </div>
      <button
        className="continue-btn"
        disabled={selected.length !== pickCount}
        onClick={() => act({ type: 'CHOOSE_NPCS', npcIds: selected })}
      >
        {selected.length === pickCount ? '和他们一起走进大学' : `再选 ${pickCount - selected.length} 人`}
      </button>
    </Card>
  );
}

export function LifeGoalScreen(props: { view: Extract<ViewModel, { kind: 'LIFE_GOAL' }> }) {
  const act = useGame(s => s.act);
  return (
    <Card>
      <p className="kicker">2018 年 · 毕业之前</p>
      <h2>你想把什么放在人生前面？</h2>
      <p className="muted">目标不会锁死选项，但会改变事件倾向和最终评分方式。</p>
      <div className="choices">
        {props.view.goals.map(goal => (
          <ChoiceButton
            key={goal.id}
            sub={goal.text}
            onClick={() => act({ type: 'CHOOSE_LIFE_GOAL', goalId: goal.id })}
          >
            {goal.label}
          </ChoiceButton>
        ))}
      </div>
    </Card>
  );
}

export function CrossroadScreen(props: { view: Extract<ViewModel, { kind: 'CROSSROAD' }> }) {
  const act = useGame(s => s.act);
  const { view } = props;
  return (
    <Card>
      <p className="kicker">{view.year} 年 · 毕业季</p>
      <h2>大四三岔口</h2>
      <p className="muted">
        {view.university} · {view.major}。宿舍开始收拾纸箱,每个人都在给自己找一个下一站。
      </p>
      <div className="choices crossroad-options">
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
      </div>
    </Card>
  );
}
