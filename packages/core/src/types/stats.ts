export type StatKey = 'knowledge' | 'money' | 'mindset' | 'network' | 'health';

export interface Stats {
  knowledge: number;
  money: number;
  mindset: number;
  network: number;
  /** 健康:0-100,长期透支型选择的隐性代价;跌破下限触发早退结局 */
  health: number;
}

export type StatDeltas = Partial<Stats>;

export type Track = '文' | '理';

export type Flags = Record<string, boolean | number | string>;
