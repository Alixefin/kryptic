// Order service — Types and helpers
// Data fetching now happens directly in components via Convex hooks.
// This file provides the types and the shipping rate logic.

import { ShippingAddress, Order } from "@/types/order";
import { CartItem } from "@/context/CartContext";

export interface CreateOrderData {
    items: CartItem[];
    shippingAddress: ShippingAddress;
    subtotal: number;
    shipping: number;
    total: number;
    paymentReference: string;
    userId?: string;
}

export interface OrderResult {
    success: boolean;
    orderId?: string;
    error?: string;
}

export type { Order, ShippingAddress };
