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
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
  useRestoreCategory,
} from "@/hooks/useCategories";
import CategoriesDataTable from "./data-table";
import CategoryForm from "./category-form";
import CategoryDetail from "./category-detail";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "@/api/types";

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  // State for dialogs
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Fetch categories
  const { data, isLoading, isError, error, refetch } = useCategories({ page, limit });

  // Fetch all categories for parent selection in form
  const { data: allCategoriesData } = useCategories({ page: "all" });

  // Mutations
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();
  const restoreMutation = useRestoreCategory();

  const handleView = (category: Category) => {
    setSelectedCategory(category);
    setIsDetailOpen(true);
  };

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsFormOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteDialogOpen(true);
  };

  const handleRestore = async (category: Category) => {
    try {
      await restoreMutation.mutateAsync(category._id);
      toast.success("Category restored successfully");
    } catch (err) {
      toast.error("Failed to restore category");
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteMutation.mutateAsync(categoryToDelete._id);
      toast.success("Category deleted successfully");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete category";
      // Check if error is about having children
      if (errorMessage.includes("children") || errorMessage.includes("con")) {
        toast.error("Cannot delete category with child categories. Please delete or move children first.");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  const handleFormSubmit = async (data: CreateCategoryRequest | UpdateCategoryRequest) => {
    try {
      if (selectedCategory) {
        await updateMutation.mutateAsync({ id: selectedCategory._id, data });
        toast.success("Category updated successfully");
      } else {
        await createMutation.mutateAsync(data as CreateCategoryRequest);
        toast.success("Category created successfully");
      }
      setIsFormOpen(false);
      setSelectedCategory(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to save category";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        </div>
        <Card>
          <CardContent className="flex min-h-[200px] items-center justify-center py-12">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Loading categories...</p>
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
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
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
  const categories = Array.isArray(data) ? data : (data?.data ?? []);
  const allCategories = Array.isArray(allCategoriesData)
    ? allCategoriesData
    : (allCategoriesData?.data ?? []);

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
        <Button onClick={handleCreate}>
          <PlusCircledIcon className="mr-2 h-4 w-4" /> Add New Category
        </Button>
      </div>
      <Card>
        <CardContent>
          <CategoriesDataTable
            data={categories}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRestore={handleRestore}
          />
        </CardContent>
      </Card>

      {/* Category Form Dialog */}
      <CategoryForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        category={selectedCategory}
        categories={allCategories}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Category Detail Dialog */}
      <CategoryDetail
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        category={selectedCategory}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will soft delete the category &quot;{categoryToDelete?.name}&quot;. You can restore it
              later. Note: Categories with child categories cannot be deleted.
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
