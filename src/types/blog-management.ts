import { PaginationParams } from "./common"

export type ContentType = 'news' | 'programming' | 'gallery'
export type NewsCategory = 'general' | 'stock' | 'coin'

export interface BlogPost {
    id: number
    title: string
    slug: string
    content: string
    excerpt: string
    featuredImage?: string
    author: string
    authorId: number
    status: 'draft' | 'published' | 'archived'
    contentType: ContentType
    newsCategory?: NewsCategory
    tags?: string[]
    category?: string
    categoryId?: number
    publishedAt?: string
    viewCount: number
    featured?: boolean
    sortOrder?: number
    sourceName?: string
    sourceUrl?: string
    externalNews?: boolean
    fetchedAt?: string
    createdAt: string
    updatedAt: string
  }

  export interface ExternalNewsDetail {
    title: string
    sourceUrl: string
    sourceName: string
    contentHtml: string
  }
  
  /** Alias for update mutations (same shape as create body). */
  export type UpdateBlogPostDto = AuditBlogPostDto

  export interface AuditBlogPostDto {
    title: string
    content: string
    excerpt?: string
    featuredImage?: string
    tags?: string[]
    category?: string
    contentType?: ContentType
    status?: 'draft' | 'published'
    featured?: boolean
    sortOrder?: number
  }
  
  export interface BlogFilterParams extends PaginationParams {
    status?: 'draft' | 'published' | 'archived' | 'all'
    contentType?: ContentType
    search?: string
    category?: string
    tags?: string[]
    dateFrom?: string
    dateTo?: string
    newsCategory?: NewsCategory
  }
  