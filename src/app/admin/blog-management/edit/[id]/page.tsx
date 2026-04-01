'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useBlogPost } from '@/api/actions/blog/useBlogQueries'

export default function LegacyBlogEditRedirect({
  params,
}: Readonly<{
  params: Promise<{ id: string }>
}>) {
  const { id } = use(params)
  const router = useRouter()
  const postId = Number.parseInt(id, 10)
  const { data: post, isLoading, isError } = useBlogPost(postId)

  useEffect(() => {
    if (post?.contentType) {
      router.replace(`/admin/content/${post.contentType}/posts/${post.id}/edit`)
    }
  }, [post, router])

  useEffect(() => {
    if (!isLoading && (isError || !post)) {
      router.replace('/admin/content/programming/posts')
    }
  }, [isLoading, isError, post, router])

  if (isLoading) {
    return (
      <div className="container max-w-5xl py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isError || !post) {
    return null
  }

  return (
    <div className="container max-w-5xl py-16 flex justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}
