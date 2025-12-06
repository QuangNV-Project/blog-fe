'use client'

import { useState } from 'react'
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

  // Calculate stats
  const stats = {
    total: postsData?.meta.total || 0,
    published: postsData?.data.filter((p) => p.status === 'published').length || 0,
    drafts: postsData?.data.filter((p) => p.status === 'draft').length || 0,
    archived: postsData?.data.filter((p) => p.status === 'archived').length || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
      <div className="container space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Blog Management</h1>
              <p className="text-muted-foreground mt-2">
                Create, manage, and publish your blog posts with ease
              </p>
            </div>
            <Button onClick={handleCreate} size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Plus className="h-5 w-5 mr-2" />
              Create New Post
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                      <p className="text-3xl font-bold mt-2">{stats.total}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Published</p>
                      <p className="text-3xl font-bold mt-2">{stats.published}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Drafts</p>
                      <p className="text-3xl font-bold mt-2">{stats.drafts}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Card className="border-border/60 bg-card/60 backdrop-blur-xl hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Archived</p>
                      <p className="text-3xl font-bold mt-2">{stats.archived}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-gray-500/10 flex items-center justify-center">
                      <Archive className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <Card className="border-border/60 bg-card/60 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <CardTitle>Posts</CardTitle>
              <CardDescription>
                View and manage all your blog posts in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Filters */}
              <BlogFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                categories={categories}
              />

              {/* Table */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-16 space-y-4"
                  >
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading blog posts...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
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
                                return (
                                  page === 1 ||
                                  page === totalPages ||
                                  Math.abs(page - currentPage) <= 1
                                )
                              })
                              .map((page, index, array) => {
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
                      <div className="text-sm text-muted-foreground text-center py-4 border-t border-border/40">
                        Showing {postsData.data.length} of {postsData.meta.total} results
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent className="border-border/60 bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-destructive" />
              </div>
              Delete Blog Post?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. This will permanently delete the
              blog post <span className="font-semibold text-foreground">&quot;{deletePost?.title}&quot;</span> from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

