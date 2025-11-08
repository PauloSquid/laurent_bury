import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Récupérer le mot de passe depuis les variables d'environnement
    // On utilise ADMIN_PASSWORD (sans NEXT_PUBLIC_) pour plus de sécurité
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
    
    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'Configuration manquante' },
        { status: 500 }
      )
    }
    
    if (password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { success: false, error: 'Mot de passe incorrect' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Erreur lors de la vérification:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la vérification' },
      { status: 500 }
    )
  }
}

