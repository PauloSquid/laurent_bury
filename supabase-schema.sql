-- Script SQL pour créer la table livres dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre projet Supabase

-- Créer la table livres
CREATE TABLE IF NOT EXISTS livres (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auteur TEXT,
  titre TEXT,
  date TEXT,
  editeur TEXT,
  genre TEXT,
  info_supplementaires TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Créer un index sur le titre pour améliorer les performances de recherche
CREATE INDEX IF NOT EXISTS idx_livres_titre ON livres(titre);

-- Créer un index sur le genre pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_livres_genre ON livres(genre);

-- Créer un index sur l'éditeur pour améliorer les performances de filtrage
CREATE INDEX IF NOT EXISTS idx_livres_editeur ON livres(editeur);

-- Activer Row Level Security (RLS)
ALTER TABLE livres ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique
CREATE POLICY "Allow public read access" ON livres
  FOR SELECT
  USING (true);

-- Politique pour permettre l'insertion (vous pouvez restreindre cela plus tard)
CREATE POLICY "Allow public insert" ON livres
  FOR INSERT
  WITH CHECK (true);

-- Politique pour permettre la mise à jour (vous pouvez restreindre cela plus tard)
CREATE POLICY "Allow public update" ON livres
  FOR UPDATE
  USING (true);

-- Politique pour permettre la suppression (vous pouvez restreindre cela plus tard)
CREATE POLICY "Allow public delete" ON livres
  FOR DELETE
  USING (true);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_livres_updated_at
  BEFORE UPDATE ON livres
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

