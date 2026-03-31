import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decodeJwtPayload, isAdminFromRoles } from '@/lib/jwt-payload'

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const token = cookieStore.get('access-token')?.value
  if (!token) {
    redirect('/')
  }
  const payload = decodeJwtPayload(token)
  if (!payload || payload.type === 'refresh' || !isAdminFromRoles(payload.roles)) {
    redirect('/')
  }
  return <>{children}</>
}
