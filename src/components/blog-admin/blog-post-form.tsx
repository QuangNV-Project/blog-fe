'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ImageUploader } from './image-uploader'
import { RichTextEditor } from './rich-text-editer'

import { Loader2 } from 'lucide-react'
import { blogPostSchema } from '@/schemas/blogSchema'
import { AuditBlogPostDto, BlogPost } from '@/types/blog-management'
import { useCategories } from '@/api/actions/category/useCategoryQueries'
import type { ContentType } from '@/types/blog-management'


type BlogPostFormData = z.infer<typeof blogPostSchema>

interface BlogPostFormProps {
  initialData?: BlogPost
  onSubmit: (data: AuditBlogPostDto) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  isEdit?: boolean
}

export function BlogPostForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false,
}: Readonly<BlogPostFormProps>) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      featuredImage: initialData?.featuredImage || '',
      category: initialData?.categoryId?.toString() || '',
      contentType: initialData?.contentType || 'programming',
      tags: initialData?.tags || [],
      status: (initialData?.status as 'draft' | 'published') || 'draft',
    },
  })

  const selectedContentType = watch('contentType') as ContentType
  const selectedCategory = watch('category')
  const { data: categories } = useCategories(selectedContentType)
  const selectedCategoryExists = (categories || []).some((category) => category.id.toString() === selectedCategory)

  const onSubmitForm = async (data: BlogPostFormData) => {
    await onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter blog post title"
              {...register('title')}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              placeholder="Brief summary of your blog post (optional)"
              rows={3}
              {...register('excerpt')}
              disabled={isSubmitting}
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive">
                {errors.excerpt.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              This will be displayed in blog listings and search results
            </p>
          </div>

          {/* Featured Image */}
          <Controller
            name="featuredImage"
            control={control}
            render={({ field }) => (
              <ImageUploader
                value={field.value}
                onChange={field.onChange}
                label="Featured Image"
                description="Upload a featured image for your blog post (max 5MB)"
              />
            )}
          />
          {errors.featuredImage && (
            <p className="text-sm text-destructive">
              {errors.featuredImage.message}
            </p>
          )}

          {/* Content - Rich Text Editor */}
          <div className="space-y-2">
            <Label>
              Content <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Write your blog content. You can format text, add images, and links.
            </p>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                />
              )}
            />
            {errors.content && (
              <p className="text-sm text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Content Type */}
          <div className="space-y-2">
            <Label htmlFor="contentType">Section</Label>
            <Controller
              name="contentType"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value)
                    setValue('category', '')
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="contentType">
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="gallery">Gallery</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {!selectedCategoryExists && selectedCategory && (
              <p className="text-xs text-muted-foreground">Selected category is not available in this section.</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Draft posts are not visible to the public
            </p>
          </div>

          {/* Tags (simplified - can be enhanced) */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Enter tags separated by commas"
              defaultValue={initialData?.tags?.join(', ') || ''}
              onChange={(e) => {
                const tags = e.target.value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                setValue('tags', tags)
              }}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Separate tags with commas
            </p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isEdit ? 'Update' : 'Create'} Blog Post
        </Button>
      </div>
    </form>
  )
}

