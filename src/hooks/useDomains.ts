import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Domain } from '../types';

export function useDomains(userId: string) {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      loadDomains();
    }
  }, [userId]);

  const loadDomains = async () => {
    try {
      setError(null);
      setLoading(true);

      const { data, error: supabaseError } = await supabase
        .from('domains')
        .select('*, backlinks, rank')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        setDomains([]);
        return;
      }

      setDomains(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors du chargement des domaines';
      setError(message);
      console.error('Error loading domains:', err);
    } finally {
      setLoading(false);
    }
  };

  const addDomain = async (name: string, url: string) => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('domains')
        .insert({
          user_id: userId,
          name,
          url
        })
        .select()
        .single();

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (!data) {
        throw new Error('Aucune donnée retournée après l\'insertion');
      }

      setDomains(prev => [data, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de l\'ajout du domaine';
      setError(message);
      console.error('Error adding domain:', err);
      throw err;
    }
  };

  const deleteDomain = async (domainId: string) => {
    try {
      setError(null);
      const { error: supabaseError } = await supabase
        .from('domains')
        .delete()
        .eq('id', domainId);

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setDomains(prev => prev.filter(domain => domain.id !== domainId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression du domaine';
      setError(message);
      console.error('Error deleting domain:', err);
      throw err;
    }
  };

  return {
    domains,
    loading,
    error,
    retry: loadDomains,
    addDomain,
    deleteDomain
  };
}