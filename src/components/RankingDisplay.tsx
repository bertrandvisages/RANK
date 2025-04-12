import React from 'react';
import { Trophy, Link, AlertCircle, Clock } from 'lucide-react';
import { isOutOfRange, formatRankingText } from '../utils/ranking';
import { formatDate } from '../utils/date';
import { getPositionColors } from '../utils/colors';
import { SerpButton } from './SerpButton';
import type { Ranking } from '../types';

interface RankingDisplayProps {
  rankings?: Ranking[];
  lastChecked?: Date | string;
}

export function RankingDisplay({ rankings, lastChecked }: RankingDisplayProps) {
  if (!rankings?.length) return null;

  // Trier les rankings par date et prendre le plus récent
  const latestRanking = [...rankings].sort((a, b) => {
    const dateA = a.checkedAt ? new Date(a.checkedAt).getTime() : 0;
    const dateB = b.checkedAt ? new Date(b.checkedAt).getTime() : 0;
    return dateB - dateA;  // Tri décroissant pour avoir le plus récent en premier
  })[0];

  const colors = getPositionColors(latestRanking.position);
  const outOfRange = isOutOfRange(latestRanking.position);

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-md">
      <div className="flex flex-wrap items-center gap-2">
        {outOfRange ? (
          <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
        ) : (
          <Trophy size={20} className={`${colors.text} flex-shrink-0`} />
        )}
        <span className={`text-lg font-semibold ${colors.text} break-all`}>
          {formatRankingText(latestRanking.position)}
        </span>
        {latestRanking.serpUrl && (
          <SerpButton url={latestRanking.serpUrl} />
        )}
      </div>
      
      {latestRanking.targetUrl && (
        <div className="mt-2 space-y-2">
          <div className="flex items-start gap-2 text-gray-600">
            <Link size={16} className="flex-shrink-0 mt-1" />
            <a 
              href={latestRanking.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:underline break-all"
            >
              {latestRanking.targetUrl}
            </a>
          </div>
          
          {lastChecked && (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={14} className="flex-shrink-0" />
              <span className="text-xs break-normal">
                Vérifié le {formatDate(lastChecked)}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}