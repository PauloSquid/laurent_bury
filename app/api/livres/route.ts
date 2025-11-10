import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { readFile } from 'fs/promises'
import { join } from 'path'

const LIVRES_FILE = join(process.cwd(), 'livres.json')

const normalizePriority = (value: unknown): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return null
    const parsed = Number(trimmed)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const withIds = searchParams.get('withIds') === 'true'

    // Si Supabase n'est pas configuré, utiliser le fichier JSON comme fallback
    if (!isSupabaseConfigured || !supabase) {
      const envCheck = {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        env: process.env.NODE_ENV
      }
      console.warn('Supabase non configuré, utilisation du fichier livres.json comme fallback', envCheck)
      
      // En production, logger une erreur plus explicite
      if (process.env.NODE_ENV === 'production') {
        console.error('⚠️ PRODUCTION: Variables Supabase manquantes!')
        console.error('URL configurée:', envCheck.url)
        console.error('Key configurée:', envCheck.key)
        console.error('Vérifiez les variables d\'environnement dans Vercel: NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY')
      }
      
      try {
        const fileContents = await readFile(LIVRES_FILE, 'utf8')
        const livres = JSON.parse(fileContents)
        return NextResponse.json(
          Array.isArray(livres)
            ? livres.map((livre: any) => ({
                ...livre,
                priorite: normalizePriority(livre?.priorite)
              }))
            : []
        )
      } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error)
        return NextResponse.json({ error: 'Erreur lors de la lecture' }, { status: 500 })
      }
    }

    const { data, error } = await supabase
      .from('livres')
      .select('*')
      .order('priorite', { ascending: true, nullsFirst: false })
      .order('titre', { ascending: true })

    if (error) {
      console.error('Erreur Supabase:', error)
      // Fallback vers le fichier JSON en cas d'erreur Supabase
      try {
        const fileContents = await readFile(LIVRES_FILE, 'utf8')
        const livres = JSON.parse(fileContents)
        console.warn('Fallback vers livres.json en raison d\'une erreur Supabase')
        return NextResponse.json(
          Array.isArray(livres)
            ? livres.map((livre: any) => ({
                ...livre,
                priorite: normalizePriority(livre?.priorite)
              }))
            : []
        )
      } catch (fileError) {
        return NextResponse.json({ error: 'Erreur lors de la récupération des livres' }, { status: 500 })
      }
    }

    const livres = data.map(({ created_at, updated_at, ...livre }) => ({
      ...livre,
      priorite: normalizePriority((livre as any).priorite)
    }))

    if (withIds) {
      // Retourner les données avec l'ID pour l'admin
      return NextResponse.json(livres)
    }

    // Retourner les données sans l'ID pour la compatibilité avec l'ancien format
    return NextResponse.json(
      livres.map(({ id, ...livreSansId }) => livreSansId)
    )
  } catch (error) {
    console.error('Erreur lors de la lecture:', error)
    // Dernier fallback vers le fichier JSON
    try {
      const fileContents = await readFile(LIVRES_FILE, 'utf8')
      const livres = JSON.parse(fileContents)
      console.warn('Fallback vers livres.json en raison d\'une erreur')
      return NextResponse.json(
        Array.isArray(livres)
          ? livres.map((livre: any) => ({
              ...livre,
              priorite: normalizePriority(livre?.priorite)
            }))
          : []
      )
    } catch (fileError) {
      return NextResponse.json({ error: 'Erreur lors de la lecture' }, { status: 500 })
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré. Veuillez configurer Supabase pour ajouter des livres.' }, { status: 503 })
    }

    const livre = await request.json()
    
    // Validation basique
    if (!livre.titre) {
      return NextResponse.json({ error: 'Le titre est requis' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('livres')
      .insert([{
        auteur: livre.auteur || null,
        titre: livre.titre,
        date: livre.date || null,
        editeur: livre.editeur || null,
        genre: livre.genre || null,
        info_supplementaires: livre.info_supplementaires || null,
        image_url: livre.image_url || null,
        priorite: normalizePriority(livre.priorite)
      }])
      .select()
      .single()

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ error: 'Erreur lors de la création du livre' }, { status: 500 })
    }

    const { id, created_at, updated_at, ...livreResponse } = data
    return NextResponse.json(livreResponse, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré. Veuillez configurer Supabase pour modifier des livres.' }, { status: 503 })
    }

    const body = await request.json()
    
    // Si c'est un tableau, c'est pour la compatibilité avec l'ancien code (remplacement complet)
    if (Array.isArray(body)) {
      // Supprimer tous les livres existants
      const { error: deleteError } = await supabase
        .from('livres')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000') // Condition qui correspond toujours

      if (deleteError) {
        console.error('Erreur lors de la suppression:', deleteError)
        return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
      }

      // Insérer tous les nouveaux livres
      if (body.length > 0) {
        const livresToInsert = body.map(livre => ({
          auteur: livre.auteur || null,
          titre: livre.titre || null,
          date: livre.date || null,
          editeur: livre.editeur || null,
          genre: livre.genre || null,
          info_supplementaires: livre.info_supplementaires || null,
          image_url: livre.image_url || null,
          priorite: normalizePriority(livre.priorite)
        }))

        const { error: insertError } = await supabase
          .from('livres')
          .insert(livresToInsert)

        if (insertError) {
          console.error('Erreur lors de l\'insertion:', insertError)
          return NextResponse.json({ error: 'Erreur lors de l\'insertion' }, { status: 500 })
        }
      }

      return NextResponse.json({ success: true })
    }
    
    // Sinon, c'est une mise à jour d'un livre spécifique (avec id)
    if (!body.id) {
      return NextResponse.json({ error: 'L\'ID est requis pour la mise à jour' }, { status: 400 })
    }

    const { id, ...updateData } = body
    const { data, error } = await supabase
      .from('livres')
      .update({
        auteur: updateData.auteur || null,
        titre: updateData.titre,
        date: updateData.date || null,
        editeur: updateData.editeur || null,
        genre: updateData.genre || null,
        info_supplementaires: updateData.info_supplementaires || null,
        image_url: updateData.image_url || null,
        priorite: normalizePriority(updateData.priorite)
      })
      .eq('id', id)
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

export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({ error: 'Supabase n\'est pas configuré. Veuillez configurer Supabase pour supprimer des livres.' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'L\'ID est requis' }, { status: 400 })
    }

    const { error } = await supabase
      .from('livres')
      .delete()
      .eq('id', id)

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

