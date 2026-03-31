'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { env } from '@/config/env'
import { Badge } from '@/components/ui/badge'
import { SectionSwitcher } from '@/components/layout/section-switcher'
import { UserAccountMenu } from '@/components/layout/user-account-menu'

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <span className="font-semibold text-lg tracking-tight">{env.appName}</span>
            <Badge variant="highlight" className="hidden sm:inline-flex">
              Edu layout
            </Badge>
          </Link>
          <SectionSwitcher />
          <nav className="hidden items-center gap-5 lg:flex">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link href="/content" className="text-sm font-medium transition-colors hover:text-primary">
              Hub
            </Link>
            <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
              About
            </Link>
          </nav>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/contact">Contact</Link>
          </Button>
          <UserAccountMenu />
        </div>
      </div>
    </header>
  )
}
