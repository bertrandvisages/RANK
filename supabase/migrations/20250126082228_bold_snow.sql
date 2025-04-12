/*
  # Ajout des valeurs BL, RK et VOL

  1. Mise à jour des données
    - Ajout des valeurs BL et RK pour les domaines
    - Ajout des valeurs VOL pour les mots-clés
*/

-- Mise à jour des domaines avec les valeurs BL et RK
UPDATE domains
SET backlinks = 
  CASE url
    WHEN 'bertrandlirette.fr' THEN 1200
    WHEN 'rankingking.fr' THEN 800
    WHEN 'volumeking.fr' THEN 600
    ELSE backlinks
  END,
rank = 
  CASE url
    WHEN 'bertrandlirette.fr' THEN 45
    WHEN 'rankingking.fr' THEN 35
    WHEN 'volumeking.fr' THEN 25
    ELSE rank
  END
WHERE url IN ('bertrandlirette.fr', 'rankingking.fr', 'volumeking.fr');

-- Mise à jour des mots-clés avec les valeurs VOL
UPDATE keywords
SET volume = 
  CASE term
    WHEN 'bertrand lirette' THEN 1200000
    WHEN 'ranking king' THEN 800000
    WHEN 'volume king' THEN 600000
    ELSE volume
  END
WHERE term IN ('bertrand lirette', 'ranking king', 'volume king');