"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Search, Package, Truck, CheckCircle } from "lucide-react";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Handle order tracking
    console.log("Tracking order:", { orderNumber, email });
    // Simulate search
    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8">Track Your Order</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-2xl mx-auto">
          Enter your order number and email address to track your package.
        </p>

        <div className="max-w-xl mx-auto">
          {/* Track Order Form */}
          <div className="bg-[var(--bg-secondary)] p-8 rounded-lg mb-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g., KRP-123456"
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
                disabled={isSearching}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Search className="h-5 w-5" />
                {isSearching ? "Searching..." : "Track Order"}
              </button>
            </form>
          </div>

          {/* Order Status Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">How Order Tracking Works</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-full">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Order Confirmed</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your order has been received and is being processed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-full">
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">In Transit</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your package is on its way to you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-[var(--accent)] rounded-full">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">Delivered</h3>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Your order has been delivered successfully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
