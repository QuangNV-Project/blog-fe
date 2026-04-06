import { axiosInstance } from '@/api/axios'
import { BlogFilterParams, BlogPost, AuditBlogPostDto, ExternalNewsDetail } from '@/types/blog-management'
import { PaginatedResponse } from '@/types/common'

/** Paths are resolved against `axios` baseURL (browser: `/api/proxy`, server: backend origin). */
const BLOG_ADMIN_ENDPOINTS = {
  GET_POSTS: '/blog/public/blog-management/all',
  GET_POST_BY_ID: '/blog/public/blog-management/detail/:id',
  GET_EXTERNAL_NEWS_DETAIL: '/blog/public/blog-management/external-detail',
  CREATE_POST: '/blog/private/blog-management/create',
  UPDATE_POST: '/blog/private/blog-management/update',
  DELETE_POST: '/blog/private/blog-management/delete',
  PUBLISH_POST: '/blog/private/blog-management/publish/:id',
  ARCHIVE_POST: '/blog/private/blog-management/archive/:id',
}

export const blogManagementService = {
  // Get all blog posts with filters
  async getPosts(params?: BlogFilterParams): Promise<PaginatedResponse<BlogPost>> {
    const { data } = await axiosInstance.get<PaginatedResponse<BlogPost>>(
      BLOG_ADMIN_ENDPOINTS.GET_POSTS,
      { params }
    )
    return data
  },
  // Get single blog post by ID
  async getPostById(id: number): Promise<BlogPost> {
    const { data } = await axiosInstance.get<BlogPost>(
      BLOG_ADMIN_ENDPOINTS.GET_POST_BY_ID.replace(':id', id.toString())
    )
    return data
  },
  // Get external article detail by source URL
  async getExternalNewsDetail(url: string): Promise<ExternalNewsDetail> {
    const { data } = await axiosInstance.get<ExternalNewsDetail>(
      BLOG_ADMIN_ENDPOINTS.GET_EXTERNAL_NEWS_DETAIL,
      { params: { url } }
    )
    return data
  },
  // Create new blog post
  async createPost(data: AuditBlogPostDto): Promise<BlogPost> {
    const { data: created } = await axiosInstance.post<BlogPost>(BLOG_ADMIN_ENDPOINTS.CREATE_POST, data)
    return created
  },

  // Update blog post
  async updatePost(id: number, data: AuditBlogPostDto): Promise<BlogPost> {
    const { data: updated } = await axiosInstance.post<BlogPost>(
      BLOG_ADMIN_ENDPOINTS.UPDATE_POST,
      data,
      { params: { blogId: id } }
    )
    return updated
  },

  // Delete blog post
  async deletePost(id: number): Promise<void> {
    await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.DELETE_POST, null, { params: { blogId: id } })
  },

  // Publish draft
  async publishPost(id: number): Promise<BlogPost> {
    const { data } = await axiosInstance.post<BlogPost>(
      BLOG_ADMIN_ENDPOINTS.PUBLISH_POST.replace(':id', id.toString())
    )
    return data
  },

  // Archive post
  async archivePost(id: number): Promise<BlogPost> {
    const { data } = await axiosInstance.post<BlogPost>(
      BLOG_ADMIN_ENDPOINTS.ARCHIVE_POST.replace(':id', id.toString())
    )
    return data
  },
}

