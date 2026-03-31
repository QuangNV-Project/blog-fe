import type { ContentType } from '@/types/blog-management'

export const contentTypeLabel: Record<ContentType, string> = {
  news: 'News',
  programming: 'Programming',
  gallery: 'Gallery',
}

export const contentTypeRoute: Record<ContentType, string> = {
  news: '/news',
  programming: '/programming',
  gallery: '/gallery',
}
