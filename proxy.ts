import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  // "/" hiển thị landing page - không redirect sang /dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ["/"]
};
