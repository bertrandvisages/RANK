import type { RankingResponse } from './types';
import { RankingError } from '../errors';

export function parseRankingResponse(text: string, domain: string): RankingResponse[] {
  if (!text?.trim()) {
    throw new RankingError('Aucune donnée à analyser');
  }

  try {
    const entries = text.split(';')
      .filter(entry => entry.trim())
      .map(entry => parseRankingEntry(entry, domain));

    if (entries.length === 0) {
      throw new RankingError('Aucun résultat trouvé');
    }

    return entries;
  } catch (error) {
    if (error instanceof RankingError) {
      throw error;
    }
    throw new RankingError('Erreur lors de l\'analyse des résultats');
  }
}

function parseRankingEntry(entry: string, defaultDomain: string): RankingResponse {
  // Format attendu: "position,url,serpUrl"
  const [posStr, url = '', serpUrl = ''] = entry.split(',').map(s => s?.trim() || '');
  const position = parseInt(posStr, 10);

  if (isNaN(position) || position < 1 || position > 101) {
    throw new RankingError('Position invalide dans la réponse');
  }

  const targetUrl = formatTargetUrl(url || defaultDomain);
  return { 
    position, 
    targetUrl,
    serpUrl: serpUrl || undefined // Ajouter l'URL SERP si elle existe
  };
}

function formatTargetUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`;
}