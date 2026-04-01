'use client'

import { use } from 'react'
import { notFound, useRouter } from 'next/navigation'
import Link from 'next/link'
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
import { useBlogPost } from '@/api/actions/blog/useBlogQueries'
import { useUpdateBlogPost } from '@/api/actions/blog-management/useBlogAdminMutations'
import { UpdateBlogPostDto } from '@/types/blog-management'
import { isAdminContentTypeParam } from '@/lib/admin-content-type'
import type { ContentType } from '@/types/blog-management'

export default function AdminEditPostPage({
  params,
}: Readonly<{
  params: Promise<{ type: string; id: string }>
}>) {
  const { type: typeParam, id } = use(params)
  if (!isAdminContentTypeParam(typeParam)) {
    notFound()
  }
  const contentType = typeParam as ContentType
  const postId = Number.parseInt(id, 10)
  const router = useRouter()
  const listPath = `/admin/content/${contentType}/posts`

  const { data: post, isLoading } = useBlogPost(postId)
  const updateMutation = useUpdateBlogPost()

  const handleSubmit = async (data: UpdateBlogPostDto) => {
    await updateMutation.mutateAsync({
      id: postId,
      data: { ...data, contentType },
    })
    router.push(listPath)
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-5xl mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Post not found</p>
            <Button asChild className="mt-4">
              <Link href={listPath}>Back to list</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (post.contentType !== contentType) {
    notFound()
  }

  const variant = contentType === 'gallery' ? 'gallery' : 'article'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={listPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit post</h1>
          <p className="text-muted-foreground">{contentType}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Update fields below</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm
            initialData={post}
            lockedContentType={contentType}
            variant={variant}
            onSubmit={handleSubmit}
            onCancel={() => router.push(listPath)}
            isSubmitting={updateMutation.isPending}
            isEdit
          />
        </CardContent>
      </Card>
    </div>
  )
}
