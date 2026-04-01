import { notFound } from 'next/navigation'
import { isAdminContentTypeParam } from '@/lib/admin-content-type'
import { ContentPostsAdminPage } from '@/components/blog-admin/content-posts-admin-page'

export default async function AdminContentPostsPage({
  params,
}: Readonly<{
  params: Promise<{ type: string }>
}>) {
  const { type } = await params
  if (!isAdminContentTypeParam(type)) {
    notFound()
  }
  return <ContentPostsAdminPage contentType={type} />
}
