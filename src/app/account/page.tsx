"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { User, Package, MapPin, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
        </div>
        <Footer />
      </main>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const menuItems = [
    { icon: User, label: "Profile", href: "/account/profile", description: "Manage your personal information" },
    { icon: Package, label: "Orders", href: "/account/orders", description: "View your order history" },
    { icon: MapPin, label: "Addresses", href: "/account/addresses", description: "Manage shipping addresses" },
  ];

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">My Account</h1>
        <p className="text-center text-[var(--text-secondary)] mb-12">
          Welcome back, {user?.firstName}!
        </p>

        <div className="max-w-2xl mx-auto">
          {/* User Info Card */}
          <div className="bg-[var(--bg-secondary)] p-6 rounded-lg mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div>
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-[var(--text-secondary)]">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-card)] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-[var(--bg-card)] rounded-lg">
                    <item.icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.label}</h3>
                    <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-[var(--text-secondary)]" />
              </Link>
            ))}

            {/* Logout Button */}
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="flex items-center gap-4 w-full p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-card)] transition-colors text-left"
            >
              <div className="p-2 bg-[var(--bg-card)] rounded-lg">
                <LogOut className="h-5 w-5 text-[var(--sale-red)]" />
              </div>
              <div>
                <h3 className="font-semibold text-[var(--sale-red)]">Logout</h3>
                <p className="text-sm text-[var(--text-secondary)]">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
