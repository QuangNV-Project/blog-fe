'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Search, Calendar, Clock, ArrowRight, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 16: The Complete Guide',
    description:
      'Explore the latest features in Next.js 16 including improved App Router, enhanced performance, and new developer tools that will revolutionize your workflow.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Tutorial',
    tags: ['Next.js', 'React', 'Web Development'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    featured: true,
  },
  {
    id: 2,
    title: 'Mastering TanStack Query: Advanced Patterns',
    description:
      'Deep dive into advanced data fetching patterns, caching strategies, and optimistic updates with TanStack Query v5.',
    date: '2024-01-12',
    readTime: '12 min read',
    category: 'Deep Dive',
    tags: ['TanStack Query', 'React', 'State Management'],
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
  },
  {
    id: 3,
    title: 'Modern CSS: Grid, Flexbox, and Container Queries',
    description:
      'Master modern CSS layout techniques with practical examples and best practices for responsive design in 2024.',
    date: '2024-01-10',
    readTime: '10 min read',
    category: 'CSS',
    tags: ['CSS', 'Layout', 'Responsive Design'],
    image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop',
  },
  {
    id: 4,
    title: 'TypeScript 5.5: New Features and Improvements',
    description:
      'Explore the latest TypeScript features including improved type inference, new utility types, and performance enhancements.',
    date: '2024-01-08',
    readTime: '6 min read',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=400&fit=crop',
  },
  {
    id: 5,
    title: 'Building Accessible Web Applications',
    description:
      'Learn how to create inclusive web experiences with ARIA, semantic HTML, and keyboard navigation best practices.',
    date: '2024-01-05',
    readTime: '15 min read',
    category: 'Accessibility',
    tags: ['A11y', 'Web Standards', 'UX'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop',
  },
  {
    id: 6,
    title: 'Optimizing React Performance: Tips and Tricks',
    description:
      'Boost your React app performance with memoization, code splitting, and smart rendering strategies.',
    date: '2024-01-03',
    readTime: '11 min read',
    category: 'Performance',
    tags: ['React', 'Performance', 'Optimization'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
  },
]

const categories = ['All', 'Tutorial', 'Deep Dive', 'CSS', 'TypeScript', 'Accessibility', 'Performance']

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredPosts = mockPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPost = mockPosts.find((p) => p.featured)
  const regularPosts = filteredPosts.filter((p) => !p.featured)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/40">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_40%),radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.06),transparent_40%)]" />
          <div className="absolute inset-0 bg-grid-light dark:bg-grid-dark opacity-[0.02]" />

          <div className="relative container py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center space-y-6"
            >
              <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
                <Sparkles className="h-3 w-3 mr-1" />
                Latest Articles & Insights
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Discover <span className="text-primary">Knowledge</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore our curated collection of articles, tutorials, and insights on web development, design, and technology.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto mt-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 h-12 bg-background/80 backdrop-blur-xl border-border/60 focus-visible:ring-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container py-12 space-y-12">
          {/* Featured Post */}
          {featuredPost && selectedCategory === 'All' && !searchQuery && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-bold">Featured Article</h2>
              </div>

              <Link href={`/blog/${featuredPost.id}`}>
                <Card className="overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 group">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="relative aspect-video md:aspect-auto overflow-hidden">
                      <Image
                        src={featuredPost.image}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent md:bg-gradient-to-r" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                      <Badge className="w-fit mb-3 bg-primary/15 text-primary border-primary/20">
                        {featuredPost.category}
                      </Badge>
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition-colors">
                        {featuredPost.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {featuredPost.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4" />
                          {new Date(featuredPost.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-fit group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all">
                        Read Article
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.section>
          )}

          {/* Category Filter */}
          <section className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? 'shadow-lg' : ''}
              >
                {category}
              </Button>
            ))}
          </section>

          {/* Blog Grid */}
          <section>
            <AnimatePresence mode="wait">
              {regularPosts.length > 0 ? (
                <motion.div
                  key="posts-grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {regularPosts.map((post, idx) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                    >
                      <Link href={`/blog/${post.id}`} className="h-full block group">
                        <Card className="h-full flex flex-col overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                          <div className="relative aspect-video overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-background/90 backdrop-blur-sm text-foreground border-border/60">
                                {post.category}
                              </Badge>
                            </div>
                          </div>
                          <CardHeader className="flex-1">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 mt-2">
                              {post.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
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
                            <div className="flex flex-wrap gap-1.5">
                              {post.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="ghost" className="w-full group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                              Read More
                              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-16"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">No articles found</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filter to find what you&apos;re looking for.
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                  }}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}

