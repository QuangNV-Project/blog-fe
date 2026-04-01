import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { authService } from '@/api/services/auth.service'
import { decodeJwtPayload, isAdminFromRoles } from '@/lib/jwt-payload'
import type { LoginMutationResponse } from '@/types/auth'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const type = searchParams.get('type')

  if (!code) {
    return redirect(`/login?error=${encodeURIComponent('No code received')}`)
  }

  let data: LoginMutationResponse
  try {
    data = await authService.handleExchangeAuthCode({ code, type })
    const cookieStore = await cookies()

    cookieStore.set('access-token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    cookieStore.set('refresh-token', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
  } catch (err: unknown) {
    console.error('Auth Callback Error:', err)
    return redirect(`/login?error=${encodeURIComponent('Authentication failed')}`)
  }

  const payload = decodeJwtPayload(data.accessToken)
  const admin =
    payload?.type !== 'refresh' && isAdminFromRoles(payload?.roles)

  let dest = state?.trim() || '/'
  if (admin) {
    if (!dest.startsWith('/admin')) {
      dest = '/admin/content'
    }
  } else if (dest.startsWith('/admin')) {
    dest = '/'
  }

  redirect(dest)
}
