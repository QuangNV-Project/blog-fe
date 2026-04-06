'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Calendar, ArrowRight } from 'lucide-react'
import { useBlogPosts } from '@/api/actions/blog/useBlogQueries'
import { useCategories } from '@/api/actions/category/useCategoryQueries'
import { contentTypeLabel, contentTypeRoute } from './content-config'
import type { ContentType, NewsCategory } from '@/types/blog-management'

interface Props {
  contentType: ContentType
}

export function ContentSectionPage({ contentType }: Readonly<Props>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | string>('all')
  const [newsCategory, setNewsCategory] = useState<NewsCategory>('general')

  const { data: categoriesData } = useCategories(contentType)
  const { data: postsData, isLoading } = useBlogPosts({
    page: 1,
    limit: 12,
    status: 'published',
    contentType,
    newsCategory: contentType === 'news' ? newsCategory : undefined,
    search: searchQuery || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
  })
  const posts = postsData?.data ?? []

  const newsTabs: Array<{ id: NewsCategory; label: string }> = [
    { id: 'general', label: 'News' },
    { id: 'stock', label: 'Chứng khoán' },
    { id: 'coin', label: 'Coin' },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        <section className="border-b border-border/40">
          <div className="container py-12 space-y-6">
            <Badge variant="highlight">{contentTypeLabel[contentType]}</Badge>
            <h1 className="text-4xl font-bold">{contentTypeLabel[contentType]} Hub</h1>
            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={`Search ${contentTypeLabel[contentType]}...`}
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <div className="container py-10 space-y-8">
          {contentType === 'news' && (
            <section className="flex items-center gap-3 overflow-x-auto pb-1">
              {newsTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={newsCategory === tab.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNewsCategory(tab.id)}
                >
                  {tab.label}
                </Button>
              ))}
            </section>
          )}

          <section className="flex items-center gap-3 overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            {(categoriesData || []).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id.toString() ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </section>

          {isLoading ? (
            <p className="text-muted-foreground">Loading content...</p>
          ) : posts.length === 0 ? (
            <p className="text-muted-foreground">No content found.</p>
          ) : contentType === 'gallery' ? (
            <section className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance]">
              {posts.map((post) => (
                <Link key={post.id} href={`${contentTypeRoute[contentType]}/${post.id}`} className="mb-6 block break-inside-avoid">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?w=800&h=600&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardContent className="pt-4">
                      <p className="font-semibold line-clamp-2">{post.title}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </section>
          ) : (
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`${contentTypeRoute[contentType]}/${post.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <div className="relative aspect-video overflow-hidden rounded-t-xl">
                      <Image
                        src={post.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop'}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {post.sourceName && (
                        <Badge variant="outline" className="w-fit">
                          {post.sourceName}
                        </Badge>
                      )}
                      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US')}
                        </span>
                        <span className="inline-flex items-center gap-1 text-primary">
                          Read <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
