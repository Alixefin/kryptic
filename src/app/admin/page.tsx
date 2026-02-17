"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  Eye,
  Clock,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function AdminDashboard() {
  const stats = useQuery(api.users.getAdminStats);
  const recentOrders = useQuery(api.orders.getRecent, { limit: 5 });

  const isLoading = stats === undefined || recentOrders === undefined;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 mt-1">Loading...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse border border-slate-700">
              <div className="h-20 bg-slate-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statsDisplay = [
    {
      name: "Total Revenue",
      value: formatPrice(stats?.totalRevenue || 0),
      change: "",
      changeType: "increase",
      icon: DollarSign,
      color: "emerald",
      gradient: true,
    },
    {
      name: "Total Orders",
      value: String(stats?.totalOrders || 0),
      change: "",
      changeType: "increase",
      icon: ShoppingCart,
      color: "blue",
    },
    {
      name: "Total Products",
      value: String(stats?.totalProducts || 0),
      change: "",
      changeType: "increase",
      icon: Package,
      color: "purple",
    },
    {
      name: "Total Customers",
      value: String(stats?.totalCustomers || 0),
      change: "",
      changeType: "increase",
      icon: Users,
      color: "orange",
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; icon: string } } = {
      emerald: { bg: "bg-emerald-500/20", icon: "text-emerald-400" },
      blue: { bg: "bg-blue-500/20", icon: "text-blue-400" },
      purple: { bg: "bg-purple-500/20", icon: "text-purple-400" },
      orange: { bg: "bg-orange-500/20", icon: "text-orange-400" },
    };
    return colors[color] || colors.emerald;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div
              key={stat.name}
              className={`rounded-xl p-6 border ${stat.gradient
                ? "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20"
                : "bg-slate-800/50 border-slate-700"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 ${colorClasses.bg} rounded-lg`}>
                  <stat.icon className={`w-5 h-5 ${colorClasses.icon}`} />
                </div>
                {stat.change && (
                  <span className={`flex items-center text-sm ${stat.changeType === "increase" ? "text-emerald-400" : "text-red-400"
                    }`}>
                    {stat.changeType === "increase" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change}
                  </span>
                )}
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-slate-400">{stat.name}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alerts Section */}
      {(stats?.totalProducts === 0 || (stats?.totalOrders ?? 0) === 0) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
          <div>
            <p className="text-amber-400 font-medium">Getting Started</p>
            <p className="text-slate-400 text-sm mt-1">
              {stats?.totalProducts === 0 && "Add your first product to start selling. "}
              {(stats?.totalOrders ?? 0) === 0 && "No orders yet - share your store to get customers!"}
            </p>
          </div>
        </div>
      )}

      {/* Quick Actions & Recent Orders */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link
              href="/admin/products/new"
              className="flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Add New Product</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </Link>
            <Link
              href="/admin/orders"
              className="flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <span className="text-white">View All Orders</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </Link>
            <Link
              href="/admin/analytics"
              className="flex items-center justify-between px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-purple-400" />
                <span className="text-white">View Analytics</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </Link>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-emerald-400 hover:text-emerald-300">
              View all →
            </Link>
          </div>

          {(recentOrders || []).length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No orders yet</p>
              <p className="text-sm text-slate-500 mt-1">Orders will appear here when customers make purchases</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Order</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Total</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(recentOrders || []).map((order) => (
                    <tr key={order._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                      <td className="py-3 px-4">
                        <p className="text-sm font-mono text-white">{order._id.substring(0, 8)}...</p>
                        <p className="text-xs text-slate-400">
                          {new Date(order._creationTime).toISOString().split("T")[0]}
                        </p>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-300">{order.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-medium text-emerald-400">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order._id}`}
                          className="p-2 hover:bg-slate-700 rounded-lg inline-flex"
                        >
                          <Eye className="w-4 h-4 text-slate-400 hover:text-white" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
