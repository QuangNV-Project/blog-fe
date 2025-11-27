'use client'

import { use } from 'react'
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
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useBlogPost } from '@/api/actions/blog/useBlogQueries'
import { useUpdateBlogPost } from '@/api/actions/blog-management/useBlogAdminMutations'
import { UpdateBlogPostDto } from '@/types/blog-management'

export default function EditBlogPostPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = use(params)
  const router = useRouter()
  const postId = Number.parseInt(id)

  const { data: post, isLoading } = useBlogPost(postId)
  const updateMutation = useUpdateBlogPost()

  const handleSubmit = async (data: UpdateBlogPostDto) => {
    await updateMutation.mutateAsync({ id: postId, data })
    router.push('/admin/blog-management')
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container max-w-5xl py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Blog post not found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/blog-management">Back to List</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
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
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <p className="text-muted-foreground">
            Update your blog post information
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Blog Post Details</CardTitle>
          <CardDescription>
            Make changes to your blog post below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm
            initialData={post}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>
    </div>
  )
}

