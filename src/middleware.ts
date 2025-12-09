import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { env } from './config/env'

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // --- PHẦN 1: AUTHENTICATION LOGIC ---
  // Định nghĩa các route cần bảo vệ
  const protectedPaths = ['/dashboard', '/profile', '/admin', '/blog']

  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path))

  if (isProtectedRoute) {
    const token = request.cookies.get('access-token')?.value
    console.log("token",token)
    if (!token) {
      const fullPath = pathname.startsWith('/') ? pathname.slice() : pathname;

      const params = new URLSearchParams({
        redirectTo: origin,
        state: fullPath
      }).toString();
      console.log(`Redirecting to login URL: ${env.AUTH_URL}?${params}`);
      const loginUrl = `${env.AUTH_URL}?${params}`;
      return NextResponse.redirect(loginUrl)
    }
  }

  // --- PHẦN 2: SECURITY HEADERS LOGIC ---
  const response = NextResponse.next()

  // Gán headers vào response này
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  // Content Security Policy (CSP)
  response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self'")

  return response
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/blog/:path*',
  ],
}

