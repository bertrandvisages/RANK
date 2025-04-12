-- Supprimer l'ancienne contrainte
ALTER TABLE domains DROP CONSTRAINT IF EXISTS valid_rank;

-- Ajouter la nouvelle contrainte avec une plage plus large
ALTER TABLE domains
ADD CONSTRAINT valid_rank CHECK (rank IS NULL OR (rank >= 0 AND rank <= 1000000));

-- Mettre à jour la fonction de mise à jour des métriques avec validation
CREATE OR REPLACE FUNCTION update_domain_metrics(
  domain_id uuid,
  new_backlinks integer,
  new_rank integer
)
RETURNS void AS $$
BEGIN
  -- Valider les valeurs avant la mise à jour
  IF new_backlinks < 0 THEN
    RAISE EXCEPTION 'Le nombre de backlinks doit être positif';
  END IF;
  
  IF new_rank < 0 OR new_rank > 1000000 THEN
    RAISE EXCEPTION 'Le rank doit être compris entre 0 et 1000000';
  END IF;

  UPDATE domains
  SET 
    backlinks = new_backlinks,
    rank = new_rank
  WHERE id = domain_id;
END;
$$ LANGUAGE plpgsql;