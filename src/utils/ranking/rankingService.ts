import type { Ranking } from '../../types';
import type { RankingRequest } from './types';
import { RankingError } from '../errors';
import { validateRankingRequest } from './validation';
import { fetchRanking } from './api';
import { parseRankingResponse } from './parser';

export class RankingService {
  static async checkRanking(keyword: string, domain: string, username: string): Promise<Ranking[]> {
    try {
      const request: RankingRequest = { keyword, domain, username };
      validateRankingRequest(request);

      const response = await fetchRanking(request);
      return parseRankingResponse(response, domain);
    } catch (error) {
      console.error('Error in checkRanking:', error);
      if (error instanceof RankingError) {
        throw error;
      }
      throw new RankingError('Erreur lors de la vérification du classement');
    }
  }
}