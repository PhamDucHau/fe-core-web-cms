import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Categories",
    description: "Quản lý danh mục sản phẩm - danh sách, thêm, sửa, xóa danh mục",
  });
}

export default function CategoriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
