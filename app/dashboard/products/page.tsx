"use client";

import { useState } from "react";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useRestoreProduct,
} from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import ProductsDataTable from "./data-table";
import ProductForm from "./product-form";
import ProductDetail from "./product-detail";
import type { Product, CreateProductRequest, UpdateProductRequest } from "@/api/types";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // State for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Fetch products
  const { data, isLoading, isError, error, refetch } = useProducts({ page, limit });

  // Fetch categories for form
  const { data: categoriesData } = useCategories({ page: "all" });

  // Mutations
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();
  const restoreMutation = useRestoreProduct();

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  const handleRestore = async (product: Product) => {
    try {
      await restoreMutation.mutateAsync(product._id);
      toast.success("Product restored successfully");
    } catch (err) {
      toast.error("Failed to restore product");
    }
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteMutation.mutateAsync(productToDelete._id);
      toast.success("Product deleted successfully");
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const handleFormSubmit = async (data: CreateProductRequest | UpdateProductRequest) => {
    try {
      if (selectedProduct) {
        await updateMutation.mutateAsync({ id: selectedProduct._id, data });
        toast.success("Product updated successfully");
      } else {
        await createMutation.mutateAsync(data as CreateProductRequest);
        toast.success("Product created successfully");
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save product";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading products...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[200px] flex-col items-center justify-center gap-4 py-12">
            <p className="text-destructive">
              {error instanceof Error ? error.message : "An error occurred while loading data"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle API response format
  const products = Array.isArray(data) ? data : (data?.data ?? []);
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data ?? []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Products</h1>
        <Button onClick={handleCreate}>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Add New Product
        </Button>
      </div>
      <Card>
        <CardContent>
          <ProductsDataTable
            data={products}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </CardContent>
      </Card>

      {/* Product Form Dialog */}
      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        product={selectedProduct}
        categories={categories}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Product Detail Dialog */}
      <ProductDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        product={selectedProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this product?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the product &quot;{productToDelete?.name}&quot;. You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
