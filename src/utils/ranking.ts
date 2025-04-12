import { RANKING_THRESHOLDS } from './constants';

export function getRankingColor(position: number): string {
  if (position <= RANKING_THRESHOLDS.EXCELLENT) return 'text-green-600';
  if (position <= RANKING_THRESHOLDS.GOOD) return 'text-blue-600';
  if (position > RANKING_THRESHOLDS.OUT_OF_RANGE) return 'text-red-600';
  return 'text-gray-600';
}

export function isOutOfRange(position: number): boolean {
  return position > RANKING_THRESHOLDS.OUT_OF_RANGE;
}

export function formatRankingText(position: number): string {
  return isOutOfRange(position) ? 'Hors top 100' : `Position ${position}`;
}