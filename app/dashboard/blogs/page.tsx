"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useBlogs, useDeleteBlog } from "@/hooks/useBlogs";
import type { Blog } from "@/types/blog.type";

export default function BlogsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | number | null>(null);

  const { data, isLoading, isError, error, refetch } = useBlogs({
    page,
    limit,
    search,
  });

  const deleteBlogMutation = useDeleteBlog();

  // Debounce timer ref
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle search with debounce
  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
    // Reset to first page when searching
    setPage(1);

    // Clear previous timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    // Delay search to debounce
    searchTimerRef.current = setTimeout(() => {
      setSearch(value);
    }, 500);
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Handle delete
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await deleteBlogMutation.mutateAsync(deleteId);
      setDeleteId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Xóa blog thất bại. Vui lòng thử lại.");
    }
  }, [deleteId, deleteBlogMutation]);

  // Pagination handlers
  const handlePreviousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    if (data?.totalPages && page < data.totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [data?.totalPages, page]);

  const handleLimitChange = useCallback((value: string) => {
    setLimit(Number(value));
    setPage(1);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Blog</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[400px] items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <IconLoader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Đang tải danh sách blogs...</p>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Blog</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center gap-4 py-12">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải dữ liệu"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Thử lại
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get blogs data
  const blogs: Blog[] = data?.data || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quản lý Blog</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý tất cả bài viết blog của bạn
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/blogs/create">
            <IconPlus className="mr-2 h-4 w-4" />
            Tạo blog mới
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Hiển thị:</span>
              <Select value={String(limit)} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-[80px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Table */}
          {blogs.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-2 text-center">
              <p className="text-muted-foreground">
                {search ? "Không tìm thấy blog nào phù hợp" : "Chưa có blog nào"}
              </p>
              {!search && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/blogs/create">
                    <IconPlus className="mr-2 h-4 w-4" />
                    Tạo blog đầu tiên
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Ảnh</TableHead>
                      <TableHead>Tiêu đề</TableHead>
                      <TableHead className="w-[120px]">Trạng thái</TableHead>
                      <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {blogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          {blog.image ? (
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                              <IconEyeOff className="h-5 w-5 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">{blog.title}</span>
                            <span className="text-sm text-muted-foreground line-clamp-1">
                              {blog.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={blog.isPublished ? "default" : "secondary"}>
                            {blog.isPublished ? (
                              <>
                                <IconEye className="mr-1 h-3 w-3" />
                                Đã xuất bản
                              </>
                            ) : (
                              <>
                                <IconEyeOff className="mr-1 h-3 w-3" />
                                Nháp
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                router.push(`/dashboard/blogs/${blog.id}/edit`)
                              }
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => setDeleteId(blog.id)}
                                >
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bạn có chắc chắn muốn xóa blog &quot;{blog.title}&quot;? Hành động này không thể hoàn tác.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                    Hủy
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={deleteBlogMutation.isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {deleteBlogMutation.isPending && (
                                      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Xóa
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="flex flex-col gap-4 md:hidden">
                {blogs.map((blog) => (
                  <Card key={blog.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {blog.image ? (
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        ) : (
                          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-muted">
                            <IconEyeOff className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 space-y-2">
                          <h3 className="font-medium line-clamp-1">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {blog.description}
                          </p>
                          <Badge variant={blog.isPublished ? "default" : "secondary"}>
                            {blog.isPublished ? "Đã xuất bản" : "Nháp"}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/dashboard/blogs/${blog.id}/edit`)
                          }
                        >
                          <IconEdit className="mr-1 h-4 w-4" />
                          Sửa
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setDeleteId(blog.id)}
                            >
                              <IconTrash className="mr-1 h-4 w-4" />
                              Xóa
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa blog &quot;{blog.title}&quot;? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setDeleteId(null)}>
                                Hủy
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDelete}
                                disabled={deleteBlogMutation.isPending}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                {deleteBlogMutation.isPending && (
                                  <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trong tổng số {total} blog
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={page <= 1}
                  >
                    <IconChevronLeft className="mr-1 h-4 w-4" />
                    Trước
                  </Button>
                  <span className="text-sm">
                    Trang {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={page >= totalPages}
                  >
                    Sau
                    <IconChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
