"use client";

import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProductImageUrl, getProductHoverImageUrl, getProductHref } from "@/lib/products";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CollectionPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Fetch category details to get the proper name
    const category = useQuery(api.categories.getBySlug, { slug });

    // Fetch products for this category
    const products = useQuery(api.products.getByCategory, { category: slug });

    const isLoading = products === undefined || category === undefined;

    // Capitalize slug for title if category not found (fallback)
    const title = category ? category.name.toUpperCase() : slug.toUpperCase();

    return (
        <main className="min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-8">
                    <Link
                        href="/collections"
                        className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Collections
                    </Link>
                </div>
                <h1 className="text-3xl font-bold mb-8">{title}</h1>
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
                        <p className="text-[var(--text-secondary)]">No items available in this collection yet.</p>
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
