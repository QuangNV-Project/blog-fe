import { categoryService } from "@/api/services/category.service"
import type { ContentType } from "@/types/blog-management"
import { useQuery } from "@tanstack/react-query"

export const categoriesKey = {
    all: ['category'] as const,
    lists: () => [...categoriesKey.all, 'list'] as const,
    list: (contentType?: ContentType) => [...categoriesKey.lists(), contentType ?? 'all'] as const,
  }
  
  // Get all blog posts
  export function useCategories(contentType?: ContentType) {
    return useQuery({
      queryKey: categoriesKey.list(contentType),
      queryFn: () => categoryService.getCategories(contentType),
    })
  }