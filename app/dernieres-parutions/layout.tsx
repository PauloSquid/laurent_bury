import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  title: 'Dernières parutions',
  description: 'Découvrez les dernières traductions de Laurent Bury. Ouvrages parus au cours des 5 dernières années.',
  openGraph: {
    title: 'Dernières parutions | Laurent Bury',
    description: 'Découvrez les dernières traductions de Laurent Bury. Ouvrages parus au cours des 5 dernières années.',
    url: `${siteUrl}/dernieres-parutions`,
  },
  keywords: [
    'dernières traductions',
    'nouveautés traduction',
    'livres récents',
    'traductions récentes',
  ],
}

export default function DernieresParutionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

