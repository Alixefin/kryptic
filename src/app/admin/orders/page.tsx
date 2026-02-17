"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, Filter, Clock } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";

const statusOptions: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function AdminOrdersPage() {
  const orders = useQuery(api.orders.listAll);
  const updateStatus = useMutation(api.orders.updateStatus);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const isLoading = orders === undefined;

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateStatus({ id: orderId as Id<"orders">, status: newStatus });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "processing":
      case "confirmed":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  const filteredOrders = (orders || []).filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 mt-1">Loading orders...</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-8 animate-pulse border border-slate-700">
          <div className="h-48 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-slate-400 mt-1">
          Manage and track customer orders ({(orders || []).length} total)
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
        {(orders || []).length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No orders yet</p>
            <p className="text-sm text-slate-500 mt-1">Orders will appear here when customers make purchases</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Date</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Total</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-4">
                      <p className="font-mono text-sm text-emerald-400">{order._id.substring(0, 8)}...</p>
                    </td>
                    <td className="p-4 text-white">{order.email}</td>
                    <td className="p-4 text-slate-400">
                      {new Date(order._creationTime).toISOString().split("T")[0]}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value as OrderStatus)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-transparent border ${getStatusColor(order.status)} focus:outline-none cursor-pointer`}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value} className="bg-slate-800 text-white">
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4 text-right font-medium text-emerald-400">
                      {formatPrice(order.total)}
                    </td>
                    <td className="p-4 text-right">
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

        {(orders || []).length > 0 && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No orders match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
