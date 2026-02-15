"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useDeleteUser } from "@/hooks/useUsers";
import type { User } from "@/api/types";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess?: () => void;
}

export function DeleteUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: DeleteUserDialogProps) {
  const deleteUser = useDeleteUser();
  const isLoading = deleteUser.isPending;

  // Get user ID - handle both _id and id
  const getUserId = (user: User | null): string | null => {
    if (!user) return null;
    return user._id?.toString() || user.id?.toString() || null;
  };

  const handleDelete = async () => {
    const userId = getUserId(user);
    if (!userId) {
      toast.error("Không tìm thấy ID user");
      return;
    }

    try {
      await deleteUser.mutateAsync(userId);
      toast.success("Xóa user thành công", {
        description: `User "${user?.name || user?.email}" đã được xóa.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Xóa user thất bại", {
        description: errorMessage,
      });
    }
  };

  if (!user) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa user?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa user{" "}
            <span className="font-semibold text-foreground">
              {user.name || user.email}
            </span>
            ? Hành động này không thể hoàn tác và sẽ xóa vĩnh viễn user khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault(); // Prevent auto-close
              handleDelete();
            }}
            disabled={isLoading}
            className={buttonVariants({ variant: "destructive" })}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Đang xóa..." : "Xóa user"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
