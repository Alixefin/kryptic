"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/lib/currency";

interface ProductCardProps {
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  href: string;
  discount?: number;
  soldOut?: boolean;
}

function PlaceholderIcon() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg
        className="w-16 h-16 text-[var(--text-secondary)]"
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
  );
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  image,
  hoverImage,
  href,
  discount,
  soldOut,
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [hoverImageError, setHoverImageError] = useState(false);
  const isPlaceholder = image.includes("placeholder") || imageError;

  return (
    <Link href={href} className="group relative cursor-pointer block">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-[var(--bg-card)] aspect-square mb-3">
        {isPlaceholder ? (
          <PlaceholderIcon />
        ) : (
          <>
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain transition-opacity duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
            {hoverImage && !hoverImageError && (
              <Image
                src={hoverImage}
                alt={`${name} alternate view`}
                fill
                className="object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
                onError={() => setHoverImageError(true)}
              />
            )}
          </>
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-2 left-2 text-[var(--sale-red)] text-xs font-medium">
            - {discount}%
          </span>
        )}

        {/* Sold Out Badge */}
        {soldOut && (
          <span className="absolute top-2 left-2 text-xs text-[var(--text-secondary)]">Sold out</span>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-[var(--text-primary)]">{name}</h3>
        <div className="flex items-center gap-2">
          {originalPrice && (
            <span className="text-sm text-[var(--sale-red)] line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {formatPrice(price)}
          </span>
        </div>
      </div>
    </Link>
  );
}
