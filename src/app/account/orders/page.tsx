"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/currency";
import { Package, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

// Mock orders data - will be replaced with actual data from Convex
const mockOrders = [
  {
    id: "KRP-1706093100000-ABC123",
    date: "2026-01-24",
    status: "delivered",
    total: 45000,
    items: 2,
  },
  {
    id: "KRP-1706006700000-DEF456",
    date: "2026-01-23",
    status: "shipped",
    total: 32000,
    items: 1,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500",
  processing: "bg-purple-500/20 text-purple-500",
  shipped: "bg-cyan-500/20 text-cyan-500",
  delivered: "bg-green-500/20 text-green-500",
  cancelled: "bg-red-500/20 text-red-500",
};

export default function OrdersPage() {
  const { user } = useAuth();
  const orders = useQuery(api.orders.getByUser, user ? { userId: user.id } : "skip");

  const isLoading = orders === undefined;

  if (isLoading) {
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
          <span>Orders</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-secondary)] rounded-lg">
            <Package className="w-16 h-16 text-[var(--text-secondary)] mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-[var(--text-secondary)] mb-6">
              When you place orders, they will appear here.
            </p>
            <Link href="/collections/all" className="btn-primary inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[var(--bg-secondary)] p-6 rounded-lg hover:bg-[var(--bg-card)] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-sm text-[var(--text-secondary)]">#{order._id.substring(0, 8)}...</p>
                    <p className="font-medium mt-1">{order.items.length} item(s)</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(order._creationTime).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status] || "bg-gray-500/20 text-gray-500"}`}>
                      {order.status}
                    </span>
                    <span className="font-bold">{formatPrice(order.total)}</span>
                    <Link
                      href={`/account/orders/${order._id}`}
                      className="text-[var(--accent)] hover:underline text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
