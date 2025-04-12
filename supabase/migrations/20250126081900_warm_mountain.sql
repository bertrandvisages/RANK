/*
  # Ajout des métriques BL, RK et VOL

  1. Nouvelles colonnes
    - `domains`
      - `backlinks` (integer) : Nombre de backlinks
      - `rank` (integer) : Rang du domaine
    - `keywords`
      - `volume` (integer) : Volume de recherche mensuel

  2. Indexes
    - Index sur les nouvelles colonnes pour optimiser les requêtes
*/

-- Ajout des colonnes pour les métriques des domaines
ALTER TABLE domains
ADD COLUMN IF NOT EXISTS backlinks integer,
ADD COLUMN IF NOT EXISTS rank integer;

-- Ajout de la colonne volume pour les mots-clés
ALTER TABLE keywords
ADD COLUMN IF NOT EXISTS volume integer;

-- Création des indexes pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_domains_backlinks ON domains(backlinks);
CREATE INDEX IF NOT EXISTS idx_domains_rank ON domains(rank);
CREATE INDEX IF NOT EXISTS idx_keywords_volume ON keywords(volume);

-- Ajout de contraintes pour assurer des valeurs valides
ALTER TABLE domains
ADD CONSTRAINT valid_backlinks CHECK (backlinks IS NULL OR backlinks >= 0),
ADD CONSTRAINT valid_rank CHECK (rank IS NULL OR (rank >= 0 AND rank <= 100));

ALTER TABLE keywords
ADD CONSTRAINT valid_volume CHECK (volume IS NULL OR volume >= 0);