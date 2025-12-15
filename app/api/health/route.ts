import { NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  const health: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    supabase: {
      configured: isSupabaseConfigured,
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      // Ne pas exposer les vraies valeurs en production
      urlPreview: process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...` 
        : 'non configuré',
      connected: false,
    }
  }

  // Tester la connexion Supabase si elle est configurée
  if (isSupabaseConfigured && supabase) {
    try {
      // Faire une requête légère pour vérifier la connexion
      const { error } = await supabase
        .from('livres')
        .select('id')
        .limit(1)
      
      health.supabase.connected = !error
      if (error) {
        health.supabase.error = error.message
      }
    } catch (error: any) {
      health.supabase.connected = false
      health.supabase.error = error?.message || 'Erreur inconnue'
    }
  }

  return NextResponse.json(health, {
    status: health.supabase.configured && health.supabase.connected ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}

