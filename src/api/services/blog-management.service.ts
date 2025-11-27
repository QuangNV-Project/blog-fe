import { axiosInstance } from '@/api/axios'
import {  BlogFilterParams, BlogPost, CreateBlogPostDto, UpdateBlogPostDto } from '@/types/blog-management'
import { PaginatedResponse } from '@/types/common'

const BLOG_ADMIN_PRIVATE_API_URL = '/api/blog/private/blog-management'
const BLOG_ADMIN_PUBLIC_API_URL = '/api/blog/public/blog-management'

const BLOG_ADMIN_ENDPOINTS = {
  GET_POSTS: `${BLOG_ADMIN_PUBLIC_API_URL}`,
  GET_POST_BY_ID: `${BLOG_ADMIN_PUBLIC_API_URL}/detail/:id`,
  CREATE_POST: `${BLOG_ADMIN_PRIVATE_API_URL}/create`,
  UPDATE_POST: `${BLOG_ADMIN_PRIVATE_API_URL}/update/:id`,
  DELETE_POST: `${BLOG_ADMIN_PRIVATE_API_URL}/delete/:id`,
  PUBLISH_POST: `${BLOG_ADMIN_PRIVATE_API_URL}/publish/:id`,
  ARCHIVE_POST: `${BLOG_ADMIN_PRIVATE_API_URL}/archive/:id`,
}

export const blogManagementService = {
  // Get all blog posts with filters
  async getPosts(params?: BlogFilterParams): Promise<PaginatedResponse<BlogPost>> {
    const response = await axiosInstance.get(BLOG_ADMIN_ENDPOINTS.GET_POSTS, { params })
    return response.data
  },
  // Get single blog post by ID
  async getPostById(id: number): Promise<BlogPost> {
    const response = await axiosInstance.get(BLOG_ADMIN_ENDPOINTS.GET_POST_BY_ID.replace(':id', id.toString()))
    return response.data
  },
  // Create new blog post
  async createPost(data: CreateBlogPostDto): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.CREATE_POST, data)
    return response.data
  },

  // Update blog post
  async updatePost(id: number, data: UpdateBlogPostDto): Promise<BlogPost> {
    const response = await axiosInstance.patch(BLOG_ADMIN_ENDPOINTS.UPDATE_POST.replace(':id', id.toString()), data)
    return response.data
  },

  // Delete blog post
  async deletePost(id: number): Promise<void> {
    await axiosInstance.delete(BLOG_ADMIN_ENDPOINTS.DELETE_POST.replace(':id', id.toString()))
  },

  // Publish draft
  async publishPost(id: number): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.PUBLISH_POST.replace(':id', id.toString()))
    return response.data
  },

  // Archive post
  async archivePost(id: number): Promise<BlogPost> {
    const response = await axiosInstance.post(BLOG_ADMIN_ENDPOINTS.ARCHIVE_POST.replace(':id', id.toString()))
    return response.data
  },
}

