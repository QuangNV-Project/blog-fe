import axios from 'axios'
import { env } from '@/config/env'

export const axiosInstance = axios.create({
  baseURL: env.BACK_END_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-Code': env.TENANT_CODE,
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

