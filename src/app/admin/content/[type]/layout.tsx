import { notFound } from 'next/navigation'
import { isAdminContentTypeParam } from '@/lib/admin-content-type'
import { ContentTypeAdminNav } from '@/components/blog-admin/content-type-admin-nav'

export default async function AdminContentTypeLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ type: string }>
}>) {
  const { type } = await params
  if (!isAdminContentTypeParam(type)) {
    notFound()
  }

  return (
    <div className="container py-8 space-y-6">
      <ContentTypeAdminNav contentType={type} />
      {children}
    </div>
  )
}
