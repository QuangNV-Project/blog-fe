import { categoryService } from '@/api/services/category.service'
import type { ContentType } from '@/types/blog-management'
import { useQuery } from '@tanstack/react-query'

export const categoriesKey = {
  all: ['category'] as const,
  lists: () => [...categoriesKey.all, 'list'] as const,
  list: (contentType?: ContentType) =>
    [...categoriesKey.lists(), contentType ?? 'all'] as const,
  details: () => [...categoriesKey.all, 'detail'] as const,
  detail: (id: number) => [...categoriesKey.details(), id] as const,
}

export function useCategories(contentType?: ContentType) {
  return useQuery({
    queryKey: categoriesKey.list(contentType),
    queryFn: () => categoryService.getCategories(contentType),
  })
}

export function useCategory(id: number, enabled = true) {
  return useQuery({
    queryKey: categoriesKey.detail(id),
    queryFn: () => categoryService.getCategory(id),
    enabled: enabled && Number.isFinite(id) && id > 0,
  })
}