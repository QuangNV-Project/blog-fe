import { env } from '@/config/env'

export function buildAuthLoginUrl(origin: string, returnPath: string): string {
  const base = env.AUTH_URL
  if (!base) return '/'
  const params = new URLSearchParams({
    redirectTo: origin,
    state: returnPath.startsWith('/') ? returnPath : `/${returnPath}`,
  })
  return `${base}?${params.toString()}`
}

export function buildAuthRegisterUrl(origin: string, returnPath: string): string {
  const explicit = env.AUTH_URL
  const base =
    explicit ||
    (env.AUTH_URL ? env.AUTH_URL.replace(/\/login\/?$/i, '/register') : '')
  if (!base) return buildAuthLoginUrl(origin, returnPath)
  const params = new URLSearchParams({
    redirectTo: origin,
    state: returnPath.startsWith('/') ? returnPath : `/${returnPath}`,
  })
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}${params.toString()}`
}
