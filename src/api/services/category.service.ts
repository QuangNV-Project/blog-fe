import { Category, CategoryUpsertReq } from '@/types/category'
import { ContentType } from '@/types/blog-management'
import { axiosInstance } from '../axios'

const CATEGORY_BASE = '/blog/private/category'
const CATEGORY_PUBLIC_BASE = '/blog/public/category'

const CATEGORY_ENDPOINTS = {
  GET_ALL: `${CATEGORY_PUBLIC_BASE}/all`,
  GET_BY_ID: `${CATEGORY_PUBLIC_BASE}/:id`,
  CREATE: `${CATEGORY_BASE}/create`,
  UPDATE: `${CATEGORY_BASE}/update`,
  DELETE: `${CATEGORY_BASE}/delete`,
}

export const categoryService = {
  async getCategories(contentType?: ContentType): Promise<Category[]> {
    const { data } = await axiosInstance.get<Category[]>(CATEGORY_ENDPOINTS.GET_ALL, {
      params: { contentType },
    })
    return data
  },

  async getCategory(id: number): Promise<Category> {
    const { data } = await axiosInstance.get<Category>(
      CATEGORY_ENDPOINTS.GET_BY_ID.replace(':id', String(id))
    )
    return data
  },

  async create(body: CategoryUpsertReq): Promise<Category> {
    const { data } = await axiosInstance.post<Category>(
      CATEGORY_ENDPOINTS.CREATE,
      body
    )
    return data
  },

  async update(categoryId: number, body: CategoryUpsertReq): Promise<Category> {
    const { data } = await axiosInstance.post<Category>(
      CATEGORY_ENDPOINTS.UPDATE,
      body,
      { params: { categoryId } }
    )
    return data
  },

  async delete(categoryId: number): Promise<void> {
    await axiosInstance.post(CATEGORY_ENDPOINTS.DELETE, null, {
      params: { categoryId },
    })
  },
}
