import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { RankingButton } from './RankingButton';
import { RankingDisplay } from './RankingDisplay';
import { RankingChart } from './RankingChart';
import { ErrorMessage } from './ErrorMessage';
import { MetricsButton } from './MetricsButton';
import { useKeywordExpansions } from '../hooks/useKeywordExpansions';
import { useMetrics } from '../hooks/useMetrics';
import type { Keyword } from '../types';

interface KeywordListProps {
  keywords: Keyword[];
  onAddKeyword: (term: string) => void;
  onDeleteKeyword: (id: string) => void;
  onRefreshRanking: (id: string) => Promise<void>;
  selectedDomainId: string | null;
  userId: string;
}

export function KeywordList({
  keywords,
  onAddKeyword,
  onDeleteKeyword,
  onRefreshRanking,
  selectedDomainId,
  userId
}: KeywordListProps) {
  const [newKeyword, setNewKeyword] = useState('');
  const [loadingKeywords, setLoadingKeywords] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [expandedCharts, setExpandedCharts] = useState<Set<string>>(new Set());
  
  const { 
    expandedKeywords, 
    toggleKeywordExpansion 
  } = useKeywordExpansions(userId);

  const {
    loadingKeywords: loadingVolumes,
    checkKeywordVolume
  } = useMetrics();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim()) {
      onAddKeyword(newKeyword.trim());
      setNewKeyword('');
    }
  };

  const handleDelete = async (e: React.MouseEvent, keywordId: string) => {
    e.stopPropagation();
    try {
      await onDeleteKeyword(keywordId);
    } catch (error) {
      console.error('Error deleting keyword:', error);
      const message = error instanceof Error ? error.message : 'Erreur lors de la suppression';
      setErrors(prev => ({ ...prev, [keywordId]: message }));
    }
  };

  const handleRefresh = async (keywordId: string) => {
    setErrors(prev => ({ ...prev, [keywordId]: '' }));
    try {
      setLoadingKeywords(prev => new Set(prev).add(keywordId));
      await onRefreshRanking(keywordId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setErrors(prev => ({ ...prev, [keywordId]: message }));
    } finally {
      setLoadingKeywords(prev => {
        const next = new Set(prev);
        next.delete(keywordId);
        return next;
      });
    }
  };

  const handleVolumeCheck = async (keyword: Keyword) => {
    try {
      const updatedKeyword = await checkKeywordVolume(keyword.id, keyword.term);
      // Mettre à jour le mot-clé dans la liste avec la nouvelle valeur
      if (updatedKeyword) {
        const index = keywords.findIndex(k => k.id === keyword.id);
        if (index !== -1) {
          keywords[index] = {
            ...keywords[index],
            volume: updatedKeyword.volume
          };
        }
      }
    } catch (error) {
      console.error('Error checking volume:', error);
    }
  };

  const toggleChart = (keywordId: string) => {
    setExpandedCharts(prev => {
      const next = new Set(prev);
      if (next.has(keywordId)) {
        next.delete(keywordId);
      } else {
        next.add(keywordId);
      }
      return next;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">Mots-clés</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Nouveau mot-clé"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!selectedDomainId}
          />
          <button
            type="submit"
            disabled={!selectedDomainId}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 whitespace-nowrap"
          >
            <Plus size={16} />
            Ajouter
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {keywords.map((keyword) => {
          const isExpanded = expandedKeywords.has(keyword.id);
          const hasRankings = keyword.rankings && keyword.rankings.length > 0;
          const isLoading = loadingVolumes.has(keyword.id);

          return (
            <div
              key={keyword.id}
              className="border rounded-md overflow-hidden"
            >
              {/* En-tête du mot-clé (toujours visible) */}
              <div 
                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                onClick={() => toggleKeywordExpansion(keyword.id)}
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  <h3 className="font-medium text-lg">{keyword.term}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <MetricsButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleVolumeCheck(keyword);
                    }}
                    isLoading={isLoading}
                    metrics={{ volume: keyword.volume }}
                    type="keyword"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(e, keyword.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Contenu détaillé (visible uniquement si déplié) */}
              {isExpanded && (
                <div className="p-4 border-t">
                  <RankingDisplay 
                    rankings={keyword.rankings} 
                    lastChecked={keyword.last_checked}
                  />

                  {hasRankings && (
                    <RankingChart
                      rankings={keyword.rankings}
                      expanded={expandedCharts.has(keyword.id)}
                      onToggle={() => toggleChart(keyword.id)}
                    />
                  )}

                  {errors[keyword.id] && (
                    <div className="mt-2">
                      <ErrorMessage message={errors[keyword.id]} />
                    </div>
                  )}
                  
                  <RankingButton 
                    onClick={() => handleRefresh(keyword.id)}
                    isLoading={loadingKeywords.has(keyword.id)}
                  />
                </div>
              )}
            </div>
          );
        })}
        {keywords.length === 0 && selectedDomainId && (
          <p className="text-center text-gray-500 py-4">
            Aucun mot-clé pour ce domaine. Ajoutez-en un !
          </p>
        )}
      </div>
    </div>
  );
}