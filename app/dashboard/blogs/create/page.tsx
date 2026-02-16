"use client";

import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogForm } from "@/components/blog-form";

export default function CreateBlogPage() {
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
          <h1 className="text-2xl font-bold tracking-tight">Tạo blog mới</h1>
          <p className="text-sm text-muted-foreground">
            Điền thông tin để tạo bài viết blog mới
          </p>
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin blog</CardTitle>
          <CardDescription>
            Nhập các thông tin cần thiết cho bài viết blog của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BlogForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}
