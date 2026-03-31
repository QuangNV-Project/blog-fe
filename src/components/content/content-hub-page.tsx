'use client'

import Link from 'next/link'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBlogPosts } from '@/api/actions/blog/useBlogQueries'
import { contentTypeLabel, contentTypeRoute } from './content-config'
import type { ContentType } from '@/types/blog-management'

const types: ContentType[] = ['news', 'programming', 'gallery']

export function ContentHubPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <section className="container py-12 space-y-3">
          <h1 className="text-4xl font-bold">Content Hub</h1>
          <p className="text-muted-foreground">Explore News, Programming, and Gallery in one place.</p>
        </section>

        <section className="container pb-16 grid md:grid-cols-3 gap-6">
          {types.map((type) => (
            <SectionCard key={type} contentType={type} />
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}

function SectionCard({ contentType }: Readonly<{ contentType: ContentType }>) {
  const { data } = useBlogPosts({ page: 1, limit: 4, status: 'published', contentType })
  const count = data?.meta.total ?? 0

  return (
    <Card className="h-full">
      <CardHeader>
        <Badge variant="highlight" className="w-fit mb-2">{contentTypeLabel[contentType]}</Badge>
        <CardTitle>{contentTypeLabel[contentType]}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{count} published entries</p>
        {(data?.data || []).slice(0, 3).map((post) => (
          <Link key={post.id} href={`${contentTypeRoute[contentType]}/${post.id}`} className="block text-sm hover:text-primary line-clamp-1">
            {post.title}
          </Link>
        ))}
        <Link href={contentTypeRoute[contentType]} className="text-sm text-primary font-medium">
          Browse {contentTypeLabel[contentType]}
        </Link>
      </CardContent>
    </Card>
  )
}
