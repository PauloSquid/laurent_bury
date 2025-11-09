import { Metadata } from 'next'
import StructuredData from '@/components/StructuredData'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'Bienvenue sur le site de Laurent Bury, traducteur professionnel depuis plus de trente ans. Découvrez mes traductions de classiques, romans, histoire et philosophie.',
  openGraph: {
    title: 'Laurent Bury - Traducteur professionnel',
    description: 'Traducteur professionnel depuis plus de trente ans. Spécialisé dans la traduction de classiques, romans, histoire et philosophie.',
    url: siteUrl,
  },
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Laurent Bury',
  jobTitle: 'Traducteur professionnel',
  description: 'Traducteur professionnel depuis plus de trente ans, spécialisé dans la traduction littéraire.',
  url: siteUrl,
  sameAs: [
    // Ajoutez vos réseaux sociaux ici si vous en avez
    // 'https://twitter.com/votrecompte',
    // 'https://linkedin.com/in/votrecompte',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Laurent Bury - Traducteur',
  url: siteUrl,
  description: 'Site vitrine de Laurent Bury, traducteur professionnel',
  publisher: {
    '@type': 'Person',
    name: 'Laurent Bury',
  },
}

export default function Home() {
  return (
    <>
      <StructuredData data={personSchema} />
      <StructuredData data={websiteSchema} />
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
    </>
  )
}

