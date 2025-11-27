import { Category } from "@/types/category"
import { axiosInstance } from "../axios"
const CATEGORY_API_URL = '/api/blog/public/categories'

const CATEGORY_ENDPOINTS = {
  GET_CATEGORIES: `${CATEGORY_API_URL}`,
}

export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const response = await axiosInstance.get(CATEGORY_ENDPOINTS.GET_CATEGORIES)
    return response.data
  },
}