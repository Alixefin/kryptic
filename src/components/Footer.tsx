"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const shopLinks = [
  { name: "Home", href: "/" },
  { name: "Our Collections", href: "/collections" },
  { name: "X BOY DIRECTOR", href: "/collections/x-boy-director" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Track Order", href: "/track-order" },
];

const paymentMethods = [
  { name: "Visa", src: "https://ext.same-assets.com/1808662203/4000352868.svg" },
  { name: "Mastercard", src: "https://ext.same-assets.com/1808662203/798889216.svg" },
  { name: "PayPal", src: "https://ext.same-assets.com/1808662203/3864129645.svg" },
  { name: "Apple Pay", src: "https://ext.same-assets.com/1808662203/658525573.svg" },
  { name: "Shop Pay", src: "https://ext.same-assets.com/1808662203/3765562295.svg" },
  { name: "Google Pay", src: "https://ext.same-assets.com/1808662203/3156002987.svg" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
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
                <line x1="48" y1="10" x2="48" y2="35" stroke="currentColor" strokeWidth="2" />
                <line x1="44" y1="14" x2="52" y2="14" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>

            <div className="space-y-2 text-sm">
              <p>
                <Link href="tel:+2348140617316" className="hover:underline">
                  Phone: +234 814 061 7316
                </Link>
              </p>
              <p>
                <Link href="mailto:info@outterspaceluxury.com" className="hover:underline">
                  Email: info@outterspaceluxury.com
                </Link>
              </p>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-600 hover:text-gray-900">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0Zm6.75 8.25-6.75 6.75a.75.75 0 0 1-1.06 0L5.25 9.31a.75.75 0 0 1 1.06-1.06l5.44 5.44 6.22-6.22a.75.75 0 0 1 1.06 1.06Z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">SHOP</h3>
            <ul className="space-y-2">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-bold text-lg mb-4">Address</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Store C10, Lennox Mall, Lekki Admiralty road, Lekki Phase 1, Opposite Medicure near Zenith Bank at Lekki Phase 1 Gate, Lekki
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <p className="text-sm text-gray-600">
              Mon - Sun: 9am - 7pm
            </p>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              {paymentMethods.map((method) => (
                <Image
                  key={method.name}
                  src={method.src}
                  alt={method.name}
                  width={40}
                  height={25}
                  className="h-6 w-auto"
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              © 2026, OUTTERSPACE
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
