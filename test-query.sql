-- Requête SQL pour tester si un livre avec le titre "test" existe
-- À exécuter dans l'éditeur SQL de Supabase

-- Option 1: Recherche exacte (case-sensitive)
SELECT * FROM livres WHERE titre = 'test';

-- Option 2: Recherche insensible à la casse (recommandé)
SELECT * FROM livres WHERE LOWER(titre) = LOWER('test');

-- Option 3: Recherche partielle (contient "test")
SELECT * FROM livres WHERE LOWER(titre) LIKE LOWER('%test%');

-- Option 4: Compter le nombre de livres avec ce titre
SELECT COUNT(*) as nombre_livres FROM livres WHERE LOWER(titre) = LOWER('test');

-- Option 5: Voir tous les titres qui contiennent "test"
SELECT id, titre, auteur, date, editeur, genre 
FROM livres 
WHERE LOWER(titre) LIKE LOWER('%test%')
ORDER BY titre;

-- Option 6: Vérifier si la table existe et voir sa structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'livres'
ORDER BY ordinal_position;

-- Option 7: Voir tous les livres (limité à 10 pour éviter trop de résultats)
SELECT id, titre, auteur, date, editeur, genre, created_at
FROM livres
ORDER BY created_at DESC
LIMIT 10;

