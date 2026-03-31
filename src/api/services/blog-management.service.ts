import { axiosInstance } from '@/api/axios'
import {  BlogFilterParams, BlogPost, AuditBlogPostDto } from '@/types/blog-management'
import { PaginatedResponse } from '@/types/common'

const BLOG_ADMIN_API_URL = '/fin-track/private/admin'

const BLOG_ADMIN_ENDPOINTS = {
  GET_POSTS: `${BLOG_ADMIN_API_URL}/`,
  GET_POST_BY_ID: `${BLOG_ADMIN_API_URL}/detail/:id`,
  CREATE_POST: `${BLOG_ADMIN_API_URL}/create`,
  UPDATE_POST: `${BLOG_ADMIN_API_URL}/update`,
  DELETE_POST: `${BLOG_ADMIN_API_URL}/delete`,
  PUBLISH_POST: `${BLOG_ADMIN_API_URL}/publish/:id`,
  ARCHIVE_POST: `${BLOG_ADMIN_API_URL}/archive/:id`,
}

function unwrapApiResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T
  }
  return payload as T
}

export const blogManagementService = {
  // Get all blog posts with filters
  async getPosts(params?: BlogFilterParams): Promise<PaginatedResponse<BlogPost>> {
    const response = await axiosInstance.get(BLOG_ADMIN_ENDPOINTS.GET_POSTS, { params })
    return unwrapApiResponse<PaginatedResponse<BlogPost>>(response.data)
  },
  // Get single blog post by ID
  async getPostById(id: number): Promise<BlogPost> {
    const response = await axiosInstance.get(BLOG_ADMIN_ENDPOINTS.GET_POST_BY_ID.replace(':id', id.toString()))
    return unwrapApiResponse<BlogPost>(response.data)
  },
  // Create new blog post
  async createPost(data: AuditBlogPostDto): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.CREATE_POST, data)
    return unwrapApiResponse<BlogPost>(response.data)
  },

  // Update blog post
  async updatePost(id: number, data: AuditBlogPostDto): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.UPDATE_POST, data, { params: { blogId: id } })
    return unwrapApiResponse<BlogPost>(response.data)
  },

  // Delete blog post
  async deletePost(id: number): Promise<void> {
    await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.DELETE_POST, null, { params: { blogId: id } })
  },

  // Publish draft
  async publishPost(id: number): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.PUBLISH_POST.replace(':id', id.toString()))
    return unwrapApiResponse<BlogPost>(response.data)
  },

  // Archive post
  async archivePost(id: number): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.ARCHIVE_POST.replace(':id', id.toString()))
    return unwrapApiResponse<BlogPost>(response.data)
  },
}

