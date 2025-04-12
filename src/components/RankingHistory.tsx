import React from 'react';
import { Clock } from 'lucide-react';
import { formatDate } from '../utils/date';
import type { Ranking } from '../types';

interface RankingHistoryProps {
  rankings: Ranking[];
  lastChecked?: Date;
}

export function RankingHistory({ rankings, lastChecked }: RankingHistoryProps) {
  if (!lastChecked) return null;

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2 text-gray-600">
        <Clock size={16} className="text-gray-400" />
        <span className="text-sm">
          Dernière vérification : {formatDate(lastChecked)}
        </span>
      </div>
    </div>
  );
}