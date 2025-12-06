'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  BookmarkPlus,
  Twitter,
  Facebook,
  Linkedin,
  Link as LinkIcon,
  User,
  Tag,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Mock data - replace with real data fetching
const mockPost = {
  id: '1',
  title: 'Getting Started with Next.js 16: The Complete Guide',
  description:
    'Explore the latest features in Next.js 16 including improved App Router, enhanced performance, and new developer tools.',
  content: `
# Introduction

Next.js 16 brings a revolutionary set of features that will transform how we build web applications. In this comprehensive guide, we'll explore all the major updates and how to leverage them in your projects.

## What's New in Next.js 16

The latest version introduces several groundbreaking features:

### Enhanced App Router

The App Router has been significantly improved with better performance and developer experience. Key improvements include:

- **Faster navigation** with optimized client-side routing
- **Improved data fetching** with enhanced caching strategies
- **Better error handling** with granular error boundaries
- **Streaming improvements** for better progressive rendering

### Performance Optimizations

Next.js 16 focuses heavily on performance:

1. **Automatic code splitting** - Only load what you need
2. **Optimized image loading** - Built-in lazy loading and optimization
3. **Enhanced caching** - Smarter cache invalidation strategies
4. **Reduced bundle sizes** - Better tree-shaking and minification

### Developer Experience

The DX improvements are substantial:

- New debugging tools integrated into the dev server
- Better TypeScript support with improved type inference
- Enhanced error messages with actionable suggestions
- Faster Hot Module Replacement (HMR)

## Getting Started

To get started with Next.js 16, simply run:

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## Best Practices

Here are some best practices when working with Next.js 16:

- Always use the App Router for new projects
- Leverage Server Components by default
- Use Client Components only when necessary
- Implement proper error boundaries
- Optimize images with the Image component
- Use dynamic imports for heavy components

## Conclusion

Next.js 16 represents a major leap forward in web development. With its focus on performance, developer experience, and modern React patterns, it's the perfect framework for building production-ready applications.

Start exploring these features today and take your Next.js applications to the next level!
  `,
  date: '2024-01-15',
  readTime: '8 min read',
  category: 'Tutorial',
  tags: ['Next.js', 'React', 'Web Development', 'Performance'],
  image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
  author: {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    bio: 'Full-stack developer and tech writer',
  },
}

const relatedPosts = [
  {
    id: 2,
    title: 'Mastering TanStack Query',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=200&fit=crop',
    date: '2024-01-12',
    readTime: '12 min read',
  },
  {
    id: 3,
    title: 'Modern CSS Techniques',
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=200&fit=crop',
    date: '2024-01-10',
    readTime: '10 min read',
  },
]

export default function BlogPostPage() {
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = (platform: string) => {
    const url = window.location.href
    const text = mockPost.title

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400')
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <>
      <Header />

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted z-50">
        <motion.div
          className="h-full bg-primary"
          style={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(59,130,246,0.1),transparent_50%)]" />

          <div className="relative container py-8">
            <Button variant="ghost" asChild className="mb-6">
              <Link href="/blog">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <Badge className="bg-primary/10 text-primary border-primary/20">
                {mockPost.category}
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {mockPost.title}
              </h1>

              <p className="text-xl text-muted-foreground">
                {mockPost.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-3">
                  <Image
                    src={mockPost.author.avatar}
                    alt={mockPost.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium text-foreground">{mockPost.author.name}</p>
                    <p className="text-xs">{mockPost.author.bio}</p>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-10" />

                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {new Date(mockPost.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {mockPost.readTime}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {mockPost.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Image */}
        <section className="container py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/60 shadow-2xl">
              <Image
                src={mockPost.image}
                alt={mockPost.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </section>

        <div className="container pb-16">
          <div className="max-w-5xl mx-auto grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Main Content */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="prose prose-lg dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-muted-foreground prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                prose-pre:bg-muted prose-pre:border prose-pre:border-border
                prose-img:rounded-lg prose-img:shadow-lg
                prose-li:marker:text-primary"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: mockPost.content.split('\n').map(line => {
                    if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
                    if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
                    if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
                    if (line.match(/^\d+\./)) return `<li>${line.slice(line.indexOf('.') + 1).trim()}</li>`
                    if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
                    if (line.startsWith('```')) return line.includes('bash') ? '<pre><code class="language-bash">' : '</code></pre>'
                    if (line.trim() === '') return '<br />'
                    return `<p>${line}</p>`
                  }).join('')
                }}
              />
            </motion.article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Share Actions */}
              <Card className="p-6 sticky top-24 space-y-4 border-border/60 bg-card/60 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </h3>
                  <Button
                    size="icon"
                    variant={isBookmarked ? 'default' : 'outline'}
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="h-8 w-8"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                    className="w-full"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                    className="w-full"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                    className="w-full"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('copy')}
                    className="w-full"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </Card>

              {/* Author Card */}
              <Card className="p-6 space-y-4 border-border/60 bg-card/60 backdrop-blur-xl">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  About the Author
                </h3>
                <div className="flex items-start gap-3">
                  <Image
                    src={mockPost.author.avatar}
                    alt={mockPost.author.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="font-medium">{mockPost.author.name}</p>
                    <p className="text-sm text-muted-foreground">{mockPost.author.bio}</p>
                  </div>
                </div>
              </Card>
            </aside>
          </div>

          {/* Related Posts */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-5xl mx-auto mt-16 space-y-6"
          >
            <h2 className="text-3xl font-bold">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.id}`}>
                  <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </>
  )
}

