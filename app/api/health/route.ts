import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase'

export async function GET() {
  const health = {
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
    }
  }

  return NextResponse.json(health, {
    status: health.supabase.configured ? 200 : 503,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    }
  })
}

