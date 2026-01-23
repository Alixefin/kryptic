"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function SubscribeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Show modal after 2 seconds
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribing:", email);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#292826] mb-2">
            Subscribe To Get Best Deals & Offers!
          </h2>
          <p className="text-gray-500 mb-6">
            Sign up and unlock your instant discounts.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#292826] text-white py-3 font-medium hover:bg-gray-700 transition-colors"
            >
              Submit
            </button>
          </form>

          <button
            onClick={() => setIsOpen(false)}
            className="mt-4 text-[#7fb3b5] hover:underline text-sm"
          >
            No, thanks
          </button>

          <p className="mt-4 text-xs text-gray-400">
            You are signing up to receive communication via email and can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}
