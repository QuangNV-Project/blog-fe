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
  /** Smaller dropzone, icons, and copy for sidebars / dense forms */
  compact?: boolean
  /** Grow to match a sibling column (dropzone uses flex-1 instead of fixed aspect). */
  fillColumn?: boolean
  className?: string
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  label = 'Featured Image',
  description = 'Upload a featured image for your blog post',
  maxSizeMB = 5,
  aspectRatio = 'aspect-video',
  compact = false,
  fillColumn = false,
  className,
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

  const boxAspect =
    compact && !fillColumn ? 'aspect-[5/3] max-h-36' : !fillColumn ? aspectRatio : ''
  const dropPadding = compact ? 'p-4' : 'p-8'
  const iconWrap = compact ? 'p-2' : 'p-4'
  const iconSize = compact ? 'h-5 w-5' : 'h-8 w-8'
  const loaderSize = compact ? 'h-8 w-8' : 'h-12 w-12'

  const dropGrowClass = fillColumn ? 'flex-1 min-h-[160px] w-full' : ''
  const previewGrowClass = fillColumn ? 'flex-1 min-h-[180px] w-full' : ''

  return (
    <div
      className={cn(
        fillColumn ? 'flex h-full min-h-0 flex-col gap-1.5' : 'space-y-2',
        !fillColumn && compact && 'space-y-1.5',
        className
      )}
    >
      <label
        className={cn(
          'font-medium shrink-0',
          compact ? 'text-xs' : 'text-sm'
        )}
      >
        {label}
      </label>
      {description && (
        <p
          className={cn(
            'text-muted-foreground shrink-0',
            compact ? 'text-[11px] leading-snug' : 'text-sm'
          )}
        >
          {description}
        </p>
      )}

      {value ? (
        <div className={cn('relative group', fillColumn && 'flex min-h-0 flex-1 flex-col')}>
          <div
            className={cn(
              'relative overflow-hidden rounded-lg',
              boxAspect,
              fillColumn && previewGrowClass
            )}
          >
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
            'relative border-2 border-dashed rounded-lg transition-colors',
            dropPadding,
            boxAspect,
            dropGrowClass,
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
          <div
            className={cn(
              'flex flex-col items-center justify-center h-full',
              compact ? 'gap-2' : 'gap-4'
            )}
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className={cn(loaderSize, 'animate-spin text-primary')} />
                <p className={cn('text-muted-foreground', compact ? 'text-xs' : 'text-sm')}>
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <div className={cn('rounded-full bg-primary/10', iconWrap)}>
                  <ImageIcon className={cn(iconSize, 'text-primary')} />
                </div>
                <div className="text-center px-1">
                  <p className={cn('font-medium', compact ? 'text-xs' : 'text-sm')}>
                    {compact ? 'Drop or click' : 'Drag and drop your image here'}
                  </p>
                  {!compact && (
                    <p className="text-xs text-muted-foreground mt-1">
                      or click to browse (max {maxSizeMB}MB)
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={compact ? 'h-7 text-xs' : undefined}
                >
                  <Upload className={cn(compact ? 'h-3 w-3' : 'h-4 w-4', 'mr-2')} />
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

