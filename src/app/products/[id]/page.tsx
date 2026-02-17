"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { getProductImageUrl } from "@/lib/products";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { ShoppingBag, Heart, Truck, RotateCcw, Shield, Minus, Plus } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const product = useQuery(
    api.products.getById,
    productId ? { id: productId as Id<"products"> } : "skip"
  );
  const { addItem, isInCart } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  // Loading state
  if (product === undefined) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
        </div>
        <Footer />
      </main>
    );
  }

  // Not found
  if (product === null) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-[var(--text-secondary)]">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
        <Footer />
      </main>
    );
  }

  const imageUrl = getProductImageUrl(product);
  const availableSizes = product.sizes || [];
  const availableColors = product.colors || [];
  const alreadyInCart = isInCart(product._id);

  function handleAddToCart() {
    if (product && !product.soldOut) {
      addItem(product, quantity, selectedSize || undefined, selectedColor || undefined);
    }
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative aspect-square bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
            {!product.imageUrl || product.imageUrl.includes("placeholder") ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-20 h-20 text-[var(--text-secondary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            ) : (
              <Image
                src={imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            )}
            {product.soldOut && (
              <div className="absolute top-4 left-4 bg-[var(--sale-red)] text-white px-3 py-1 rounded text-sm font-medium">
                Sold Out
              </div>
            )}
            {product.discount && !product.soldOut && (
              <div className="absolute top-4 left-4 bg-[var(--sale-red)] text-white px-3 py-1 rounded text-sm font-medium">
                -{product.discount}%
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-[var(--text-secondary)] line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-[var(--text-secondary)] mb-6">{product.description}</p>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Size</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${selectedSize === size
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border-color)] hover:border-[var(--accent)]"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-lg text-sm transition-colors ${selectedColor === color
                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "border-[var(--border-color)] hover:border-[var(--accent)]"
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <div className="flex items-center border border-[var(--border-color)] rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-6 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.soldOut || alreadyInCart}
                className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShoppingBag className="h-5 w-5" />
                {product.soldOut
                  ? "Sold Out"
                  : alreadyInCart
                    ? "Already in Cart"
                    : "Add to Cart"}
              </button>
              <button className="p-3 border border-[var(--border-color)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <Truck className="h-5 w-5" />
                <span>Free shipping on orders over ₦50,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <RotateCcw className="h-5 w-5" />
                <span>30-day return policy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                <Shield className="h-5 w-5" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
