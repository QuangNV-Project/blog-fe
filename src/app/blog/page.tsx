import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

const mockPosts = [
  {
    id: 1,
    title: 'Getting Started with Next.js 16',
    description:
      'Learn how to build modern web applications with Next.js 16 and App Router',
    date: '2024-01-15',
  },
  {
    id: 2,
    title: 'Mastering TanStack Query',
    description:
      'Deep dive into data fetching and caching with TanStack Query',
    date: '2024-01-10',
  },
  {
    id: 3,
    title: 'Styling with Tailwind CSS',
    description: 'Best practices for building beautiful UIs with Tailwind CSS',
    date: '2024-01-05',
  },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Blog</h1>
            <p className="text-muted-foreground">
              Latest articles and tutorials
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPosts.map((post) => (
              <Card key={post.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <CardDescription>{post.date}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild className="w-full">
                    <Link href={`/blog/${post.id}`}>Read More</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

