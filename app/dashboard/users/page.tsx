"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import UsersDataTable from "./data-table";
import type { User } from "./data-table";
import type { User as ApiUser } from "@/api/types";
import {
  UserFormDialog,
  UserDetailDialog,
  DeleteUserDialog,
} from "./components";

function UsersPageContent() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data, isLoading, isError, error, refetch } = useUsers({ page, limit });

  // Convert table User type to API User type for dialogs
  const toApiUser = (user: User | null): ApiUser | null => {
    if (!user) return null;
    return {
      _id: user._id,
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      country: user.country,
      status: user.status,
      plan_name: user.plan_name,
      role: user.role,
      securityConfirmed: user.securityConfirmed,
      uid: user.uid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

  // Action handlers
  const handleView = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  }, []);

  const handleEdit = useCallback((user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleCreateNew = useCallback(() => {
    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  }, []);

  const handleSuccess = useCallback(() => {
    refetch();
  }, [refetch]);

  // Table actions
  const tableActions = {
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Đang tải danh sách users...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
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

  // API có thể trả về { data: [] } hoặc mảng trực tiếp
  const rawUsers = (Array.isArray(data) ? data : (data?.data ?? [])) as Record<string, unknown>[];

  // Transform API data để match với UsersDataTable columns (name, role, etc.)
  const users: User[] = rawUsers.map((u) => {
    const first = (u.firstName as string) || "";
    const last = (u.lastName as string) || "";
    const fullName = (u.name as string) ?? `${first} ${last}`.trim();

    // Handle role - can be string or object with name
    let roleValue = "";
    if (typeof u.role === "string") {
      roleValue = u.role;
    } else if (u.role && typeof u.role === "object") {
      roleValue = (u.role as { name?: string }).name || "";
    }

    return {
      id: Number(u.id) || 0,
      _id: (u._id as string) || "",
      firstName: first,
      lastName: last,
      name: fullName,
      image: (u.image as string) ?? "",
      country: (u.country as string) ?? "",
      status: (u.status as string) ?? "",
      plan_name: (u.plan_name as string) ?? "",
      email: (u.email as string) ?? "",
      role: roleValue,
      securityConfirmed: (u.securityConfirmed as boolean) ?? false,
      uid: (u.uid as string) ?? "",
      createdAt: (u.createdAt as string) ?? "",
      updatedAt: (u.updatedAt as string) ?? "",
    };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button variant="secondary" onClick={handleCreateNew}>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Thêm User Mới
        </Button>
      </div>
      <Card>
        <CardContent>
          <UsersDataTable data={users} actions={tableActions} />
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <UserFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        user={null}
        onSuccess={handleSuccess}
      />

      {/* Edit User Dialog */}
      <UserFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={toApiUser(selectedUser)}
        onSuccess={handleSuccess}
      />

      {/* User Detail Dialog */}
      <UserDetailDialog
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
        user={toApiUser(selectedUser)}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        user={toApiUser(selectedUser)}
        onSuccess={handleSuccess}
      />
    </>
  );
}

export default function UsersPage() {
  return <UsersPageContent />;
}
