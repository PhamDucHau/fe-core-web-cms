import { generateMeta } from "@/lib/utils";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Products",
    description: "Quản lý sản phẩm - danh sách, thêm, sửa, xóa sản phẩm",
  });
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
