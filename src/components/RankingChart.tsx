import React, { useState, useMemo, useRef } from 'react';
import { LineChart } from 'lucide-react';
import { formatDate } from '../utils/date';
import { getPositionColors } from '../utils/colors';
import { calculateChartPoints, calculateAxisTicks, createLinePath } from '../utils/chart/calculations';
import type { Ranking } from '../types';
import { formatRankingText, isOutOfRange } from '../utils/ranking';

interface RankingChartProps {
  rankings: Ranking[];
  expanded: boolean;
  onToggle: () => void;
}

const CHART_DIMENSIONS = {
  width: 600,
  height: 200,
  padding: {
    left: 40,
    right: 20,
    top: 20,
    bottom: 30
  }
};

const POINT_RADIUS = 12;

export function RankingChart({ rankings, expanded, onToggle }: RankingChartProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    position: number;
    date: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    position: 0,
    date: ''
  });

  // Vérifier si nous avons des données valides à afficher
  const hasValidRankings = rankings.length > 0 && rankings.some(r => !isOutOfRange(r.position));

  const points = useMemo(() => 
    calculateChartPoints(rankings, CHART_DIMENSIONS),
    [rankings]
  );

  // Calculer la largeur minimale nécessaire pour le graphique
  const minWidth = useMemo(() => {
    if (points.length === 0) return CHART_DIMENSIONS.width;
    const lastPoint = points[points.length - 1];
    return Math.max(CHART_DIMENSIONS.width, lastPoint.x + CHART_DIMENSIONS.padding.right);
  }, [points]);

  const { yTicks, xTicks } = useMemo(() => 
    calculateAxisTicks(rankings),
    [rankings]
  );

  const linePath = useMemo(() => 
    createLinePath(points),
    [points]
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current!.offsetLeft);
    setScrollLeft(scrollContainerRef.current!.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - scrollContainerRef.current!.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current!.scrollLeft = scrollLeft - walk;
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMouseEnter = (e: React.MouseEvent<SVGCircleElement>, ranking: Ranking) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const svgRect = e.currentTarget.closest('svg')?.getBoundingClientRect();
    if (!svgRect) return;

    setTooltip({
      visible: true,
      x: rect.left - svgRect.left + rect.width / 2,
      y: rect.top - svgRect.top,
      position: ranking.position,
      date: ranking.checkedAt || ''
    });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setTooltip(prev => ({ ...prev, visible: false }));
    }
  };

  // Ne rien afficher s'il n'y a pas de données valides
  if (!hasValidRankings) {
    return null;
  }

  // Afficher le bouton "Voir l'historique" si le graphique n'est pas développé
  if (!expanded) {
    return (
      <button
        onClick={onToggle}
        className="mt-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <LineChart size={16} />
        <span>Voir l'historique</span>
      </button>
    );
  }

  return (
    <div className="mt-4 relative">
      <div 
        ref={scrollContainerRef}
        className={`overflow-x-auto pb-4 cursor-${isDragging ? 'grabbing' : 'grab'} select-none`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleDragEnd}
      >
        <div style={{ minWidth: `${minWidth}px` }}>
          <svg 
            width={minWidth} 
            height={CHART_DIMENSIONS.height}
            className="w-full h-auto"
          >
            {/* Ligne du graphique */}
            <path
              d={linePath}
              className="stroke-blue-500 stroke-2 fill-none"
            />

            {/* Points */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={POINT_RADIUS}
                  className="fill-blue-500 hover:fill-blue-600 cursor-pointer transition-colors"
                  onMouseEnter={(e) => handleMouseEnter(e, point.ranking)}
                  onMouseLeave={handleMouseLeave}
                />
                <text
                  x={point.x}
                  y={point.y}
                  dy="0.35em"
                  textAnchor="middle"
                  className="fill-white text-[11px] font-medium pointer-events-none select-none"
                >
                  {point.ranking.position}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute z-10 bg-gray-800 text-white rounded-lg shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translate(-50%, -120%)'
          }}
        >
          <div className="px-4 py-2 text-sm">
            <div className="font-medium">
              {formatRankingText(tooltip.position)}
            </div>
            <div className="text-gray-300 text-xs">
              {formatDate(tooltip.date)}
            </div>
          </div>
          <div 
            className="absolute left-1/2 bottom-0 w-2 h-2 bg-gray-800 transform -translate-x-1/2 translate-y-1/2 rotate-45"
            aria-hidden="true"
          />
        </div>
      )}

      <button
        onClick={onToggle}
        className="mt-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
      >
        <LineChart size={16} />
        <span>Masquer l'historique</span>
      </button>
    </div>
  );
}