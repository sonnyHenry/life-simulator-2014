export type StatKey = 'knowledge' | 'money' | 'mindset' | 'network';

export interface Stats {
  knowledge: number;
  money: number;
  mindset: number;
  network: number;
}

export type StatDeltas = Partial<Stats>;

export type Track = '文' | '理';

export type Flags = Record<string, boolean | number | string>;
