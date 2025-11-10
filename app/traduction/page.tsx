'use client'

import { useSearchParams } from 'next/navigation'
import { useState, Suspense, useMemo, useEffect } from 'react'

interface Livre {
  auteur: string | null
  titre: string | null
  date: string | null
  editeur: string | null
  genre: string | null
  info_supplementaires: string | null
  image_url: string | null
  priorite: number | null
}

function TraductionContent() {
  const searchParams = useSearchParams()
  const triParam = searchParams.get('tri')
  const triInitial: 'priorite' | 'genre' | 'editeur' | 'date' | 'auteur' =
    triParam === 'genre' || triParam === 'editeur' || triParam === 'date' || triParam === 'priorite' || triParam === 'auteur'
      ? triParam
      : 'priorite'
  const [tri, setTri] = useState<'priorite' | 'genre' | 'editeur' | 'date' | 'auteur'>(triInitial)
  const [recherche, setRecherche] = useState('')
  const [livresData, setLivresData] = useState<Livre[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const normalizePriority = (value: unknown): number | null => {
      if (value === null || value === undefined) return null
      if (typeof value === 'number' && Number.isFinite(value)) return value
      if (typeof value === 'string') {
        const trimmed = value.trim()
        if (!trimmed) return null
        const parsed = Number(trimmed)
        return Number.isFinite(parsed) ? parsed : null
      }
      return null
    }

    const normalizeLivre = (livre: any): Livre => ({
      auteur: livre?.auteur ?? null,
      titre: livre?.titre ?? null,
      date: livre?.date ?? null,
      editeur: livre?.editeur ?? null,
      genre: livre?.genre ?? null,
      info_supplementaires: livre?.info_supplementaires ?? null,
      image_url: livre?.image_url ?? null,
      priorite: normalizePriority(livre?.priorite)
    })

    const loadLivres = async () => {
      try {
        const response = await fetch('/api/livres')
        if (response.ok) {
          const data = await response.json()
          const livresNormalises = Array.isArray(data) ? data.map(normalizeLivre) : []
          setLivresData(livresNormalises)
          setError(null)
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
          setError(errorData.error || 'Erreur lors du chargement des livres')
          console.error('Erreur API:', errorData)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error)
        setError('Impossible de charger les livres. Vérifiez votre connexion et la configuration Supabase.')
      } finally {
        setLoading(false)
      }
    }
    loadLivres()
  }, [])

  // Fonction pour extraire l'année d'une date
  const extraireAnnee = (date: string | null): number | null => {
    if (!date) return null
    const match = date.match(/\b(19|20)\d{2}\b/)
    if (match) {
      return parseInt(match[0], 10)
    }
    return null
  }

  const extraireMois = (date: string | null): number | null => {
    if (!date) return null

    const normalized = date.toLowerCase()
    const sanitized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')

    const moisKeywords: Record<number, string[]> = {
      1: ['janvier', 'jan'],
      2: ['fevrier', 'février', 'feb'],
      3: ['mars', 'mar'],
      4: ['avril', 'avr', 'apr'],
      5: ['mai', 'may'],
      6: ['juin', 'jun'],
      7: ['juillet', 'jul'],
      8: ['aout', 'août', 'aug'],
      9: ['septembre', 'sept', 'sep'],
      10: ['octobre', 'oct'],
      11: ['novembre', 'nov'],
      12: ['decembre', 'décembre', 'dec', 'dez']
    }

    for (const [index, keywords] of Object.entries(moisKeywords)) {
      const monthIndex = parseInt(index, 10)
      for (const keyword of keywords) {
        const keywordNormalized = keyword.toLowerCase()
        const keywordSanitized = keywordNormalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (normalized.includes(keywordNormalized) || sanitized.includes(keywordSanitized)) {
          return monthIndex
        }
      }
    }

    const numericMatch = sanitized.match(/(?:^|\D)(0?[1-9]|1[0-2])(?:\D|$)/)
    if (numericMatch) {
      const numericMonth = parseInt(numericMatch[1], 10)
      if (numericMonth >= 1 && numericMonth <= 12) {
        return numericMonth
      }
    }

    return null
  }

  // Fonction de recherche
  const correspondRecherche = (livre: Livre, terme: string): boolean => {
    if (!terme.trim()) return true
    const termeLower = terme.toLowerCase()
    return !!(
      (livre.titre && livre.titre.toLowerCase().includes(termeLower)) ||
      (livre.auteur && livre.auteur.toLowerCase().includes(termeLower)) ||
      (livre.editeur && livre.editeur.toLowerCase().includes(termeLower)) ||
      (livre.genre && livre.genre.toLowerCase().includes(termeLower)) ||
      (livre.date && livre.date.toLowerCase().includes(termeLower)) ||
      (livre.info_supplementaires && livre.info_supplementaires.toLowerCase().includes(termeLower))
    )
  }

  // Filtrer les livres valides (avec titre)
  const livresValides = useMemo(() => {
    const prioritizeValue = (priorite: number | null) => (priorite ?? Number.POSITIVE_INFINITY)

    return (livresData as Livre[])
      .filter(livre => livre.titre && livre.titre.trim() !== '')
      .filter(livre => correspondRecherche(livre, recherche))
      .sort((a, b) => {
        // Si on est en mode "priorite" (Toutes), trier par priorité puis nom de famille d'auteur
        if (tri === 'priorite') {
          // D'abord, trier par priorité
          const prioriteA = prioritizeValue(a.priorite)
          const prioriteB = prioritizeValue(b.priorite)
          if (prioriteA !== prioriteB) {
            return prioriteA - prioriteB
          }
          
          // Si même priorité, trier par nom de famille d'auteur
          // Fonction pour extraire le nom de famille (dernier mot)
          const extraireNomFamille = (nom: string | null): string => {
            if (!nom || nom.trim() === '') return ''
            const mots = nom.trim().split(/\s+/)
            return mots.length > 0 ? mots[mots.length - 1].toLowerCase() : nom.toLowerCase()
          }
          
          const nomFamilleA = extraireNomFamille(a.auteur)
          const nomFamilleB = extraireNomFamille(b.auteur)
          
          if (nomFamilleA !== nomFamilleB) {
            if (nomFamilleA === '') return 1
            if (nomFamilleB === '') return -1
            return nomFamilleA.localeCompare(nomFamilleB, 'fr', { sensitivity: 'base' })
          }
          
          // Si même nom de famille, trier par nom complet d'auteur
          const auteurA = (a.auteur || '').toLowerCase().trim()
          const auteurB = (b.auteur || '').toLowerCase().trim()
          if (auteurA !== auteurB) {
            return auteurA.localeCompare(auteurB, 'fr', { sensitivity: 'base' })
          }
          
          // Si même auteur, trier par titre
          const titreA = (a.titre || '').toLowerCase()
          const titreB = (b.titre || '').toLowerCase()
          return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
        }
        // Sinon, trier par priorité puis titre (pour les autres modes)
        const prioriteA = prioritizeValue(a.priorite)
        const prioriteB = prioritizeValue(b.priorite)
        if (prioriteA !== prioriteB) {
          return prioriteA - prioriteB
        }
        const titreA = (a.titre || '').toLowerCase()
        const titreB = (b.titre || '').toLowerCase()
        return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
      })
  }, [livresData, recherche, tri])

  // Grouper par genre
  const livresParGenre = useMemo(() => {
    const groupes: { [key: string]: Livre[] } = {}
    livresValides.forEach(livre => {
      const genre = livre.genre || 'Non classé'
      if (!groupes[genre]) {
        groupes[genre] = []
      }
      groupes[genre].push(livre)
    })
    // Trier les genres par ordre alphabétique et les livres par date (plus récent en premier)
    return Object.keys(groupes).sort().reduce((acc, key) => {
      const livres = groupes[key]
      livres.sort((a, b) => {
        const anneeA = extraireAnnee(a.date)
        const anneeB = extraireAnnee(b.date)
        if (anneeA !== anneeB) {
          if (anneeA === null) return 1
          if (anneeB === null) return -1
          return anneeB - anneeA
        }
        const moisA = extraireMois(a.date)
        const moisB = extraireMois(b.date)
        if (moisA !== moisB) {
          if (moisA === null) return 1
          if (moisB === null) return -1
          return moisB - moisA
        }
        const prioriteA = a.priorite ?? Number.POSITIVE_INFINITY
        const prioriteB = b.priorite ?? Number.POSITIVE_INFINITY
        if (prioriteA !== prioriteB) {
          return prioriteA - prioriteB
        }
        const titreA = (a.titre || '').toLowerCase()
        const titreB = (b.titre || '').toLowerCase()
        return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
      })
      acc[key] = livres
      return acc
    }, {} as { [key: string]: Livre[] })
  }, [livresValides])

  // Grouper par éditeur
  const livresParEditeur = useMemo(() => {
    const groupes: { [key: string]: Livre[] } = {}
    livresValides.forEach(livre => {
      const editeur = livre.editeur || 'Non spécifié'
      if (!groupes[editeur]) {
        groupes[editeur] = []
      }
      groupes[editeur].push(livre)
    })
    // Trier les éditeurs par ordre alphabétique et les livres par date (plus récent en premier)
    return Object.keys(groupes).sort().reduce((acc, key) => {
      const livres = groupes[key]
      livres.sort((a, b) => {
        const anneeA = extraireAnnee(a.date)
        const anneeB = extraireAnnee(b.date)
        if (anneeA !== anneeB) {
          if (anneeA === null) return 1
          if (anneeB === null) return -1
          return anneeB - anneeA
        }
        const moisA = extraireMois(a.date)
        const moisB = extraireMois(b.date)
        if (moisA !== moisB) {
          if (moisA === null) return 1
          if (moisB === null) return -1
          return moisB - moisA
        }
        const prioriteA = a.priorite ?? Number.POSITIVE_INFINITY
        const prioriteB = b.priorite ?? Number.POSITIVE_INFINITY
        if (prioriteA !== prioriteB) {
          return prioriteA - prioriteB
        }
        const titreA = (a.titre || '').toLowerCase()
        const titreB = (b.titre || '').toLowerCase()
        return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
      })
      acc[key] = livres
      return acc
    }, {} as { [key: string]: Livre[] })
  }, [livresValides])

  // Grouper par auteur
  const livresParAuteur = useMemo(() => {
    const groupes: { [key: string]: Livre[] } = {}
    livresValides.forEach(livre => {
      const auteur = livre.auteur || 'Non spécifié'
      if (!groupes[auteur]) {
        groupes[auteur] = []
      }
      groupes[auteur].push(livre)
    })
    // Fonction pour extraire le nom de famille (dernier mot)
    const extraireNomFamille = (nom: string): string => {
      if (nom === 'Non spécifié') return nom
      const mots = nom.trim().split(/\s+/)
      return mots.length > 0 ? mots[mots.length - 1].toLowerCase() : nom.toLowerCase()
    }
    // Trier les auteurs par nom de famille (dernier mot) puis par nom complet
    return Object.keys(groupes).sort((a, b) => {
      const nomFamilleA = extraireNomFamille(a)
      const nomFamilleB = extraireNomFamille(b)
      if (nomFamilleA !== nomFamilleB) {
        return nomFamilleA.localeCompare(nomFamilleB, 'fr', { sensitivity: 'base' })
      }
      // Si même nom de famille, trier par nom complet
      return a.localeCompare(b, 'fr', { sensitivity: 'base' })
    }).reduce((acc, key) => {
      const livres = groupes[key]
      livres.sort((a, b) => {
        const anneeA = extraireAnnee(a.date)
        const anneeB = extraireAnnee(b.date)
        if (anneeA !== anneeB) {
          if (anneeA === null) return 1
          if (anneeB === null) return -1
          return anneeB - anneeA
        }
        const moisA = extraireMois(a.date)
        const moisB = extraireMois(b.date)
        if (moisA !== moisB) {
          if (moisA === null) return 1
          if (moisB === null) return -1
          return moisB - moisA
        }
        const prioriteA = a.priorite ?? Number.POSITIVE_INFINITY
        const prioriteB = b.priorite ?? Number.POSITIVE_INFINITY
        if (prioriteA !== prioriteB) {
          return prioriteA - prioriteB
        }
        const titreA = (a.titre || '').toLowerCase()
        const titreB = (b.titre || '').toLowerCase()
        return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
      })
      acc[key] = livres
      return acc
    }, {} as { [key: string]: Livre[] })
  }, [livresValides])

  // Grouper par date (année)
  const livresParDate = useMemo(() => {
    const groupes: { [key: number]: Livre[] } = {}
    livresValides.forEach(livre => {
      const annee = extraireAnnee(livre.date)
      if (annee) {
        if (!groupes[annee]) {
          groupes[annee] = []
        }
        groupes[annee].push(livre)
      } else {
        // Livres sans date dans un groupe "Sans date"
        if (!groupes[0]) {
          groupes[0] = []
        }
        groupes[0].push(livre)
      }
    })
    // Trier les années par ordre décroissant (plus récent en premier)
    const annees = Object.keys(groupes)
      .map(a => parseInt(a, 10))
      .sort((a, b) => b - a)
    
    const result: { [key: string]: Livre[] } = {}
    annees.forEach(annee => {
      const key = annee === 0 ? 'Sans date' : annee.toString()
      const livres = groupes[annee]
      if (livres) {
        livres.sort((a, b) => {
          const moisA = extraireMois(a.date)
          const moisB = extraireMois(b.date)
          if (moisA !== moisB) {
            if (moisA === null) return 1
            if (moisB === null) return -1
            return moisB - moisA
          }

          const prioriteA = a.priorite ?? Number.POSITIVE_INFINITY
          const prioriteB = b.priorite ?? Number.POSITIVE_INFINITY
          if (prioriteA !== prioriteB) {
            return prioriteA - prioriteB
          }

          const titreA = (a.titre || '').toLowerCase()
          const titreB = (b.titre || '').toLowerCase()
          return titreA.localeCompare(titreB, 'fr', { sensitivity: 'base' })
        })
      }
      result[key] = livres
    })
    return result
  }, [livresValides])

  const groupesAffiches =
    tri === 'genre'
      ? livresParGenre
      : tri === 'editeur'
      ? livresParEditeur
      : tri === 'auteur'
      ? livresParAuteur
      : tri === 'date'
      ? livresParDate
      : {}

  if (loading) {
    return (
      <div className="section-container py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-primary-600">Chargement...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="section-container py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="page-title">Traductions</h1>
          <div className="card p-8 bg-red-50 border border-red-200">
            <p className="text-red-800 font-semibold mb-2">Erreur de chargement</p>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-4">
              Vérifiez que Supabase est configuré et que les données ont été migrées.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="page-title">Traductions</h1>
        
        {/* Barre de recherche */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un ouvrage, un auteur, un éditeur..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-primary-900 placeholder-primary-400 transition-all duration-200"
            />
            {recherche && (
              <button
                onClick={() => setRecherche('')}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary-400 hover:text-primary-600 transition-colors"
                aria-label="Effacer la recherche"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          {recherche && (
            <p className="mt-2 text-sm text-primary-600">
              {livresValides.length} {livresValides.length === 1 ? 'résultat trouvé' : 'résultats trouvés'}
            </p>
          )}
        </div>

        {/* Filtres de tri */}
        <div className="mb-12 flex flex-wrap gap-4">
          <button
            onClick={() => setTri('priorite')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              tri === 'priorite'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            Toutes
          </button>
          <button
            onClick={() => setTri('genre')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              tri === 'genre'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            Par genre
          </button>
          <button
            onClick={() => setTri('auteur')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              tri === 'auteur'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            Par auteur
          </button>
          <button
            onClick={() => setTri('editeur')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              tri === 'editeur'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            Par éditeur
          </button>
          <button
            onClick={() => setTri('date')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              tri === 'date'
                ? 'bg-primary-700 text-white shadow-lg scale-105'
                : 'bg-white text-primary-700 border-2 border-primary-200 hover:border-primary-400 hover:bg-primary-50'
            }`}
          >
            Par date
          </button>
        </div>

        {/* Affichage des livres groupés */}
        {tri === 'priorite' ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {livresValides.map((livre, index) => (
                <div
                  key={`${livre.titre}-${index}`}
                  className="card p-4 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  {livre.image_url ? (
                    <div className="mb-3 aspect-[2/3] overflow-hidden rounded-lg bg-primary-100 flex-shrink-0">
                      <img
                        src={livre.image_url}
                        alt={livre.titre || 'Couverture'}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="mb-3 aspect-[2/3] rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className="space-y-1 flex-grow">
                    {livre.auteur && (
                      <p className="text-sm font-semibold text-primary-800 line-clamp-1">
                        {livre.auteur}
                      </p>
                    )}
                    <h3 className="font-medium text-primary-900 line-clamp-2 min-h-[2.5rem]">
                      {livre.titre}
                    </h3>
                    {livre.date && (
                      <p className="text-xs text-primary-600">
                        {livre.date}
                      </p>
                    )}
                    {livre.editeur && (
                      <p className="text-xs text-primary-500 italic line-clamp-1">
                        {livre.editeur}
                      </p>
                    )}
                    {livre.genre && (
                      <p className="text-xs text-primary-500 italic line-clamp-1">
                        {livre.genre}
                      </p>
                    )}
                    {livre.info_supplementaires && (
                      <p className="text-xs text-primary-400 mt-1 line-clamp-2">
                        {livre.info_supplementaires}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {livresValides.length === 0 && (
              <div className="card p-12 text-center animate-fade-in">
                <p className="text-lg text-primary-600">
                  Aucune traduction trouvée.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="space-y-12">
              {Object.entries(groupesAffiches).map(([groupe, livres]) => (
                <div key={groupe} className="animate-fade-in">
                  <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary-900 mb-6 pb-3 border-b-2 border-primary-200">
                    {groupe}
                    <span className="ml-3 text-lg font-normal text-primary-500">
                      ({livres.length} {livres.length === 1 ? 'livre' : 'livres'})
                    </span>
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {livres.map((livre, index) => (
                      <div 
                        key={`${livre.titre}-${index}`} 
                        className="card p-4 hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {livre.image_url ? (
                          <div className="mb-3 aspect-[2/3] overflow-hidden rounded-lg bg-primary-100 flex-shrink-0">
                            <img
                              src={livre.image_url}
                              alt={livre.titre || 'Couverture'}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        ) : (
                          <div className="mb-3 aspect-[2/3] rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                            <svg className="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                        )}
                        <div className="space-y-1 flex-grow">
                          {livre.auteur && tri !== 'auteur' && (
                            <p className="text-sm font-semibold text-primary-800 line-clamp-1">
                              {livre.auteur}
                            </p>
                          )}
                          <h3 className="font-medium text-primary-900 line-clamp-2 min-h-[2.5rem]">
                            {livre.titre}
                          </h3>
                          {livre.date && (
                            <p className="text-xs text-primary-600">
                              {livre.date}
                            </p>
                          )}
                          {livre.editeur && (tri === 'genre' || tri === 'date' || tri === 'auteur') && (
                            <p className="text-xs text-primary-500 italic line-clamp-1">
                              {livre.editeur}
                            </p>
                          )}
                          {livre.genre && (tri === 'editeur' || tri === 'date' || tri === 'auteur') && (
                            <p className="text-xs text-primary-500 italic line-clamp-1">
                              {livre.genre}
                            </p>
                          )}
                          {livre.info_supplementaires && (
                            <p className="text-xs text-primary-400 mt-1 line-clamp-2">
                              {livre.info_supplementaires}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Message si aucun livre */}
            {Object.keys(groupesAffiches).length === 0 && (
              <div className="card p-12 text-center animate-fade-in">
                <p className="text-lg text-primary-600">
                  Aucune traduction trouvée.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function TraductionPage() {
  return (
    <Suspense fallback={
      <div className="section-container py-16">
        <div className="text-center text-primary-600">Chargement...</div>
      </div>
    }>
      <TraductionContent />
    </Suspense>
  )
}
