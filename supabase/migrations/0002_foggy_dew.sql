/*
  # Configuration de l'authentification et des préférences utilisateur

  1. Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key vers auth.users)
      - `domain_id` (text)
      - `keyword_id` (text)
      - `is_favorite` (boolean)
      - `created_at` (timestamp)

  2. Sécurité
    - Enable RLS sur la table user_preferences
    - Ajouter des policies pour permettre aux utilisateurs de gérer leurs préférences
*/

-- Création de la table des préférences utilisateur
CREATE TABLE IF NOT EXISTS user_preferences (
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

-- Policies
CREATE POLICY "Users can view their own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences"
  ON user_preferences
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);