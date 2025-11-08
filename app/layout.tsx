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

export const metadata: Metadata = {
  title: 'Traducteur - Site Vitrine',
  description: 'Site vitrine d\'un traducteur professionnel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={roboto.variable}>
      <body className={roboto.className}>
        {/* Gradient animé en arrière-plan */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100 opacity-80"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary-50/50 to-transparent animate-gradient-shift"></div>
          {/* Formes décoratives animées */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-primary-50/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        <ConditionalHeader />
        <main className="min-h-screen relative">
          {children}
        </main>
      </body>
    </html>
  )
}

