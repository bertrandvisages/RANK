import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session on mount
    checkUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    } catch (error) {
      if (error instanceof Error && 
          !(error.message.includes('refresh_token_not_found') || 
            error.message.includes('invalid refresh token'))) {
        console.error('Error checking auth session:', error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, username: string) => {
    try {
      // Vérifier d'abord si l'utilisateur existe déjà
      const { count, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('username', username);

      if (countError) throw countError;
      
      if (count && count > 0) {
        return {
          data: null,
          error: { message: 'Ce nom d\'utilisateur est déjà utilisé' }
        };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return {
            data: null,
            error: { message: 'Cette adresse email est déjà utilisée' }
          };
        }
        throw error;
      }

      if (!data.user) {
        throw new Error('No user data returned');
      }

      // Créer le profil utilisateur
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          username,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        return {
          data: null,
          error: { message: 'Erreur lors de la création du profil' }
        };
      }

      return {
        data,
        error: null,
        emailConfirmation: true
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        data: null,
        error: {
          message: 'Une erreur est survenue lors de l\'inscription'
        }
      };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          persistSession: true
        }
      });

      if (error) {
        let message = 'Une erreur est survenue lors de la connexion';
        
        if (error.message.includes('Invalid login credentials')) {
          message = 'Email ou mot de passe incorrect';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Veuillez confirmer votre email avant de vous connecter';
        }
        
        return { data: null, error: { message } };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        data: null, 
        error: {
          message: 'Une erreur est survenue lors de la connexion'
        }
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    loading,
    login,
    signup,
    logout
  };
}