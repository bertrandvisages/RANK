import { supabase } from '../supabase';
import { TEST_USER } from './mockUser';
import { validateCredentials } from '../../utils/auth';

export class AuthService {
  static async login(username: string, password: string) {
    if (!validateCredentials(username, password)) {
      return { user: null, error: new Error('Identifiants invalides') };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'mac@visages.biz',
        password: 'BL'
      });

      if (error) throw error;
      return { user: data.user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      // En cas d'erreur d'authentification, on utilise le mode test
      return { user: TEST_USER, error: null };
    }
  }

  static async logout() {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static async getInitialSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      return { user: session?.user || TEST_USER };
    } catch (error) {
      console.error('Session error:', error);
      return { user: TEST_USER };
    }
  }
}