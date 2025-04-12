/*
  # Ajout des fonctions de mise à jour des métriques

  1. Mise à jour des domaines
    - Fonction pour mettre à jour BL et RK
  
  2. Mise à jour des mots-clés
    - Fonction pour mettre à jour VOL
*/

-- Fonction pour mettre à jour BL et RK d'un domaine
CREATE OR REPLACE FUNCTION update_domain_metrics(
  domain_id uuid,
  new_backlinks integer,
  new_rank integer
)
RETURNS void AS $$
BEGIN
  UPDATE domains
  SET 
    backlinks = new_backlinks,
    rank = new_rank
  WHERE id = domain_id;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour mettre à jour VOL d'un mot-clé
CREATE OR REPLACE FUNCTION update_keyword_volume(
  keyword_id uuid,
  new_volume integer
)
RETURNS void AS $$
BEGIN
  UPDATE keywords
  SET volume = new_volume
  WHERE id = keyword_id;
END;
$$ LANGUAGE plpgsql;