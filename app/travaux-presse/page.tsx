export default function TravauxPressePage() {
  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title">Travaux presse</h1>
        
        <div className="card p-8 md:p-12 animate-fade-in">
          {/* Collaboration régulière */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Collaboration régulière avec :</h3>
            <ul className="space-y-2 text-primary-700 list-disc list-inside">
              <li>Sensibilités</li>
              <li>Books</li>
              <li>6 Mois</li>
              <li>XXI</li>
              <li>Sang Froid</li>
              <li>Revue d'histoire du XIX<sup>e</sup> siècle</li>
            </ul>
          </div>

          {/* Dossiers de presse traduits */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Dossiers de presse traduits du français vers l'anglais :</h3>
            <ul className="space-y-2 text-primary-700 list-disc list-inside">
              <li>Festival d'Aix-en-Provence, éditions 2023, 2024 et 2025</li>
              <li>Opéra d'Athènes, saison 2025-26</li>
              <li>
                Dossier de presse <em>2025 Année Boulez</em> pour la Philharmonie de Paris
              </li>
            </ul>
          </div>

          {/* Traduction de textes pour l'Opéra de Lille */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Traduction de textes pour l'Opéra de Lille :</h3>
            <ul className="space-y-2 text-primary-700 list-disc list-inside">
              <li>
                Version française du livret de Cordelia Lynn pour l'opéra de Sivan Eldar <em>Like Flesh</em>, commande de l'Opéra de Lille, créé en janvier 2022
              </li>
            </ul>
          </div>

          {/* Autres traductions */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Autres traductions :</h3>
            <div className="space-y-3 text-primary-700 leading-relaxed">
              <p>
                Traduction de l'anglais vers le français de la brochure <strong>EEMERGING+</strong> du Centre culturel de rencontre et festival d'Ambronay
              </p>
              <p>Traduction de textes pour le choeur Accentus</p>
            </div>
          </div>

          {/* Traductions pour labels discographiques */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Traductions pour labels discographiques :</h3>
            <ul className="space-y-3 text-primary-700 list-disc list-inside">
              <li>
                Editions Ambronay : "Les Itinérantes - Voyages d'hiver", "Die Lullisten", "Cantoria, Ensaladas", "La Palatine - Il n'y a pas d'amour heureux"
              </li>
              <li>
                EPR Classic : "Stabat Mater de Poulenc / Requiem de Desenclos", "Weinberg - Les Métamorphoses"
              </li>
              <li>Aparté : "Tarare" de Salieri</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

