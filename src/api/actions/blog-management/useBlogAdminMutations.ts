import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { CreateBlogPostDto, UpdateBlogPostDto } from "@/types/blog-management"
import { blogManagementService } from "@/api/services/blog-management.service"
import { blogKeys } from "../blog/useBlogQueries"

// Create blog post
export function useCreateBlogPost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (data: CreateBlogPostDto) =>
        blogManagementService.createPost(data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
        toast.success('Blog post created successfully')
      },
      onError: (error: Error) => {
        toast.error('Failed to create blog post', {
          description: error.message,
        })
      },
    })
  }
  
  // Update blog post
  export function useUpdateBlogPost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: UpdateBlogPostDto }) =>
        blogManagementService.updatePost(id, data),
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
        queryClient.invalidateQueries({
          queryKey: blogKeys.detail(variables.id),
        })
        toast.success('Blog post updated successfully')
      },
      onError: (error: Error) => {
        toast.error('Failed to update blog post', {
          description: error.message,
        })
      },
    })
  }
  
  // Delete blog post
  export function useDeleteBlogPost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (id: number) => blogManagementService.deletePost(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
        toast.success('Blog post deleted successfully')
      },
      onError: (error: Error) => {
        toast.error('Failed to delete blog post', {
          description: error.message,
        })
      },
    })
  }
  
  // Publish blog post
  export function usePublishBlogPost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (id: number) => blogManagementService.publishPost(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) })
        toast.success('Blog post published successfully')
      },
      onError: (error: Error) => {
        toast.error('Failed to publish blog post', {
          description: error.message,
        })
      },
    })
  }
  
  // Archive blog post
  export function useArchiveBlogPost() {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: (id: number) => blogManagementService.archivePost(id),
      onSuccess: (_, id) => {
        queryClient.invalidateQueries({ queryKey: blogKeys.lists() })
        queryClient.invalidateQueries({ queryKey: blogKeys.detail(id) })
        toast.success('Blog post archived successfully')
      },
      onError: (error: Error) => {
        toast.error('Failed to archive blog post', {
          description: error.message,
        })
      },
    })
  }
  
  