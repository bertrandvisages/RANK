import { useState } from 'react';
import { RankingError } from '../utils/errors';
import { checkRanking } from '../lib/api/ranking';
import type { Ranking } from '../types';

export function useRanking() {
  const [loading, setLoading] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (keywordId: string) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[keywordId];
      return next;
    });
  };

  const refreshRanking = async (keywordId: string, domainId: string): Promise<Ranking[]> => {
    clearError(keywordId);
    setLoading(prev => new Set(prev).add(keywordId));

    try {
      const rankings = await checkRanking(keywordId, domainId);
      return rankings;
    } catch (error) {
      const message = error instanceof RankingError 
        ? error.message 
        : 'Erreur lors de la vérification du classement';
      
      setErrors(prev => ({ ...prev, [keywordId]: message }));
      throw new RankingError(message);
    } finally {
      setLoading(prev => {
        const next = new Set(prev);
        next.delete(keywordId);
        return next;
      });
    }
  };

  return {
    refreshRanking,
    loading,
    errors,
    clearError
  };
}