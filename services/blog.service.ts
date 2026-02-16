import axiosClient from "@/api/axiosClient";
import type {
  Blog,
  BlogsResponse,
  BlogResponse,
  BlogsQueryParams,
  CreateBlogDTO,
  UpdateBlogDTO,
} from "@/types/blog.type";

export const blogService = {
  /**
   * Get list of blogs with pagination and search
   */
  getBlogs: async (params: BlogsQueryParams = {}): Promise<BlogsResponse> => {
    const { page = 1, limit = 10, search = "" } = params;
    const response = await axiosClient.get<BlogsResponse>("/blogs", {
      params: { page, limit, search },
    });
    return response.data;
  },

  /**
   * Get a single blog by ID
   */
  getBlogById: async (id: string | number): Promise<Blog> => {
    const response = await axiosClient.get<BlogResponse>(`/blogs/${id}`);
    return response.data.data;
  },

  /**
   * Create a new blog
   */
  createBlog: async (data: CreateBlogDTO): Promise<Blog> => {
    const response = await axiosClient.post<BlogResponse>("/blogs", data);
    return response.data.data;
  },

  /**
   * Update an existing blog
   */
  updateBlog: async (id: string | number, data: UpdateBlogDTO): Promise<Blog> => {
    const response = await axiosClient.put<BlogResponse>(`/blogs/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a blog
   */
  deleteBlog: async (id: string | number): Promise<void> => {
    await axiosClient.delete(`/blogs/${id}`);
  },

  /**
   * Upload image and return URL
   */
  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<{ url: string }>("/minio/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    // API trả về relative path, cần build full URL giống file.service
    const relativePath = response.data.url;
    if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
      return relativePath;
    }
    const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    return `https://seyeuthuong.org${path}`;
  },
};
