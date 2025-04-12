/*
  # Create favorites tables and policies

  1. New Tables
    - `domains`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `url` (text)
      - `is_favorite` (boolean)
      - `created_at` (timestamptz)

    - `keywords`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `domain_id` (uuid, references domains)
      - `term` (text)
      - `is_favorite` (boolean)
      - `created_at` (timestamptz)
      - `last_checked` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
*/

-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  name text NOT NULL,
  url text NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, url)
);

-- Create keywords table
CREATE TABLE IF NOT EXISTS keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  term text NOT NULL,
  is_favorite boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_checked timestamptz,
  UNIQUE(user_id, domain_id, term)
);

-- Enable RLS
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

-- Domains policies
CREATE POLICY "Users can read their own domains"
  ON domains FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own domains"
  ON domains FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own domains"
  ON domains FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own domains"
  ON domains FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Keywords policies
CREATE POLICY "Users can read their own keywords"
  ON keywords FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own keywords"
  ON keywords FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keywords"
  ON keywords FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keywords"
  ON keywords FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_domains_user_id ON domains(user_id);
CREATE INDEX idx_keywords_user_id ON keywords(user_id);
CREATE INDEX idx_keywords_domain_id ON keywords(domain_id);