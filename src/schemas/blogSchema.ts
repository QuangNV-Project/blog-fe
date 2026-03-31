import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  excerpt: z.string().max(500, 'Excerpt is too long').optional(),
  featuredImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  category: z.string().optional(),
  contentType: z.enum(['news', 'programming', 'gallery']).default('programming'),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

export const updateBlogPostSchema = blogPostSchema.partial()

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message is too long'),
})

export type BlogPostInput = z.infer<typeof blogPostSchema>
export type UpdateBlogPostInput = z.infer<typeof updateBlogPostSchema>
export type ContactFormInput = z.infer<typeof contactFormSchema>

