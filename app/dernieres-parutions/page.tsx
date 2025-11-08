'use client'

import { useMemo, useState, useEffect } from 'react'

interface Livre {
  auteur: string | null
  titre: string | null
  date: string | null
  editeur: string | null
  genre: string | null
  info_supplementaires: string | null
  image_url: string | null
}

interface LivreAvecAnnee extends Livre {
  annee: number
}

export default function DernieresParutionsPage() {
  const [livresData, setLivresData] = useState<Livre[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLivres = async () => {
      try {
        const response = await fetch('/api/livres')
        if (response.ok) {
          const data = await response.json()
          setLivresData(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error)
      } finally {
        setLoading(false)
      }
    }
    loadLivres()
  }, [])

  // Fonction pour extraire l'année d'une date
  const extraireAnnee = (date: string | null): number | null => {
    if (!date) return null
    
    // Chercher un pattern de 4 chiffres (année)
    const match = date.match(/\b(19|20)\d{2}\b/)
    if (match) {
      return parseInt(match[0], 10)
    }
    return null
  }

  // Obtenir l'année actuelle
  const anneeActuelle = new Date().getFullYear()
  const anneeLimite = anneeActuelle - 4 // 5 dernières années incluses

  // Filtrer et trier les livres des 5 dernières années
  const livresRecents = useMemo(() => {
    const livresValides = livresData
      .filter(livre => livre.titre && livre.titre.trim() !== '')
      .map(livre => ({
        ...livre,
        annee: extraireAnnee(livre.date)
      }))
      .filter(livre => livre.annee !== null && livre.annee >= anneeLimite)
      .sort((a, b) => {
        if (a.annee! !== b.annee!) {
          return b.annee! - a.annee!
        }
        return (a.titre || '').localeCompare(b.titre || '')
      })

    const groupes: { [key: number]: LivreAvecAnnee[] } = {}
    livresValides.forEach(livre => {
      const annee = livre.annee!
      if (!groupes[annee]) {
        groupes[annee] = []
      }
      groupes[annee].push(livre as LivreAvecAnnee)
    })

    return Object.keys(groupes)
      .map(annee => parseInt(annee, 10))
      .sort((a, b) => b - a)
      .map(annee => ({
        annee,
        livres: groupes[annee]
      }))
  }, [livresData, anneeLimite])

  if (loading) {
    return (
      <div className="section-container py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-primary-600">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="page-title">Dernières parutions</h1>
        
        <p className="text-lg text-primary-700 mb-8 text-center">
          Ouvrages parus au cours des 5 dernières années ({anneeLimite} - {anneeActuelle})
        </p>

        {livresRecents.length === 0 ? (
          <div className="card p-12 text-center animate-fade-in">
            <p className="text-lg text-primary-600">
              Aucune parution récente trouvée.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {livresRecents.map(({ annee, livres }) => (
              <div key={annee} className="animate-fade-in">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-primary-900 mb-6 pb-3 border-b-2 border-primary-200">
                  {annee}
                  <span className="ml-3 text-lg font-normal text-primary-500">
                    ({livres.length} {livres.length === 1 ? 'ouvrage' : 'ouvrages'})
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
                          <p className="text-xs text-primary-400 line-clamp-1">
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
        )}
      </div>
    </div>
  )
}
