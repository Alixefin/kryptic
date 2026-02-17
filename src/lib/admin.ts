// Admin service — Types and helpers for admin dashboard
// Data fetching now happens directly in components via Convex `useQuery` hooks.

export interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenueChange: number;
    ordersChange: number;
}

export interface AdminOrder {
    id: string;
    customer: string;
    email: string;
    total: number;
    status: string;
    date: string;
}

/**
 * Format a Convex order document into the AdminOrder shape
 */
export function formatAdminOrder(order: {
    _id: string;
    email: string;
    total: number;
    status: string;
    _creationTime: number;
    shippingAddress?: {
        firstName?: string;
        lastName?: string;
    };
}): AdminOrder {
    return {
        id: order._id,
        customer: order.shippingAddress
            ? `${order.shippingAddress.firstName || ""} ${order.shippingAddress.lastName || ""}`.trim() ||
            "Unknown"
            : "Unknown",
        email: order.email,
        total: order.total,
        status: order.status,
        date: new Date(order._creationTime).toISOString().split("T")[0],
    };
}

/**
 * Calculate revenue/order changes between periods
 */
export function calculateChanges(orders: { total: number; _creationTime: number; paymentStatus: string }[]) {
    const now = Date.now();
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    const currentPeriod = orders.filter((o) => now - o._creationTime < thirtyDays);
    const previousPeriod = orders.filter(
        (o) => now - o._creationTime >= thirtyDays && now - o._creationTime < thirtyDays * 2
    );

    const currentRevenue = currentPeriod
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0);
    const previousRevenue = previousPeriod
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0);

    const revenueChange =
        previousRevenue > 0
            ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
            : currentRevenue > 0
                ? 100
                : 0;

    const ordersChange =
        previousPeriod.length > 0
            ? ((currentPeriod.length - previousPeriod.length) / previousPeriod.length) * 100
            : currentPeriod.length > 0
                ? 100
                : 0;

    return {
        revenueChange: Math.round(revenueChange * 10) / 10,
        ordersChange: Math.round(ordersChange * 10) / 10,
    };
}
