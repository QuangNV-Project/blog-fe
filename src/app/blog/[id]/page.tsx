import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import Link from 'next/link'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // In a real app, you would fetch the post data here
  const post = {
    id,
    title: 'Sample Blog Post',
    date: '2024-01-15',
    content:
      'This is a sample blog post. In a real application, you would fetch this data from your API or database.',
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-8rem)] p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Button asChild variant="outline">
            <Link href="/blog">← Back to Blog</Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{post.title}</CardTitle>
              <CardDescription>{post.date}</CardDescription>
            </CardHeader>
            <CardContent className="prose dark:prose-invert max-w-none">
              <p>{post.content}</p>
              <p>
                This is where your blog post content would go. You can use
                markdown, MDX, or any other format you prefer.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}

