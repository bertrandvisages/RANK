import { RankingService } from './ranking/rankingService';
import { supabase } from '../lib/supabase';
import { RankingError } from './errors';

export const checkRanking = async (keywordId: string, domainId: string) => {
  try {
    // Récupérer la session courante
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      throw new RankingError('Erreur lors de la récupération de la session');
    }

    if (!session?.user?.email) {
      throw new RankingError('Utilisateur non connecté');
    }

    // Récupérer le mot-clé et le domaine
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

    // Appeler le service de ranking avec les données récupérées
    return await RankingService.checkRanking(
      keywordData.term,
      keywordData.domains.url,
      session.user.email
    );
  } catch (error) {
    console.error('Error in checkRanking:', error);
    if (error instanceof RankingError) {
      throw error;
    }
    throw new RankingError('Erreur lors de la vérification du classement');
  }
};