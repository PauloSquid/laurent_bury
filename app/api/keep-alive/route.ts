import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/**
 * Route de keep-alive pour maintenir Supabase actif
 * Cette route fait une requête légère à Supabase pour éviter la mise en pause automatique
 * 
 * À appeler régulièrement via un cron job (ex: toutes les 6 heures)
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured || !supabase) {
      return NextResponse.json({
        success: false,
        message: 'Supabase non configuré',
        timestamp: new Date().toISOString()
      }, { status: 503 })
    }

    // Faire une requête très légère à Supabase pour maintenir la connexion active
    // On utilise SELECT 1 qui est la requête la plus simple possible
    const { data, error } = await supabase
      .from('livres')
      .select('id')
      .limit(1)

    if (error) {
      console.error('Erreur Supabase keep-alive:', error)
      return NextResponse.json({
        success: false,
        message: 'Erreur lors de la requête Supabase',
        error: error.message,
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Keep-alive réussi',
      timestamp: new Date().toISOString(),
      supabaseActive: true
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Erreur keep-alive:', error)
    return NextResponse.json({
      success: false,
      message: 'Erreur inattendue',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

