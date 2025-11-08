'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(path)
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-primary-100">
      <nav className="section-container py-4">
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className={`text-2xl md:text-3xl font-serif font-bold transition-colors duration-200 relative ${
              isActive('/') ? 'text-primary-900' : 'text-primary-800 hover:text-primary-700'
            }`}
          >
            Laurent Bury, Traducteur
            {isActive('/') && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-500"></span>
            )}
          </Link>
          
          {/* Menu Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <Link 
                href="/traduction" 
                className="text-primary-700 font-medium transition-colors duration-200 relative py-2 group/link"
              >
                Traduction
                <span className={`absolute bottom-0 left-0 bg-accent-500 transition-all duration-300 ${
                  isActive('/traduction') 
                    ? 'w-full h-0.5' 
                    : 'w-0 h-0.5 group-hover/link:w-full group-hover/link:h-1'
                }`}></span>
              </Link>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-primary-100">
                <div className="py-2">
                  <Link 
                    href="/traduction?tri=genre" 
                    className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors duration-200"
                  >
                    Par genre
                  </Link>
                  <Link 
                    href="/traduction?tri=editeur" 
                    className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors duration-200"
                  >
                    Par éditeur
                  </Link>
                  <Link 
                    href="/traduction?tri=date" 
                    className="block px-4 py-2.5 text-sm text-primary-700 hover:bg-primary-50 hover:text-primary-900 transition-colors duration-200"
                  >
                    Par date
                  </Link>
                </div>
              </div>
            </div>
            <Link 
              href="/cv-contact" 
              className="text-primary-700 font-medium transition-colors duration-200 relative py-2 group/link"
            >
              CV/Contact
              <span className={`absolute bottom-0 left-0 bg-accent-500 transition-all duration-300 ${
                isActive('/cv-contact') 
                  ? 'w-full h-0.5' 
                  : 'w-0 h-0.5 group-hover/link:w-full group-hover/link:h-1'
              }`}></span>
            </Link>
            <Link 
              href="/dernieres-parutions" 
              className="text-primary-700 font-medium transition-colors duration-200 relative py-2 group/link"
            >
              Dernières parutions
              <span className={`absolute bottom-0 left-0 bg-accent-500 transition-all duration-300 ${
                isActive('/dernieres-parutions') 
                  ? 'w-full h-0.5' 
                  : 'w-0 h-0.5 group-hover/link:w-full group-hover/link:h-1'
              }`}></span>
            </Link>
            <Link 
              href="/travaux-presse" 
              className="text-primary-700 font-medium transition-colors duration-200 relative py-2 group/link"
            >
              Travaux presse
              <span className={`absolute bottom-0 left-0 bg-accent-500 transition-all duration-300 ${
                isActive('/travaux-presse') 
                  ? 'w-full h-0.5' 
                  : 'w-0 h-0.5 group-hover/link:w-full group-hover/link:h-1'
              }`}></span>
            </Link>
          </div>

          {/* Bouton Menu Mobile */}
          <button
            className="md:hidden text-primary-700 hover:text-primary-900 focus:outline-none transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-2 animate-slide-up">
            <div>
              <Link 
                href="/traduction" 
                className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-medium relative ${
                  isActive('/traduction') 
                    ? 'text-primary-900 bg-primary-50' 
                    : 'text-primary-700 hover:bg-primary-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Traduction
                {isActive('/traduction') && (
                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-l-lg"></span>
                )}
              </Link>
              <div className="pl-4 space-y-1 mt-1">
                <Link 
                  href="/traduction?tri=genre" 
                  className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Par genre
                </Link>
                <Link 
                  href="/traduction?tri=editeur" 
                  className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Par éditeur
                </Link>
                <Link 
                  href="/traduction?tri=date" 
                  className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Par date
                </Link>
              </div>
            </div>
            <Link 
              href="/cv-contact" 
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-medium relative ${
                isActive('/cv-contact') 
                  ? 'text-primary-900 bg-primary-50' 
                  : 'text-primary-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              CV/Contact
              {isActive('/cv-contact') && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-l-lg"></span>
              )}
            </Link>
            <Link 
              href="/dernieres-parutions" 
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-medium relative ${
                isActive('/dernieres-parutions') 
                  ? 'text-primary-900 bg-primary-50' 
                  : 'text-primary-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Dernières parutions
              {isActive('/dernieres-parutions') && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-l-lg"></span>
              )}
            </Link>
            <Link 
              href="/travaux-presse" 
              className={`block px-4 py-3 rounded-lg transition-colors duration-200 font-medium relative ${
                isActive('/travaux-presse') 
                  ? 'text-primary-900 bg-primary-50' 
                  : 'text-primary-700 hover:bg-primary-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Travaux presse
              {isActive('/travaux-presse') && (
                <span className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 rounded-l-lg"></span>
              )}
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

