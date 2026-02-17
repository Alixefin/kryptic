"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { formatPrice } from "@/lib/currency";
import { ChevronLeft, Package, MapPin, CreditCard, Clock } from "lucide-react";
import { Id } from "@convex/_generated/dataModel";

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: orderId } = use(params);
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const order = useQuery(api.orders.getById, { id: orderId as Id<"orders"> });

    if (authLoading || order === undefined) {
        return (
            <main className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
                </div>
                <Footer />
            </main>
        );
    }

    if (!order) {
        return (
            <main className="min-h-screen">
                <Header />
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
                    <Link href="/account/orders" className="text-[var(--accent)] hover:underline">
                        Back to Orders
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[var(--bg-primary)]">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Link
                    href="/account/orders"
                    className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back to Orders
                </Link>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Order Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                Order #{order._id.substring(0, 8)}
                            </h1>
                            <span className="px-3 py-1 rounded-full text-sm font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 capitalize">
                                {order.status}
                            </span>
                        </div>

                        <p className="text-[var(--text-secondary)] mb-8 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Placed on {new Date(order._creationTime).toLocaleDateString()} at {new Date(order._creationTime).toLocaleTimeString()}
                        </p>

                        {/* Order Items */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden mb-8">
                            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Items ({order.items.length})
                                </h2>
                            </div>
                            <div className="divide-y divide-[var(--border-color)]">
                                {order.items.map((item) => (
                                    <div key={item._id} className="p-4 flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-[var(--text-primary)]">{item.productName}</p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                            </p>
                                        </div>
                                        <p className="font-medium">{formatPrice(item.productPrice * item.quantity)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" />
                                    Payment Summary
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Subtotal</span>
                                    <span>{formatPrice(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-[var(--text-secondary)]">Shipping</span>
                                    <span>{formatPrice(order.shipping)}</span>
                                </div>
                                <div className="pt-3 border-t border-[var(--border-color)] flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span className="text-[var(--accent)]">{formatPrice(order.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Shipping & Customer Info */}
                    <div className="w-full lg:w-96 space-y-6">
                        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                                <h2 className="font-semibold flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Shipping Address
                                </h2>
                            </div>
                            <div className="p-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                                <p className="font-medium text-[var(--text-primary)] mb-1">
                                    {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                                </p>
                                <p>{order.shippingAddress.street}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                                <p>{order.shippingAddress.country}</p>
                                <p className="mt-2">{order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] overflow-hidden">
                            <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card)]">
                                <h2 className="font-semibold">Customer Details</h2>
                            </div>
                            <div className="p-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                                <p className="mb-1">
                                    <span className="text-[var(--text-secondary)]">Email:</span>{" "}
                                    <span className="text-[var(--text-primary)]">{order.email}</span>
                                </p>
                                <p>
                                    <span className="text-[var(--text-secondary)]">User ID:</span>{" "}
                                    <span className="font-mono text-xs">{order.userId || "Guest"}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
