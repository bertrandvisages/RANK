import React from 'react';
import { ProgressButton } from './ProgressButton';

interface MetricsButtonProps {
  onClick: (e: React.MouseEvent) => void;
  isLoading: boolean;
  metrics?: {
    backlinks?: number | null;
    rank?: number | null;
    volume?: number | null;
  };
  type: 'domain' | 'keyword';
}

export function MetricsButton({ onClick, isLoading, metrics, type }: MetricsButtonProps) {
  // Fonction pour formater les grands nombres
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '';
    
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const renderDomainMetrics = () => (
    <div className="flex items-center gap-1">
      <span className="text-red-600">BL</span>
      <span className="text-green-600">{formatNumber(metrics?.backlinks)}</span>
      <span className="text-red-600 ml-2">RK</span>
      <span className="text-green-600">{formatNumber(metrics?.rank)}</span>
    </div>
  );

  const renderKeywordMetrics = () => (
    <div className="flex items-center gap-1">
      <span className="text-red-600">VOL</span>
      <span className="text-green-600">{formatNumber(metrics?.volume)}</span>
    </div>
  );

  const hasMetrics = type === 'domain' 
    ? (metrics?.backlinks !== undefined || metrics?.rank !== undefined)
    : metrics?.volume !== undefined;

  return (
    <ProgressButton
      onClick={onClick}
      isLoading={isLoading}
      duration={3000}
      className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
        isLoading 
          ? 'bg-gray-100 text-gray-400' 
          : hasMetrics
            ? 'bg-gray-50 hover:bg-gray-100' 
            : 'bg-red-50 hover:bg-red-100'
      }`}
    >
      {isLoading ? (
        <span>...</span>
      ) : type === 'domain' ? (
        renderDomainMetrics()
      ) : (
        renderKeywordMetrics()
      )}
    </ProgressButton>
  );
}