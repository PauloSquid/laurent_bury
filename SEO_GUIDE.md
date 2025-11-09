# Guide SEO - Laurent Bury Traducteur

Ce document explique la stratégie SEO mise en place pour le site.

## ✅ Éléments SEO implémentés

### 1. Métadonnées optimisées
- **Titres** : Structure avec template pour toutes les pages
- **Descriptions** : Descriptions uniques et optimisées pour chaque page
- **Keywords** : Mots-clés pertinents pour chaque page
- **Open Graph** : Métadonnées pour le partage sur les réseaux sociaux
- **Twitter Cards** : Métadonnées optimisées pour Twitter

### 2. Structured Data (Schema.org)
- **Person Schema** : Informations sur Laurent Bury
- **WebSite Schema** : Informations sur le site
- Format JSON-LD pour une meilleure compréhension par les moteurs de recherche

### 3. Sitemap XML
- Généré automatiquement par Next.js
- Accessible à `/sitemap.xml`
- Inclut toutes les pages importantes avec priorités et fréquences de mise à jour

### 4. Robots.txt
- Généré automatiquement par Next.js
- Accessible à `/robots.txt`
- Bloque l'indexation de `/admin` et `/api/`
- Référence le sitemap

### 5. Optimisations techniques
- **Canonical URLs** : Évite le contenu dupliqué
- **Langue** : `lang="fr"` défini sur le HTML
- **Mobile-friendly** : Design responsive
- **Performance** : Optimisations Next.js

## 📝 Configuration requise

### Variable d'environnement

Ajoutez dans votre `.env.local` (et dans Vercel) :

```env
NEXT_PUBLIC_SITE_URL=https://votre-domaine.com
```

Remplacez `https://votre-domaine.com` par votre URL de production.

### Image Open Graph

Créez une image Open Graph (`public/og-image.jpg`) :
- Dimensions : 1200x630 pixels
- Format : JPG ou PNG
- Contenu : Logo/nom + description du site
- Taille : < 1MB

## 🔍 Vérifications SEO

### Outils de test
1. **Google Search Console** : Ajoutez votre site
2. **Google Rich Results Test** : Testez les structured data
   - https://search.google.com/test/rich-results
3. **Facebook Sharing Debugger** : Testez les Open Graph
   - https://developers.facebook.com/tools/debug/
4. **Twitter Card Validator** : Testez les Twitter Cards
   - https://cards-dev.twitter.com/validator

### Checklist
- [ ] Variable `NEXT_PUBLIC_SITE_URL` configurée
- [ ] Image Open Graph créée (`public/og-image.jpg`)
- [ ] Site soumis à Google Search Console
- [ ] Sitemap soumis à Google Search Console
- [ ] Structured data testés et validés
- [ ] Open Graph testés sur Facebook
- [ ] Twitter Cards testées
- [ ] Site testé sur mobile (Google Mobile-Friendly Test)

## 📊 Améliorations futures possibles

### 1. Structured Data supplémentaires
- **Book Schema** : Pour chaque livre traduit
- **BreadcrumbList** : Pour la navigation
- **Organization Schema** : Si vous avez une entreprise

### 2. Métadonnées dynamiques
- Métadonnées spécifiques pour chaque livre (si pages dédiées)
- Métadonnées basées sur les filtres de recherche

### 3. Performance
- Lazy loading des images
- Optimisation des images (WebP, AVIF)
- Compression des assets

### 4. Contenu
- Articles de blog sur la traduction
- FAQ sur la traduction
- Témoignages clients

## 🎯 Mots-clés ciblés

### Principaux
- traducteur professionnel
- traduction littéraire
- traducteur français
- Laurent Bury

### Secondaires
- traduction classiques
- traduction romans
- traduction philosophie
- traduction histoire
- traducteur expérimenté

## 📈 Suivi

### Métriques à surveiller
- Position dans Google pour les mots-clés ciblés
- Trafic organique (Google Analytics)
- Taux de rebond
- Temps sur site
- Pages vues par session

### Actions régulières
- Mettre à jour le sitemap si nouvelles pages
- Ajouter du contenu régulièrement
- Surveiller les erreurs dans Google Search Console
- Optimiser les pages les moins performantes

## 🔗 Liens utiles

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)
- [Next.js SEO](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Open Graph Protocol](https://ogp.me/)

