"use client";

import ProductCard from "./ProductCard";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  href: string;
  discount?: number;
  soldOut?: boolean;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  viewAllHref: string;
}

export default function ProductSection({ title, products, viewAllHref }: ProductSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">{title}</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              originalPrice={product.originalPrice}
              image={product.image}
              hoverImage={product.hoverImage}
              href={product.href}
              discount={product.discount}
              soldOut={product.soldOut}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href={viewAllHref} className="btn-primary inline-block">
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
