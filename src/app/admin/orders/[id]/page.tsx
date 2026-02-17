"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Truck, User, MapPin, CreditCard, Clock, Trash2 } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    delivered: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
};

const paymentStatusColors: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    paid: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    failed: "bg-red-500/20 text-red-400 border-red-500/30",
    refunded: "bg-slate-500/20 text-slate-400 border-slate-500/30",
};

export default function OrderDetailPage() {
    const params = useParams();
    const orderId = params.id as string;
    const order = useQuery(
        api.orders.getById,
        orderId ? { id: orderId as Id<"orders"> } : "skip"
    );
    const updateStatus = useMutation(api.orders.updateStatus);
    const deleteOrder = useMutation(api.orders.deleteOrder);
    const router = useRouter();

    const isLoading = order === undefined;

    const handleStatusChange = async (newStatus: string) => {
        if (!order) return;
        try {
            await updateStatus({ id: order._id, status: newStatus });
        } catch (err) {
            console.error("Failed to update status:", err);
        }
    };

    const handleDelete = async () => {
        if (!order) return;
        if (confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                await deleteOrder({ id: order._id });
                router.push("/admin/orders");
            } catch (err) {
                console.error("Failed to delete order:", err);
                alert("Failed to delete order");
            }
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Loading order...</h1>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-8 animate-pulse border border-slate-700">
                    <div className="h-48 bg-slate-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-white">Order not found</h1>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-8 text-center border border-slate-700">
                    <Clock className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">The order you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/admin/orders" className="inline-block mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-400 transition-colors">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const shippingAddress = order.shippingAddress as {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        street?: string;
        city?: string;
        state?: string;
        country?: string;
    } | undefined;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Order {order._id.substring(0, 8).toUpperCase()}</h1>
                        <p className="text-sm text-slate-400">
                            Placed on {new Date(order._creationTime).toLocaleDateString("en-NG", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDelete}
                        className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                        title="Delete Order"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${paymentStatusColors[order.paymentStatus] || "bg-slate-500/20 text-slate-400 border-slate-500/30"}`}>
                        {order.paymentStatus}
                    </span>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium capitalize border ${statusColors[order.status] || "bg-slate-500/20 border-slate-500/30"} bg-transparent focus:outline-none cursor-pointer`}
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status} className="bg-slate-800 text-white">
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                            <Package className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-bold text-white">Order Items</h2>
                        </div>
                        <div className="divide-y divide-slate-700">
                            {(order.items || []).map((item: { _id: string; productName: string; productPrice: number; quantity: number; size?: string; color?: string }) => (
                                <div key={item._id} className="p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-slate-500" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{item.productName}</p>
                                        <p className="text-sm text-slate-400">
                                            {item.size && `Size: ${item.size}`}
                                            {item.size && item.color && " • "}
                                            {item.color && `Color: ${item.color}`}
                                        </p>
                                        <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium text-emerald-400">{formatPrice(item.productPrice * item.quantity)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-bold text-white">Payment Summary</h2>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Subtotal</span>
                                <span className="text-white">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Shipping</span>
                                <span className="text-white">{formatPrice(order.shipping)}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-3 flex justify-between font-bold">
                                <span className="text-white">Total</span>
                                <span className="text-emerald-400">{formatPrice(order.total)}</span>
                            </div>
                            {order.paymentReference && (
                                <div className="pt-3 border-t border-slate-700">
                                    <p className="text-sm text-slate-400">
                                        Reference: <span className="font-mono text-white">{order.paymentReference}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Customer & Shipping */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                            <User className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-bold text-white">Customer</h2>
                        </div>
                        <div className="p-4 space-y-2">
                            <p className="font-medium text-white">
                                {shippingAddress?.firstName} {shippingAddress?.lastName}
                            </p>
                            <p className="text-sm text-slate-400">{order.email}</p>
                            {shippingAddress?.phone && (
                                <p className="text-sm text-slate-400">{shippingAddress.phone}</p>
                            )}
                        </div>
                    </div>

                    {/* Shipping Address */}
                    {shippingAddress && (
                        <div className="bg-slate-800/50 rounded-xl border border-slate-700">
                            <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-emerald-400" />
                                <h2 className="font-bold text-white">Shipping Address</h2>
                            </div>
                            <div className="p-4 space-y-1 text-slate-300">
                                <p>{shippingAddress.street}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state}</p>
                                <p>{shippingAddress.country}</p>
                            </div>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-emerald-400" />
                            <h2 className="font-bold text-white">Order Timeline</h2>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500"></div>
                                    <div>
                                        <p className="font-medium text-white">Order Placed</p>
                                        <p className="text-sm text-slate-400">
                                            {new Date(order._creationTime).toLocaleString("en-NG")}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${order.paymentStatus === "paid" ? "bg-emerald-500" : "bg-yellow-500"}`}></div>
                                    <div>
                                        <p className="font-medium text-white">Payment {order.paymentStatus === "paid" ? "Received" : order.paymentStatus}</p>
                                        <p className="text-sm text-slate-400">
                                            {order.paymentStatus === "paid" ? "Confirmed" : "Pending confirmation"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${["processing", "shipped", "delivered"].includes(order.status) ? "bg-emerald-500" : "bg-slate-600"}`}></div>
                                    <div>
                                        <p className="font-medium text-white">Processing</p>
                                        <p className="text-sm text-slate-400">
                                            {["processing", "shipped", "delivered"].includes(order.status) ? "Order is being prepared" : "Waiting"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${["shipped", "delivered"].includes(order.status) ? "bg-emerald-500" : "bg-slate-600"}`}></div>
                                    <div>
                                        <p className="font-medium text-white">Shipped</p>
                                        <p className="text-sm text-slate-400">
                                            {["shipped", "delivered"].includes(order.status) ? "In transit" : "Not yet shipped"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${order.status === "delivered" ? "bg-emerald-500" : "bg-slate-600"}`}></div>
                                    <div>
                                        <p className="font-medium text-white">Delivered</p>
                                        <p className="text-sm text-slate-400">
                                            {order.status === "delivered" ? "Order completed" : "Pending delivery"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
