'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronDown, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { contentTypeLabel, contentTypeRoute } from '@/components/content/content-config'
import type { ContentType } from '@/types/blog-management'

type SessionState = {
  loaded: boolean
  isAdmin: boolean
}

const CONTENT_TYPES: ContentType[] = ['news', 'programming', 'gallery']

function pathToSection(pathname: string): 'news' | 'programming' | 'gallery' | 'admin' | null {
  if (pathname.startsWith('/admin')) return 'admin'
  if (pathname.startsWith('/news')) return 'news'
  if (pathname.startsWith('/gallery')) return 'gallery'
  if (pathname.startsWith('/programming') || pathname.startsWith('/blog')) return 'programming'
  return null
}

export function SectionSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const [session, setSession] = useState<SessionState>({ loaded: false, isAdmin: false })

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data: { isAdmin?: boolean }) => {
        if (!cancelled) {
          setSession({ loaded: true, isAdmin: Boolean(data.isAdmin) })
        }
      })
      .catch(() => {
        if (!cancelled) setSession({ loaded: true, isAdmin: false })
      })
    return () => {
      cancelled = true
    }
  }, [])

  const current = pathToSection(pathname)
  const label =
    current === 'admin'
      ? 'Admin'
      : current && current !== 'admin'
        ? contentTypeLabel[current]
        : 'Chọn khu vực'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="min-w-[180px] max-w-[min(100vw-8rem,260px)] justify-between gap-2 border-border/80 bg-background/80 font-medium shadow-sm"
        >
          <span className="flex min-w-0 items-center gap-2">
            <LayoutGrid className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate">{label}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[220px]">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Nội dung (một lúc một khu vực)
        </DropdownMenuLabel>
        {CONTENT_TYPES.map((type) => (
          <DropdownMenuItem
            key={type}
            onSelect={() => router.push(contentTypeRoute[type])}
            className={current === type ? 'bg-primary/10 font-medium' : ''}
          >
            {contentTypeLabel[type]}
          </DropdownMenuItem>
        ))}
        {session.loaded && session.isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">Quản trị</DropdownMenuLabel>
            <DropdownMenuItem
              onSelect={() => router.push('/admin/blog-management')}
              className={current === 'admin' ? 'bg-primary/10 font-medium' : ''}
            >
              Blog management
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
