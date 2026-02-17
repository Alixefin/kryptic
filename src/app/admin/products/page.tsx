"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function AdminProductsPage() {
  const products = useQuery(api.products.list);
  const removeProduct = useMutation(api.products.remove);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const categoriesQuery = useQuery(api.categories.listAll);
  const categories = categoriesQuery || [];

  const isLoading = products === undefined || categoriesQuery === undefined;

  async function handleDelete(productId: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);
    try {
      await removeProduct({ id: productId as Id<"products"> });
    } catch {
      alert("Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = (products || []).filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">
            Manage your product catalog ({(products || []).length} items)
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-400 hover:to-teal-400 transition-all font-medium w-fit"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="all" className="bg-slate-800">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug} className="bg-slate-800">
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No products found</p>
            <Link href="/admin/products/new" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block">
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
                          {!product.imageUrl || product.imageUrl.includes("placeholder") ? (
                            <Package className="w-6 h-6 text-slate-500" />
                          ) : (
                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.name}</p>
                          <p className="text-sm text-slate-400">ID: {product._id.substring(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-slate-300">{product.category}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-emerald-400">{formatPrice(product.price)}</p>
                        {product.originalPrice && (
                          <p className="text-sm text-slate-500 line-through">
                            {formatPrice(product.originalPrice)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300">{product.stock}</td>
                    <td className="p-4">
                      {product.soldOut ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          Sold Out
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-slate-400 hover:text-white" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400" />
                          ) : (
                            <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-400" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
