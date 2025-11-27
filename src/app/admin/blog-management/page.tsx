'use client'

import { useState } from 'react'
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
import { Plus, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useBlogPosts } from '@/api/actions/blog/useBlogQueries'
import { useCategories } from '@/api/actions/category/useCategoryQueries'
import { useArchiveBlogPost, useDeleteBlogPost, usePublishBlogPost } from '@/api/actions/blog-management/useBlogAdminMutations'
import { BlogFilterParams, BlogPost } from '@/types/blog-management'

export default function BlogManagementPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<BlogFilterParams>({
    page: 1,
    limit: 10,
  })
  const [deletePost, setDeletePost] = useState<BlogPost | null>(null)

  // Queries
  const { data: postsData, isLoading } = useBlogPosts(filters)
  const { data: categories } = useCategories()
  const deleteMutation = useDeleteBlogPost()
  const publishMutation = usePublishBlogPost()
  const archiveMutation = useArchiveBlogPost()

  const handleFilterChange = (newFilters: BlogFilterParams) => {
    setFilters(newFilters)
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  const handleCreate = () => {
    router.push('/admin/blog-management/create')
  }

  const handleEdit = (post: BlogPost) => {
    router.push(`/admin/blog-management/edit/${post.id}`)
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

  return (
    <div className="container py-8 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Blog Management</CardTitle>
            <CardDescription>
              Manage your blog posts, create new content, and publish updates
            </CardDescription>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Blog Post
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filters */}
          <BlogFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories}
          />

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <BlogTable
                posts={postsData?.data || []}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onArchive={handleArchive}
                onView={handleView}
              />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            if (currentPage > 1) {
                              handlePageChange(currentPage - 1)
                            }
                          }}
                          className={
                            currentPage === 1
                              ? 'pointer-events-none opacity-50'
                              : ''
                          }
                        />
                      </PaginationItem>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((page) => {
                          // Show first, last, current, and adjacent pages
                          return (
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - currentPage) <= 1
                          )
                        })
                        .map((page, index, array) => {
                          // Add ellipsis
                          const prevPage = array[index - 1]
                          const showEllipsis = prevPage && page - prevPage > 1

                          return (
                            <PaginationItem key={page}>
                              {showEllipsis && (
                                <span className="px-4">...</span>
                              )}
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
                            if (currentPage < totalPages) {
                              handlePageChange(currentPage + 1)
                            }
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

              {/* Results info */}
              {postsData && (
                <div className="text-sm text-muted-foreground text-center">
                  Showing {postsData.data.length} of {postsData.meta.total}{' '}
                  results
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post &quot;{deletePost?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

