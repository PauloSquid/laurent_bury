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
        <ConditionalHeader />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}

