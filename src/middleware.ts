import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from './config/env'

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl

  const needsLogin =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/admin')

  if (needsLogin) {
    const token = request.cookies.get('access-token')?.value
    if (!token) {
      const fullPath = pathname.startsWith('/') ? pathname.slice() : pathname
      const params = new URLSearchParams({
        redirectTo: origin,
        state: fullPath,
      }).toString()
      const loginUrl = env.AUTH_URL ? `${env.AUTH_URL}?${params}` : '/'
      return NextResponse.redirect(loginUrl)
    }
  }
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('X-Tenant-Code', env.TENANT_CODE)

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  // response.headers.set('X-Frame-Options', 'DENY')
  // response.headers.set('X-Content-Type-Options', 'nosniff')
  // response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  // response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'")

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/blog/:path*',
    '/news/:path*',
    '/programming/:path*',
    '/gallery/:path*',
    '/content/:path*',
  ],
}
