/*
  # Ajout du stockage de l'état de dépliage des mots-clés

  1. Nouvelle Table
    - `keyword_expansions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, référence vers auth.users)
      - `keyword_id` (uuid, référence vers keywords)
      - `is_expanded` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Sécurité
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create keyword_expansions table
CREATE TABLE keyword_expansions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  keyword_id uuid REFERENCES keywords(id) ON DELETE CASCADE,
  is_expanded boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, keyword_id)
);

-- Enable RLS
ALTER TABLE keyword_expansions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own keyword expansions"
  ON keyword_expansions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own keyword expansions"
  ON keyword_expansions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own keyword expansions"
  ON keyword_expansions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own keyword expansions"
  ON keyword_expansions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_keyword_expansions_user_id ON keyword_expansions(user_id);
CREATE INDEX idx_keyword_expansions_keyword_id ON keyword_expansions(keyword_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_keyword_expansions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at
CREATE TRIGGER update_keyword_expansions_updated_at
  BEFORE UPDATE ON keyword_expansions
  FOR EACH ROW
  EXECUTE FUNCTION update_keyword_expansions_updated_at();