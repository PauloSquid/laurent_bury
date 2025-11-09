import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import './globals.css'
import ConditionalHeader from '@/components/ConditionalHeader'

const roboto = Roboto({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://laurentburytraducteur.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Laurent Bury - Traducteur professionnel',
    template: '%s | Laurent Bury - Traducteur'
  },
  description: 'Laurent Bury, traducteur professionnel depuis plus de trente ans. Spécialisé dans la traduction de classiques, romans, histoire et philosophie. Découvrez mes traductions par genre et par éditeur.',
  keywords: [
    'traducteur',
    'traduction',
    'traducteur professionnel',
    'traduction littéraire',
    'traduction français',
    'Laurent Bury',
    'traduction classiques',
    'traduction romans',
    'traduction philosophie',
    'traduction histoire'
  ],
  authors: [{ name: 'Laurent Bury' }],
  creator: 'Laurent Bury',
  publisher: 'Laurent Bury',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: 'Laurent Bury - Traducteur',
    title: 'Laurent Bury - Traducteur professionnel',
    description: 'Traducteur professionnel depuis plus de trente ans. Spécialisé dans la traduction de classiques, romans, histoire et philosophie.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Laurent Bury - Traducteur professionnel',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Laurent Bury - Traducteur professionnel',
    description: 'Traducteur professionnel depuis plus de trente ans. Spécialisé dans la traduction de classiques, romans, histoire et philosophie.',
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Ajoutez vos codes de vérification ici si nécessaire
    // google: 'votre-code-google',
    // yandex: 'votre-code-yandex',
    // bing: 'votre-code-bing',
  },
  alternates: {
    canonical: siteUrl,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={roboto.variable}>
      <body className={roboto.className}>
        {/* Gradient animé en arrière-plan - teintes de jaune */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-50 via-white to-accent-100 opacity-90"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent-50/60 to-transparent animate-gradient-shift"></div>
          {/* Formes décoratives animées - teintes de jaune */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-100/40 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-50/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        </div>
        <ConditionalHeader />
        <main className="min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  )
}

