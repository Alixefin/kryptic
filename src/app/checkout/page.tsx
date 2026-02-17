"use client";

import dynamic from "next/dynamic";

const CheckoutContent = dynamic(() => import("./CheckoutContent"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
    </main>
  ),
});

export default function CheckoutPage() {
  return <CheckoutContent />;
}
