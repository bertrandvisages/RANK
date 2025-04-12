/*
  # Ajout des valeurs BL, RK et VOL

  1. Mise à jour des domaines
    - Ajout des valeurs BL et RK pour les domaines existants
  
  2. Mise à jour des mots-clés
    - Ajout des valeurs VOL pour les mots-clés existants
*/

-- Mise à jour des domaines avec les valeurs BL et RK
UPDATE domains
SET 
  backlinks = CASE 
    WHEN url LIKE '%bertrandlirette%' THEN 1200
    WHEN url LIKE '%rankingnow%' THEN 800
    WHEN url LIKE '%volumeking%' THEN 600
    ELSE backlinks
  END,
  rank = CASE 
    WHEN url LIKE '%bertrandlirette%' THEN 45
    WHEN url LIKE '%rankingnow%' THEN 35
    WHEN url LIKE '%volumeking%' THEN 25
    ELSE rank
  END
WHERE url LIKE ANY (ARRAY['%bertrandlirette%', '%rankingnow%', '%volumeking%']);

-- Mise à jour des mots-clés avec les valeurs VOL
UPDATE keywords
SET volume = CASE 
  WHEN term ILIKE '%bertrand%' THEN 1200000
  WHEN term ILIKE '%ranking%' THEN 800000
  WHEN term ILIKE '%volume%' THEN 600000
  ELSE volume
END
WHERE term ILIKE ANY (ARRAY['%bertrand%', '%ranking%', '%volume%']);