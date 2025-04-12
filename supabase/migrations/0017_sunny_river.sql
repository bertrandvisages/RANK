/*
  # Correction des contraintes de clé étrangère

  1. Modifications
    - Ajout de ON DELETE CASCADE pour la contrainte domain_id
    - Ajout de ON DELETE CASCADE pour la contrainte keyword_id

  2. Raison
    - Permet la suppression en cascade des historiques de classement lors de la suppression d'un domaine ou d'un mot-clé
    - Évite les erreurs de contrainte de clé étrangère
*/

-- Drop existing foreign key constraints
ALTER TABLE ranking_history
DROP CONSTRAINT IF EXISTS ranking_history_domain_id_fkey,
DROP CONSTRAINT IF EXISTS ranking_history_keyword_id_fkey;

-- Re-create constraints with ON DELETE CASCADE
ALTER TABLE ranking_history
ADD CONSTRAINT ranking_history_domain_id_fkey
FOREIGN KEY (domain_id)
REFERENCES domains(id)
ON DELETE CASCADE;

ALTER TABLE ranking_history
ADD CONSTRAINT ranking_history_keyword_id_fkey
FOREIGN KEY (keyword_id)
REFERENCES keywords(id)
ON DELETE CASCADE;