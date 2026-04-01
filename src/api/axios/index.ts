import axios from 'axios'
import { env, getAxiosBaseURL } from '@/config/env'

/**
 * Unwraps backend envelopes like `{ data: T, message?: string }` (e.g. ApiResponse).
 * If the body is not wrapped, returns it unchanged.
 */
export function unwrapApiEnvelope<T>(payload: unknown): T {
  if (payload !== null && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data
  }
  return payload as T
}

export const axiosInstance = axios.create({
  baseURL: getAxiosBaseURL(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Tenant-Code': env.TENANT_CODE,
  },
  // Cookie-based auth via `/api/proxy` only works when the browser sends cookies to same-origin
  withCredentials: true,
})

// httpOnly cookies are not readable in the browser; `/api/proxy` attaches Bearer from `access-token`.
// Optional: forward explicit Authorization (e.g. tests) without overriding if already set.
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response: normalize `response.data` to inner payload (same rules as unwrapApiEnvelope)
axiosInstance.interceptors.response.use(
  (response) => {
    response.data = unwrapApiEnvelope(response.data)
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

