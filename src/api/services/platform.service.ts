import { axiosInstance } from '@/api/axios'
import { UploadResponse } from '@/types/platform'

const PLATFORM_API_URL = '/platform/private/storage'

const PLATFORM_ENDPOINTS = {
  UPLOAD_IMAGES: `${PLATFORM_API_URL}/upload/images`,
  DELETE_IMAGE: `${PLATFORM_API_URL}/upload/image`,
  GET_PRESIGNED_UPLOAD_URL: `${PLATFORM_API_URL}/upload/presigned-url`,
}

export const platformService = {
  /**
   * Upload multiple images to MinIO
   */
  async uploadImages(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await axiosInstance.post<UploadResponse[]>(
      PLATFORM_ENDPOINTS.UPLOAD_IMAGES,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Delete image from MinIO
   */
  async deleteImage(fileUrl: string): Promise<void> {
    await axiosInstance.delete(PLATFORM_ENDPOINTS.DELETE_IMAGE, {
      data: { fileUrl },
    })
  },

  /**
   * Get presigned URL for upload (alternative approach)
   */
  async getPresignedUploadUrl(
    fileName: string,
    contentType: string
  ): Promise<{ uploadUrl: string; fileUrl: string }> {
    const response = await axiosInstance.post(PLATFORM_ENDPOINTS.GET_PRESIGNED_UPLOAD_URL, {
      fileName,
      contentType,
    })
    return response.data
  },
}

