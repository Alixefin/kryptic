"use client";

import { useState } from "react";
import { Search, Mail, Users, UserPlus, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

export default function AdminCustomersPage() {
  const customers = useQuery(api.users.listAll);
  const deleteUser = useMutation(api.users.deleteUser);
  const [searchQuery, setSearchQuery] = useState("");

  const isLoading = customers === undefined;

  const filteredCustomers = (customers || []).filter((customer) => {
    const matchesSearch =
      (customer.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone || "").includes(searchQuery);
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 mt-1">Loading customers...</p>
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
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-slate-400 mt-1">
          Manage your customer base ({(customers || []).length} total)
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 border border-slate-700">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Users className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{(customers || []).length}</p>
            <p className="text-sm text-slate-400">Total Customers</p>
          </div>
        </div>
        <div className="bg-slate-800/50 p-6 rounded-xl flex items-center gap-4 border border-slate-700">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <UserPlus className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{(customers || []).filter(c => c.role === "admin").length}</p>
            <p className="text-sm text-slate-400">Admin Users</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
        {(customers || []).length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No customers yet. Customers will appear here once they register.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Phone</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Joined</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium">
                          {(customer.name || "?").split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-white">{customer.name || "Unknown"}</p>
                          <p className="text-sm text-slate-400">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{customer.phone || "-"}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${customer.role === "admin"
                        ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                        : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}>
                        {customer.role || "user"}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {new Date(customer._creationTime).toISOString().split("T")[0]}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`mailto:${customer.email}`}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4 text-slate-400 hover:text-white" />
                        </a>
                        <button
                          onClick={async () => {
                            if (confirm("Are you sure you want to delete this user? This cannot be undone.")) {
                              await deleteUser({ userId: customer._id });
                            }
                          }}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {(customers || []).length > 0 && filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No customers match your search</p>
          </div>
        )}
      </div>
    </div>
  );
}
