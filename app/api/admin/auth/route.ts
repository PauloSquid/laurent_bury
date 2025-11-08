import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Récupérer le mot de passe depuis les variables d'environnement
    // On utilise ADMIN_PASSWORD (sans NEXT_PUBLIC_) pour plus de sécurité
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || ''
    
    // Debug en production - à retirer après résolution
    console.log('Admin password configured:', adminPassword ? 'YES' : 'NO')
    console.log('Password length:', adminPassword.length)
    console.log('Received password length:', password?.length)
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD not configured in environment variables')
      return NextResponse.json(
        { success: false, error: 'Configuration manquante. Veuillez contacter l\'administrateur.' },
        { status: 500 }
      )
    }
    
    // Comparaison stricte
    const isMatch = password === adminPassword
    
    if (isMatch) {
      return NextResponse.json({ success: true })
    } else {
      // Debug pour voir les différences
      console.log('Password mismatch')
      console.log('Expected length:', adminPassword.length)
      console.log('Received length:', password?.length)
      console.log('First char expected:', adminPassword.charAt(0))
      console.log('First char received:', password?.charAt(0))
      
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

