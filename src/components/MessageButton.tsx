"use client";

import { MessageCircle } from "lucide-react";

export default function MessageButton() {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 bg-gray-800 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-gray-700 transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      <span className="text-sm font-medium">Message us</span>
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
        1
      </span>
    </button>
  );
}
