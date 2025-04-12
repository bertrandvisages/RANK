/*
  # Add ranking history tracking

  1. New Tables
    - `ranking_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `domain_id` (uuid, references domains)
      - `keyword_id` (uuid, references keywords)
      - `position` (integer)
      - `target_url` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `ranking_history` table
    - Add policies for authenticated users to manage their history
*/

CREATE TABLE IF NOT EXISTS ranking_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  domain_id uuid REFERENCES domains(id) NOT NULL,
  keyword_id uuid REFERENCES keywords(id) NOT NULL,
  position integer NOT NULL,
  target_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE ranking_history ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own ranking history"
  ON ranking_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ranking history"
  ON ranking_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_ranking_history_user_id ON ranking_history(user_id);
CREATE INDEX idx_ranking_history_domain_id ON ranking_history(domain_id);
CREATE INDEX idx_ranking_history_keyword_id ON ranking_history(keyword_id);
CREATE INDEX idx_ranking_history_created_at ON ranking_history(created_at);