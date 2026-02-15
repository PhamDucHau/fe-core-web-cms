"use client";

import Link from "next/link";
import { FEATURED_CATEGORIES } from "@/lib/landing-data";
import { Package } from "lucide-react";

export function ProductCategories() {
  return (
    <section id="categories" className="py-16 lg:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Product Categories</h2>
          <p className="mt-2 text-muted-foreground">Browse our wide range of auto parts</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat._id}
              href="/#products"
              className="group flex flex-col items-center p-6 rounded-lg bg-card border hover:border-primary/50 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition">
                <Package className="h-7 w-7 text-primary" />
              </div>
              <span className="font-medium text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
