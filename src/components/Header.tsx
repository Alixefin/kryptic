"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, User, ShoppingBag, Menu, X } from "lucide-react";

const collections = [
  { name: "JACKETS", href: "/collections/jackets" },
  { name: "T-SHIRTS", href: "/collections/t-shirts" },
  { name: "SHIRTS", href: "/collections/shirts" },
  { name: "BOTTOMS", href: "/collections/bottoms" },
  { name: "ACCESSORIES", href: "/collections/accessories" },
  { name: "FUTURE VINTAGE", href: "/collections/future-vintage" },
];

export default function Header() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <svg viewBox="0 0 200 40" className="h-8 w-auto" fill="currentColor">
              <text x="0" y="30" fontFamily="Jost, sans-serif" fontSize="20" fontWeight="500" letterSpacing="2">
                OUT
              </text>
              <text x="42" y="30" fontFamily="Jost, sans-serif" fontSize="20" fontWeight="500" letterSpacing="2">
                T
              </text>
              <text x="55" y="30" fontFamily="Jost, sans-serif" fontSize="20" fontWeight="500" letterSpacing="2">
                ERSPACE
              </text>
              {/* Double T decoration */}
              <line x1="48" y1="10" x2="48" y2="35" stroke="currentColor" strokeWidth="2" />
              <line x1="44" y1="14" x2="52" y2="14" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="nav-link underline underline-offset-4">Home</Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button className="nav-link flex items-center gap-1">
                Our Collections
                <ChevronDown className="h-4 w-4" />
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 shadow-lg py-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      href={collection.href}
                      className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/collections/x-boy-director" className="nav-link">X BOY DIRECTOR</Link>
            <Link href="/about" className="nav-link">About Us</Link>
            <Link href="/contact" className="nav-link">Contact Us</Link>
            <Link href="/track-order" className="nav-link">Track Order</Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Country/Currency Selector */}
            <div className="hidden md:flex items-center space-x-2 text-sm">
              <span className="text-gray-500">United States | NGN</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <User className="h-5 w-5" />
            </button>

            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors relative">
              <ShoppingBag className="h-5 w-5" />
            </button>

            {/* Currency selector */}
            <div className="hidden md:flex items-center space-x-1 text-sm">
              <span className="text-xs">🇺🇸</span>
              <span>USD</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-4">
            <Link href="/" className="block py-2 text-sm font-medium">Home</Link>
            <div>
              <button
                className="flex items-center justify-between w-full py-2 text-sm font-medium"
                onClick={() => setIsCollectionsOpen(!isCollectionsOpen)}
              >
                Our Collections
                <ChevronDown className={`h-4 w-4 transition-transform ${isCollectionsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCollectionsOpen && (
                <div className="pl-4 space-y-2 mt-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      href={collection.href}
                      className="block py-1 text-sm text-gray-600"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/collections/x-boy-director" className="block py-2 text-sm font-medium">X BOY DIRECTOR</Link>
            <Link href="/about" className="block py-2 text-sm font-medium">About Us</Link>
            <Link href="/contact" className="block py-2 text-sm font-medium">Contact Us</Link>
            <Link href="/track-order" className="block py-2 text-sm font-medium">Track Order</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
