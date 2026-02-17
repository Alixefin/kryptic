"use client";

import { useState } from "react";
import {
    DollarSign,
    ShoppingCart,
    Package,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
} from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function AdminAnalyticsPage() {
    const stats = useQuery(api.users.getAdminStats);
    const allOrders = useQuery(api.orders.listAll);
    const [dateRange, setDateRange] = useState("7days");

    const isLoading = stats === undefined || allOrders === undefined;

    // Compute weekly sales data from orders
    const now = new Date();
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData: { [key: string]: { revenue: number; orders: number } } = {};

    // Initialize all days
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayName = days[date.getDay()];
        dailyData[dayName] = { revenue: 0, orders: 0 };
    }

    // Fill with actual data from orders
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    (allOrders || []).forEach((order) => {
        const orderDate = new Date(order._creationTime);
        if (orderDate >= weekAgo && order.paymentStatus === "paid") {
            const dayName = days[orderDate.getDay()];
            if (dailyData[dayName]) {
                dailyData[dayName].revenue += order.total || 0;
                dailyData[dayName].orders += 1;
            }
        }
    });

    const weeklySales = Object.entries(dailyData).map(([day, data]) => ({
        day,
        revenue: data.revenue,
        orders: data.orders,
    }));

    const maxRevenue = Math.max(...weeklySales.map((d) => d.revenue), 1);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Analytics</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-slate-800/50 rounded-xl p-6 animate-pulse border border-slate-700">
                            <div className="h-20 bg-slate-700 rounded"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-slate-400 mt-1">Track your store performance</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button
                        onClick={() => setDateRange("7days")}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${dateRange === "7days" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                        7 Days
                    </button>
                    <button
                        onClick={() => setDateRange("30days")}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${dateRange === "30days" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                        30 Days
                    </button>
                    <button
                        onClick={() => setDateRange("all")}
                        className={`px-3 py-1.5 rounded-md text-sm transition-colors ${dateRange === "all" ? "bg-emerald-500 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-emerald-500/20 rounded-lg">
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-4">{formatPrice(stats?.totalRevenue || 0)}</p>
                    <p className="text-sm text-slate-400">Total Revenue</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <ShoppingCart className="w-5 h-5 text-blue-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-4">{stats?.totalOrders || 0}</p>
                    <p className="text-sm text-slate-400">Total Orders</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Package className="w-5 h-5 text-purple-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-4">{stats?.totalProducts || 0}</p>
                    <p className="text-sm text-slate-400">Products</p>
                </div>

                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="p-2 bg-orange-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-orange-400" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mt-4">
                        {stats?.totalOrders ? formatPrice((stats.totalRevenue || 0) / stats.totalOrders) : "₦0"}
                    </p>
                    <p className="text-sm text-slate-400">Avg Order Value</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Last 7 days
                    </div>
                </div>

                {/* Simple Bar Chart */}
                <div className="h-64 flex items-end gap-2">
                    {weeklySales.map((day) => (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                            <div
                                className="w-full bg-gradient-to-t from-emerald-500 to-teal-400 rounded-t-md transition-all duration-500 hover:from-emerald-400 hover:to-teal-300"
                                style={{
                                    height: `${Math.max((day.revenue / maxRevenue) * 100, 5)}%`,
                                    minHeight: "8px"
                                }}
                                title={`${formatPrice(day.revenue)} - ${day.orders} orders`}
                            />
                            <span className="text-xs text-slate-400">{day.day}</span>
                        </div>
                    ))}
                </div>

                {/* Chart Legend */}
                <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-sm"></div>
                        <span className="text-sm text-slate-400">Revenue</span>
                    </div>
                </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h2 className="text-lg font-semibold text-white mb-4">This Week&apos;s Summary</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Day</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Orders</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {weeklySales.map((day) => (
                                <tr key={day.day} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                    <td className="py-3 px-4 text-sm text-white">{day.day}</td>
                                    <td className="py-3 px-4 text-sm text-right text-slate-300">{day.orders}</td>
                                    <td className="py-3 px-4 text-sm text-right text-emerald-400 font-medium">{formatPrice(day.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="bg-slate-700/30">
                                <td className="py-3 px-4 text-sm font-semibold text-white">Total</td>
                                <td className="py-3 px-4 text-sm text-right font-semibold text-white">
                                    {weeklySales.reduce((sum, d) => sum + d.orders, 0)}
                                </td>
                                <td className="py-3 px-4 text-sm text-right font-semibold text-emerald-400">
                                    {formatPrice(weeklySales.reduce((sum, d) => sum + d.revenue, 0))}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
