"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/services/blog.service";
import type { BlogsQueryParams, CreateBlogDTO, UpdateBlogDTO } from "@/types/blog.type";

export const BLOGS_QUERY_KEY = "blogs";
export const BLOG_QUERY_KEY = "blog";

/**
 * Hook để lấy danh sách blogs với pagination và search
 */
export function useBlogs(params: BlogsQueryParams = {}) {
  const { page = 1, limit = 10, search = "" } = params;

  return useQuery({
    queryKey: [BLOGS_QUERY_KEY, page, limit, search],
    queryFn: () => blogService.getBlogs({ page, limit, search }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook để lấy chi tiết một blog theo ID
 */
export function useBlog(id: string | number | undefined) {
  return useQuery({
    queryKey: [BLOG_QUERY_KEY, id],
    queryFn: () => blogService.getBlogById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook để tạo blog mới
 */
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBlogDTO) => blogService.createBlog(data),
    onSuccess: () => {
      // Invalidate và refetch danh sách blogs
      queryClient.invalidateQueries({
        queryKey: [BLOGS_QUERY_KEY],
      });
    },
  });
}

/**
 * Hook để cập nhật blog
 */
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: UpdateBlogDTO }) =>
      blogService.updateBlog(id, data),
    onSuccess: (_, variables) => {
      // Invalidate danh sách blogs
      queryClient.invalidateQueries({
        queryKey: [BLOGS_QUERY_KEY],
      });
      // Invalidate blog detail
      queryClient.invalidateQueries({
        queryKey: [BLOG_QUERY_KEY, variables.id],
      });
    },
  });
}

/**
 * Hook để xóa blog
 */
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => blogService.deleteBlog(id),
    onSuccess: () => {
      // Invalidate và refetch danh sách blogs
      queryClient.invalidateQueries({
        queryKey: [BLOGS_QUERY_KEY],
      });
    },
  });
}

/**
 * Hook để upload ảnh
 */
export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => blogService.uploadImage(file),
  });
}
