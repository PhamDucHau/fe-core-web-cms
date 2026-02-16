"use client";

import * as React from "react";
import { Package, Tag, Box, DollarSign, BarChart3 } from "lucide-react";

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
import type { Product, ProductStatus } from "@/api/types";

interface ProductDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const formatCurrency = (amount: number, currency: string = "VND") => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

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

const getStatusBadge = (status: ProductStatus) => {
  const statusConfig = {
    ACTIVE: { className: "bg-green-100 text-green-700", label: "Active" },
    DRAFT: { className: "bg-gray-100 text-gray-700", label: "Draft" },
    INACTIVE: { className: "bg-orange-100 text-orange-700", label: "Inactive" },
  };

  const config = statusConfig[status] || statusConfig.DRAFT;
  return <Badge className={cn(config.className)}>{config.label}</Badge>;
};

export default function ProductDetail({
  open,
  onOpenChange,
  product,
}: ProductDetailProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Product Details
          </DialogTitle>
          <DialogDescription>
            View complete information about this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Image and Basic Info */}
          <div className="flex gap-4">
            <Avatar className="h-24 w-24 rounded-lg">
              <AvatarImage
                src={product.thumbnailUrl}
                alt={product.name}
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">
                <Package className="h-8 w-8" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold">{product.name}</h3>
                {getStatusBadge(product.status)}
              </div>
              <p className="text-sm text-muted-foreground font-mono">SKU: {product.sku}</p>
              {product.brand && (
                <p className="text-sm text-muted-foreground">Brand: {product.brand}</p>
              )}
              {product.category && (
                <p className="text-sm text-muted-foreground">
                  Category: {product.category.name}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4" />
              Pricing
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Regular Price</p>
                <p className="text-lg font-semibold">
                  {formatCurrency(product.price, product.currency)}
                </p>
              </div>
              {product.salePrice && (
                <div className="bg-red-50 dark:bg-red-950/30 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Sale Price</p>
                  <p className="text-lg font-semibold text-red-600">
                    {formatCurrency(product.salePrice, product.currency)}
                  </p>
                </div>
              )}
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Currency</p>
                <p className="text-lg font-semibold">{product.currency || "VND"}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Inventory */}
          <div>
            <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
              <BarChart3 className="h-4 w-4" />
              Inventory
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Stock Quantity</p>
                <p className="text-lg font-semibold">{product.stockQuantity}</p>
              </div>
              <div className="bg-secondary/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Availability</p>
                <Badge
                  className={cn(
                    product.stockQuantity > 0 || product.isInStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {product.stockQuantity > 0 || product.isInStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          {(product.shortDescription || product.description) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Description</h4>
                {product.shortDescription && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.shortDescription}
                  </p>
                )}
                {product.description && (
                  <div
                    className="text-sm prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  />
                )}
              </div>
            </>
          )}

          {/* Physical Properties */}
          {(product.weight || product.dimensions) && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Box className="h-4 w-4" />
                  Physical Properties
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {product.weight && (
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Weight</p>
                      <p className="font-medium">{product.weight}g</p>
                    </div>
                  )}
                  {product.dimensions?.length && (
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Length</p>
                      <p className="font-medium">{product.dimensions.length}cm</p>
                    </div>
                  )}
                  {product.dimensions?.width && (
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Width</p>
                      <p className="font-medium">{product.dimensions.width}cm</p>
                    </div>
                  )}
                  {product.dimensions?.height && (
                    <div className="bg-secondary/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Height</p>
                      <p className="font-medium">{product.dimensions.height}cm</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4" />
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Images */}
          {product.images && product.images.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium mb-3">Additional Images</h4>
                <div className="flex flex-wrap gap-2">
                  {product.images.map((image, index) => (
                    <Avatar key={index} className="h-16 w-16 rounded-md">
                      <AvatarImage src={image} alt={`${product.name} ${index + 1}`} className="object-cover" />
                      <AvatarFallback className="rounded-md">
                        <Package className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Metadata */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>ID: {product._id}</p>
            {product.slug && <p>Slug: {product.slug}</p>}
            <p>Created: {formatDate(product.createdAt)}</p>
            <p>Updated: {formatDate(product.updatedAt)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
