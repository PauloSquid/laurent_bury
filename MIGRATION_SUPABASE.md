# Migration vers Supabase

Ce document explique comment migrer de `livres.json` vers Supabase.

## Étapes de configuration

### 1. Créer un projet Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et votre clé anonyme (anon key)

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec :

```env
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
```

Vous pouvez trouver ces valeurs dans votre projet Supabase :
- Settings → API → Project URL
- Settings → API → anon/public key

### 3. Créer la table dans Supabase

1. Allez dans votre projet Supabase
2. Ouvrez l'éditeur SQL (SQL Editor)
3. Exécutez le script `supabase-schema.sql` qui se trouve à la racine du projet

Ce script va :
- Créer la table `livres` avec tous les champs nécessaires
- Créer des index pour améliorer les performances
- Configurer Row Level Security (RLS) pour permettre l'accès public
- Créer un trigger pour mettre à jour automatiquement `updated_at`

### 4. Migrer les données existantes

#### Option A : Utiliser le script de migration (recommandé)

1. Installez les dépendances nécessaires :
```bash
npm install --save-dev dotenv tsx
```

2. Exécutez le script de migration :
```bash
npx tsx scripts/migrate-livres-to-supabase.ts
```

#### Option B : Migration manuelle via l'interface Supabase

1. Allez dans Table Editor → livres
2. Cliquez sur "Insert" → "Insert row"
3. Ajoutez les livres un par un, ou utilisez l'import CSV si vous convertissez `livres.json` en CSV

#### Option C : Utiliser l'API admin

Une fois Supabase configuré, vous pouvez utiliser l'interface admin (`/admin`) pour ajouter les livres manuellement.

### 5. Vérifier la migration

1. Démarrez le serveur de développement :
```bash
npm run dev
```

2. Visitez `/admin` et vérifiez que les livres s'affichent correctement
3. Visitez `/traduction` et vérifiez que les livres s'affichent correctement

## Structure de la base de données

La table `livres` contient les champs suivants :

- `id` (UUID, Primary Key) - Généré automatiquement
- `auteur` (TEXT, nullable)
- `titre` (TEXT, nullable)
- `date` (TEXT, nullable)
- `editeur` (TEXT, nullable)
- `genre` (TEXT, nullable)
- `info_supplementaires` (TEXT, nullable)
- `image_url` (TEXT, nullable)
- `priorite` (INTEGER, nullable) — utilisé pour ordonner les ouvrages (1 = plus haute priorité)
- `created_at` (TIMESTAMP) - Généré automatiquement
- `updated_at` (TIMESTAMP) - Mis à jour automatiquement

## Sécurité

Par défaut, les politiques RLS permettent :
- Lecture publique (SELECT)
- Insertion publique (INSERT)
- Mise à jour publique (UPDATE)
- Suppression publique (DELETE)

**⚠️ Important :** Pour un environnement de production, vous devriez restreindre ces politiques pour n'autoriser que la lecture publique et restreindre les modifications à des utilisateurs authentifiés.

## Changements apportés

### API Routes

- `GET /api/livres` - Récupère tous les livres (sans ID par défaut)
- `GET /api/livres?withIds=true` - Récupère tous les livres avec leurs IDs (pour l'admin)
- `POST /api/livres` - Crée un nouveau livre
- `PUT /api/livres` - Met à jour tous les livres (pour compatibilité) ou un livre spécifique avec ID
- `PUT /api/livres/[id]` - Met à jour un livre spécifique
- `DELETE /api/livres/[id]` - Supprime un livre spécifique

### Pages

- `app/traduction/page.tsx` - Utilise maintenant l'API au lieu d'importer directement `livres.json`
- `app/dernieres-parutions/page.tsx` - Utilise maintenant l'API au lieu d'importer directement `livres.json`
- `app/admin/page.tsx` - Utilise maintenant les IDs au lieu des indices pour les opérations CRUD
- Les listes côté site appliquent un tri par `priorite` (valeurs faibles en premier) puis par ordre alphabétique lorsque la priorité est absente

## Dépannage

### Erreur : "Missing Supabase environment variables"

Vérifiez que votre fichier `.env.local` existe et contient les bonnes variables.

### Erreur : "relation 'livres' does not exist"

Vous n'avez pas exécuté le script SQL. Allez dans Supabase → SQL Editor et exécutez `supabase-schema.sql`.

### Les livres ne s'affichent pas

1. Vérifiez que les données ont bien été migrées dans Supabase
2. Vérifiez les logs du serveur pour voir les erreurs
3. Vérifiez que les politiques RLS sont correctement configurées

