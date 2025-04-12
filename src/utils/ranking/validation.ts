import { RankingError } from '../errors';
import type { RankingRequest } from './types';

export function validateRankingRequest(request: RankingRequest): void {
  if (!request.keyword?.trim()) {
    throw new RankingError('Le mot-clé est requis');
  }

  if (!request.domain?.trim()) {
    throw new RankingError('Le domaine est requis');
  }

  if (!request.username?.trim()) {
    throw new RankingError('Le nom d\'utilisateur est requis');
  }
}