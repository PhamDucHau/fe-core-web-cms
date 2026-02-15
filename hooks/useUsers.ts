"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import type { UsersQueryParams } from "@/api/types";

export const USERS_QUERY_KEY = "users";

export function useUsers(params: UsersQueryParams = {}) {
  const { page = 1, limit = 10 } = params;

  return useQuery({
    queryKey: [USERS_QUERY_KEY, page, limit],
    queryFn: () => userService.getUsers({ page, limit }),
    staleTime: 5 * 60 * 1000, // 5 minutes - data được coi là fresh
    gcTime: 10 * 60 * 1000, // 10 minutes - garbage collection time (trước đây là cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
