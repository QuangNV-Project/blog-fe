import { categoryService } from "@/api/services/category.service"
import { useQuery } from "@tanstack/react-query"

export const categoriesKey = {
    all: ['category'] as const,
    lists: () => [...categoriesKey.all, 'list'] as const,
  }
  
  // Get all blog posts
  export function useCategories() {
    return useQuery({
      queryKey: categoriesKey.lists(),
      queryFn: () => categoryService.getCategories(),
    })
  }