'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Archive,
  Send,
} from 'lucide-react'
import type { BlogPost } from '@/types/blog-management'
import { format } from 'date-fns'
import Image from 'next/image'

interface BlogTableProps {
  posts: BlogPost[]
  onEdit: (post: BlogPost) => void
  onDelete: (post: BlogPost) => void
  onPublish?: (post: BlogPost) => void
  onArchive?: (post: BlogPost) => void
  onView?: (post: BlogPost) => void
}

const statusColors = {
  draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  published: 'bg-green-500/10 text-green-500 border-green-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

export function BlogTable({
  posts,
  onEdit,
  onDelete,
  onPublish,
  onArchive,
  onView,
}: BlogTableProps) {
  return (
    <div className="border rounded-lg border-border/60 overflow-hidden bg-background/40">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px] font-semibold">Image</TableHead>
            <TableHead className="font-semibold">Title</TableHead>
            <TableHead className="font-semibold">Author</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Category</TableHead>
            <TableHead className="font-semibold w-[90px]">Featured</TableHead>
            <TableHead className="font-semibold w-[80px]">Sort</TableHead>
            <TableHead className="font-semibold">Views</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="w-[80px] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-16">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                    <Edit className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">No blog posts found</p>
                  <p className="text-sm text-muted-foreground">Create your first post to get started</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  {post.featuredImage ? (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-border/40 shadow-sm">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted border border-border/40 flex items-center justify-center">
                      <Edit className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium max-w-[300px]">
                  <div className="truncate">{post.title}</div>
                  {post.excerpt && (
                    <div className="text-xs text-muted-foreground truncate mt-1">
                      {post.excerpt}
                    </div>
                  )}
                </TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusColors[post.status]}
                  >
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell>{post.category || '-'}</TableCell>
                <TableCell>
                  {post.featured ? (
                    <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30">Yes</Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">{post.sortOrder ?? 0}</TableCell>
                <TableCell>{post.viewCount || 0}</TableCell>
                <TableCell>
                  {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {onView && (
                        <DropdownMenuItem onClick={() => onView(post)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => onEdit(post)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      {onPublish && post.status === 'draft' && (
                        <DropdownMenuItem onClick={() => onPublish(post)}>
                          <Send className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {onArchive && post.status === 'published' && (
                        <DropdownMenuItem onClick={() => onArchive(post)}>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(post)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

