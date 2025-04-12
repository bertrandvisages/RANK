import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useKeywordExpansions(userId: string) {
  const [expandedKeywords, setExpandedKeywords] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadExpandedKeywords();
    }
  }, [userId]);

  const loadExpandedKeywords = async () => {
    try {
      const { data, error } = await supabase
        .from('keyword_expansions')
        .select('keyword_id, is_expanded')
        .eq('user_id', userId);

      if (error) throw error;

      const expanded = new Set(
        data
          ?.filter(item => item.is_expanded)
          .map(item => item.keyword_id)
      );

      setExpandedKeywords(expanded);
    } catch (error) {
      console.error('Error loading keyword expansions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeywordExpansion = async (keywordId: string) => {
    const isCurrentlyExpanded = expandedKeywords.has(keywordId);
    
    try {
      const { error } = await supabase
        .from('keyword_expansions')
        .upsert({
          user_id: userId,
          keyword_id: keywordId,
          is_expanded: !isCurrentlyExpanded
        }, {
          onConflict: 'user_id,keyword_id'
        });

      if (error) throw error;

      setExpandedKeywords(prev => {
        const next = new Set(prev);
        if (isCurrentlyExpanded) {
          next.delete(keywordId);
        } else {
          next.add(keywordId);
        }
        return next;
      });
    } catch (error) {
      console.error('Error updating keyword expansion:', error);
    }
  };

  return {
    expandedKeywords,
    loading,
    toggleKeywordExpansion
  };
}