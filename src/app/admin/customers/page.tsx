"use client";

import { useState } from "react";
import { Search, Eye, Mail, MoreVertical } from "lucide-react";
import { formatPrice } from "@/lib/currency";

// Mock data - will be replaced with Supabase data
const mockCustomers = [
  { 
    id: "1", 
    name: "John Doe", 
    email: "john@example.com", 
    phone: "+234 801 234 5678",
    orders: 5,
    totalSpent: 245000,
    joinedDate: "2025-12-15",
    lastOrder: "2026-01-24"
  },
  { 
    id: "2", 
    name: "Jane Smith", 
    email: "jane@example.com", 
    phone: "+234 802 345 6789",
    orders: 3,
    totalSpent: 156000,
    joinedDate: "2025-11-20",
    lastOrder: "2026-01-22"
  },
  { 
    id: "3", 
    name: "Bob Wilson", 
    email: "bob@example.com", 
    phone: "+234 803 456 7890",
    orders: 8,
    totalSpent: 478500,
    joinedDate: "2025-10-05",
    lastOrder: "2026-01-20"
  },
  { 
    id: "4", 
    name: "Alice Brown", 
    email: "alice@example.com", 
    phone: "+234 804 567 8901",
    orders: 2,
    totalSpent: 75000,
    joinedDate: "2026-01-10",
    lastOrder: "2026-01-18"
  },
  { 
    id: "5", 
    name: "Charlie Davis", 
    email: "charlie@example.com", 
    phone: "+234 805 678 9012",
    orders: 12,
    totalSpent: 892000,
    joinedDate: "2025-08-22",
    lastOrder: "2026-01-24"
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch = 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your customer base
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
          <p className="text-2xl font-bold">{mockCustomers.length}</p>
          <p className="text-sm text-[var(--text-secondary)]">Total Customers</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
          <p className="text-2xl font-bold">
            {mockCustomers.reduce((sum, c) => sum + c.orders, 0)}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">Total Orders</p>
        </div>
        <div className="bg-[var(--bg-secondary)] p-6 rounded-lg">
          <p className="text-2xl font-bold">
            {formatPrice(mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0))}
          </p>
          <p className="text-sm text-[var(--text-secondary)]">Total Revenue</p>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)]">
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Customer</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Phone</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Orders</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Total Spent</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Last Order</th>
                <th className="text-left p-4 text-sm font-medium text-[var(--text-secondary)]">Joined</th>
                <th className="text-right p-4 text-sm font-medium text-[var(--text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="border-b border-[var(--border-color)] hover:bg-[var(--bg-card)]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-medium">
                        {customer.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--text-secondary)]">{customer.phone}</td>
                  <td className="p-4">{customer.orders}</td>
                  <td className="p-4 font-medium">{formatPrice(customer.totalSpent)}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{customer.lastOrder}</td>
                  <td className="p-4 text-[var(--text-secondary)]">{customer.joinedDate}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[var(--text-secondary)]">No customers found</p>
          </div>
        )}
      </div>
    </div>
  );
}
