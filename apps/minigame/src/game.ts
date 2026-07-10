import {
  createEngine,
  randomSeed,
  type GameState,
  type Gender,
  type PlayerAction,
  type StatDeltas,
  type StatKey,
  type Stats,
  type Track,
  type ViewModel,
} from '@life-sim/core';
import { contentPack } from '@life-sim/content';

const GENDER_LABELS: Record<Gender, string> = { male: '男生', female: '女生' };
import {
  bindTouchHandlers,
  clearSave,
  copyText,
  createGameCanvas,
  enableShare,
  getGameSystemInfo,
  loadRestoredGame,
  saveGame,
  shareNow,
  showToast,
  type RestoredGame,
} from './platform';

type ButtonVariant = 'primary' | 'secondary' | 'plain';

interface HitButton {
  x: number;
  y: number;
  width: number;
  height: number;
  disabled?: boolean;
  onTap: () => void;
}

interface Panel {
  x: number;
  y: number;
  width: number;
  contentX: number;
  contentWidth: number;
}

const STAT_ITEMS: { key: StatKey; label: string }[] = [
  { key: 'knowledge', label: '学识' },
  { key: 'money', label: '金钱' },
  { key: 'mindset', label: '心态' },
  { key: 'network', label: '人脉' },
  { key: 'health', label: '健康' },
];

const STAT_MOD_LABELS: Record<string, string> = {
  knowledge: '学识',
  money: '金钱',
  mindset: '心态',
  network: '人脉',
  health: '健康',
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function formatMoney(value: number): string {
  return Math.round(value).toLocaleString('zh-CN');
}

function formatStat(key: StatKey, value: number): string {
  return key === 'money' ? `¥${formatMoney(value)}` : String(value);
}

function formatDelta(key: StatKey, value: number): string {
  const sign = value >= 0 ? '+' : '';
  return key === 'money' ? `${sign}¥${formatMoney(value)}` : `${sign}${value}`;
}

class LifeSimMiniGame {
  private readonly engine = createEngine(contentPack);
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private game!: GameState;
  private view!: ViewModel;
  private restored: RestoredGame | null = null;
  private actionLog: PlayerAction[] = [];
  /** BACKGROUND_DRAW 屏的特质选择(本地 UI 状态,提交后清空) */
  private traitSelection: string[] = [];
  /** NPC_SELECTION 屏的重点关系选择 */
  private npcSelection: string[] = [];
  private signature = '';
  private buttons: HitButton[] = [];
  private width = 375;
  private height = 667;
  private dpr = 1;
  private scrollY = 0;
  private maxScroll = 0;
  private setupGender: Gender | null = null;
  private setupTrack: Track | null = null;
  private selectedApplicationId: string | null = null;
  private touchStart: { x: number; y: number; scrollY: number } | null = null;

  constructor() {
    this.canvas = createGameCanvas();
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context is unavailable.');
    this.ctx = ctx;

    this.resize();
    this.restored = loadRestoredGame(this.engine, contentPack.meta.version);
    this.setGame(this.engine.start(), { resetScroll: true });
    this.bindInput();
    enableShare(() => this.sharePayload());
    this.render();
  }

  private bindInput(): void {
    bindTouchHandlers({
      onStart: (x, y) => {
        this.touchStart = { x, y, scrollY: this.scrollY };
      },
      onMove: (x, y) => {
        if (!this.touchStart) return;
        const deltaY = y - this.touchStart.y;
        this.scrollY = clamp(this.touchStart.scrollY - deltaY, 0, this.maxScroll);
        this.render();
      },
      onEnd: (x, y) => {
        const start = this.touchStart;
        this.touchStart = null;
        if (!start) return;
        const moved = Math.abs(x - start.x) + Math.abs(y - start.y);
        if (moved > 10) return;
        this.handleTap(x, y + this.scrollY);
      },
    });
  }

  private resize(): void {
    const info = getGameSystemInfo();
    this.width = Math.max(320, info.windowWidth);
    this.height = Math.max(520, info.windowHeight);
    this.dpr = Math.max(1, info.pixelRatio ?? 1);
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    if ('style' in this.canvas) {
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
    }
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  private setGame(next: GameState, options?: { resetScroll?: boolean }): void {
    const nextView = this.engine.view(next);
    const nextSignature = this.makeSignature(next, nextView);
    const screenChanged = nextSignature !== this.signature;
    this.game = next;
    this.view = nextView;
    this.signature = nextSignature;
    if (screenChanged || options?.resetScroll) {
      this.scrollY = 0;
      if (nextView.kind !== 'SETUP') {
        this.setupGender = null;
        this.setupTrack = null;
      }
      if (nextView.kind !== 'APPLICATION') {
        this.selectedApplicationId = null;
      }
    }
  }

  private makeSignature(game: GameState, view: ViewModel): string {
    return [
      view.kind,
      game.phaseIndex,
      game.flowStepIndex,
      game.roundIndex,
      game.eventCursor,
      game.examCursor,
      game.history.length,
      game.endingId ?? '',
    ].join(':');
  }

  private act(action: PlayerAction): void {
    try {
      if (this.game.screen === 'TITLE') this.actionLog = [];
      const next = this.engine.dispatch(this.game, action);
      this.actionLog.push(action);
      saveGame(contentPack.meta.version, next, this.actionLog);
      this.setGame(next);
      this.render();
    } catch (error) {
      showToast(error instanceof Error ? error.message : '操作失败');
    }
  }

  private startFresh(): void {
    this.actionLog = [];
    this.traitSelection = [];
    this.restored = null;
    clearSave();
    this.setGame(this.engine.start(randomSeed()), { resetScroll: true });
    this.act({ type: 'START' });
  }

  private continueSaved(): void {
    const restored = this.restored ?? loadRestoredGame(this.engine, contentPack.meta.version);
    if (!restored) {
      showToast('没有可继续的存档');
      return;
    }
    this.restored = restored;
    this.actionLog = [...restored.actionLog];
    this.setGame(restored.state, { resetScroll: true });
    this.render();
  }

  private handleTap(x: number, y: number): void {
    for (let i = this.buttons.length - 1; i >= 0; i -= 1) {
      const button = this.buttons[i];
      if (
        button &&
        !button.disabled &&
        x >= button.x &&
        x <= button.x + button.width &&
        y >= button.y &&
        y <= button.y + button.height
      ) {
        button.onTap();
        return;
      }
    }
  }

  private render(): void {
    this.resize();
    this.buttons = [];
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.fillStyle = '#f6f0df';
    ctx.fillRect(0, 0, this.width, this.height);
    this.drawBackgroundTexture();

    const headerHeight = this.view.kind === 'TITLE' ? 0 : this.drawStatsBar();
    ctx.save();
    ctx.translate(0, -this.scrollY);
    const contentBottom = this.renderScreen(headerHeight + 18);
    ctx.restore();

    const nextMaxScroll = Math.max(0, contentBottom - this.height + 28);
    if (this.scrollY > nextMaxScroll) {
      this.maxScroll = nextMaxScroll;
      this.scrollY = nextMaxScroll;
      this.render();
      return;
    }
    this.maxScroll = nextMaxScroll;
    this.drawScrollHint();
  }

  private renderScreen(top: number): number {
    switch (this.view.kind) {
      case 'TITLE':
        return this.renderTitle(top + 18, this.view);
      case 'BACKGROUND_DRAW':
        return this.renderBackgroundDraw(top, this.view);
      case 'SETUP':
        return this.renderSetup(top, this.view);
      case 'EXAM':
        return this.renderExam(top, this.view);
      case 'EXAM_RESULT':
        return this.renderExamResult(top, this.view);
      case 'APPLICATION':
        return this.renderApplication(top, this.view);
      case 'NPC_SELECTION':
        return this.renderNpcSelection(top, this.view);
      case 'LIFE_GOAL':
        return this.renderLifeGoal(top, this.view);
      case 'CROSSROAD':
        return this.renderCrossroad(top, this.view);
      case 'BRIEF':
        return this.renderBrief(top, this.view);
      case 'EVENT':
        return this.renderEvent(top, this.view);
      case 'OUTCOME':
        return this.renderOutcome(top, this.view);
      case 'SETTLEMENT':
        return this.renderSettlement(top, this.view);
      case 'ENDING':
        return this.renderEnding(top, this.view);
    }
  }

  private drawBackgroundTexture(): void {
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = 0.12;
    ctx.fillStyle = '#c55f3f';
    ctx.fillRect(0, 0, this.width, 5);
    ctx.fillStyle = '#2e6b57';
    ctx.fillRect(0, this.height - 5, this.width, 5);
    ctx.globalAlpha = 0.08;
    for (let y = 72; y < this.height; y += 72) {
      ctx.fillStyle = y % 144 === 0 ? '#2e6b57' : '#b9833a';
      ctx.fillRect(18, y, this.width - 36, 1);
    }
    ctx.restore();
  }

  private drawStatsBar(): number {
    const ctx = this.ctx;
    const x = 14;
    const y = 12;
    const w = this.width - 28;
    const h = 58;
    this.roundRect(x, y, w, h, 8, '#263f34');
    this.drawText(`${this.game.date.year} 年`, x + 14, y + 10, {
      size: 15,
      weight: '700',
      color: '#fff7e8',
    });
    const traitLabels = contentPack.traits
      .filter(t => Boolean(this.game.flags[t.id]))
      .map(t => t.label)
      .join('·');
    const goalLabel = contentPack.lifeGoals.find(goal => goal.id === this.game.flags.life_goal)?.label;
    const evolutionLabels = contentPack.traitEvolutions
      .filter(evolution => Boolean(this.game.flags[evolution.id]))
      .map(evolution => evolution.label)
      .join('·');
    const identityLine = [traitLabels, goalLabel ? `目标·${goalLabel}` : '', evolutionLabels ? `成长·${evolutionLabels}` : '']
      .filter(Boolean)
      .join('  ');
    if (identityLine) {
      this.drawText(identityLine, x + 90, y + 12, { size: 11, color: '#d8c9a5', maxWidth: w - 180 });
    }
    const compact = [
      `学识 ${this.game.stats.knowledge}`,
      `¥${formatMoney(this.game.stats.money)}`,
      `心态 ${this.game.stats.mindset}`,
      `人脉 ${this.game.stats.network}`,
      `健康 ${this.game.stats.health}`,
    ].join('  ');
    this.drawText(compact, x + 14, y + 34, {
      size: 11,
      color: '#dce9df',
      maxWidth: w - 28,
    });
    ctx.fillStyle = '#d89145';
    ctx.fillRect(x + w - 70, y, 46, 3);
    return y + h;
  }

  private drawScrollHint(): void {
    if (this.maxScroll <= 2) return;
    const trackH = Math.max(40, this.height - 120);
    const thumbH = Math.max(28, (this.height / (this.height + this.maxScroll)) * trackH);
    const thumbY = 82 + (this.scrollY / this.maxScroll) * (trackH - thumbH);
    this.roundRect(this.width - 8, 82, 3, trackH, 2, 'rgba(38, 63, 52, 0.12)');
    this.roundRect(this.width - 9, thumbY, 5, thumbH, 3, 'rgba(38, 63, 52, 0.55)');
  }

  private beginPanel(top: number): Panel {
    const margin = 18;
    const x = margin;
    const width = this.width - margin * 2;
    this.roundRect(x, top, width, 1800, 8, '#fffaf0', '#e4d2ad');
    return {
      x,
      y: top,
      width,
      contentX: x + 20,
      contentWidth: width - 40,
    };
  }

  private renderTitle(top: number, view: Extract<ViewModel, { kind: 'TITLE' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 28;
    y = this.drawText('一款关于选择的人生模拟器', panel.contentX, y, {
      size: 13,
      weight: '700',
      color: '#b45438',
      maxWidth: panel.contentWidth,
    }) + 14;
    y = this.drawWrappedText(view.title, panel.contentX, y, panel.contentWidth, {
      size: 36,
      lineHeight: 43,
      weight: '800',
      color: '#20352c',
    }) + 14;
    y = this.drawWrappedText(
      '从高考考场到而立之年,你将替一个普通人做出所有重要的决定。',
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 16, lineHeight: 25, color: '#5c5142' },
    ) + 22;

    if (this.restored) {
      y = this.drawButton('继续上次人生', '', panel.contentX, y, panel.contentWidth, () =>
        this.continueSaved(),
      );
    }
    y = this.drawButton(
      '开始新的人生',
      '',
      panel.contentX,
      y,
      panel.contentWidth,
      () => this.startFresh(),
      { variant: this.restored ? 'secondary' : 'primary' },
    );
    y = this.drawText('微信小游戏版 · Canvas', panel.contentX, y + 8, {
      size: 12,
      color: '#8b806d',
      maxWidth: panel.contentWidth,
    });
    return y + 44;
  }

  private renderBackgroundDraw(
    top: number,
    view: Extract<ViewModel, { kind: 'BACKGROUND_DRAW' }>,
  ): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker('你的出身是——', panel, y);
    y = this.drawHeading(view.card.label, panel, y);
    y = this.drawWrappedText(view.card.text, panel.contentX, y, panel.contentWidth, {
      size: 16,
      lineHeight: 26,
      color: '#3f382f',
    }) + 18;
    y = this.drawCallout(`初始资金 ¥${formatMoney(view.card.initialMoney)}`, panel.contentX, y, panel.contentWidth);
    y = this.drawWrappedText(
      `命运给了你 ${view.traitOffer.length} 张特质卡,选 ${view.pickCount} 张带进这一生——`,
      panel.contentX,
      y + 14,
      panel.contentWidth,
      { size: 14, lineHeight: 22, color: '#8b806d' },
    );
    for (const trait of view.traitOffer) {
      const picked = this.traitSelection.includes(trait.id);
      const mods = Object.entries(trait.statMods ?? {})
        .map(([k, v]) => `${STAT_MOD_LABELS[k] ?? k}${v > 0 ? '+' : '−'}${Math.abs(v)}`)
        .join(' ');
      y = this.drawButton(
        `${picked ? '✓ ' : ''}${trait.label}${mods ? `(${mods})` : ''}`,
        trait.text,
        panel.contentX,
        y + 8,
        panel.contentWidth,
        () => {
          this.traitSelection = picked
            ? this.traitSelection.filter(id => id !== trait.id)
            : this.traitSelection.length < view.pickCount
              ? [...this.traitSelection, trait.id]
              : this.traitSelection;
          this.render();
        },
        { variant: picked ? 'primary' : 'secondary' },
      );
    }
    const ready = this.traitSelection.length === view.pickCount;
    y = this.drawButton(
      ready ? '接受命运' : `再选 ${view.pickCount - this.traitSelection.length} 张特质卡`,
      '',
      panel.contentX,
      y + 8,
      panel.contentWidth,
      () => {
        if (!ready) return;
        const chosen = [...this.traitSelection];
        this.traitSelection = [];
        this.act({ type: 'CHOOSE_TRAITS', traitIds: chosen });
      },
      { disabled: !ready },
    );
    return y + 28;
  }

  private renderSetup(top: number, view: Extract<ViewModel, { kind: 'SETUP' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawHeading('2014 年 6 月,高考报名表', panel, y);
    y = this.drawSectionLabel('你是男生还是女生?', panel, y);
    y = this.drawOptionGrid(
      view.genders.map(g => ({ id: g, label: GENDER_LABELS[g] })),
      this.setupGender,
      panel.contentX,
      y,
      panel.contentWidth,
      id => {
        this.setupGender = id as Gender;
        this.render();
      },
    ) + 10;
    y = this.drawSectionLabel('文科还是理科?', panel, y);
    y = this.drawOptionGrid(
      view.tracks.map(track => ({ id: track, label: `${track}科` })),
      this.setupTrack,
      panel.contentX,
      y,
      panel.contentWidth,
      id => {
        this.setupTrack = id as Track;
        this.render();
      },
    ) + 12;
    const disabled = !this.setupGender || !this.setupTrack;
    y = this.drawButton(
      '走进考场',
      disabled ? '先完成上面的选择' : '',
      panel.contentX,
      y,
      panel.contentWidth,
      () => {
        if (this.setupGender && this.setupTrack) {
          this.act({
            type: 'CHOOSE_SETUP',
            gender: this.setupGender,
            track: this.setupTrack,
          });
        }
      },
      { disabled },
    );
    return y + 28;
  }

  private renderExam(top: number, view: Extract<ViewModel, { kind: 'EXAM' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 24;
    y = this.drawKicker(`${view.question.subject} · 第 ${view.index + 1} / ${view.total} 题`, panel, y);
    y = this.drawWrappedText(view.question.text, panel.contentX, y, panel.contentWidth, {
      size: 18,
      lineHeight: 29,
      weight: '700',
      color: '#26372f',
    }) + 18;
    view.question.options.forEach((option, index) => {
      y = this.drawButton(
        `${OPTION_LETTERS[index] ?? index + 1}. ${option}`,
        '',
        panel.contentX,
        y,
        panel.contentWidth,
        () => this.act({ type: 'ANSWER', optionIndex: index }),
        { variant: 'secondary' },
      );
    });
    y = this.drawButton(
      '跳过答题',
      '按默认成绩计分',
      panel.contentX,
      y + 4,
      panel.contentWidth,
      () => this.act({ type: 'SKIP_EXAM' }),
      { variant: 'plain' },
    );
    return y + 28;
  }

  private renderExamResult(
    top: number,
    view: Extract<ViewModel, { kind: 'EXAM_RESULT' }>,
  ): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker('放榜了', panel, y);
    y = this.drawText(String(view.score), panel.contentX, y, {
      size: 54,
      weight: '800',
      color: '#b45438',
      maxWidth: panel.contentWidth,
    }) + 18;
    y = this.drawWrappedText(
      `全卷答对 ${view.correct} / ${view.total}。分数已经出来了,接下来是那张可能改变一生的志愿表。`,
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 16, lineHeight: 25, color: '#5c5142' },
    ) + 22;
    y = this.drawButton('填报志愿', '', panel.contentX, y, panel.contentWidth, () =>
      this.act({ type: 'CONTINUE' }),
    );
    return y + 28;
  }

  private renderApplication(top: number, view: Extract<ViewModel, { kind: 'APPLICATION' }>): number {
    const panel = this.beginPanel(top);
    const selected = view.options.find(option => option.id === this.selectedApplicationId);
    let y = panel.y + 26;
    y = this.drawHeading('志愿填报', panel, y);
    y = this.drawWrappedText(
      `你的分数: ${view.score}。先选批次,再选专业。报高于分数的批次可以冲,但冲不上就会滑档。`,
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 15, lineHeight: 24, color: '#5c5142' },
    ) + 18;

    if (!selected) {
      view.options.forEach(option => {
        y = this.drawButton(
          `${option.label}${option.risky ? ' · 有风险' : ''}`,
          `${option.university} · 录取把握: ${option.chanceLabel}`,
          panel.contentX,
          y,
          panel.contentWidth,
          () => {
            this.selectedApplicationId = option.id;
            this.render();
          },
          { variant: 'secondary' },
        );
      });
      return y + 28;
    }

    y = this.drawSectionLabel(
      `${selected.label} · ${selected.university} · 录取把握: ${selected.chanceLabel}`,
      panel,
      y,
    );
    selected.majors.forEach(major => {
      y = this.drawButton(major.name, '', panel.contentX, y, panel.contentWidth, () =>
        this.act({ type: 'APPLY', optionId: selected.id, majorId: major.id }),
      );
    });
    y = this.drawButton('重新选批次', '', panel.contentX, y + 4, panel.contentWidth, () => {
      this.selectedApplicationId = null;
      this.render();
    }, { variant: 'plain' });
    return y + 28;
  }

  private renderNpcSelection(
    top: number,
    view: Extract<ViewModel, { kind: 'NPC_SELECTION' }>,
  ): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker('大学生活即将开始', panel, y);
    y = this.drawHeading('谁会成为重要的人？', panel, y);
    y = this.drawWrappedText(
      `选择 ${view.pickCount} 个人。你选择的是重点关系,不是预先决定结局。`,
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 15, lineHeight: 24, color: '#5c5142' },
    ) + 14;
    for (const npc of view.npcs) {
      const picked = this.npcSelection.includes(npc.id);
      y = this.drawButton(
        `${picked ? '✓ ' : ''}${npc.name}`,
        npc.description,
        panel.contentX,
        y,
        panel.contentWidth,
        () => {
          this.npcSelection = picked
            ? this.npcSelection.filter(id => id !== npc.id)
            : this.npcSelection.length < view.pickCount
              ? [...this.npcSelection, npc.id]
              : this.npcSelection;
          this.render();
        },
        { variant: picked ? 'primary' : 'secondary' },
      );
    }
    const ready = this.npcSelection.length === view.pickCount;
    y = this.drawButton(
      ready ? '和他们一起走进大学' : `再选 ${view.pickCount - this.npcSelection.length} 人`,
      '',
      panel.contentX,
      y + 8,
      panel.contentWidth,
      () => {
        if (!ready) return;
        const chosen = [...this.npcSelection];
        this.npcSelection = [];
        this.act({ type: 'CHOOSE_NPCS', npcIds: chosen });
      },
      { disabled: !ready },
    );
    return y + 28;
  }

  private renderLifeGoal(top: number, view: Extract<ViewModel, { kind: 'LIFE_GOAL' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker('2018 年 · 毕业之前', panel, y);
    y = this.drawHeading('你想把什么放在人生前面？', panel, y);
    y = this.drawWrappedText(
      '目标不会锁死选项,但会改变事件倾向和最终评分方式。',
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 15, lineHeight: 24, color: '#5c5142' },
    ) + 14;
    for (const goal of view.goals) {
      y = this.drawButton(
        goal.label,
        goal.text,
        panel.contentX,
        y,
        panel.contentWidth,
        () => this.act({ type: 'CHOOSE_LIFE_GOAL', goalId: goal.id }),
        { variant: 'secondary' },
      );
    }
    return y + 28;
  }

  private renderCrossroad(top: number, view: Extract<ViewModel, { kind: 'CROSSROAD' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker(`${view.year} 年 · 毕业季`, panel, y);
    y = this.drawHeading('大四三岔口', panel, y);
    y = this.drawWrappedText(
      `${view.university} · ${view.major}。宿舍开始收拾纸箱,每个人都在给自己找一个下一站。`,
      panel.contentX,
      y,
      panel.contentWidth,
      { size: 15, lineHeight: 24, color: '#5c5142' },
    ) + 18;
    view.options.forEach(option => {
      const recommended = option.recommendedFor?.includes(view.major) ? ' · 顺势' : '';
      y = this.drawButton(
        `${option.label}${recommended}`,
        option.text,
        panel.contentX,
        y,
        panel.contentWidth,
        () => this.act({ type: 'CHOOSE_CROSSROAD', optionId: option.id }),
        { variant: 'secondary' },
      );
    });
    return y + 28;
  }

  private renderBrief(top: number, view: Extract<ViewModel, { kind: 'BRIEF' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker(view.phaseLabel, panel, y);
    y = this.drawText(String(view.year), panel.contentX, y, {
      size: 48,
      weight: '800',
      color: '#b45438',
      maxWidth: panel.contentWidth,
    }) + 16;
    y = this.drawWrappedText(view.text, panel.contentX, y, panel.contentWidth, {
      size: 17,
      lineHeight: 28,
      color: '#3f382f',
    }) + 22;
    y = this.drawButton('这一年开始了', '', panel.contentX, y, panel.contentWidth, () =>
      this.act({ type: 'CONTINUE' }),
    );
    return y + 28;
  }

  private renderEvent(top: number, view: Extract<ViewModel, { kind: 'EVENT' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    if (view.major) y = this.drawKicker('人生节点', panel, y);
    y = this.drawHeading(view.title, panel, y);
    y = this.drawWrappedText(view.text, panel.contentX, y, panel.contentWidth, {
      size: 17,
      lineHeight: 28,
      color: '#3f382f',
    }) + 20;
    view.choices.forEach(choice => {
      y = this.drawButton(choice.text, '', panel.contentX, y, panel.contentWidth, () =>
        this.act({ type: 'CHOOSE', choiceId: choice.id }),
      );
    });
    return y + 28;
  }

  private renderOutcome(top: number, view: Extract<ViewModel, { kind: 'OUTCOME' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 28;
    y = this.drawWrappedText(view.text, panel.contentX, y, panel.contentWidth, {
      size: 18,
      lineHeight: 30,
      color: '#3f382f',
    }) + 18;
    y = this.drawDeltaChips(view.deltas, panel.contentX, y, panel.contentWidth) + 16;
    y = this.drawButton('继续', '', panel.contentX, y, panel.contentWidth, () =>
      this.act({ type: 'CONTINUE' }),
    );
    return y + 28;
  }

  private renderSettlement(top: number, view: Extract<ViewModel, { kind: 'SETTLEMENT' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker(`${view.year} 年 · 年末`, panel, y);
    y = this.drawStatsGrid(view.stats, panel.contentX, y, panel.contentWidth) + 22;
    y = this.drawButton('翻过这一年', '', panel.contentX, y, panel.contentWidth, () =>
      this.act({ type: 'CONTINUE' }),
    );
    return y + 28;
  }

  private renderEnding(top: number, view: Extract<ViewModel, { kind: 'ENDING' }>): number {
    const panel = this.beginPanel(top);
    let y = panel.y + 26;
    y = this.drawKicker('你的结局', panel, y);
    y = this.drawHeading(view.title, panel, y, 30);
    y = this.drawWrappedText(view.text, panel.contentX, y, panel.contentWidth, {
      size: 16,
      lineHeight: 26,
      color: '#3f382f',
    }) + 18;
    y = this.drawShareCard(view, panel.contentX, y, panel.contentWidth) + 20;
    y = this.drawStatsGrid(view.stats, panel.contentX, y, panel.contentWidth) + 22;
    y = this.drawButton('微信分享', '', panel.contentX, y, panel.contentWidth, () =>
      shareNow(this.sharePayload()),
    );
    y = this.drawButton('复制分享文案', '', panel.contentX, y, panel.contentWidth, () =>
      copyText(this.buildShareText(view)),
      { variant: 'secondary' },
    );
    y = this.drawButton('再活一次', '', panel.contentX, y, panel.contentWidth, () =>
      this.startFresh(),
      { variant: 'plain' },
    );
    return y + 28;
  }

  private drawShareCard(
    view: Extract<ViewModel, { kind: 'ENDING' }>,
    x: number,
    y: number,
    width: number,
  ): number {
    const hasTraits = view.shareCard.traits.length > 0;
    const hasGoal = Boolean(view.shareCard.goal);
    const hasEvolution = view.shareCard.traitEvolutions.length > 0;
    const cardHeight = 178 + (hasTraits ? 20 : 0) + (hasGoal ? 20 : 0) + (hasEvolution ? 20 : 0);
    const toneColor =
      view.shareCard.tone === 'triumph'
        ? '#2e6b57'
        : view.shareCard.tone === 'bitter'
          ? '#5b5562'
          : '#b45438';
    this.roundRect(x, y, width, cardHeight, 8, '#263f34');
    this.ctx.fillStyle = toneColor;
    this.ctx.fillRect(x, y, width, 5);
    let cy = y + 18;
    this.drawText(`${view.shareCard.years}  #${view.shareCard.seed}`, x + 16, cy, {
      size: 12,
      weight: '700',
      color: '#f4e5c2',
      maxWidth: width - 32,
    });
    cy += 28;
    cy = this.drawWrappedText(view.shareCard.title, x + 16, cy, width - 32, {
      size: 24,
      lineHeight: 30,
      weight: '800',
      color: '#fffaf0',
    }) + 8;
    cy = this.drawWrappedText(view.shareCard.tagline, x + 16, cy, width - 32, {
      size: 14,
      lineHeight: 21,
      color: '#e8dcc2',
    }) + 12;
    if (view.shareCard.goal) {
      this.drawText(`人生目标:${view.shareCard.goal}`, x + 16, cy, {
        size: 12,
        color: '#d8c9a5',
        maxWidth: width - 32,
      });
      cy += 20;
    }
    if (hasEvolution) {
      this.drawText(`性格成长:${view.shareCard.traitEvolutions.join(' × ')}`, x + 16, cy, {
        size: 12,
        color: '#d8c9a5',
        maxWidth: width - 32,
      });
      cy += 20;
    }
    if (hasTraits) {
      this.drawText(`特质:${view.shareCard.traits.join(' × ')}`, x + 16, cy, {
        size: 12,
        color: '#d8c9a5',
        maxWidth: width - 32,
      });
      cy += 20;
    }
    this.drawText(`成绩 ${view.grade} · 人生总分 ${view.score}`, x + 16, cy, {
      size: 15,
      weight: '700',
      color: '#fff7e8',
      maxWidth: width - 32,
    });
    return y + cardHeight;
  }

  private drawStatsGrid(stats: Stats, x: number, y: number, width: number): number {
    const gap = 8;
    const colWidth = (width - gap) / 2;
    let cy = y;
    STAT_ITEMS.forEach((item, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const cellX = x + col * (colWidth + gap);
      const cellY = y + row * 70;
      this.roundRect(cellX, cellY, colWidth, 62, 8, '#f3ead9', '#e1caa1');
      this.drawText(item.label, cellX + 12, cellY + 10, {
        size: 12,
        color: '#7b6f5e',
        maxWidth: colWidth - 24,
      });
      this.drawText(formatStat(item.key, stats[item.key]), cellX + 12, cellY + 30, {
        size: item.key === 'money' ? 17 : 20,
        weight: '800',
        color: '#263f34',
        maxWidth: colWidth - 24,
      });
      cy = Math.max(cy, cellY + 70);
    });
    return cy;
  }

  private drawDeltaChips(deltas: StatDeltas, x: number, y: number, width: number): number {
    let cx = x;
    let cy = y;
    let drew = false;
    STAT_ITEMS.forEach(item => {
      const value = deltas[item.key] ?? 0;
      if (value === 0) return;
      drew = true;
      const label = `${item.label} ${formatDelta(item.key, value)}`;
      this.setFont(13, '700');
      const chipWidth = Math.min(width, this.ctx.measureText(label).width + 24);
      if (cx + chipWidth > x + width) {
        cx = x;
        cy += 34;
      }
      this.roundRect(
        cx,
        cy,
        chipWidth,
        26,
        13,
        value > 0 ? '#dcecdf' : '#f3dfd5',
        value > 0 ? '#9fcaab' : '#d7aa96',
      );
      this.drawText(label, cx + 12, cy + 6, {
        size: 13,
        weight: '700',
        color: value > 0 ? '#285a42' : '#8a3d2d',
        maxWidth: chipWidth - 24,
      });
      cx += chipWidth + 8;
    });
    return drew ? cy + 32 : y;
  }

  private drawOptionGrid(
    options: { id: string; label: string }[],
    selectedId: string | null,
    x: number,
    y: number,
    width: number,
    onSelect: (id: string) => void,
  ): number {
    const gap = 8;
    const colWidth = (width - gap) / 2;
    let cy = y;
    options.forEach((option, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      const cellX = x + col * (colWidth + gap);
      const cellY = y + row * 54;
      const selected = selectedId === option.id;
      this.roundRect(
        cellX,
        cellY,
        colWidth,
        46,
        8,
        selected ? '#2e6b57' : '#f3ead9',
        selected ? '#2e6b57' : '#e1caa1',
      );
      this.drawWrappedText(option.label, cellX + 10, cellY + 9, colWidth - 20, {
        size: 13,
        lineHeight: 17,
        weight: '700',
        color: selected ? '#fffaf0' : '#4d463b',
      });
      this.buttons.push({
        x: cellX,
        y: cellY,
        width: colWidth,
        height: 46,
        onTap: () => onSelect(option.id),
      });
      cy = Math.max(cy, cellY + 54);
    });
    return cy;
  }

  private drawCallout(text: string, x: number, y: number, width: number): number {
    const h = 48;
    this.roundRect(x, y, width, h, 8, '#263f34');
    this.drawText(text, x + 14, y + 15, {
      size: 16,
      weight: '800',
      color: '#fff7e8',
      maxWidth: width - 28,
    });
    return y + h + 14;
  }

  private drawButton(
    label: string,
    sub: string,
    x: number,
    y: number,
    width: number,
    onTap: () => void,
    options?: { variant?: ButtonVariant; disabled?: boolean },
  ): number {
    const variant = options?.variant ?? 'primary';
    const disabled = options?.disabled ?? false;
    const labelLines = this.measureWrapped(label, width - 28, 16, '800');
    const subLines = sub ? this.measureWrapped(sub, width - 28, 13, '400') : [];
    const height = Math.max(52, 18 + labelLines.length * 21 + subLines.length * 18);
    const colors = this.buttonColors(variant, disabled);
    this.roundRect(x, y, width, height, 8, colors.fill, colors.stroke);
    let textY = y + (subLines.length ? 11 : Math.max(14, (height - labelLines.length * 21) / 2));
    labelLines.forEach(line => {
      this.drawText(line, x + 14, textY, {
        size: 16,
        weight: '800',
        color: colors.label,
        maxWidth: width - 28,
      });
      textY += 21;
    });
    subLines.forEach(line => {
      this.drawText(line, x + 14, textY + 2, {
        size: 13,
        color: colors.sub,
        maxWidth: width - 28,
      });
      textY += 18;
    });
    this.buttons.push({ x, y, width, height, disabled, onTap });
    return y + height + 10;
  }

  private buttonColors(variant: ButtonVariant, disabled: boolean): {
    fill: string;
    stroke: string;
    label: string;
    sub: string;
  } {
    if (disabled) {
      return { fill: '#e7dfd0', stroke: '#d2c6b4', label: '#9a907f', sub: '#9a907f' };
    }
    if (variant === 'secondary') {
      return { fill: '#f3ead9', stroke: '#d9c39c', label: '#263f34', sub: '#756a5a' };
    }
    if (variant === 'plain') {
      return { fill: '#fffaf0', stroke: '#d9c39c', label: '#7a4b31', sub: '#8b806d' };
    }
    return { fill: '#2e6b57', stroke: '#2e6b57', label: '#fffaf0', sub: '#dce9df' };
  }

  private drawKicker(text: string, panel: Panel, y: number): number {
    return (
      this.drawText(text, panel.contentX, y, {
        size: 13,
        weight: '800',
        color: '#b45438',
        maxWidth: panel.contentWidth,
      }) + 12
    );
  }

  private drawHeading(text: string, panel: Panel, y: number, size = 25): number {
    return (
      this.drawWrappedText(text, panel.contentX, y, panel.contentWidth, {
        size,
        lineHeight: size + 8,
        weight: '800',
        color: '#26372f',
      }) + 14
    );
  }

  private drawSectionLabel(text: string, panel: Panel, y: number): number {
    return (
      this.drawWrappedText(text, panel.contentX, y, panel.contentWidth, {
        size: 14,
        lineHeight: 20,
        weight: '800',
        color: '#6d604f',
      }) + 10
    );
  }

  private drawWrappedText(
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    options: {
      size: number;
      lineHeight: number;
      color: string;
      weight?: string;
    },
  ): number {
    const lines = this.measureWrapped(text, maxWidth, options.size, options.weight ?? '400');
    let cy = y;
    lines.forEach(line => {
      this.drawText(line, x, cy, {
        size: options.size,
        weight: options.weight,
        color: options.color,
        maxWidth,
      });
      cy += options.lineHeight;
    });
    return cy;
  }

  private drawText(
    text: string,
    x: number,
    y: number,
    options: {
      size: number;
      color: string;
      weight?: string;
      maxWidth?: number;
      align?: CanvasTextAlign;
    },
  ): number {
    const ctx = this.ctx;
    this.setFont(options.size, options.weight ?? '400');
    ctx.fillStyle = options.color;
    ctx.textBaseline = 'top';
    ctx.textAlign = options.align ?? 'left';
    ctx.fillText(text, x, y, options.maxWidth);
    return y + options.size;
  }

  private measureWrapped(text: string, maxWidth: number, size: number, weight: string): string[] {
    this.setFont(size, weight);
    const lines: string[] = [];
    const paragraphs = text.split('\n');
    paragraphs.forEach(paragraph => {
      if (!paragraph) {
        lines.push('');
        return;
      }
      let line = '';
      Array.from(paragraph).forEach(char => {
        const next = `${line}${char}`;
        if (line && this.ctx.measureText(next).width > maxWidth) {
          lines.push(line);
          line = char;
        } else {
          line = next;
        }
      });
      if (line) lines.push(line);
    });
    return lines;
  }

  private setFont(size: number, weight: string): void {
    this.ctx.font = `${weight} ${size}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  }

  private roundRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fill: string,
    stroke?: string,
  ): void {
    const ctx = this.ctx;
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  private buildShareText(view: Extract<ViewModel, { kind: 'ENDING' }>): string {
    const { stats } = view;
    return [
      `我在《${contentPack.meta.title}》里达成结局: ${view.title}`,
      view.shareCard.tagline,
      ...(view.shareCard.goal ? [`人生目标:${view.shareCard.goal}`] : []),
      ...(view.shareCard.traitEvolutions.length > 0 ? [`性格成长:${view.shareCard.traitEvolutions.join(' × ')}`] : []),
      ...(view.shareCard.traits.length > 0 ? [`特质:${view.shareCard.traits.join(' × ')}`] : []),
      `人生总分 ${view.score}(${view.grade} 级)`,
      `学识${stats.knowledge} 金钱¥${formatMoney(stats.money)} 心态${stats.mindset} 人脉${stats.network} 健康${stats.health}`,
      `人生编号 #${view.shareCard.seed}`,
    ].join('\n');
  }

  private sharePayload(): { title: string; query?: string } {
    if (this.view.kind === 'ENDING') {
      return {
        title: `我达成了结局: ${this.view.title}`,
        query: `seed=${this.view.shareCard.seed}&ending=${this.view.endingId}`,
      };
    }
    return { title: contentPack.meta.title };
  }
}

void new LifeSimMiniGame();
