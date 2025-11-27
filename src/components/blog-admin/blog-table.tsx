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
import type { BlogPost } from '@/api/services/blog-management.service'
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
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Views</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <p className="text-muted-foreground">No blog posts found</p>
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell>
                  {post.featuredImage ? (
                    <div className="relative w-16 h-16 rounded overflow-hidden">
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">
                        No image
                      </span>
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

