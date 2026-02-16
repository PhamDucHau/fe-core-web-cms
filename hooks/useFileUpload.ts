"use client";

import { useMutation } from "@tanstack/react-query";
import { fileService } from "@/services/file.service";
import type { FileUploadResult } from "@/api/types";

export const FILE_UPLOAD_MUTATION_KEY = "fileUpload";
export const FILES_UPLOAD_MUTATION_KEY = "filesUpload";

interface UseFileUploadOptions {
  onSuccess?: (data: FileUploadResult) => void;
  onError?: (error: Error) => void;
}

interface UseFilesUploadOptions {
  onSuccess?: (data: FileUploadResult[]) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for uploading a single file to MinIO
 * Returns the full URL with domain prefix (https://seyeuthuong.org/...)
 */
export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationKey: [FILE_UPLOAD_MUTATION_KEY],
    mutationFn: (file: File) => fileService.uploadFile(file),
    onSuccess,
    onError,
  });
}

/**
 * Hook for uploading multiple files to MinIO
 * Returns array of full URLs with domain prefix (https://seyeuthuong.org/...)
 */
export function useFilesUpload(options: UseFilesUploadOptions = {}) {
  const { onSuccess, onError } = options;

  return useMutation({
    mutationKey: [FILES_UPLOAD_MUTATION_KEY],
    mutationFn: (files: File[]) => fileService.uploadFiles(files),
    onSuccess,
    onError,
  });
}
