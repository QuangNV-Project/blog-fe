import type { ContentType } from '@/types/blog-management'

export const ADMIN_CONTENT_TYPES: ContentType[] = ['news', 'programming', 'gallery']

export function isAdminContentTypeParam(
  value: string | undefined
): value is ContentType {
  return (
    value === 'news' || value === 'programming' || value === 'gallery'
  )
}

export function adminContentTypeLabel(type: ContentType): string {
  switch (type) {
    case 'news':
      return 'News'
    case 'programming':
      return 'Programming'
    case 'gallery':
      return 'Gallery'
    default: {
      const _exhaustive: never = type
      return _exhaustive
    }
  }
}
