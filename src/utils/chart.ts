import type { Ranking } from '../types';

export interface Point {
  x: number;
  y: number;
  ranking: Ranking;
}

export function calculateChartDimensions(positions: number[]) {
  const minPosition = Math.max(1, Math.min(...positions) - 5);
  const maxPosition = Math.min(100, Math.max(...positions) + 5);
  const height = 150;
  
  return { minPosition, maxPosition, height };
}

export function calculateTimeScale(dates: number[]) {
  const minDate = Math.min(...dates);
  const maxDate = Math.max(...dates);
  const timeRange = Math.max(1, maxDate - minDate); // Évite la division par zéro
  const width = Math.max(300, Math.min(600, timeRange / (24 * 60 * 60 * 1000) * 50));
  
  return { minDate, maxDate, timeRange, width };
}

export function calculateYAxisValues(minPosition: number, maxPosition: number, steps = 5) {
  const stepSize = Math.ceil((maxPosition - minPosition) / steps);
  return Array.from(
    { length: steps + 1 },
    (_, i) => Math.min(100, minPosition + i * stepSize)
  ).reverse();
}

export function calculatePoints(
  rankings: Ranking[], 
  minDate: number, 
  timeRange: number,
  minPosition: number,
  maxPosition: number,
  width: number,
  height: number
): Point[] {
  return rankings.map(ranking => {
    const x = ranking.checkedAt 
      ? ((new Date(ranking.checkedAt).getTime() - minDate) / timeRange) * width
      : 0;
    const y = height - (((ranking.position - minPosition) / (maxPosition - minPosition)) * height);
    return { x, y, ranking };
  });
}