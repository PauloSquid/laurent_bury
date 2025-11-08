import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const adminPassword = process.env.ADMIN_PASSWORD || ''
    
    if (!adminPassword) {
      return NextResponse.json({ 
        success: false, 
        error: 'Configuration manquante' 
      }, { status: 500 })
    }
    
    if (password === adminPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Mot de passe incorrect' 
      }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Erreur lors de la vérification' 
    }, { status: 500 })
  }
}
