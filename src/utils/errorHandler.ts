import axios from 'axios'
import type { ApiError } from '@/types/common'

export function handleApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data?.message || error.message,
      code: error.response?.status?.toString(),
      details: error.response?.data,
    }
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    }
  }

  return {
    message: 'An unknown error occurred',
  }
}

export function getErrorMessage(error: unknown): string {
  const apiError = handleApiError(error)
  return apiError.message
}

