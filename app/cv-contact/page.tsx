export default function CVContactPage() {
  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="page-title">CV / Contact</h1>
        
        <div className="card p-8 md:p-12 animate-fade-in">
          {/* Photo et introduction */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="flex-shrink-0">
              <img
                src="https://web.archive.org/web/20250324104454im_/http://laurentburytraducteur.com/wp-content/uploads/2016/11/picture-15-1405593453.jpg"
                alt="Laurent Bury"
                className="w-48 h-48 md:w-56 md:h-56 rounded-lg object-cover shadow-md"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg text-primary-700 mb-4">
                <strong>Bonjour,</strong>
              </p>
              <p className="text-primary-600 leading-relaxed">
                Vous trouverez ci-dessous un CV détaillé qui vous dira (presque) tout ce
                qu'il y a à savoir sur mon parcours professionnel jusqu'à aujourd'hui.
              </p>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h2 className="text-2xl font-serif font-semibold text-primary-900 mb-4">Informations personnelles</h2>
            <div className="space-y-2 text-primary-700">
              <p><strong>Nom :</strong> BURY</p>
              <p><strong>Prénom :</strong> Laurent</p>
              <p><strong>Né le :</strong> 22 septembre 1967, à Valenciennes</p>
              <p><strong>Nationalité :</strong> Française</p>
              <p><strong>Adresse :</strong> 27, rue Jean-Jacques Rousseau — 75001 Paris</p>
              <p><strong>Téléphone :</strong> 06 43 10 69 40</p>
              <p><strong>E-mail :</strong> <a href="mailto:bury.laurent@neuf.fr" className="text-primary-600 hover:text-primary-900 underline transition-colors">bury.laurent@neuf.fr</a></p>
              <p><strong>Profession :</strong> Traducteur indépendant</p>
            </div>
          </div>

          {/* Diplômes et formation */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Diplômes et formation</h3>
            <ul className="space-y-2 text-primary-700 list-disc list-inside">
              <li>1985 : Baccalauréat A2</li>
              <li>1985–1988 : Classes préparatoires aux grandes écoles (Lycée Louis-le-Grand)</li>
              <li>1988 : Admission à l'ENS rue d'Ulm / Licence d'anglais à Paris IV</li>
              <li>1988–1989 : Maîtrise d'anglais à Paris IV</li>
              <li>1989–1990 : Lecteur à Wadham College et St Catherine's College, Oxford / Diplôme d'Études Approfondies d'anglais à Paris IV</li>
              <li>1991 : Obtention de l'Agrégation d'anglais (3<sup>e</sup>)</li>
              <li>1993–1996 : Doctorat à Paris IV</li>
              <li>1997–2009 : Maître de conférences au département d'anglais, Paris IV</li>
              <li>2004 : Habilitation à Diriger des Recherches</li>
              <li>2010–2020 : Professeur de Littérature anglaise à l'Université Lumière – Lyon 2</li>
            </ul>
          </div>

          {/* Activités */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Activités</h3>
            <div className="space-y-4 text-primary-700 leading-relaxed">
              <p>
                Rédaction de critiques (opéras, disques, livres, expositions) pour le magazine
                <em> Classica</em> et sur les sites{' '}
                <a href="http://www.concertclassic.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">concertclassic.com</a>,{' '}
                <a href="http://www.wanderersite.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">wanderersite.com</a>,{' '}
                <a href="http://www.premiere-loge.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">premiere-loge.fr</a>.
              </p>

              <p>
                De 2011 à avril 2020, rédacteur en chef du site{' '}
                <a href="http://www.forumopera.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">forumopera.com</a>.
              </p>

              <p>
                D'octobre 2018 à mars 2020 : participation à l'émission <em>« La Dispute »</em> sur France Culture.
              </p>

              <p>
                Rédaction d'articles pour <em>L'Avant-Scène Opéra</em> :
                <em> « Myfanwy Piper au service de Britten »</em> (n° 320, <em>La Mort à Venise</em>) et
                <em> « Montagu Slater, librettiste rouge »</em> (n° 326, <em>Peter Grimes</em>).
              </p>
            </div>
          </div>

          {/* Publications */}
          <div className="mb-8 pb-8 border-b border-primary-200">
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Publications</h3>
            <ul className="space-y-3 text-primary-700">
              <li>
                <em>Liberty, Duality, Urbanity : Charles Dickens's</em> <strong>A Tale of Two Cities</strong>, PUF, octobre 2012.
              </li>
              <li>
                <em>L'Orientalisme victorien dans les arts visuels et la littérature</em>, PU de Grenoble, janvier 2011.
              </li>
              <li>
                <em>Seductive Strategies in the Fiction of Anthony Trollope</em>, Edwin Mellen, août 2004.
              </li>
              <li>
                <em>Histoire des arts en Grande-Bretagne</em>, Ellipses, février 2002.
              </li>
              <li>
                <em>Civilisation Britannique au XIX<sup>e</sup> siècle</em>, Hachette Université, juillet 2001.
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xl font-serif font-semibold text-primary-900 mb-4">Contact</h3>
            <div className="space-y-2 text-primary-700">
              <p>
                <strong>Par e-mail :</strong>{' '}
                <a href="mailto:bury.laurent@neuf.fr" className="text-primary-600 hover:text-primary-900 underline transition-colors">bury.laurent@neuf.fr</a>
              </p>
              <p>
                <strong>Sur Facebook :</strong>{' '}
                <a href="https://www.facebook.com/profile.php?id=100008300803952" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">Page Facebook</a>
              </p>
              <p>
                <strong>Sur Twitter :</strong>{' '}
                <a href="https://twitter.com/LaurentBury1" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-900 underline transition-colors">@LaurentBury1</a>
              </p>
              <p>
                <strong>Par téléphone :</strong> 06 43 10 69 40
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

