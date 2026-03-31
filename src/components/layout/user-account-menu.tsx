'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Loader2, LogIn, LogOut, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { buildAuthLoginUrl, buildAuthRegisterUrl } from '@/lib/auth-urls'
import { env } from '@/config/env'

type SessionPayload = {
  authenticated: boolean
  isAdmin?: boolean
  userName: string | null
  userId: number | null
  roles?: string[]
}

function initialsFromName(name: string | null): string {
  if (!name?.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export function UserAccountMenu() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/auth/session')
      .then((r) => r.json())
      .then((data: SessionPayload) => setSession(data))
      .catch(() => setSession({ authenticated: false, userName: null, userId: null }))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setSession({ authenticated: false, userName: null, userId: null })
      router.refresh()
      router.push('/')
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const returnPath = pathname || '/'
  const authConfigured = Boolean(env.AUTH_URL)
  const loginHref = origin && authConfigured ? buildAuthLoginUrl(origin, returnPath) : '#'
  const registerHref = origin && authConfigured ? buildAuthRegisterUrl(origin, returnPath) : '#'

  if (loading) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" disabled aria-label="Đang tải tài khoản">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </Button>
    )
  }

  if (!session?.authenticated) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-border/60" aria-label="Tài khoản">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-muted text-muted-foreground">
                <LogIn className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal text-muted-foreground">
            {authConfigured ? 'Chưa đăng nhập' : 'Chưa cấu hình NEXT_PUBLIC_AUTH_URL'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {authConfigured ? (
            <>
              <DropdownMenuItem asChild>
                <a href={loginHref} className="cursor-pointer">
                  <LogIn className="mr-2 h-4 w-4" />
                  Đăng nhập
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={registerHref} className="cursor-pointer">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Đăng ký
                </a>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem disabled>
                <LogIn className="mr-2 h-4 w-4" />
                Đăng nhập
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <UserPlus className="mr-2 h-4 w-4" />
                Đăng ký
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const label = session.userName || `User #${session.userId ?? ''}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 rounded-full px-1 pr-2 hover:bg-muted/80" aria-label="Menu tài khoản">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{initialsFromName(session.userName)}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-medium sm:inline">{session.userName || 'Tài khoản'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <span className="truncate text-sm font-medium">{label}</span>
            {session.userId != null && (
              <span className="text-xs font-normal text-muted-foreground">ID: {session.userId}</span>
            )}
            {session.isAdmin && (
              <span className="text-xs font-medium text-primary">Admin</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          Đăng xuất
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
