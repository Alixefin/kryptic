"use client";

import ProductCard from "./ProductCard";
import Link from "next/link";
import type { Product } from "@/lib/products";
import { getProductImageUrl, getProductHoverImageUrl, getProductHref } from "@/lib/products";

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref: string;
}

export default function ProductSection({
  title,
  products,
  viewAllHref,
}: ProductSectionProps) {
  if (products.length === 0) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
          <p className="text-[var(--text-secondary)]">No products available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href={viewAllHref}
          className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          View All →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.slice(0, 4).map((product) => (
          <ProductCard
            key={product._id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            image={getProductImageUrl(product)}
            hoverImage={getProductHoverImageUrl(product)}
            href={getProductHref(product)}
            soldOut={product.soldOut}
          />
        ))}
      </div>
    </section>
  );
}
