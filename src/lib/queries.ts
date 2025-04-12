import { supabase } from './supabase';

export const userPreferencesQueries = {
  getDomains: (userId: string) => 
    supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .is('keyword_id', null),

  getKeywords: (userId: string, domainId: string) =>
    supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .eq('domain_id', domainId)
      .not('keyword_id', 'is', null),

  addDomain: (userId: string, domainId: string) =>
    supabase
      .from('user_preferences')
      .insert({
        user_id: userId,
        domain_id: domainId,
        is_favorite: false
      }),

  deleteDomain: (id: string) =>
    supabase
      .from('user_preferences')
      .delete()
      .eq('id', id),

  deleteKeyword: (id: string) =>
    supabase
      .from('user_preferences')
      .delete()
      .eq('id', id),

  toggleFavorite: (id: string, isFavorite: boolean) =>
    supabase
      .from('user_preferences')
      .update({ is_favorite: !isFavorite })
      .eq('id', id)
};