import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { categoryService } from '@/api/services/category.service'
import type { CategoryUpsertReq } from '@/types/category'
import type { ContentType } from '@/types/blog-management'
import { categoriesKey } from './useCategoryQueries'

function invalidateListsForType(
  queryClient: ReturnType<typeof useQueryClient>,
  contentType: ContentType
) {
  void queryClient.invalidateQueries({ queryKey: categoriesKey.list(contentType) })
  void queryClient.invalidateQueries({ queryKey: categoriesKey.list(undefined) })
}

export function useCreateCategory(contentType: ContentType) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (body: Omit<CategoryUpsertReq, 'contentType'>) =>
      categoryService.create({ ...body, contentType }),
    onSuccess: () => {
      invalidateListsForType(queryClient, contentType)
      toast.success('Category created')
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Failed to create category')
    },
  })
}

export function useUpdateCategory(contentType: ContentType) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number
      body: Omit<CategoryUpsertReq, 'contentType'>
    }) =>
      categoryService.update(id, { ...body, contentType }),
    onSuccess: (_, { id }) => {
      invalidateListsForType(queryClient, contentType)
      void queryClient.invalidateQueries({ queryKey: categoriesKey.detail(id) })
      toast.success('Category updated')
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Failed to update category')
    },
  })
}

export function useDeleteCategory(contentType: ContentType) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoryService.delete(id),
    onSuccess: () => {
      invalidateListsForType(queryClient, contentType)
      toast.success('Category deleted')
    },
    onError: (e: Error) => {
      toast.error(e.message || 'Failed to delete category')
    },
  })
}
