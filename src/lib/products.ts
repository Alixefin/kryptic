// Product service — Convex queries and helpers
// Pages should use `useQuery(api.products.list)` etc. directly from convex/react.
// These helpers are for image URLs and link generation.

import type { Id } from "@convex/_generated/dataModel";

// Re-export the Product type shape that matches Convex documents
export interface Product {
    _id: Id<"products">;
    _creationTime: number;
    name: string;
    description?: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    category: string;
    imageStorageId?: Id<"_storage">;
    hoverImageStorageId?: Id<"_storage">;
    imageUrl?: string;
    hoverImageUrl?: string;
    sizes?: string[];
    colors?: string[];
    stock: number;
    soldOut: boolean;
    featured: boolean;
}

/**
 * Helper: Get the display image URL for a product
 */
export function getProductImageUrl(product: Product): string {
    return product.imageUrl || "/images/products/placeholder.png";
}

/**
 * Helper: Get the hover image URL for a product
 */
export function getProductHoverImageUrl(product: Product): string | undefined {
    return product.hoverImageUrl || undefined;
}

/**
 * Helper: Build the product detail page href
 */
export function getProductHref(product: Product): string {
    return `/products/${product._id}`;
}
