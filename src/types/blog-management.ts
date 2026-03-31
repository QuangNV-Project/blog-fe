import { PaginationParams } from "./common"

export type ContentType = 'news' | 'programming' | 'gallery'

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
    tags?: string[]
    category?: string
    categoryId?: number
    publishedAt?: string
    viewCount: number
    createdAt: string
    updatedAt: string
  }
  
  export interface AuditBlogPostDto {
    title: string
    content: string
    excerpt?: string
    featuredImage?: string
    tags?: string[]
    category?: string
    contentType?: ContentType
    status?: 'draft' | 'published'
  }
  
  export interface BlogFilterParams extends PaginationParams {
    status?: 'draft' | 'published' | 'archived' | 'all'
    contentType?: ContentType
    search?: string
    category?: string
    tags?: string[]
    dateFrom?: string
    dateTo?: string
  }
  