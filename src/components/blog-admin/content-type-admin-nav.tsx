'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { ContentType } from '@/types/blog-management'
import { adminContentTypeLabel } from '@/lib/admin-content-type'

interface ContentTypeAdminNavProps {
  contentType: ContentType
}

export function ContentTypeAdminNav({
  contentType,
}: Readonly<ContentTypeAdminNavProps>) {
  const pathname = usePathname()
  const base = `/admin/content/${contentType}`

  const links = [
    { href: `${base}/posts`, label: 'Posts' },
    { href: `${base}/categories`, label: 'Categories' },
  ] as const

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
      <span className="mr-2 text-sm font-medium text-muted-foreground">
        {adminContentTypeLabel(contentType)}
      </span>
      {links.map(({ href, label }) => {
        const postsSection = href.endsWith('/posts')
        const highlighted = postsSection
          ? pathname.startsWith(`${base}/posts`)
          : pathname.startsWith(`${base}/categories`)
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              highlighted
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            {label}
          </Link>
        )
      })}
      <Link
        href="/admin/content"
        className="ml-auto text-sm text-muted-foreground hover:text-foreground"
      >
        All sections
      </Link>
    </div>
  )
}
