"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  AlertTriangle,
  TrendingUp,
  ExternalLink,
  Bell,
  Search,
  Check,
} from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Menu },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAdmin, logout } = useAuth();

  const notifications = useQuery(api.notifications.listAdmin);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const unreadCount = notifications?.length || 0;

  const handleMarkAllRead = async () => {
    await markAllRead();
    setIsNotificationsOpen(false);
  };

  // Skip auth check for login page
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoading && !isLoginPage) {
      if (!user) {
        router.push("/account/login");
      } else if (!isAdmin) {
        router.push("/");
      }
    }
  }, [user, isLoading, isAdmin, router, isLoginPage]);

  // Show login page without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="text-slate-400 mt-4">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Don't render admin layout if not admin
  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-slate-900 border-r border-slate-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div>
                <span className="text-lg font-bold text-white">
                  Admin Panel
                </span>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="mx-auto w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">K</span>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActive
                    ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30"
                    : "hover:bg-slate-800/50 text-slate-400 hover:text-white"
                    } ${sidebarCollapsed ? "justify-center" : ""}`}
                >
                  <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "group-hover:text-emerald-400"}`} />
                  {!sidebarCollapsed && <span className="font-medium">{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-slate-800 space-y-1">
            {/* Collapse toggle - desktop only */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors w-full justify-center"
            >
              <Menu className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">Collapse</span>}
            </button>

            <Link
              href="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <ExternalLink className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">View Store</span>}
            </Link>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors w-full ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <LogOut className="w-5 h-5" />
              {!sidebarCollapsed && <span className="font-medium">Logout</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-slate-400"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Search bar */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700 w-80">
                <Search className="w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search orders, products, customers..."
                  className="bg-transparent text-sm text-white placeholder-slate-400 outline-none w-full"
                />
                <kbd className="px-2 py-0.5 text-xs text-slate-400 bg-slate-700 rounded">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--bg-secondary)]"></span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
                      <h3 className="font-semibold text-sm text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllRead}
                          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {unreadCount === 0 ? (
                        <div className="p-8 text-center text-slate-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No new notifications</p>
                        </div>
                      ) : (
                        notifications?.map((notif) => (
                          <Link
                            href={notif.link || "/admin/orders"}
                            key={notif._id}
                            onClick={() => setIsNotificationsOpen(false)}
                            className="block p-4 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0"
                          >
                            <div className="flex gap-3">
                              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{notif.message}</p>
                                <p className="text-[10px] text-slate-500 mt-2 opacity-70">
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

              {/* User profile */}
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.firstName?.[0] || "A"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white">{user?.firstName || "Admin"}</p>
                  <p className="text-xs text-slate-400">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
