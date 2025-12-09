import { PaginationParams } from "./common"

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
    tags?: string[]
    category?: string
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
    status?: 'draft' | 'published'
  }
  
  export interface BlogFilterParams extends PaginationParams {
    status?: 'draft' | 'published' | 'archived' | 'all'
    search?: string
    category?: string
    tags?: string[]
    dateFrom?: string
    dateTo?: string
  }
  