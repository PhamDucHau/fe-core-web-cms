import axiosClient from "@/api/axiosClient";
import type { FileUploadResponse, FileUploadResult } from "@/api/types";

// Domain prefix for MinIO images
const MINIO_BASE_URL = "https://seyeuthuong.org";

/**
 * Build full URL from MinIO response
 * API returns: { url: "/imagefolder/1771248988154-quan-ao.png" }
 * Result: "https://seyeuthuong.org/imagefolder/1771248988154-quan-ao.png"
 */
function buildFullUrl(relativePath: string): string {
  // If already has domain, return as is
  if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
    return relativePath;
  }
  // Ensure path starts with /
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${MINIO_BASE_URL}${path}`;
}

export const fileService = {
  /**
   * Upload file to MinIO server
   * @param file - File to upload
   * @returns FileUploadResult with full URL
   */
  uploadFile: async (file: File): Promise<FileUploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post<FileUploadResponse>("/minio/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const originalUrl = response.data.url;
    const fullUrl = buildFullUrl(originalUrl);

    return {
      url: fullUrl,
      originalUrl,
    };
  },

  /**
   * Upload multiple files to MinIO server
   * @param files - Array of files to upload
   * @returns Array of FileUploadResult with full URLs
   */
  uploadFiles: async (files: File[]): Promise<FileUploadResult[]> => {
    const uploadPromises = files.map((file) => fileService.uploadFile(file));
    return Promise.all(uploadPromises);
  },
};
