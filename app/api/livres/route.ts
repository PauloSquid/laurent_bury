import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

const LIVRES_FILE = join(process.cwd(), 'livres.json')

export async function GET() {
  try {
    const fileContents = await readFile(LIVRES_FILE, 'utf8')
    const livres = JSON.parse(fileContents)
    return NextResponse.json(livres)
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier:', error)
    return NextResponse.json({ error: 'Erreur lors de la lecture' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const livres = await request.json()
    
    // Validation basique
    if (!Array.isArray(livres)) {
      return NextResponse.json({ error: 'Les données doivent être un tableau' }, { status: 400 })
    }

    // Sauvegarder dans le fichier
    await writeFile(LIVRES_FILE, JSON.stringify(livres, null, 2), 'utf8')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de l\'écriture du fichier:', error)
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 })
  }
}

