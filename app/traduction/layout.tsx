import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  title: 'Traductions',
  description: 'Découvrez toutes les traductions de Laurent Bury, organisées par genre, éditeur ou date. Classiques, romans contemporains, philosophie, histoire et bien plus.',
  openGraph: {
    title: 'Traductions | Laurent Bury',
    description: 'Découvrez toutes les traductions de Laurent Bury, organisées par genre, éditeur ou date.',
    url: `${siteUrl}/traduction`,
  },
  keywords: [
    'traductions',
    'livres traduits',
    'traduction littéraire',
    'traduction classiques',
    'traduction romans',
    'traduction philosophie',
    'traduction histoire',
    'catalogue traductions',
  ],
}

export default function TraductionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

