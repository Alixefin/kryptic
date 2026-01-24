"use client";

import { MessageCircle } from "lucide-react";

export default function MessageButton() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 bg-[var(--accent)] text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-[var(--accent-dark)] transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Message us</span>
    </button>
  );
}
