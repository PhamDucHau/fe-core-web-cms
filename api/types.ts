// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

// User types
export interface User {
  id: string | number;
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  country?: string;
  status?: string;
  plan_name?: string;
  role?: string;
}

export interface UsersResponse {
  data: User[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface UsersQueryParams {
  page?: number;
  limit?: number;
}

// Product types
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface Product {
  _id: string;
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  stockQuantity: number;
  isInStock?: boolean;
  status: ProductStatus;
  categoryId?: string;
  category?: Category;
  brand?: string;
  thumbnailUrl?: string;
  images?: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  tags?: string[];
  ratingAverage?: number;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  sku: string;
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  currency?: string;
  stockQuantity?: number;
  status?: ProductStatus;
  categoryId?: string;
  brand?: string;
  thumbnailUrl?: string;
  images?: string[];
  weight?: number;
  dimensions?: ProductDimensions;
  tags?: string[];
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {}

export interface ProductsQueryParams {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
  status?: ProductStatus;
  brand?: string;
  isInStock?: boolean;
  tags?: string;
  page?: number | "all";
  limit?: number;
  sortBy?: "price" | "createdAt" | "name" | "ratingAverage" | "stockQuantity";
  sortOrder?: "asc" | "desc";
}

export interface ProductsResponse {
  data: Product[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface UpdateStockRequest {
  quantity: number;
}

export interface BulkStatusRequest {
  ids: string[];
  status: ProductStatus;
}

export interface BulkStatusResponse {
  message: string;
  modifiedCount: number;
}

// Category types
export type CategoryStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export interface CategoryAncestor {
  _id: string;
  name: string;
  slug: string;
}

export interface Category {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  parent?: Category;
  level: number;
  ancestors?: CategoryAncestor[];
  productCount?: number;
  status: CategoryStatus;
  sortOrder?: number;
  isDeleted?: boolean;
  children?: Category[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  parentId?: string | null;
  status?: CategoryStatus;
  sortOrder?: number;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

export interface CategoriesQueryParams {
  search?: string;
  parentId?: string | "root";
  status?: CategoryStatus;
  level?: number;
  page?: number | "all";
  limit?: number;
  sortBy?: "name" | "createdAt" | "sortOrder" | "productCount";
  sortOrder?: "asc" | "desc";
  includeChildren?: boolean;
}

export interface CategoriesResponse {
  data: Category[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CategoryResponse {
  message: string;
  data: Category;
}

export interface CategoryTreeResponse {
  message: string;
  data: Category[];
}
