import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Users",
    description: "Danh sách users - quản lý người dùng",
  });
}

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
