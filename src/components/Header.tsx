"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronDown, User, ShoppingBag, Menu, X, Bell, Check } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

// const collections = [
//   { name: "JACKETS", href: "/collections/jackets" },
//   { name: "T-SHIRTS", href: "/collections/t-shirts" },
//   { name: "SHIRTS", href: "/collections/shirts" },
//   { name: "BOTTOMS", href: "/collections/bottoms" },
//   { name: "ACCESSORIES", href: "/collections/accessories" },
// ];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
  { name: "Track Order", href: "/track-order" },
];

export default function Header() {
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { toggleCart, getItemCount } = useCart();
  const { theme } = useTheme();
  const { user } = useAuth();
  const pathname = usePathname();
  const itemCount = getItemCount();

  const notifications = useQuery(api.notifications.list);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const unreadCount = notifications?.length || 0;

  const activeCategories = useQuery(api.categories.listActive);
  const collections = activeCategories
    ? activeCategories.map(c => ({ name: c.name.toUpperCase(), href: `/collections/${c.slug}` }))
    : [];

  const handleMarkAllRead = async () => {
    await markAllRead();
    setIsNotificationsOpen(false);
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isCollectionsActive = pathname.startsWith("/collections");

  // Use different logos for dark and light mode
  const logoSrc = theme === "dark"
    ? "/images/hero/logo-dark.png"
    : "/images/hero/logo-light.png";

  return (
    <header className="bg-[var(--bg-primary)] border-b border-[var(--border-color)] sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image
              src={logoSrc}
              alt="KRYPTIC"
              width={40}
              height={40}
              className="h-10 w-auto"
              priority
            />
            <span
              className="text-xl font-bold tracking-wider"
              style={{ fontFamily: "'Orbitron', sans-serif" }}
            >
              KRYPTIC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "underline underline-offset-4" : ""}`}
            >
              Home
            </Link>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsCollectionsOpen(true)}
              onMouseLeave={() => setIsCollectionsOpen(false)}
            >
              <button className={`nav-link flex items-center gap-1 ${isCollectionsActive ? "underline underline-offset-4" : ""}`}>
                Our Collections
                <ChevronDown className="h-4 w-4" />
              </button>

              {isCollectionsOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-lg py-2">
                  {collections.map((collection) => (
                    <Link
                      key={collection.name}
                      href={collection.href}
                      className="block px-4 py-2 text-sm hover:bg-[var(--bg-card)] transition-colors"
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? "underline underline-offset-4" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* Notifications */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors relative text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-primary)]"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-primary)]">
                      <h3 className="font-semibold text-sm">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-[var(--accent)] hover:text-emerald-400 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {unreadCount === 0 ? (
                        <div className="p-8 text-center text-[var(--text-secondary)]">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        notifications?.map((notif) => (
                          <Link
                            href={notif.link || "/account/orders"}
                            key={notif._id}
                            onClick={() => setIsNotificationsOpen(false)}
                            className="block p-4 hover:bg-[var(--bg-primary)] transition-colors border-b border-[var(--border-color)] last:border-0"
                          >
                            <div className="flex gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-[var(--accent)] flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium">{notif.title}</p>
                                <p className="text-xs text-[var(--text-secondary)] mt-1 line-clamp-2">{notif.message}</p>
                                <p className="text-[10px] text-[var(--text-secondary)] mt-2 opacity-70">
                                  {new Date(notif._creationTime).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link href="/account" className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors">
              <User className="h-5 w-5" />
            </Link>

            <button
              onClick={toggleCart}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-full transition-colors relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[var(--accent)] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-[var(--bg-secondary)] rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-primary)] border-t border-[var(--border-color)]">
          <nav className="px-4 py-4 space-y-4">
            <Link
              href="/"
              className={`block py-2 text-sm font-medium ${isActive("/") ? "text-[var(--accent)]" : ""}`}
            >
              Home
            </Link>
            <div>
              <button
                className={`flex items-center justify-between w-full py-2 text-sm font-medium ${isCollectionsActive ? "text-[var(--accent)]" : ""}`}
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
                      className={`block py-1 text-sm ${pathname === collection.href ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
                    >
                      {collection.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {navLinks.slice(1).map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block py-2 text-sm font-medium ${isActive(link.href) ? "text-[var(--accent)]" : ""}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
