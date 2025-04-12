/*
  # Configuration initiale de Supabase
  
  1. Tables
    - Création de la table user_preferences
    
  2. Sécurité
    - Activation de RLS
    - Configuration des politiques d'accès
*/

-- Suppression de la table si elle existe
DROP TABLE IF EXISTS user_preferences;

-- Création de la table user_preferences
CREATE TABLE user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  domain_id text NOT NULL,
  keyword_id text,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, domain_id, keyword_id)
);

-- Activation de RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Création des politiques
CREATE POLICY "Users can read their own preferences"
  ON user_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own preferences"
  ON user_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Index pour améliorer les performances
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_domain_id ON user_preferences(domain_id);