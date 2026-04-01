'use client'

import { useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ZodTypeAny } from 'zod'
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
import { blogPostSchema, galleryPostSchema } from '@/schemas/blogSchema'
import { AuditBlogPostDto, BlogPost } from '@/types/blog-management'
import { useCategories } from '@/api/actions/category/useCategoryQueries'
import type { ContentType } from '@/types/blog-management'

/** Radix Select forbids `value=""`; map to real "no category" on submit. */
const CATEGORY_NONE = '__none__'

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
}

function buildGalleryHtml(
  title: string,
  imageUrl: string,
  caption?: string
): string {
  const alt = escapeAttr(title.slice(0, 200))
  const src = escapeAttr(imageUrl)
  const cap = caption?.trim()
  if (cap) {
    const safe = cap
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    return `<figure class="gallery-item"><img src="${src}" alt="${alt}" /><figcaption>${safe}</figcaption></figure>`
  }
  return `<figure class="gallery-item"><img src="${src}" alt="${alt}" /></figure>`
}

interface BlogPostFormProps {
  initialData?: BlogPost
  onSubmit: (data: AuditBlogPostDto) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  isEdit?: boolean
  /** Lock section (e.g. admin route `/admin/content/news/...`). */
  lockedContentType?: ContentType
  /** Gallery: image required, caption optional; article: rich HTML body. */
  variant?: 'article' | 'gallery'
}

export function BlogPostForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  isEdit = false,
  lockedContentType,
  variant = 'article',
}: Readonly<BlogPostFormProps>) {
  const isGallery = variant === 'gallery'
  const schema = useMemo(
    () => (isGallery ? galleryPostSchema : blogPostSchema),
    [isGallery]
  )

  const defaultContentType =
    lockedContentType ??
    initialData?.contentType ??
    (isGallery ? 'gallery' : 'programming')

  const form = useForm({
    resolver: zodResolver(schema as ZodTypeAny),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      excerpt: initialData?.excerpt || '',
      featuredImage: initialData?.featuredImage || '',
      category:
        initialData?.categoryId != null
          ? initialData.categoryId.toString()
          : CATEGORY_NONE,
      contentType: defaultContentType,
      tags: initialData?.tags || [],
      status: (initialData?.status as 'draft' | 'published') || 'draft',
      featured: initialData?.featured ?? false,
      sortOrder: initialData?.sortOrder ?? 0,
    },
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = form

  useEffect(() => {
    if (lockedContentType) {
      setValue('contentType', lockedContentType)
    }
  }, [lockedContentType, setValue])

  const selectedContentType = (lockedContentType ??
    (watch('contentType') as ContentType)) as ContentType
  const selectedCategory = watch('category')
  const { data: categories } = useCategories(selectedContentType)
  const categorySelectionInvalid =
    !!selectedCategory &&
    selectedCategory !== CATEGORY_NONE &&
    !(categories || []).some((c) => c.id.toString() === selectedCategory)

  const onSubmitForm = async (data: Record<string, unknown>) => {
    const category = data.category as string | undefined
    const cat =
      !category || category === CATEGORY_NONE ? undefined : category
    const contentTypeOut =
      lockedContentType ?? (data.contentType as ContentType)

    if (isGallery) {
      const title = String(data.title ?? '')
      const imageUrl = String(data.featuredImage ?? '')
      const caption = String(data.content ?? '')
      const html = buildGalleryHtml(title, imageUrl, caption)
      await onSubmit({
        title,
        content: html,
        excerpt: (data.excerpt as string) || undefined,
        featuredImage: imageUrl,
        category: cat,
        contentType: contentTypeOut,
        tags: (data.tags as string[]) || undefined,
        status: data.status as 'draft' | 'published',
        featured: data.featured as boolean,
        sortOrder: data.sortOrder as number,
      })
      return
    }

    const { category: _c, ...rest } = data
    await onSubmit({
      ...(rest as unknown as AuditBlogPostDto),
      category: cat,
      contentType: contentTypeOut,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-stretch lg:min-h-[260px]">
            {/* Left: title + excerpt — excerpt grows so row height matches image column */}
            <div className="flex min-h-0 min-w-0 flex-col gap-6 lg:h-full">
              <div className="shrink-0 space-y-2">
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
              <p className="text-sm text-destructive">
                {String(errors.title.message ?? '')}
              </p>
            )}
              </div>

              <div className="flex min-h-0 flex-1 flex-col gap-2">
                <Label htmlFor="excerpt" className="shrink-0">
                  Excerpt
                </Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your blog post (optional)"
                  rows={1}
                  className="min-h-[120px] flex-1 resize-y"
                  {...register('excerpt')}
                  disabled={isSubmitting}
                />
                {errors.excerpt && (
                  <p className="shrink-0 text-sm text-destructive">
                    {String(errors.excerpt.message ?? '')}
                  </p>
                )}
                <p className="shrink-0 text-xs text-muted-foreground">
                  Shown in listings and search results
                </p>
              </div>
            </div>

            {/* Right: featured image — stretches to same row height as left */}
            <div className="flex min-h-[200px] w-full flex-col lg:min-h-0 lg:h-full">
              <Controller
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <ImageUploader
                    value={field.value}
                    onChange={field.onChange}
                    label={isGallery ? 'Featured image *' : 'Featured Image'}
                    description="Max 5MB"
                    compact
                    fillColumn
                    className="lg:min-h-0"
                  />
                )}
              />
              {errors.featuredImage && (
                <p className="text-sm text-destructive">
                  {String(errors.featuredImage.message ?? '')}
                </p>
              )}
            </div>
          </div>

          {!isGallery ? (
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
                  {String(errors.content.message ?? '')}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="gallery-caption">Caption (optional)</Label>
              <p className="text-sm text-muted-foreground">
                Plain text shown under the image. The featured image is the main media.
              </p>
              <Textarea
                id="gallery-caption"
                rows={4}
                placeholder="Short description…"
                {...register('content')}
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="text-sm text-destructive">
                  {String(errors.content.message ?? '')}
                </p>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          {!lockedContentType && (
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
                      setValue('category', CATEGORY_NONE)
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
          )}

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value === '' ? CATEGORY_NONE : field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={CATEGORY_NONE}>None</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {categorySelectionInvalid && (
              <p className="text-xs text-muted-foreground">
                Selected category is not available in this section.
              </p>
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

          <div className="flex items-center gap-3 rounded-lg border border-border/40 p-4">
            <input
              id="featured"
              type="checkbox"
              className="h-4 w-4 rounded border-border accent-primary"
              {...register('featured')}
              disabled={isSubmitting}
            />
            <div className="space-y-0.5">
              <Label htmlFor="featured" className="cursor-pointer font-medium">
                Featured
              </Label>
              <p className="text-xs text-muted-foreground">
                Ưu tiên hiển thị trên danh sách (cùng tab / trạng thái)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort order</Label>
            <Input
              id="sortOrder"
              type="number"
              min={0}
              step={1}
              {...register('sortOrder', { valueAsNumber: true })}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">Số nhỏ hơn xếp trước (sau featured)</p>
            {errors.sortOrder && (
              <p className="text-sm text-destructive">
                {String(errors.sortOrder.message ?? '')}
              </p>
            )}
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

