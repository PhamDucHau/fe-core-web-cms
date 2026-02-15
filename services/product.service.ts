import axiosClient from "@/api/axiosClient";
import type {
  Product,
  ProductsResponse,
  ProductResponse,
  ProductsQueryParams,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateStockRequest,
  BulkStatusRequest,
  BulkStatusResponse,
} from "@/api/types";

export const productService = {
  // Get list of products with filtering, pagination, and sorting
  getProducts: async (params: ProductsQueryParams = {}): Promise<ProductsResponse> => {
    const response = await axiosClient.get<ProductsResponse>("/products", {
      params,
    });
    return response.data;
  },

  // Get single product by ID
  getProduct: async (id: string): Promise<ProductResponse> => {
    const response = await axiosClient.get<ProductResponse>(`/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (data: CreateProductRequest): Promise<ProductResponse> => {
    const response = await axiosClient.post<ProductResponse>("/products", data);
    return response.data;
  },

  // Update existing product
  updateProduct: async (id: string, data: UpdateProductRequest): Promise<ProductResponse> => {
    const response = await axiosClient.put<ProductResponse>(`/products/${id}`, data);
    return response.data;
  },

  // Soft delete product
  deleteProduct: async (id: string): Promise<{ message: string; id: string }> => {
    const response = await axiosClient.delete<{ message: string; id: string }>(`/products/${id}`);
    return response.data;
  },

  // Restore deleted product
  restoreProduct: async (id: string): Promise<ProductResponse> => {
    const response = await axiosClient.patch<ProductResponse>(`/products/${id}/restore`);
    return response.data;
  },

  // Update product stock
  updateStock: async (id: string, data: UpdateStockRequest): Promise<ProductResponse> => {
    const response = await axiosClient.patch<ProductResponse>(`/products/${id}/stock`, data);
    return response.data;
  },

  // Bulk update product status
  bulkUpdateStatus: async (data: BulkStatusRequest): Promise<BulkStatusResponse> => {
    const response = await axiosClient.patch<BulkStatusResponse>("/products/bulk/status", data);
    return response.data;
  },
};
