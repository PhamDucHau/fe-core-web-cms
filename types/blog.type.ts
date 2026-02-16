import { z } from "zod";

// Blog entity interface
export interface Blog {
  id: string | number;
  title: string;
  description: string;
  image?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response types
export interface BlogsResponse {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogResponse {
  data: Blog;
}

// Query params for fetching blogs
export interface BlogsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

// Zod schema for blog form validation
export const blogFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Tiêu đề phải có ít nhất 3 ký tự" })
    .max(200, { message: "Tiêu đề không được vượt quá 200 ký tự" }),
  description: z
    .string()
    .min(10, { message: "Mô tả phải có ít nhất 10 ký tự" })
    .max(5000, { message: "Mô tả không được vượt quá 5000 ký tự" }),
  image: z.string().optional(),
  isPublished: z.boolean().default(false),
});

// Infer the type from zod schema
export type BlogFormValues = z.infer<typeof blogFormSchema>;

// DTO for creating blog
export interface CreateBlogDTO {
  title: string;
  description: string;
  image?: string;
  isPublished: boolean;
}

// DTO for updating blog
export interface UpdateBlogDTO {
  title?: string;
  description?: string;
  image?: string;
  isPublished?: boolean;
}
