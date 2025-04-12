import type { Ranking } from '../../types';

interface ChartDimensions {
  width: number;
  height: number;
  padding: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  };
}

interface Point {
  x: number;
  y: number;
  ranking: Ranking;
}

const MIN_POINT_SPACING = 40; // 2 * POINT_RADIUS (12) + 16px spacing

export function calculateChartPoints(rankings: Ranking[], dimensions: ChartDimensions): Point[] {
  if (!rankings || rankings.length < 2) return [];

  const { width, height, padding } = dimensions;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Calculer la largeur minimale nécessaire pour tous les points
  const minRequiredWidth = (rankings.length - 1) * MIN_POINT_SPACING;
  
  // Ajuster la largeur du graphique si nécessaire
  const effectiveWidth = Math.max(chartWidth, minRequiredWidth);

  const positions = rankings.map(r => r.position);
  const minPosition = Math.max(1, Math.min(...positions) - 2);
  const maxPosition = Math.min(100, Math.max(...positions) + 2);

  return rankings.map((ranking, index) => {
    // Calculer x avec l'espacement minimum garanti
    const x = padding.left + (index * MIN_POINT_SPACING);

    const yRatio = (ranking.position - minPosition) / (maxPosition - minPosition);
    const y = padding.top + (yRatio * chartHeight);

    return { 
      x: Number.isFinite(x) ? x : padding.left,
      y: Number.isFinite(y) ? y : padding.top,
      ranking 
    };
  });
}

export function calculateAxisTicks(rankings: Ranking[]): {
  yTicks: number[];
  xTicks: number[];
} {
  const positions = rankings.map(r => r.position);
  const minPosition = Math.max(1, Math.min(...positions) - 2);
  const maxPosition = Math.min(100, Math.max(...positions) + 2);

  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const value = minPosition + ((maxPosition - minPosition) / 4) * i;
    return Math.round(value);
  });

  const xTicks = Array.from({ length: Math.min(5, rankings.length) }, (_, i) => i);

  return { yTicks, xTicks };
}

export function createLinePath(points: Point[]): string {
  if (points.length < 2) return '';
  
  return points
    .map((point, i) => {
      if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) return '';
      return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    })
    .filter(Boolean)
    .join(' ');
}