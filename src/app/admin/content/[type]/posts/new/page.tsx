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
import { ArrowLeft } from 'lucide-react'
import { useCreateBlogPost } from '@/api/actions/blog-management/useBlogAdminMutations'
import { AuditBlogPostDto } from '@/types/blog-management'
import { isAdminContentTypeParam } from '@/lib/admin-content-type'
import type { ContentType } from '@/types/blog-management'

export default function AdminCreatePostPage({
  params,
}: Readonly<{
  params: Promise<{ type: string }>
}>) {
  const { type: typeParam } = use(params)
  if (!isAdminContentTypeParam(typeParam)) {
    notFound()
  }
  const contentType = typeParam as ContentType
  const router = useRouter()
  const createMutation = useCreateBlogPost()
  const listPath = `/admin/content/${contentType}/posts`

  const handleSubmit = async (data: AuditBlogPostDto): Promise<void> => {
    await createMutation.mutateAsync({ ...data, contentType })
    router.push(listPath)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={listPath}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create post</h1>
          <p className="text-muted-foreground">New {contentType} entry</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Fill in fields below</CardDescription>
        </CardHeader>
        <CardContent>
          <BlogPostForm
            lockedContentType={contentType}
            variant={contentType === 'gallery' ? 'gallery' : 'article'}
            onSubmit={handleSubmit}
            onCancel={() => router.push(listPath)}
            isSubmitting={createMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  )
}
