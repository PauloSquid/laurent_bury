/**
 * Script de migration pour importer les données de livres.json dans Supabase
 * 
 * Usage:
 * 1. Créez un fichier .env.local avec vos credentials Supabase
 * 2. Exécutez: npx tsx scripts/migrate-livres-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFile } from 'fs/promises'
import { join } from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes!')
  console.error('Assurez-vous d\'avoir créé un fichier .env.local avec:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=votre_url')
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrate() {
  try {
    console.log('📖 Lecture du fichier livres.json...')
    const livresFile = join(process.cwd(), 'livres.json')
    const fileContents = await readFile(livresFile, 'utf8')
    const livres = JSON.parse(fileContents)

    if (!Array.isArray(livres)) {
      throw new Error('Le fichier livres.json doit contenir un tableau')
    }

    console.log(`✅ ${livres.length} livres trouvés dans le fichier`)

    // Vérifier si la table existe et est vide
    const { data: existingLivres, error: checkError } = await supabase
      .from('livres')
      .select('id')
      .limit(1)

    if (checkError) {
      console.error('❌ Erreur lors de la vérification de la table:', checkError)
      console.error('Assurez-vous d\'avoir exécuté le script SQL dans Supabase (supabase-schema.sql)')
      process.exit(1)
    }

    if (existingLivres && existingLivres.length > 0) {
      console.log('⚠️  La table contient déjà des données.')
      console.log('Voulez-vous continuer? Cela va ajouter les livres en doublon.')
      // Pour un script automatique, on peut continuer ou demander confirmation
    }

    console.log('📤 Importation des livres dans Supabase...')

    // Préparer les données pour l'insertion
    const livresToInsert = livres.map(livre => ({
      auteur: livre.auteur || null,
      titre: livre.titre || null,
      date: livre.date || null,
      editeur: livre.editeur || null,
      genre: livre.genre || null,
      info_supplementaires: livre.info_supplementaires || null,
      image_url: livre.image_url || null
    }))

    // Insérer par lots de 100 pour éviter les limites
    const batchSize = 100
    let inserted = 0
    let errors = 0

    for (let i = 0; i < livresToInsert.length; i += batchSize) {
      const batch = livresToInsert.slice(i, i + batchSize)
      const { error } = await supabase
        .from('livres')
        .insert(batch)

      if (error) {
        console.error(`❌ Erreur lors de l'insertion du lot ${Math.floor(i / batchSize) + 1}:`, error)
        errors += batch.length
      } else {
        inserted += batch.length
        console.log(`✅ Lot ${Math.floor(i / batchSize) + 1} inséré (${inserted}/${livresToInsert.length})`)
      }
    }

    console.log('\n✨ Migration terminée!')
    console.log(`✅ ${inserted} livres importés avec succès`)
    if (errors > 0) {
      console.log(`⚠️  ${errors} livres n'ont pas pu être importés`)
    }
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error)
    process.exit(1)
  }
}

migrate()

