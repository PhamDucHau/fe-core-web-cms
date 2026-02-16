"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconLoader2, IconUpload, IconX, IconPhoto } from "@tabler/icons-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";

import { blogFormSchema, type BlogFormValues, type Blog } from "@/types/blog.type";
import { useCreateBlog, useUpdateBlog, useUploadImage } from "@/hooks/useBlogs";

interface BlogFormProps {
  blog?: Blog;
  mode: "create" | "edit";
}

export function BlogForm({ blog, mode }: BlogFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(blog?.image || null);
  const [isUploading, setIsUploading] = useState(false);

  const createBlogMutation = useCreateBlog();
  const updateBlogMutation = useUpdateBlog();
  const uploadImageMutation = useUploadImage();

  const isSubmitting = createBlogMutation.isPending || updateBlogMutation.isPending;

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: blog?.title || "",
      description: blog?.description || "",
      image: blog?.image || "",
      isPublished: blog?.isPublished || false,
    },
    mode: "onChange",
  });

  // Handle file selection for image upload
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Upload image
    setIsUploading(true);
    try {
      const imageUrl = await uploadImageMutation.mutateAsync(file);
      form.setValue("image", imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload ảnh thất bại. Vui lòng thử lại.");
      // Revert preview on error
      setImagePreview(blog?.image || null);
    } finally {
      setIsUploading(false);
    }
  }, [uploadImageMutation, form, blog?.image]);

  // Remove image
  const handleRemoveImage = useCallback(() => {
    setImagePreview(null);
    form.setValue("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [form]);

  // Handle form submission
  const onSubmit = async (data: BlogFormValues) => {
    try {
      if (mode === "create") {
        await createBlogMutation.mutateAsync({
          title: data.title,
          description: data.description,
          image: data.image,
          isPublished: data.isPublished,
        });
        router.push("/dashboard/blogs");
      } else if (mode === "edit" && blog?.id) {
        await updateBlogMutation.mutateAsync({
          id: blog.id,
          data: {
            title: data.title,
            description: data.description,
            image: data.image,
            isPublished: data.isPublished,
          },
        });
        router.push("/dashboard/blogs");
      }
    } catch (error) {
      console.error("Submit failed:", error);
      alert(mode === "create" ? "Tạo blog thất bại" : "Cập nhật blog thất bại");
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiêu đề *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nhập tiêu đề blog..."
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Tiêu đề sẽ hiển thị trên danh sách blog và trang chi tiết.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description Field */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập mô tả blog..."
                  className="min-h-[200px] resize-y"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Mô tả chi tiết về nội dung blog.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Field */}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh</FormLabel>
              <FormControl>
                <div className="space-y-4">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isSubmitting || isUploading}
                  />

                  {/* Image Preview */}
                  {imagePreview ? (
                    <Card className="relative overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative aspect-video w-full max-w-md">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                          {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                              <IconLoader2 className="h-8 w-8 animate-spin text-white" />
                            </div>
                          )}
                          {!isUploading && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute right-2 top-2"
                              onClick={handleRemoveImage}
                              disabled={isSubmitting}
                            >
                              <IconX className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card
                      className={cn(
                        "cursor-pointer border-2 border-dashed transition-colors hover:border-primary",
                        (isSubmitting || isUploading) && "pointer-events-none opacity-50"
                      )}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                          <IconPhoto className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                          <IconUpload className="h-4 w-4" />
                          <span>Click để upload hình ảnh</span>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          PNG, JPG, GIF tối đa 5MB
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {/* URL input (hidden, managed by upload) */}
                  <input type="hidden" {...field} />
                </div>
              </FormControl>
              <FormDescription>
                Hình ảnh đại diện cho blog (tùy chọn).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Published Switch */}
        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Xuất bản</FormLabel>
                <FormDescription>
                  Khi bật, blog sẽ hiển thị công khai trên website.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/blogs")}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting && <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "create" ? "Tạo blog" : "Cập nhật"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
