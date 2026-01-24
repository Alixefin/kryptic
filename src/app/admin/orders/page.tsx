"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, ChevronDown } from "lucide-react";
import { formatPrice } from "@/lib/currency";

// Mock data - will be replaced with Supabase data
const mockOrders = [
  { 
    id: "KRP-001", 
    customer: "John Doe", 
    email: "john@example.com", 
    phone: "+234 801 234 5678",
    total: 45000, 
    items: 2,
    status: "delivered",
    paymentStatus: "paid",
    date: "2026-01-24",
    address: "123 Main Street, Lekki, Lagos"
  },
  { 
    id: "KRP-002", 
    customer: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+234 802 345 6789",
    total: 32000, 
    items: 1,
    status: "shipped",
    paymentStatus: "paid",
    date: "2026-01-24",
    address: "456 Oak Avenue, Victoria Island, Lagos"
  },
  { 
    id: "KRP-003", 
    customer: "Bob Wilson", 
    email: "bob@example.com", 
    phone: "+234 803 456 7890",
    total: 78500, 
    items: 3,
    status: "processing",
    paymentStatus: "paid",
    date: "2026-01-23",
    address: "789 Pine Road, Ikeja, Lagos"
  },
  { 
    id: "KRP-004", 
    customer: "Alice Brown", 
    email: "alice@example.com", 
    phone: "+234 804 567 8901",
    total: 25000, 
    items: 1,
    status: "pending",
    paymentStatus: "pending",
    date: "2026-01-23",
    address: "321 Elm Street, Yaba, Lagos"
  },
  { 
    id: "KRP-005", 
    customer: "Charlie Davis", 
    email: "charlie@example.com", 
    phone: "+234 805 678 9012",
    total: 56000, 
    items: 2,
    status: "confirmed",
    paymentStatus: "paid",
    date: "2026-01-22",
    address: "654 Maple Drive, Surulere, Lagos"
  },
];

const statusOptions = ["all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  confirmed: "bg-blue-500/20 text-blue-500",
  processing: "bg-purple-500/20 text-purple-500",
  shipped: "bg-cyan-500/20 text-cyan-500",
  delivered: "bg-green-500/20 text-green-500",
  cancelled: "bg-red-500/20 text-red-500",
};

const paymentStatusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-500",
  paid: "bg-green-500/20 text-green-500",
  failed: "bg-red-500/20 text-red-500",
  refunded: "bg-gray-500/20 text-gray-500",
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Order ID</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Items</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Total</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Status</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Payment</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Date</th>
                <th className="text-right p-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card)]">
                  <td className="p-4">
                    <span className="font-mono text-sm">{order.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{order.email}</p>
                    </div>
                  </td>
                  <td className="p-4">{order.items}</td>
                  <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{order.date}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <div className="relative">
                        <button className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
