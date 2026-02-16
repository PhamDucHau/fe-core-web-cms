import axiosClient from "@/api/axiosClient";
import type {
  Category,
  CategoriesResponse,
  CategoryResponse,
  CategoryTreeResponse,
  CategoriesQueryParams,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/api/types";

export const categoryService = {
  // Get list of categories with filtering, pagination, and sorting
  getCategories: async (params: CategoriesQueryParams = {}): Promise<CategoriesResponse> => {
    const response = await axiosClient.get<CategoriesResponse>("/categories", {
      params,
    });
    return response.data;
  },

  // Get category tree structure
  getCategoryTree: async (parentId?: string): Promise<CategoryTreeResponse> => {
    const params = parentId ? { parentId } : {};
    const response = await axiosClient.get<CategoryTreeResponse>("/categories/tree", {
      params,
    });
    return response.data;
  },

  // Get single category by ID
  getCategory: async (id: string): Promise<CategoryResponse> => {
    const response = await axiosClient.get<CategoryResponse>(`/categories/${id}`);
    return response.data;
  },

  // Create new category
  createCategory: async (data: CreateCategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosClient.post<CategoryResponse>("/categories", data);
    return response.data;
  },

  // Update existing category
  updateCategory: async (id: string, data: UpdateCategoryRequest): Promise<CategoryResponse> => {
    const response = await axiosClient.put<CategoryResponse>(`/categories/${id}`, data);
    return response.data;
  },

  // Soft delete category
  deleteCategory: async (id: string): Promise<{ message: string; id: string }> => {
    const response = await axiosClient.delete<{ message: string; id: string }>(`/categories/${id}`);
    return response.data;
  },

  // Restore deleted category
  restoreCategory: async (id: string): Promise<CategoryResponse> => {
    const response = await axiosClient.patch<CategoryResponse>(`/categories/${id}/restore`);
    return response.data;
  },
};
