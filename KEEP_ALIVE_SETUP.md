# Configuration Keep-Alive pour Supabase

Ce document explique comment configurer un système de keep-alive pour éviter que votre projet Supabase soit mis en pause automatiquement.

## Problème

Supabase met automatiquement en pause les projets inactifs après une période d'inactivité. Pour éviter cela, il faut générer de l'activité régulière sur la base de données.

## Solution

Une route API `/api/keep-alive` a été créée pour faire des requêtes légères à Supabase. Cette route doit être appelée régulièrement via un cron job.

## Configuration du Cron Job

### Option 1 : Utiliser Vercel Cron (Recommandé si déployé sur Vercel)

Si votre projet est déployé sur Vercel, vous pouvez utiliser Vercel Cron Jobs.

1. Créez un fichier `vercel.json` à la racine du projet (ou modifiez-le s'il existe) :

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Cette configuration appelle la route toutes les 6 heures.

**Autres options de fréquence :**
- `0 */4 * * *` - Toutes les 4 heures
- `0 */3 * * *` - Toutes les 3 heures
- `0 */2 * * *` - Toutes les 2 heures
- `0 * * * *` - Toutes les heures
- `*/30 * * * *` - Toutes les 30 minutes

2. Poussez les changements sur votre dépôt Git
3. Vercel détectera automatiquement le fichier `vercel.json` et configurera les cron jobs

### Option 2 : Utiliser un service externe (cron-job.org, EasyCron, etc.)

Si vous n'êtes pas sur Vercel ou préférez un service externe :

#### Avec cron-job.org (Gratuit)

1. Allez sur [https://cron-job.org](https://cron-job.org)
2. Créez un compte gratuit
3. Créez un nouveau cron job :
   - **URL** : `https://votre-domaine.com/api/keep-alive`
   - **Schedule** : Toutes les 6 heures (ou plus fréquemment)
   - **Méthode** : GET
4. Activez le cron job

#### Avec EasyCron (Gratuit)

1. Allez sur [https://www.easycron.com](https://www.easycron.com)
2. Créez un compte gratuit
3. Créez un nouveau cron job :
   - **URL** : `https://votre-domaine.com/api/keep-alive`
   - **Schedule** : `0 */6 * * *` (toutes les 6 heures)
   - **Méthode** : GET
4. Activez le cron job

#### Avec UptimeRobot (Gratuit - 50 monitors)

1. Allez sur [https://uptimerobot.com](https://uptimerobot.com)
2. Créez un compte gratuit
3. Ajoutez un nouveau monitor :
   - **Type** : HTTP(s)
   - **URL** : `https://votre-domaine.com/api/keep-alive`
   - **Interval** : 5 minutes (gratuit) ou 1 minute (payant)
4. Activez le monitor

## Fréquence recommandée

Pour éviter la mise en pause de Supabase, il est recommandé de faire des requêtes :
- **Minimum** : Toutes les 6 heures
- **Recommandé** : Toutes les 3-4 heures
- **Idéal** : Toutes les 2 heures

Plus la fréquence est élevée, moins vous risquez de recevoir des emails de mise en pause.

## Test de la route

Vous pouvez tester la route manuellement en visitant :
- `https://votre-domaine.com/api/keep-alive`

La réponse devrait être :
```json
{
  "success": true,
  "message": "Keep-alive réussi",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "supabaseActive": true
}
```

## Route Health Check

La route `/api/health` a également été améliorée pour tester la connexion Supabase. Vous pouvez l'utiliser pour vérifier que tout fonctionne correctement.

## Coût

Les requêtes de keep-alive sont très légères (un simple SELECT avec LIMIT 1) et n'utilisent pratiquement pas de ressources. Elles ne devraient pas impacter significativement votre quota Supabase.

## Dépannage

### Le cron job ne fonctionne pas

1. Vérifiez que l'URL est correcte
2. Vérifiez que votre site est accessible publiquement
3. Testez la route manuellement dans votre navigateur
4. Vérifiez les logs de votre service de cron

### Supabase se met toujours en pause

1. Augmentez la fréquence des requêtes (toutes les 2-3 heures au lieu de 6)
2. Vérifiez que les requêtes arrivent bien (logs Supabase)
3. Assurez-vous que le cron job est bien actif

### Erreur 503 sur la route

Cela signifie que Supabase n'est pas configuré. Vérifiez vos variables d'environnement :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

