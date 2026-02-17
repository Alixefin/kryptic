"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

type OrderResult = {
  found: boolean;
  order?: {
    id: string;
    status: string;
    paymentStatus: string;
    total: number;
    email: string;
    createdAt: string;
    items: { productName: string; quantity: number; productPrice: number }[];
  };
};

const statusSteps = [
  { key: "pending", label: "Order Confirmed", icon: Package, description: "Your order has been received and is being processed." },
  { key: "processing", label: "Processing", icon: Clock, description: "We're preparing your order for shipment." },
  { key: "shipped", label: "In Transit", icon: Truck, description: "Your package is on its way to you." },
  { key: "delivered", label: "Delivered", icon: CheckCircle, description: "Your order has been delivered successfully." },
];

const statusOrder = ["pending", "processing", "shipped", "delivered"];

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState("");
  const [email, setEmail] = useState("");
  const [searchRef, setSearchRef] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // Only query when we have a reference to search for
  const order = useQuery(
    api.orders.getByReference,
    searchRef ? { reference: searchRef } : "skip"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchRef(orderRef.trim());
    setHasSearched(true);
  };

  const isLoading = hasSearched && searchRef && order === undefined;
  const notFound = hasSearched && order === null;
  const found = hasSearched && order && order.email?.toLowerCase() === email.toLowerCase();
  const emailMismatch = hasSearched && order && order.email?.toLowerCase() !== email.toLowerCase();

  const currentStatusIndex = found ? statusOrder.indexOf(order.status) : -1;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(amount);

  return (
    <main className="min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Track Your Order</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Enter your payment reference and email address to track your package.
        </p>

        <div className="max-w-xl mx-auto">
          {/* Track Order Form */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-lg mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderRef" className="block text-sm font-medium mb-2">
                  Payment Reference
                </label>
                <input
                  type="text"
                  id="orderRef"
                  value={orderRef}
                  onChange={(e) => setOrderRef(e.target.value)}
                  placeholder="e.g., PAY-ABC123XYZ"
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!!isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                {isLoading ? "Searching..." : "Track Order"}
              </button>
            </form>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[var(--accent)]" />
            </div>
          )}

          {/* Not Found */}
          {(notFound || emailMismatch) && (
            <div className="bg-[var(--bg-secondary)] p-8 rounded-lg text-center space-y-4">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h2 className="text-xl font-bold">Order Not Found</h2>
              <p className="text-[var(--text-secondary)]">
                We couldn&apos;t find an order matching your reference and email. Please double-check your details.
              </p>
            </div>
          )}

          {/* Order Found */}
          {found && (
            <div className="space-y-8">
              {/* Order Summary */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">Order Details</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[var(--text-secondary)]">Reference</span>
                    <p className="font-mono font-medium">{order.paymentReference}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Total</span>
                    <p className="font-bold text-[var(--accent)]">{formatCurrency(order.total)}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Status</span>
                    <p className="font-medium capitalize">{order.status}</p>
                  </div>
                  <div>
                    <span className="text-[var(--text-secondary)]">Payment</span>
                    <p className="font-medium capitalize">{order.paymentStatus}</p>
                  </div>
                </div>

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                    <h3 className="text-sm font-semibold mb-2 text-[var(--text-secondary)]">Items</h3>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="flex justify-between text-sm">
                          <span>{item.productName} × {item.quantity}</span>
                          <span className="font-medium">{formatCurrency(item.productPrice * item.quantity)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-6">Order Progress</h2>
                <div className="space-y-6">
                  {statusSteps.map((stepItem, index) => {
                    const isComplete = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    const Icon = stepItem.icon;

                    return (
                      <div key={stepItem.key} className="flex items-start gap-4">
                        <div className={`p-2 rounded-full transition-colors ${isComplete
                            ? "bg-[var(--accent)]"
                            : "bg-[var(--border-color)]"
                          }`}>
                          <Icon className={`h-5 w-5 ${isComplete ? "text-white" : "text-[var(--text-secondary)]"}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${isCurrent ? "text-[var(--accent)]" : ""}`}>
                            {stepItem.label}
                            {isCurrent && <span className="ml-2 text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full">Current</span>}
                          </h3>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {stepItem.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* How It Works (only show when no search result) */}
          {!hasSearched && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">How Order Tracking Works</h2>
              <div className="space-y-4">
                {statusSteps.map((stepItem) => {
                  const Icon = stepItem.icon;
                  return (
                    <div key={stepItem.key} className="flex items-start gap-4">
                      <div className="p-2 bg-[var(--accent)] rounded-full">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{stepItem.label}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{stepItem.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
