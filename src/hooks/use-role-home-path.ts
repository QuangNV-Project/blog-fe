'use client'

import { useMemo } from 'react'
import { useAuthSessionQuery } from '@/hooks/use-auth-session-query'

const ADMIN_HOME = '/admin/content'
const PUBLIC_HOME = '/'

/**
 * Home URL for nav: admin signed-in → content admin hub; everyone else → public home.
 * Uses the same React Query cache as the header session (single fetch).
 */
export function useRoleHomePath(): { homePath: string; ready: boolean } {
  const { data, isPending } = useAuthSessionQuery()

  const homePath = useMemo(() => {
    if (!data) return PUBLIC_HOME
    if (data.authenticated && data.isAdmin) return ADMIN_HOME
    return PUBLIC_HOME
  }, [data])

  return { homePath, ready: !isPending }
}

export { ADMIN_HOME, PUBLIC_HOME }
