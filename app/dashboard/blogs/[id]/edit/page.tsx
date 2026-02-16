"use client";

import { use } from "react";
import Link from "next/link";
import { IconChevronLeft, IconLoader2 } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogForm } from "@/components/blog-form";
import { useBlog } from "@/hooks/useBlogs";

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditBlogPage({ params }: EditBlogPageProps) {
  const { id } = use(params);
  const { data: blog, isLoading, isError, error, refetch } = useBlog(id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/blogs">
              <IconChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa blog</h1>
            <p className="text-sm text-muted-foreground">
              Đang tải thông tin blog...
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/blogs">
              <IconChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa blog</h1>
            <p className="text-sm text-muted-foreground">
              Không thể tải thông tin blog
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu"}
            </p>
            <div className="flex gap-2">
              <Button onClick={() => refetch()} variant="outline">
                Thử lại
              </Button>
              <Button asChild variant="secondary">
                <Link href="/dashboard/blogs">Quay lại</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Blog not found
  if (!blog) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/blogs">
              <IconChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa blog</h1>
            <p className="text-sm text-muted-foreground">
              Blog không tồn tại
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
            <p className="text-muted-foreground">
              Blog với ID &quot;{id}&quot; không tồn tại hoặc đã bị xóa.
            </p>
            <Button asChild>
              <Link href="/dashboard/blogs">Quay lại danh sách</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/blogs">
            <IconChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Chỉnh sửa blog</h1>
          <p className="text-sm text-muted-foreground line-clamp-1">
            Đang chỉnh sửa: {blog.title}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin blog</CardTitle>
          <CardDescription>
            Cập nhật các thông tin cho bài viết blog của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm mode="edit" blog={blog} />
        </CardContent>
      </Card>
    </div>
  );
}
