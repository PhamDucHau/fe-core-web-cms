"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import UsersDataTable from "./data-table";
import type { User } from "./data-table";

function UsersPageContent() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isError, error, refetch } = useUsers({ page, limit });

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
    return {
      id: Number(u.id) || 0,
      firstName: first,
      lastName: last,
      name: fullName,
      image: (u.image as string) ?? "",
      country: (u.country as string) ?? "",
      status: (u.status as string) ?? "",
      plan_name: (u.plan_name as string) ?? "",
      email: (u.email as string) ?? "",
      role: (u.role as string) ?? "",
    };
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <Button variant="secondary" asChild>
          <Link href="#">
            <PlusCircledIcon /> Add New User
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <UsersDataTable data={users} />          
        </CardContent>
      </Card>
    </>
  );
}

export default function UsersPage() {
  return <UsersPageContent />;
}
