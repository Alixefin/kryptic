"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribing:", email);
    setEmail("");
  };

  return (
    <section className="bg-[#c5dfe0] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Text */}
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-[#292826] leading-tight">
              Never miss our updates about new arrivals
              <br />
              <span className="font-bold">and special offers</span>
            </h2>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="w-full md:w-auto">
            <div className="flex">
              <div className="relative flex-1 md:w-80">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 bg-transparent focus:outline-none focus:border-gray-500 placeholder-gray-500"
                  required
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <ArrowRight className="h-5 w-5 text-[#292826]" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
