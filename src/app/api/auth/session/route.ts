import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { decodeJwtPayload, isAdminFromRoles } from '@/lib/jwt-payload'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('access-token')?.value
  if (!token) {
    return NextResponse.json({ authenticated: false, isAdmin: false })
  }
  const payload = decodeJwtPayload(token)
  if (!payload || payload.type === 'refresh') {
    return NextResponse.json({ authenticated: false, isAdmin: false })
  }
  const roles = payload.roles ?? []
  return NextResponse.json({
    authenticated: true,
    isAdmin: isAdminFromRoles(roles),
    userName: payload.userName ?? null,
    userId: payload.userId ?? null,
    roles,
  })
}
