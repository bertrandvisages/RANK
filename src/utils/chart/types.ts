export interface Point {
  x: number;
  y: number;
  ranking: Ranking;
}

export interface Scale {
  width: number;
  height: number;
  padding: number;
}

export interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  position: number;
  date: string;
}

export interface AxisTick {
  value: number;
  position: number;
}

export interface XAxisPosition {
  date: string;
  x: number;
}