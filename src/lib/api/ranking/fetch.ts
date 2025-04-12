import { RankingError } from '../../../utils/errors';
import type { RankingRequest } from './types';

const WEBHOOK_URL = 'https://hook.eu2.make.com/eiopg2ll2kacohrxsuzqbdv1484xb669';

export async function fetchRanking(request: RankingRequest): Promise<string> {
  try {
    const response = await fetch(`${WEBHOOK_URL}?_t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        keyword: request.keyword.trim(),
        domain: request.domain.trim(),
        username: request.username.trim()
      })
    });

    if (!response.ok) {
      throw new RankingError(`Erreur serveur: ${response.status}`);
    }

    const text = await response.text();
    if (!text?.trim()) {
      throw new RankingError('Aucune donnée reçue du serveur');
    }

    return text;
  } catch (error) {
    if (error instanceof RankingError) {
      throw error;
    }
    throw new RankingError('Erreur lors de la vérification du classement');
  }
}