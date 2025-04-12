import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRanking } from './useRanking';
import type { Keyword, Ranking } from '../types';

export function useKeywords(userId: string, domainId: string | null) {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(false);
  const ranking = useRanking();

  const loadKeywords = async () => {
    if (!domainId || !userId) {
      setKeywords([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('keywords')
        .select(`
          *,
          volume,
          ranking_history(position, target_url, serp_url, created_at)
        `)
        .eq('user_id', userId)
        .eq('domain_id', domainId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const transformedData = data?.map(keyword => ({
        ...keyword,
        rankings: keyword.ranking_history?.map((hist: any) => ({
          position: hist.position,
          targetUrl: hist.target_url,
          serpUrl: hist.serp_url,
          checkedAt: hist.created_at
        })) || []
      })) || [];

      setKeywords(transformedData);
    } catch (error) {
      console.error('Error loading keywords:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeywords();
  }, [userId, domainId]);

  const addKeyword = async (term: string) => {
    if (!domainId) return;
    
    try {
      const { data, error } = await supabase
        .from('keywords')
        .insert({
          user_id: userId,
          domain_id: domainId,
          term
        })
        .select()
        .single();

      if (error) throw error;
      setKeywords(prev => [{ ...data, rankings: [] }, ...prev]);
    } catch (error) {
      console.error('Error adding keyword:', error);
      throw error;
    }
  };

  const deleteKeyword = async (keywordId: string) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .delete()
        .eq('id', keywordId);

      if (error) throw error;
      setKeywords(prev => prev.filter(keyword => keyword.id !== keywordId));
    } catch (error) {
      console.error('Error deleting keyword:', error);
      throw error;
    }
  };

  const updateKeywordVolume = async (keywordId: string, volume: number) => {
    try {
      const { error } = await supabase
        .from('keywords')
        .update({ volume })
        .eq('id', keywordId);

      if (error) throw error;

      // Mettre à jour l'état local
      setKeywords(prev => prev.map(keyword => 
        keyword.id === keywordId 
          ? { ...keyword, volume }
          : keyword
      ));
    } catch (error) {
      console.error('Error updating keyword volume:', error);
      throw error;
    }
  };

  const refreshRanking = async (keywordId: string) => {
    if (!domainId) {
      throw new Error('No domain selected');
    }
    
    try {
      const rankings = await ranking.refreshRanking(keywordId, domainId);
      
      const { error: historyError } = await supabase
        .from('ranking_history')
        .insert(
          rankings.map(r => ({
            user_id: userId,
            domain_id: domainId,
            keyword_id: keywordId,
            position: r.position,
            target_url: r.targetUrl,
            serp_url: r.serpUrl
          }))
        );

      if (historyError) throw historyError;

      const { error: keywordError } = await supabase
        .from('keywords')
        .update({ 
          last_checked: new Date().toISOString()
        })
        .eq('id', keywordId);

      if (keywordError) throw keywordError;
      
      await loadKeywords();
      return rankings;
    } catch (error) {
      console.error('Error refreshing ranking:', error);
      throw error;
    }
  };

  return {
    keywords,
    loading,
    addKeyword,
    deleteKeyword,
    refreshRanking,
    updateKeywordVolume
  };
}