import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { authService } from '@/api/services/auth.service'

export async function GET(request: NextRequest) {
    //  Lấy searchParams từ request URL
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
        return redirect(`/login?error=${encodeURIComponent('No code received')}`)
    }

    try {
        const data = await authService.handleExchangeAuthCode({ code })
        // Set Cookies
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
    } catch (err: any) {
        console.error('Auth Callback Error:', err)
        return redirect(`/login?error=${encodeURIComponent('Authentication failed')}`)
    }

    redirect(state || '/')
}