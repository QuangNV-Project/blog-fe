'use client'

import { useQuery} from '@tanstack/react-query'
import type { PaginationParams } from '@/types/common'
import { blogManagementService } from '@/api/services/blog-management.service'

export const blogKeys = {
  all: ['blog'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (params?: PaginationParams) => [...blogKeys.lists(), params] as const,
  details: () => [...blogKeys.all, 'detail'] as const,
  detail: (id: number) => [...blogKeys.details(), id] as const,
  detailBySlug: (slug: string) => [...blogKeys.details(), 'slug', slug] as const,
}

// Get all blog posts
export function useBlogPosts(params?: PaginationParams) {
  return useQuery({
    queryKey: blogKeys.list(params),
    queryFn: () => blogManagementService.getPosts(params),
  })
}

// Get single blog post by ID
export function useBlogPost(id: number) {
  return useQuery({
    queryKey: blogKeys.detail(id),
    queryFn: () => blogManagementService.getPostById(id),
    enabled: !!id,
  })
}

