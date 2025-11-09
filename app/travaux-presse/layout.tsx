import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  title: 'Travaux de presse',
  description: 'Découvrez les travaux de presse et articles de Laurent Bury, traducteur professionnel.',
  openGraph: {
    title: 'Travaux de presse | Laurent Bury',
    description: 'Découvrez les travaux de presse et articles de Laurent Bury, traducteur professionnel.',
    url: `${siteUrl}/travaux-presse`,
  },
  keywords: [
    'travaux presse',
    'articles traducteur',
    'publications traducteur',
  ],
}

export default function TravauxPresseLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

