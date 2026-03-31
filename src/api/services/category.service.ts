import { Category } from "@/types/category"
import { ContentType } from "@/types/blog-management"
import { axiosInstance } from "../axios"

const CATEGORY_API_URL = '/fin-track/private/category'

const CATEGORY_ENDPOINTS = {
  GET_CATEGORIES: `${CATEGORY_API_URL}/`,
}

function unwrapApiResponse<T>(payload: any): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data as T
  }
  return payload as T
}

export const categoryService = {
  async getCategories(contentType?: ContentType): Promise<Category[]> {
    const response = await axiosInstance.get(CATEGORY_ENDPOINTS.GET_CATEGORIES, {
      params: { contentType },
    })
    return unwrapApiResponse<Category[]>(response.data)
  },
}