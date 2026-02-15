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

// Role type (from API)
export interface Role {
  _id: string;
  name: string;
}

// User types - matching API response structure
export interface User {
  _id?: string; // MongoDB ID from API
  id?: string | number; // Legacy support
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  image?: string;
  country?: string;
  status?: string;
  plan_name?: string;
  role?: string | Role; // Can be ObjectId string or populated Role object
  uid?: string; // Firebase UID
  securityConfirmed?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Request payload for creating a user
export interface CreateUserRequest {
  name: string;
  email: string;
  password?: string; // Required if no uid
  uid?: string; // Firebase UID (if provided, password not required)
  role?: string; // ObjectId of Role
  securityConfirmed?: boolean;
}

// Request payload for updating a user
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  uid?: string;
  role?: string;
  securityConfirmed?: boolean;
}

// Response for delete operation
export interface DeleteUserResponse {
  message: string;
  id: string;
}

export interface UsersResponse {
  data: User[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  // Legacy support
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface UsersQueryParams {
  page?: number | string; // Can be number or "all"
  limit?: number;
  search?: string;
  role?: string; // ObjectId to filter by role
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
