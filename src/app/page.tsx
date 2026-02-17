"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductSection from "@/components/ProductSection";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import MessageButton from "@/components/MessageButton";
import SubscribeModal from "@/components/SubscribeModal";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

const categories = [
  { key: "shirts", title: "SHOP SHIRTS", href: "/collections/shirts" },
  { key: "bottoms", title: "SHOP BOTTOMS", href: "/collections/bottoms" },
  { key: "jackets", title: "SHOP JACKETS", href: "/collections/jackets" },
  { key: "t-shirts", title: "SHOP T-SHIRTS", href: "/collections/t-shirts" },
  { key: "accessories", title: "SHOP ACCESSORIES", href: "/collections/accessories" },
];

function CategorySection({ categoryKey, title, href }: { categoryKey: string; title: string; href: string }) {
  const products = useQuery(api.products.getByCategory, { category: categoryKey });

  if (products === undefined) return null; // Still loading — rendered by parent spinner

  return (
    <ProductSection
      title={title}
      products={products}
      viewAllHref={href}
    />
  );
}

export default function Home() {
  // Use one query to check if data is loaded
  const allProducts = useQuery(api.products.list);
  const isLoading = allProducts === undefined;

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
        </div>
      ) : (
        categories.map((cat) => (
          <CategorySection
            key={cat.key}
            categoryKey={cat.key}
            title={cat.title}
            href={cat.href}
          />
        ))
      )}

      <Newsletter />
      <Footer />
      <MessageButton />
      <SubscribeModal />
    </main>
  );
}
