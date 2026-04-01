'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { useRoleHomePath } from '@/hooks/use-role-home-path'

export function FooterHomeLink({
  className,
  children = 'Home',
}: Readonly<{
  className?: string
  children?: ReactNode
}>) {
  const { homePath } = useRoleHomePath()
  return (
    <Link href={homePath} className={className}>
      {children}
    </Link>
  )
}
