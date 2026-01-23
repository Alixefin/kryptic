"use client";

import Image from "next/image";
import Link from "next/link";

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
  return (
    <Link href={href} className="group relative cursor-pointer block">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-white aspect-square mb-3">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain transition-opacity duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} alternate view`}
            fill
            className="object-contain absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-2 left-2 text-[#993533] text-xs font-medium">
            - {discount}%
          </span>
        )}

        {/* Sold Out Badge */}
        {soldOut && (
          <span className="absolute top-2 left-2 text-xs text-gray-500">Sold out</span>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-[#292826]">{name}</h3>
        <div className="flex items-center gap-2">
          {originalPrice && (
            <span className="text-sm text-[#993533] line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
          <span className="text-sm font-medium text-[#292826]">
            ${price.toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
