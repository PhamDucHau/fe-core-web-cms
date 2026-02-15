"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getStoredToken } from "@/api/axiosClient";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      const redirectPath = pathname ?? "/";
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`);
    }
  }, [router, pathname]);

  const token = typeof window !== "undefined" ? getStoredToken() : null;
  if (typeof window !== "undefined" && !token) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
