'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, ArrowLeft } from 'lucide-react'
import { useBlogPost, useBlogPosts } from '@/api/actions/blog/useBlogQueries'
import { contentTypeLabel, contentTypeRoute } from './content-config'
import type { ContentType } from '@/types/blog-management'

interface Props {
  contentType: ContentType
}

export function ContentDetailPage({ contentType }: Readonly<Props>) {
  const params = useParams<{ id: string }>()
  const id = Number(params.id)
  const { data: post, isLoading } = useBlogPost(id)
  const { data: relatedData } = useBlogPosts({ page: 1, limit: 3, status: 'published', contentType })
  const relatedPosts = (relatedData?.data || []).filter((p) => p.id !== id).slice(0, 2)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <section className="container py-8 space-y-6">
          <Button variant="ghost" asChild>
            <Link href={contentTypeRoute[contentType]}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {contentTypeLabel[contentType]}
            </Link>
          </Button>

          {isLoading || !post ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <article className="max-w-4xl mx-auto space-y-6">
              <Badge variant="highlight">{contentTypeLabel[contentType]}</Badge>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US')}
              </div>
              {post.featuredImage && (
                <div className="relative aspect-video rounded-xl overflow-hidden border">
                  <Image src={post.featuredImage} alt={post.title} fill className="object-cover" unoptimized />
                </div>
              )}
              <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
            </article>
          )}
        </section>

        {relatedPosts.length > 0 && (
          <section className="container pb-16">
            <h2 className="text-2xl font-bold mb-4">Related</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {relatedPosts.map((item) => (
                <Link key={item.id} href={`${contentTypeRoute[contentType]}/${item.id}`} className="rounded-lg border p-4 hover:bg-muted/40">
                  <p className="font-semibold line-clamp-2">{item.title}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
