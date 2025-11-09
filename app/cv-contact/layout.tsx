import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  title: 'CV / Contact',
  description: 'CV et informations de contact de Laurent Bury, traducteur professionnel. Contactez-moi pour vos projets de traduction.',
  openGraph: {
    title: 'CV / Contact | Laurent Bury',
    description: 'CV et informations de contact de Laurent Bury, traducteur professionnel.',
    url: `${siteUrl}/cv-contact`,
  },
  keywords: [
    'contact traducteur',
    'CV traducteur',
    'traducteur professionnel contact',
    'devis traduction',
  ],
}

export default function CVContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

