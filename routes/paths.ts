/**
 * Định nghĩa các path của ứng dụng
 * Sử dụng cho navigation và ProtectedRoute
 */
export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  USERS: "/dashboard/users",
  DASHBOARD: "/dashboard",
  SETTINGS: "/dashboard/settings",
} as const;

export const PUBLIC_PATHS = [ROUTES.LOGIN, ROUTES.REGISTER] as const;
