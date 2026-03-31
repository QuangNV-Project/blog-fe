export type JwtAccessPayload = {
  userId?: number
  userName?: string
  roles?: string[]
  type?: string
}

function base64UrlToJson(segment: string): string {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(padded, 'base64').toString('utf8')
  }
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}

export function decodeJwtPayload(token: string): JwtAccessPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const json = base64UrlToJson(parts[1])
    return JSON.parse(json) as JwtAccessPayload
  } catch {
    return null
  }
}

export function isAdminFromRoles(roles: string[] | undefined): boolean {
  if (!roles?.length) return false
  return roles.some((r) => r === 'ROLE_ADMIN' || r === 'ADMIN')
}
