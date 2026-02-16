"use client";

import * as React from "react";
import { FolderTree, Layers, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Category, CategoryStatus } from "@/api/types";

interface CategoryDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

const formatDate = (dateString?: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusBadge = (status: CategoryStatus) => {
  const statusConfig = {
    ACTIVE: { className: "bg-green-100 text-green-700", label: "Active" },
    DRAFT: { className: "bg-gray-100 text-gray-700", label: "Draft" },
    INACTIVE: { className: "bg-orange-100 text-orange-700", label: "Inactive" },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
};

const getLevelBadge = (level: number) => {
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];
  const colorClass = colors[level] || colors[colors.length - 1];
  return (
    <Badge className={cn(colorClass)}>
      Level {level}
    </Badge>
  );
};

export default function CategoryDetail({
  open,
  onOpenChange,
  category,
}: CategoryDetailProps) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderTree className="h-5 w-5" />
            Category Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this category.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image and Basic Info */}
          <div className="flex gap-4">
            <Avatar className="h-20 w-20 rounded-lg">
              <AvatarImage
                src={category.imageUrl}
                alt={category.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">
                <FolderTree className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{category.name}</h3>
                {getStatusBadge(category.status)}
              </div>
              {category.slug && (
                <p className="text-sm text-muted-foreground font-mono">/{category.slug}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {getLevelBadge(category.level)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Hierarchy Information */}
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Layers className="h-4 w-4" />
              Hierarchy
            </h4>
            <div className="space-y-3">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Parent</p>
                <p className="font-medium">
                  {category.parent?.name || category.parentId || "Root (No Parent)"}
                </p>
              </div>

              {category.ancestors && category.ancestors.length > 0 && (
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Ancestors Path</p>
                  <div className="flex flex-wrap items-center gap-1">
                    <Badge variant="outline">Root</Badge>
                    {category.ancestors.map((ancestor, index) => (
                      <React.Fragment key={ancestor._id}>
                        <span className="text-muted-foreground">/</span>
                        <Badge variant="outline">{ancestor.name}</Badge>
                      </React.Fragment>
                    ))}
                    <span className="text-muted-foreground">/</span>
                    <Badge>{category.name}</Badge>
                  </div>
                </div>
              )}

              {category.children && category.children.length > 0 && (
                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">
                    Children ({category.children.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {category.children.map((child) => (
                      <Badge key={child._id} variant="secondary">
                        {child.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Statistics */}
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <Package className="h-4 w-4" />
              Statistics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Product Count</p>
                <p className="text-2xl font-semibold">{category.productCount || 0}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Sort Order</p>
                <p className="text-2xl font-semibold">{category.sortOrder ?? 0}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {category.description && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Description</h4>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {category._id}</p>
            <p>Created: {formatDate(category.createdAt)}</p>
            <p>Updated: {formatDate(category.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
