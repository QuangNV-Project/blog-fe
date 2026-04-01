'use client'

import { useEffect, useState } from 'react'

const ADMIN_HOME = '/admin/content'
const PUBLIC_HOME = '/'

type SessionJson = {
  authenticated?: boolean
  isAdmin?: boolean
}

/**
 * Home URL for nav: admin signed-in → content admin hub; everyone else → public home.
 */
export function useRoleHomePath(): { homePath: string; ready: boolean } {
  const [homePath, setHomePath] = useState(PUBLIC_HOME)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data: SessionJson) => {
        if (cancelled) return
        if (data.authenticated && data.isAdmin) {
          setHomePath(ADMIN_HOME)
        } else {
          setHomePath(PUBLIC_HOME)
        }
      })
      .catch(() => {
        if (!cancelled) setHomePath(PUBLIC_HOME)
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { homePath, ready }
}

export { ADMIN_HOME, PUBLIC_HOME }
