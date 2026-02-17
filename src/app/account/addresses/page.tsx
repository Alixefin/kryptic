"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { ChevronRight, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export default function AddressesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center gap-2 mb-8">
          <Link href="/account" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            Account
          </Link>
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
          <span>Addresses</span>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Saved Addresses</h1>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Address
          </button>
        </div>

        {/* Address List - TODO: Wire up address management to backend */}
        <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
          <MapPin className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No saved addresses</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Add a shipping address to make checkout faster.
          </p>
          <button className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Your First Address
          </button>
        </div>
      </div>

      <Footer />
    </main>
  );
}
