import type { Ranking } from '../../types';
import type { AxisTick, XAxisPosition } from './types';
import { DEFAULT_CHART_CONFIG } from './constants';

export function calculateYAxisTicks(rankings: Ranking[], count = DEFAULT_CHART_CONFIG.tickCount): AxisTick[] {
  const positions = rankings.map(r => r.position);
  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);
  
  const range = maxPos - minPos;
  const step = Math.ceil(range / (count - 1));
  
  return Array.from(
    { length: count },
    (_, i) => {
      const value = Math.min(100, Math.max(1, minPos + i * step));
      return {
        value,
        position: (i / (count - 1)) * (DEFAULT_CHART_CONFIG.height - DEFAULT_CHART_CONFIG.padding)
      };
    }
  ).sort((a, b) => b.value - a.value);
}

export function calculateXAxisPositions(rankings: Ranking[]): XAxisPosition[] {
  const sortedRankings = [...rankings].sort((a, b) => {
    const dateA = a.checkedAt ? new Date(a.checkedAt).getTime() : 0;
    const dateB = b.checkedAt ? new Date(b.checkedAt).getTime() : 0;
    return dateA - dateB;
  });

  const availableWidth = DEFAULT_CHART_CONFIG.width - 2 * DEFAULT_CHART_CONFIG.padding;
  
  return sortedRankings.map((ranking, index) => ({
    date: ranking.checkedAt || '',
    x: (index / (sortedRankings.length - 1)) * availableWidth + DEFAULT_CHART_CONFIG.padding
  }));
}