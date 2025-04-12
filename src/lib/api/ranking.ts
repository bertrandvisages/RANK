import type { Ranking } from '../../types';
import { RankingError } from '../../utils/errors';
import { supabase } from '../supabase';

const WEBHOOK_URL = 'https://hook.eu2.make.com/eiopg2ll2kacohrxsuzqbdv1484xb669';

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

    // Call ranking service
    const response = await fetch(`${WEBHOOK_URL}?_t=${Date.now()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: JSON.stringify({
        keyword: keywordData.term.trim(),
        domain: keywordData.domains.url.trim(),
        username: session.user.email.trim()
      })
    });

    if (!response.ok) {
      throw new RankingError(`Erreur serveur: ${response.status}`);
    }

    const text = await response.text();
    if (!text?.trim()) {
      throw new RankingError('Aucune donnée reçue du serveur');
    }

    return parseRankingResponse(text, keywordData.domains.url);
  } catch (error) {
    console.error('Error in checkRanking:', error);
    if (error instanceof RankingError) {
      throw error;
    }
    throw new RankingError('Erreur lors de la vérification du classement');
  }
}

function parseRankingResponse(text: string, defaultDomain: string): Ranking[] {
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