import axiosClient from "@/api/axiosClient";
import type { UsersResponse, UsersQueryParams } from "@/api/types";

export const userService = {
  getUsers: async (params: UsersQueryParams = {}): Promise<UsersResponse> => {
    const { page = 1, limit = 10 } = params;
    const response = await axiosClient.get<UsersResponse>("/users", {
      params: { page, limit },
    });
    return response.data;
  },
};
