"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/currency";
import { allProducts } from "@/data/products";
import { ShoppingBag, Minus, Plus, Heart, Share2, ChevronLeft } from "lucide-react";
import Link from "next/link";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Navy", "Gray"];

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const product = allProducts.find(p => p.id === params.id);

  if (!product) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-[var(--text-secondary)] mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/collections" className="btn-primary inline-block">
            Browse Collections
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedSize, selectedColor);
    setTimeout(() => setIsAdding(false), 500);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const isPlaceholder = product.image.includes("placeholder");

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square bg-[var(--bg-secondary)] rounded-lg overflow-hidden relative">
              {isPlaceholder ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-24 h-24 text-[var(--text-secondary)]"
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
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              )}

              {/* Badges */}
              {product.discount && (
                <span className="absolute top-4 left-4 bg-[var(--sale-red)] text-white px-3 py-1 text-sm font-medium rounded">
                  -{product.discount}%
                </span>
              )}
              {product.soldOut && (
                <span className="absolute top-4 left-4 bg-[var(--text-secondary)] text-white px-3 py-1 text-sm font-medium rounded">
                  Sold Out
                </span>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4">
                {product.originalPrice && (
                  <span className="text-xl text-[var(--sale-red)] line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                <span className="text-2xl font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Size</label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedSize === size
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border-color)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Color</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedColor === color
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[var(--border-color)] hover:border-[var(--accent)]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[var(--border-color)] rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 font-medium">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-3 hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.soldOut || isAdding}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    {product.soldOut ? "Sold Out" : isInCart(product.id) ? "Add More" : "Add to Cart"}
                  </>
                )}
              </button>

              <div className="flex gap-4">
                <button className="flex-1 py-3 border border-[var(--border-color)] rounded-lg flex items-center justify-center gap-2 hover:border-[var(--accent)] transition-colors">
                  <Heart className="w-5 h-5" />
                  Wishlist
                </button>
                <button className="flex-1 py-3 border border-[var(--border-color)] rounded-lg flex items-center justify-center gap-2 hover:border-[var(--accent)] transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="border-t border-[var(--border-color)] pt-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-[var(--text-secondary)]">
                  Premium quality {product.name.toLowerCase()} from our exclusive collection. 
                  Crafted with the finest materials for ultimate comfort and style.
                </p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping</h3>
                <p className="text-[var(--text-secondary)]">
                  Free shipping on orders over ₦50,000. Standard delivery takes 3-5 business days within Lagos, 
                  5-7 business days for other states.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
