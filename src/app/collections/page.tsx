"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function CollectionsPage() {
  const categories = useQuery(api.categories.listActive);
  const isLoading = categories === undefined;

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">Our Collections</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12">
          Explore our curated selection of premium fashion
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories?.map((collection) => (
              <Link
                key={collection._id}
                href={`/collections/${collection.slug}`}
                className="group block bg-[var(--bg-secondary)] rounded-lg overflow-hidden hover:bg-[var(--bg-card)] transition-colors relative"
              >
                {/* Image Area */}
                <div className="aspect-[4/3] bg-[var(--bg-card)] flex items-center justify-center relative">
                  {collection.imageUrl ? (
                    <Image
                      src={collection.imageUrl}
                      alt={collection.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <svg
                      className="w-20 h-20 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors"
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
                  )}
                  {/* Overlay for better text readability if needed, currently just hover effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                    {collection.name}
                  </h2>
                  <p className="text-[var(--text-secondary)] text-sm">
                    {collection.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
