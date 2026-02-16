"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";
import type {
  CategoriesQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/types";

export const CATEGORIES_QUERY_KEY = "categories";
export const CATEGORY_QUERY_KEY = "category";
export const CATEGORY_TREE_QUERY_KEY = "categoryTree";

// Hook to fetch list of categories
export function useCategories(params: CategoriesQueryParams = {}) {
  return useQuery({
    queryKey: [CATEGORIES_QUERY_KEY, params],
    queryFn: () => categoryService.getCategories(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch category tree
export function useCategoryTree(parentId?: string) {
  return useQuery({
    queryKey: [CATEGORY_TREE_QUERY_KEY, parentId],
    queryFn: () => categoryService.getCategoryTree(parentId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to fetch single category
export function useCategory(id: string | null) {
  return useQuery({
    queryKey: [CATEGORY_QUERY_KEY, id],
    queryFn: () => categoryService.getCategory(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

// Hook to create category
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_TREE_QUERY_KEY] });
    },
  });
}

// Hook to update category
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryRequest }) =>
      categoryService.updateCategory(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_TREE_QUERY_KEY] });
    },
  });
}

// Hook to delete category
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_TREE_QUERY_KEY] });
    },
  });
}

// Hook to restore category
export function useRestoreCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryService.restoreCategory(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_QUERY_KEY, id] });
      queryClient.invalidateQueries({ queryKey: [CATEGORY_TREE_QUERY_KEY] });
    },
  });
}
