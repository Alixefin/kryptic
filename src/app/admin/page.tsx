"use client";

import { Package, ShoppingCart, Users, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import Link from "next/link";

// Mock data - will be replaced with Supabase data
const stats = [
  {
    name: "Total Revenue",
    value: formatPrice(2450000),
    change: "+12.5%",
    changeType: "increase",
    icon: DollarSign,
  },
  {
    name: "Total Orders",
    value: "156",
    change: "+8.2%",
    changeType: "increase",
    icon: ShoppingCart,
  },
  {
    name: "Total Products",
    value: "48",
    change: "+3",
    changeType: "increase",
    icon: Package,
  },
  {
    name: "Total Customers",
    value: "1,247",
    change: "+18.7%",
    changeType: "increase",
    icon: Users,
  },
];

const recentOrders = [
  { id: "KRP-001", customer: "John Doe", email: "john@example.com", total: 45000, status: "delivered", date: "2026-01-24" },
  { id: "KRP-002", customer: "Jane Smith", email: "jane@example.com", total: 32000, status: "shipped", date: "2026-01-24" },
  { id: "KRP-003", customer: "Bob Wilson", email: "bob@example.com", total: 78500, status: "processing", date: "2026-01-23" },
  { id: "KRP-004", customer: "Alice Brown", email: "alice@example.com", total: 25000, status: "pending", date: "2026-01-23" },
  { id: "KRP-005", customer: "Charlie Davis", email: "charlie@example.com", total: 56000, status: "confirmed", date: "2026-01-22" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500",
  processing: "bg-purple-500/20 text-purple-500",
  shipped: "bg-cyan-500/20 text-cyan-500",
  delivered: "bg-green-500/20 text-green-500",
  cancelled: "bg-red-500/20 text-red-500",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-[var(--bg-secondary)] p-6 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-[var(--bg-card)] rounded-lg">
                <stat.icon className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <span className={`flex items-center text-sm ${
                stat.changeType === "increase" ? "text-green-500" : "text-red-500"
              }`}>
                {stat.changeType === "increase" ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-[var(--text-secondary)]">{stat.name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-[var(--bg-secondary)] rounded-lg">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <h2 className="text-xl font-bold">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Order ID</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Total</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card)]">
                  <td className="p-4">
                    <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm hover:text-[var(--accent)]">
                      {order.id}
                    </Link>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{order.email}</p>
                    </div>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/admin/products/new"
          className="bg-[var(--bg-secondary)] p-6 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
        >
          <Package className="w-8 h-8 text-[var(--accent)] mb-4" />
          <h3 className="font-bold mb-1 group-hover:text-[var(--accent)]">Add New Product</h3>
          <p className="text-sm text-[var(--text-secondary)]">Add a new product to your catalog</p>
        </Link>
        <Link
          href="/admin/orders"
          className="bg-[var(--bg-secondary)] p-6 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
        >
          <ShoppingCart className="w-8 h-8 text-[var(--accent)] mb-4" />
          <h3 className="font-bold mb-1 group-hover:text-[var(--accent)]">Manage Orders</h3>
          <p className="text-sm text-[var(--text-secondary)]">View and process customer orders</p>
        </Link>
        <Link
          href="/admin/customers"
          className="bg-[var(--bg-secondary)] p-6 rounded-lg hover:bg-[var(--bg-card)] transition-colors group"
        >
          <Users className="w-8 h-8 text-[var(--accent)] mb-4" />
          <h3 className="font-bold mb-1 group-hover:text-[var(--accent)]">View Customers</h3>
          <p className="text-sm text-[var(--text-secondary)]">Manage your customer base</p>
        </Link>
      </div>
    </div>
  );
}
