"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const shopLinks = [
  { name: "Home", href: "/" },
  { name: "Our Collections", href: "/collections" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Track Order", href: "/track-order" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Logo and Contact */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src="/images/hero/logo.png"
                alt="KRYPTIC"
                width={40}
                height={40}
                className="h-10 w-auto"
              />
              <span 
                className="text-xl font-bold tracking-wider"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                KRYPTIC
              </span>
            </Link>

            <div className="space-y-2 text-sm text-[var(--text-secondary)]">
              <p>
                <Link href="tel:+2349090615225" className="hover:underline">
                  Phone: +234 909 0615 225
                </Link>
              </p>
              <p>
                <Link href="mailto:support@krypticlab.com" className="hover:underline">
                  Email: support@krypticlab.com
                </Link>
              </p>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                <Instagram className="h-5 w-5" />
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
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              Lokoja, Kogi State / Lagos, Nigeria
            </p>
          </div>

          {/* Opening Hours */}
          <div>
            <h3 className="font-bold text-lg mb-4">Opening Hours</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              24 Hours
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[var(--border-color)] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-sm text-[var(--text-secondary)]">
              © 2026, KRYPTIC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
