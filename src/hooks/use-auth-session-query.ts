'use client'

import { useQuery } from '@tanstack/react-query'

export type AuthSessionPayload = {
  authenticated?: boolean
  isAdmin?: boolean
  userName: string | null
  userId: number | null
  roles?: string[]
}

export const authSessionQueryKey = ['auth', 'session'] as const

async function fetchAuthSession(): Promise<AuthSessionPayload> {
  try {
    const r = await fetch('/api/auth/session')
    const data = (await r.json()) as Partial<AuthSessionPayload>
    return {
      authenticated: Boolean(data.authenticated),
      isAdmin: data.isAdmin,
      userName: data.userName ?? null,
      userId: data.userId ?? null,
      roles: data.roles,
    }
  } catch {
    return { authenticated: false, userName: null, userId: null }
  }
}

/**
 * Shared session query: one network request per cache window for all subscribers (header, switcher, home path).
 */
export function useAuthSessionQuery() {
  return useQuery({
    queryKey: authSessionQueryKey,
    queryFn: fetchAuthSession,
  })
}
