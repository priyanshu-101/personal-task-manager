import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { corsHeaders } from '@/lib/cors'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const origin = req.headers.get('origin')
  
  // Add CORS headers using our improved CORS utility
  const headers = corsHeaders(origin || undefined)
  Object.entries(headers).forEach(([key, value]) => {
    res.headers.set(key, value)
  })
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: headers,
    })
  }
  
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}