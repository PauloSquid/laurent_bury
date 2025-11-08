'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Ne pas afficher le header sur la page admin
  if (pathname?.startsWith('/admin')) {
    return null
  }
  
  return <Header />
}

