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

// File Upload types (MinIO)
export interface FileUploadResponse {
  url: string;
}

export interface FileUploadResult {
  url: string; // Full URL with domain prefix
  originalUrl: string; // Original URL from API response
}
