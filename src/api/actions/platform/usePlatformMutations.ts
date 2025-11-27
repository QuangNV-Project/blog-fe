import { useMutation } from '@tanstack/react-query'
import { platformService } from '@/api/services/platform.service'
import { toast } from 'sonner'

export function useUploadBlogImages() {
  return useMutation({
    mutationFn: (files: File[]) => platformService.uploadImages(files),
    onError: (error: Error) => {
      toast.error('Upload failed', {
        description: error.message,
      })
    },
  })
}

export function useDeleteBlogImage() {
  return useMutation({
    mutationFn: (fileUrl: string) => platformService.deleteImage(fileUrl),
    onError: (error: Error) => {
      toast.error('Delete failed', {
        description: error.message,
      })
    },
  })
}
