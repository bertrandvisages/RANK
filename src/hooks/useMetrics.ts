import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface DomainMetrics {
  backlinks: number;
  rank: number;
}

const METRICS_WEBHOOKS = {
  domain: 'https://hook.eu2.make.com/jxua7y3sy6yjnhvth7y47ob6jdca4q1o',
  keyword: 'https://hook.eu2.make.com/e41dxpsll46kkgb9nc66py78uhxtqwpr'
};

export function useMetrics() {
  const [loadingDomains, setLoadingDomains] = useState<Set<string>>(new Set());
  const [loadingKeywords, setLoadingKeywords] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateDomainMetrics = async (domainId: string, metrics: DomainMetrics) => {
    try {
      const { data, error } = await supabase
        .from('domains')
        .update({
          backlinks: metrics.backlinks,
          rank: metrics.rank
        })
        .eq('id', domainId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating domain metrics:', error);
      throw error;
    }
  };

  const updateKeywordVolume = async (keywordId: string, volume: number) => {
    try {
      const { data, error } = await supabase
        .from('keywords')
        .update({ volume })
        .eq('id', keywordId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating keyword volume:', error);
      throw error;
    }
  };

  const checkDomainMetrics = async (domainId: string, url: string) => {
    setLoadingDomains(prev => new Set(prev).add(domainId));
    setErrors(prev => ({ ...prev, [domainId]: '' }));

    try {
      const response = await fetch(METRICS_WEBHOOKS.domain, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: url })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'appel au webhook');

      const text = await response.text();
      if (!text?.trim()) {
        throw new Error('Aucune donnée reçue');
      }

      const rankMatch = text.match(/<rank>(\d+)<\/rank>/);
      const backlinkMatch = text.match(/<backlink>(\d+)<\/backlink>/);

      const metrics = {
        rank: rankMatch ? parseInt(rankMatch[1], 10) : 0,
        backlinks: backlinkMatch ? parseInt(backlinkMatch[1], 10) : 0
      };

      // Mettre à jour la base de données et retourner les données mises à jour
      const updatedDomain = await updateDomainMetrics(domainId, metrics);
      return updatedDomain;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setErrors(prev => ({ ...prev, [domainId]: message }));
      throw error;
    } finally {
      setLoadingDomains(prev => {
        const next = new Set(prev);
        next.delete(domainId);
        return next;
      });
    }
  };

  const checkKeywordVolume = async (keywordId: string, term: string) => {
    setLoadingKeywords(prev => new Set(prev).add(keywordId));
    setErrors(prev => ({ ...prev, [keywordId]: '' }));

    try {
      const response = await fetch(METRICS_WEBHOOKS.keyword, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: term })
      });

      if (!response.ok) throw new Error('Erreur lors de l\'appel au webhook');

      const text = await response.text();
      if (!text?.trim()) {
        const updatedKeyword = await updateKeywordVolume(keywordId, 0);
        return updatedKeyword;
      }

      const volume = parseInt(text.trim(), 10);
      if (isNaN(volume)) {
        const updatedKeyword = await updateKeywordVolume(keywordId, 0);
        return updatedKeyword;
      }

      // Mettre à jour la base de données et retourner les données mises à jour
      const updatedKeyword = await updateKeywordVolume(keywordId, volume);
      return updatedKeyword;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      setErrors(prev => ({ ...prev, [keywordId]: message }));
      throw error;
    } finally {
      setLoadingKeywords(prev => {
        const next = new Set(prev);
        next.delete(keywordId);
        return next;
      });
    }
  };

  return {
    loadingDomains,
    loadingKeywords,
    errors,
    checkDomainMetrics,
    checkKeywordVolume
  };
}