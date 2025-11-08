# Configuration Vercel pour Supabase

## Problème courant : Supabase fonctionne en local mais pas en production

Ce problème est généralement dû aux variables d'environnement qui ne sont pas configurées dans Vercel.

## Solution : Configurer les variables d'environnement dans Vercel

### Étape 1 : Obtenir vos credentials Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **API**
4. Notez :
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (la clé publique)

### Étape 2 : Ajouter les variables dans Vercel

1. Allez sur [https://vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**
4. Ajoutez les deux variables suivantes :

#### Variable 1 :
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Votre Project URL (ex: `https://xxxxx.supabase.co`)
- **Environments**: Production, Preview, Development (cochez toutes)

#### Variable 2 :
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: Votre anon public key
- **Environments**: Production, Preview, Development (cochez toutes)

### Étape 3 : Redéployer

Après avoir ajouté les variables :
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Sélectionnez **Redeploy**
4. Ou poussez un nouveau commit pour déclencher un nouveau déploiement

## Vérification

Pour vérifier que les variables sont bien configurées :

1. Allez dans votre déploiement Vercel
2. Ouvrez les **Logs** du build
3. Vérifiez qu'il n'y a pas d'erreurs liées à Supabase
4. Testez votre application en production

## Dépannage

### Erreur : "Missing Supabase environment variables"

**Cause** : Les variables ne sont pas définies dans Vercel

**Solution** : Suivez l'étape 2 ci-dessus

### Erreur : "relation 'livres' does not exist"

**Cause** : La table n'existe pas dans Supabase

**Solution** : 
1. Allez dans Supabase → SQL Editor
2. Exécutez le script `supabase-schema.sql`

### Erreur : "new row violates row-level security policy"

**Cause** : Les politiques RLS bloquent l'accès

**Solution** : Vérifiez que les politiques dans `supabase-schema.sql` sont bien appliquées

### L'application fonctionne mais utilise le fallback JSON

**Cause** : Les variables sont peut-être mal nommées ou mal configurées

**Solution** :
1. Vérifiez que les noms des variables sont exactement :
   - `NEXT_PUBLIC_SUPABASE_URL` (avec NEXT_PUBLIC_ au début)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (avec NEXT_PUBLIC_ au début)
2. Vérifiez qu'elles sont activées pour **Production**
3. Redéployez après avoir corrigé

## Test rapide

Pour tester rapidement si les variables sont bien configurées, vous pouvez ajouter temporairement ce code dans une page :

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configuré' : '❌ Manquant')
console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configuré' : '❌ Manquant')
```

⚠️ **Ne commitez jamais ce code en production**, c'est juste pour le debug.

## Notes importantes

- Les variables qui commencent par `NEXT_PUBLIC_` sont exposées au client
- C'est normal et nécessaire pour Supabase côté client
- L'anon key est conçue pour être publique, mais les politiques RLS protègent vos données
- Ne partagez jamais votre `service_role` key (celle-ci doit rester secrète)

