'use client'

import { useRouter } from 'next/navigation'
import { BlogPostForm } from '@/components/blog-admin/blog-post-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCreateBlogPost } from '@/api/actions/blog-management/useBlogAdminMutations'
import { CreateBlogPostDto } from '@/types/blog-management'

export default function CreateBlogPostPage() {
  const router = useRouter()
  const createMutation = useCreateBlogPost()

  const handleSubmit = async (data: CreateBlogPostDto) => {
    await createMutation.mutateAsync(data)
    router.push('/admin/blog-management')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container max-w-5xl py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/blog-management">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Blog Post</h1>
          <p className="text-muted-foreground">
            Write and publish a new blog post
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your blog post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}

