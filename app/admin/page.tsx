'use client'

import { useState, useEffect, useMemo } from 'react'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié
    const auth = sessionStorage.getItem('admin_authenticated')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_authenticated', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated')
    setIsAuthenticated(false)
    setPassword('')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50">
        <div className="card p-8 md:p-12 max-w-md w-full mx-4">
          <h1 className="text-3xl font-serif font-bold text-primary-900 mb-6 text-center">
            Administration
          </h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-200 text-primary-900"
                placeholder="Entrez le mot de passe"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full btn-primary"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="page-title">Administration</h1>
          <button
            onClick={handleLogout}
            className="btn-secondary"
          >
            Déconnexion
          </button>
        </div>

        <AdminContent />
      </div>
    </div>
  )
}

function AdminContent() {
  const [livres, setLivres] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingLivre, setEditingLivre] = useState<any | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    loadLivres()
  }, [])

  const loadLivres = async () => {
    try {
      const response = await fetch('/api/livres')
      if (response.ok) {
        const data = await response.json()
        setLivres(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des livres:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (index: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce livre ?')) {
      return
    }

    const newLivres = livres.filter((_, i) => i !== index)
    try {
      const response = await fetch('/api/livres', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLivres)
      })
      if (response.ok) {
        setLivres(newLivres)
        setMessage({ type: 'success', text: 'Livre supprimé avec succès' })
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la suppression' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Inverser l'ordre si on clique sur la même colonne
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      // Nouvelle colonne, tri croissant par défaut
      setSortColumn(column)
      setSortOrder('asc')
    }
  }

  const sortedLivres = useMemo(() => {
    if (!sortColumn) return livres.map((livre, index) => ({ ...livre, originalIndex: index }))

    return [...livres]
      .map((livre, index) => ({ ...livre, originalIndex: index }))
      .sort((a, b) => {
        const aValue = (a[sortColumn] || '').toString().toLowerCase()
        const bValue = (b[sortColumn] || '').toString().toLowerCase()
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
        return 0
      })
  }, [livres, sortColumn, sortOrder])

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 ml-1 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      )
    }
    return (
      <svg className={`w-4 h-4 ml-1 text-primary-700 ${sortOrder === 'asc' ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    )
  }

  if (loading) {
    return <div className="text-center text-primary-600">Chargement...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <p className="text-primary-700">
          {livres.length} {livres.length === 1 ? 'livre' : 'livres'} au total
        </p>
        <button
          onClick={() => {
            setEditingLivre(null)
            setShowAddForm(true)
            setTimeout(() => {
              document.getElementById('livre-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
          }}
          className="btn-primary"
        >
          + Ajouter un livre
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {showAddForm && (
        <LivreForm
          livre={editingLivre}
          onSave={async (livre) => {
            const newLivres = editingLivre
              ? livres.map((l, i) => (i === editingLivre.index ? livre : l))
              : [...livres, livre]
            
            try {
              const response = await fetch('/api/livres', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newLivres)
              })
              if (response.ok) {
                await loadLivres()
                setMessage({ 
                  type: 'success', 
                  text: editingLivre ? 'Livre modifié avec succès' : 'Livre ajouté avec succès' 
                })
                setTimeout(() => setMessage(null), 3000)
                setShowAddForm(false)
                setEditingLivre(null)
              } else {
                setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
                setTimeout(() => setMessage(null), 3000)
              }
            } catch (error) {
              console.error('Erreur:', error)
              setMessage({ type: 'error', text: 'Erreur lors de la sauvegarde' })
              setTimeout(() => setMessage(null), 3000)
            }
          }}
          onCancel={() => {
            setShowAddForm(false)
            setEditingLivre(null)
          }}
        />
      )}

      {livres.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-primary-600">Aucun livre trouvé.</p>
        </div>
      ) : (
        <div className="card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary-200">
                  <th className="text-left py-3 px-4 text-primary-900 font-semibold w-20">
                    Image
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-primary-900 font-semibold cursor-pointer hover:bg-primary-50 transition-colors select-none"
                    onClick={() => handleSort('titre')}
                  >
                    <div className="flex items-center">
                      Titre
                      <SortIcon column="titre" />
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-primary-900 font-semibold hidden md:table-cell cursor-pointer hover:bg-primary-50 transition-colors select-none"
                    onClick={() => handleSort('auteur')}
                  >
                    <div className="flex items-center">
                      Auteur
                      <SortIcon column="auteur" />
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-primary-900 font-semibold hidden lg:table-cell cursor-pointer hover:bg-primary-50 transition-colors select-none"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center">
                      Date
                      <SortIcon column="date" />
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-primary-900 font-semibold hidden lg:table-cell cursor-pointer hover:bg-primary-50 transition-colors select-none"
                    onClick={() => handleSort('editeur')}
                  >
                    <div className="flex items-center">
                      Éditeur
                      <SortIcon column="editeur" />
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 text-primary-900 font-semibold hidden xl:table-cell cursor-pointer hover:bg-primary-50 transition-colors select-none"
                    onClick={() => handleSort('genre')}
                  >
                    <div className="flex items-center">
                      Genre
                      <SortIcon column="genre" />
                    </div>
                  </th>
                  <th className="text-right py-3 px-4 text-primary-900 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedLivres.map((livre, sortedIndex) => {
                  const originalIndex = livre.originalIndex
                  // Nettoyer l'objet pour ne pas inclure originalIndex dans les données
                  const { originalIndex: _, ...livreData } = livre
                  return (
                  <tr key={`${livre.titre}-${sortedIndex}`} className="border-b border-primary-100 hover:bg-primary-50 transition-colors">
                    <td className="py-3 px-4">
                      {livre.image_url ? (
                        <div className="w-12 h-16 overflow-hidden rounded bg-primary-100 flex-shrink-0">
                          <img
                            src={livre.image_url}
                            alt={livre.titre || 'Couverture'}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-16 rounded bg-primary-100 flex items-center justify-center">
                          <svg className="w-6 h-6 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-primary-700 font-medium">{livre.titre || '-'}</td>
                    <td className="py-3 px-4 text-primary-700 hidden md:table-cell">{livre.auteur || '-'}</td>
                    <td className="py-3 px-4 text-primary-700 hidden lg:table-cell">{livre.date || '-'}</td>
                    <td className="py-3 px-4 text-primary-700 hidden lg:table-cell">{livre.editeur || '-'}</td>
                    <td className="py-3 px-4 text-primary-700 hidden xl:table-cell">{livre.genre || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingLivre({ ...livreData, index: originalIndex })
                            setShowAddForm(true)
                            setTimeout(() => {
                              document.getElementById('livre-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }, 100)
                          }}
                          className="px-3 py-1.5 text-sm bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors font-medium"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(originalIndex)}
                          className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function LivreForm({ livre, onSave, onCancel }: { livre: any | null, onSave: (livre: any) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState({
    auteur: livre?.auteur || '',
    titre: livre?.titre || '',
    date: livre?.date || '',
    editeur: livre?.editeur || '',
    genre: livre?.genre || '',
    info_supplementaires: livre?.info_supplementaires || '',
    image_url: livre?.image_url || ''
  })

  // Mettre à jour le formulaire quand le livre change
  useEffect(() => {
    if (livre) {
      setFormData({
        auteur: livre.auteur || '',
        titre: livre.titre || '',
        date: livre.date || '',
        editeur: livre.editeur || '',
        genre: livre.genre || '',
        info_supplementaires: livre.info_supplementaires || '',
        image_url: livre.image_url || ''
      })
    } else {
      setFormData({
        auteur: '',
        titre: '',
        date: '',
        editeur: '',
        genre: '',
        info_supplementaires: '',
        image_url: ''
      })
    }
  }, [livre])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const livreData = {
      auteur: formData.auteur || null,
      titre: formData.titre || null,
      date: formData.date || null,
      editeur: formData.editeur || null,
      genre: formData.genre || null,
      info_supplementaires: formData.info_supplementaires || null,
      image_url: formData.image_url || null
    }
    onSave(livreData)
  }

  return (
    <div id="livre-form" className="card p-8">
      <h2 className="text-2xl font-serif font-semibold text-primary-900 mb-6">
        {livre ? 'Modifier le livre' : 'Ajouter un livre'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Auteur
            </label>
            <input
              type="text"
              value={formData.auteur}
              onChange={(e) => setFormData({ ...formData, auteur: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Date
            </label>
            <input
              type="text"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
              placeholder="ex: janvier 2021"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Éditeur
            </label>
            <input
              type="text"
              value={formData.editeur}
              onChange={(e) => setFormData({ ...formData, editeur: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              Genre
            </label>
            <input
              type="text"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-2">
              URL Image
            </label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-2">
            Informations supplémentaires
          </label>
          <textarea
            value={formData.info_supplementaires}
            onChange={(e) => setFormData({ ...formData, info_supplementaires: e.target.value })}
            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-400"
            rows={3}
          />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn-primary">
            {livre ? 'Enregistrer les modifications' : 'Ajouter le livre'}
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}

