export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center">
      <div className="section-container py-20 md:py-32">
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="mb-12 text-center">
            <h1 className="page-title text-balance">
              Bienvenue
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-accent-400 to-accent-600 mx-auto mt-6 rounded-full"></div>
          </div>
          
          <div className="space-y-6 text-lg md:text-xl text-primary-700 leading-relaxed">
            <p>
              Bienvenue sur ce site où vous trouverez toutes les informations sur mon
              activité de traducteur, que j'exerce depuis plus de trente ans.
            </p>

            <p>
              Les textes que j'ai traduits sont présentés par maison d'édition ou par
              genre (classiques, romans policiers, histoire, philosophie, etc.). Une
              page vous indique également les derniers titres parus ou à paraître.
            </p>

            <p>
              Si vous souhaitez me joindre, la rubrique contact vous indiquera tous
              les moyens d'y parvenir.
            </p>

            <p className="pt-4">
              À bientôt<br />
              <span className="font-semibold text-primary-900">Laurent Bury</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

