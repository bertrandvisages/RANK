import type { User } from '@supabase/supabase-js';

export const TEST_USER: User = {
  id: '00000000-0000-0000-0000-000000000000', // UUID valide
  email: 'test@example.com',
  created_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated'
} as User;