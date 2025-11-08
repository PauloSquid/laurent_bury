import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré' }, { status: 503 })
    }

    const { id: livreId } = await params
    const { data, error } = await supabase
      .from('livres')
      .select('*')
      .eq('id', livreId)
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Livre non trouvé' }, { status: 404 })
    }

    const { id: _, created_at, updated_at, ...livre } = data
    return NextResponse.json(livre)
  } catch (error) {
    console.error('Erreur lors de la récupération:', error)
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré' }, { status: 503 })
    }

    const { id: livreId } = await params
    const livre = await request.json()
    
    const { data, error } = await supabase
      .from('livres')
      .update({
        auteur: livre.auteur || null,
        titre: livre.titre,
        date: livre.date || null,
        editeur: livre.editeur || null,
        genre: livre.genre || null,
        info_supplementaires: livre.info_supplementaires || null,
        image_url: livre.image_url || null
      })
      .eq('id', livreId)
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
    }

    const { id: _, created_at, updated_at, ...livreResponse } = data
    return NextResponse.json(livreResponse)
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
    return NextResponse.json({ error: 'Erreur lors de la mise à jour' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré' }, { status: 503 })
    }

    const { id: livreId } = await params
    const { error } = await supabase
      .from('livres')
      .delete()
      .eq('id', livreId)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}

