# Configuration Keep-Alive pour Supabase

Ce document explique comment configurer un système de keep-alive pour éviter que votre projet Supabase soit mis en pause automatiquement.

## Problème

Supabase met automatiquement en pause les projets inactifs après une période d'inactivité. Pour éviter cela, il faut générer de l'activité régulière sur la base de données.

## Solution

Une route API `/api/keep-alive` a été créée pour faire des requêtes légères à Supabase. Cette route doit être appelée régulièrement via un cron job.

## Configuration du Cron Job

### ⚠️ Limitation importante : Plan Hobby Vercel

**Sur le plan Hobby (gratuit) de Vercel :**
- Les cron jobs ne peuvent être déclenchés qu'**une seule fois par jour**
- L'exécution peut avoir lieu n'importe quand dans la fenêtre horaire (ex: entre 12h00 et 12h59)
- Pour plus de requêtes par jour, vous devez utiliser un service externe (voir Option 2)

### Option 1 : Utiliser Vercel Cron (Une fois par jour uniquement)

Si votre projet est déployé sur Vercel avec le plan Hobby, vous pouvez utiliser Vercel Cron Jobs, mais seulement une fois par jour.

Le fichier `vercel.json` est déjà configuré pour appeler la route une fois par jour à midi :

```json
{
  "crons": [
    {
      "path": "/api/keep-alive",
      "schedule": "0 12 * * *"
    }
  ]
}
```

**Autres options de schedule (une fois par jour) :**
- `0 0 * * *` - Minuit chaque jour
- `0 12 * * *` - Midi chaque jour (actuel)
- `0 18 * * *` - 18h chaque jour

**Note :** Une seule requête par jour peut ne pas suffire pour éviter la mise en pause de Supabase. Il est **fortement recommandé** d'utiliser un service externe (Option 2) pour avoir plusieurs requêtes par jour.

### Option 2 : Utiliser un service externe (Recommandé pour plusieurs requêtes par jour)

Si vous n'êtes pas sur Vercel ou préférez un service externe :

#### Avec cron-job.org (Gratuit - Recommandé)

1. Allez sur [https://cron-job.org](https://cron-job.org)
2. Créez un compte gratuit
3. Créez un nouveau cron job :
   - **URL** : `https://votre-domaine.com/api/keep-alive`
   - **Schedule** : Toutes les 4-6 heures (recommandé : `0 */4 * * *`)
   - **Méthode** : GET
   - **Timeout** : 30 secondes
4. Activez le cron job

**Avantages :**
- Gratuit
- Permet plusieurs requêtes par jour
- Plus fiable que le plan Hobby de Vercel

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
- **Minimum** : Une fois par jour (si vous utilisez uniquement Vercel Hobby)
- **Recommandé** : Toutes les 4-6 heures (nécessite un service externe)
- **Idéal** : Toutes les 2-3 heures (nécessite un service externe)

**Important :** Si vous utilisez uniquement le cron job Vercel (plan Hobby), vous n'aurez qu'une seule requête par jour, ce qui peut ne pas suffire. Il est **fortement recommandé** d'utiliser un service externe comme cron-job.org pour avoir plusieurs requêtes par jour et éviter les emails de mise en pause.

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

1. **Si vous utilisez uniquement Vercel Hobby** : Une seule requête par jour n'est probablement pas suffisante. Utilisez un service externe (cron-job.org) pour avoir plusieurs requêtes par jour.
2. Augmentez la fréquence des requêtes (toutes les 2-3 heures au lieu de 6)
3. Vérifiez que les requêtes arrivent bien (logs Supabase)
4. Assurez-vous que le cron job est bien actif

### Erreur 503 sur la route

Cela signifie que Supabase n'est pas configuré. Vérifiez vos variables d'environnement :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

