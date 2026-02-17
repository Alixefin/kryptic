"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductImageUrl, getProductHoverImageUrl, getProductHref } from "@/lib/products";

export default function AccessoriesPage() {
  const products = useQuery(api.products.getByCategory, { category: "accessories" });
  const isLoading = products === undefined;

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold mb-8">ACCESSORIES</h1>
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
            <p className="text-[var(--text-secondary)]">No accessories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
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
        )}
      </div>
      <Footer />
    </main>
  );
}
