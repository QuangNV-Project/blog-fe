'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { BlogFilters } from '@/components/blog-admin/blog-filters'
import { BlogTable } from '@/components/blog-admin/blog-table'
import { Plus, Loader2, FileText, CheckCircle2, Archive, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBlogPosts } from '@/api/actions/blog/useBlogQueries'
import { useCategories } from '@/api/actions/category/useCategoryQueries'
import {
  useArchiveBlogPost,
  useDeleteBlogPost,
  usePublishBlogPost,
} from '@/api/actions/blog-management/useBlogAdminMutations'
import { BlogFilterParams, BlogPost, type ContentType } from '@/types/blog-management'
import { adminContentTypeLabel } from '@/lib/admin-content-type'
import { cn } from '@/lib/utils'

interface ContentPostsAdminPageProps {
  contentType: ContentType
}

export function ContentPostsAdminPage({
  contentType,
}: Readonly<ContentPostsAdminPageProps>) {
  const router = useRouter()
  const [filters, setFilters] = useState<BlogFilterParams>({
    page: 1,
    limit: 10,
    contentType,
  })
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null)

  const filtersWithType = useMemo(
    () => ({ ...filters, contentType }),
    [filters, contentType]
  )

  const { data: postsData, isLoading } = useBlogPosts(filtersWithType)
  const { data: categories } = useCategories(contentType)
  const deleteMutation = useDeleteBlogPost()
  const publishMutation = usePublishBlogPost()
  const archiveMutation = useArchiveBlogPost()

  const basePath = `/admin/content/${contentType}/posts`

  const handleFilterChange = (newFilters: BlogFilterParams) => {
    setFilters({ ...newFilters, contentType })
  }

  const handlePageChange = (page: number) => {
    setFilters((f) => ({ ...f, page, contentType }))
  }

  const handleCreate = () => {
    router.push(`${basePath}/new`)
  }

  const handleEdit = (post: BlogPost) => {
    router.push(`${basePath}/${post.id}/edit`)
  }

  const handleView = (post: BlogPost) => {
    router.push(`/blog/${post.id}`)
  }

  const handleDelete = (post: BlogPost) => {
    setDeletePost(post)
  }

  const confirmDelete = async () => {
    if (deletePost) {
      await deleteMutation.mutateAsync(deletePost.id)
      setDeletePost(null)
    }
  }

  const handlePublish = async (post: BlogPost) => {
    await publishMutation.mutateAsync(post.id)
  }

  const handleArchive = async (post: BlogPost) => {
    await archiveMutation.mutateAsync(post.id)
  }

  const totalPages = postsData?.meta.totalPages || 1
  const currentPage = filters.page || 1

  const stats = {
    total: postsData?.meta.total || 0,
    published: postsData?.data.filter((p) => p.status === 'published').length || 0,
    drafts: postsData?.data.filter((p) => p.status === 'draft').length || 0,
    archived: postsData?.data.filter((p) => p.status === 'archived').length || 0,
  }

  const sectionLabel = adminContentTypeLabel(contentType)

  return (
    <div className="min-h-[60vh] space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{sectionLabel} posts</h1>
            <p className="text-muted-foreground mt-2">
              Manage {contentType} content for the site
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" className="shadow-md">
            <Plus className="h-5 w-5 mr-2" />
            New post
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: FileText },
            { label: 'Published', value: stats.published, icon: CheckCircle2, tone: 'text-green-500' },
            { label: 'Drafts', value: stats.drafts, icon: AlertCircle, tone: 'text-yellow-500' },
            { label: 'Archived', value: stats.archived, icon: Archive, tone: 'text-gray-500' },
          ].map(({ label, value, icon: Icon, tone }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Card className="border-border/60 bg-card/60">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{label}</p>
                      <p className="text-2xl font-bold mt-1">{value}</p>
                    </div>
                    <Icon className={cn('h-8 w-8 opacity-80', tone)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Card className="border-border/60 bg-card/60 shadow-lg">
        <CardHeader>
          <CardTitle>Posts</CardTitle>
          <CardDescription>List, filter, and edit {sectionLabel.toLowerCase()} entries</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <BlogFilters
            filters={filtersWithType}
            onFilterChange={handleFilterChange}
            categories={categories}
            lockedContentType={contentType}
          />

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 space-y-4"
              >
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading posts…</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <BlogTable
                  posts={postsData?.data || []}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPublish={handlePublish}
                  onArchive={handleArchive}
                  onView={handleView}
                />

                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) handlePageChange(currentPage - 1)
                            }}
                            className={
                              currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                            }
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (page) =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - currentPage) <= 1
                          )
                          .map((page, index, array) => {
                            const prevPage = array[index - 1]
                            const showEllipsis = prevPage && page - prevPage > 1
                            return (
                              <PaginationItem key={page}>
                                {showEllipsis && <span className="px-4">…</span>}
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(page)
                                  }}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          })}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < totalPages) handlePageChange(currentPage + 1)
                            }}
                            className={
                              currentPage === totalPages
                                ? 'pointer-events-none opacity-50'
                                : ''
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}

                {postsData && (
                  <div className="text-sm text-muted-foreground text-center py-4 border-t border-border/40">
                    Showing {postsData.data.length} of {postsData.meta.total} results
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This cannot be undone. Post &quot;{deletePost?.title}&quot; will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
