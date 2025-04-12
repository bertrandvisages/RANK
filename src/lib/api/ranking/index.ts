import { RankingError } from '../../../utils/errors';
import { supabase } from '../../supabase';
import { fetchRanking } from './fetch';
import { parseRankingResponse } from './parser';
import type { Ranking } from '../../../types';
import type { RankingRequest } from './types';

export async function checkRanking(keywordId: string, domainId: string): Promise<Ranking[]> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new RankingError('Erreur lors de la récupération de la session');
    }

    if (!session?.user?.email) {
      throw new RankingError('Utilisateur non connecté');
    }

    // Get keyword and domain data
    const { data: keywordData, error: keywordError } = await supabase
      .from('keywords')
      .select(`
        term,
        domains!inner (
          url
        )
      `)
      .eq('id', keywordId)
      .eq('domains.id', domainId)
      .single();

    if (keywordError) {
      console.error('Database error:', keywordError);
      throw new RankingError('Erreur lors de la récupération des données');
    }

    if (!keywordData) {
      throw new RankingError('Mot-clé ou domaine non trouvé');
    }

    const request: RankingRequest = {
      keyword: keywordData.term,
      domain: keywordData.domains.url,
      username: session.user.email
    };

    const response = await fetchRanking(request);
    return parseRankingResponse(response, keywordData.domains.url);
  } catch (error) {
    console.error('Error in checkRanking:', error);
    if (error instanceof RankingError) {
      throw error;
    }
    throw new RankingError('Erreur lors de la vérification du classement');
  }
}

export type { RankingRequest, RankingResponse } from './types';