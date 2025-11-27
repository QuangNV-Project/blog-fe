'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUploadBlogImages } from '@/api/actions/platform/usePlatformMutations'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  onRemove?: () => void
  label?: string
  description?: string
  maxSizeMB?: number
  aspectRatio?: string
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  label = 'Featured Image',
  description = 'Upload a featured image for your blog post',
  maxSizeMB = 5,
  aspectRatio = 'aspect-video',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const uploadMutation = useUploadBlogImages()

  const handleFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      // Validate file size
      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        alert(`File size must be less than ${maxSizeMB}MB`)
        return
      }

      try {
        const result = await uploadMutation.mutateAsync([file])
        onChange(result[0]?.url ?? '')
      } catch (error) {
        console.error('Upload failed:', error)
      }
    },
    [maxSizeMB, onChange, uploadMutation]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        handleFile(file)
      }
    },
    [handleFile]
  )

  const handleRemove = useCallback(() => {
    onChange('')
    onRemove?.()
  }, [onChange, onRemove])

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      {value ? (
        <div className="relative group">
          <div className={cn('relative overflow-hidden rounded-lg', aspectRatio)}>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
            disabled={uploadMutation.isPending}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 transition-colors',
            aspectRatio,
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            uploadMutation.isPending && 'pointer-events-none opacity-50'
          )}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadMutation.isPending}
          />
          <div className="flex flex-col items-center justify-center gap-4 h-full">
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </>
            ) : (
              <>
                <div className="rounded-full bg-primary/10 p-4">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drag and drop your image here
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    or click to browse (max {maxSizeMB}MB)
                  </p>
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

