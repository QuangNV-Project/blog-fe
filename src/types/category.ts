import type { ContentType } from './blog-management'

export interface Category {
    id: number
    name: string
    slug: string
    contentType: ContentType
    description: string
    createdAt: string
    updatedAt: string
}