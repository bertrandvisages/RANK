import { RankingError } from '../../../utils/errors';
import type { Ranking } from '../../../types';

export function parseRankingResponse(text: string, defaultDomain: string): Ranking[] {
  if (!text?.trim()) {
    throw new RankingError('Aucune donnée à analyser');
  }

  try {
    const entries = text.split(';')
      .filter(entry => entry.trim())
      .map(entry => parseRankingEntry(entry, defaultDomain));

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

function parseRankingEntry(entry: string, defaultDomain: string): Ranking {
  const [posStr, url = '', serpUrl = ''] = entry.split(',').map(s => s?.trim() || '');
  const position = parseInt(posStr, 10);

  if (isNaN(position) || position < 1 || position > 101) {
    throw new RankingError('Position invalide dans la réponse');
  }

  const targetUrl = formatTargetUrl(url || defaultDomain);
  return { 
    position, 
    targetUrl,
    serpUrl: serpUrl || undefined,
    checkedAt: new Date().toISOString()
  };
}

function formatTargetUrl(url: string): string {
  return url.startsWith('http') ? url : `https://${url}`;
}