import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Create a new order
export const create = mutation({
    args: {
        userId: v.optional(v.string()),
        email: v.string(),
        subtotal: v.number(),
        shipping: v.number(),
        total: v.number(),
        paymentReference: v.string(),
        shippingAddress: v.object({
            firstName: v.string(),
            lastName: v.string(),
            email: v.string(),
            phone: v.string(),
            street: v.string(),
            city: v.string(),
            state: v.string(),
            country: v.string(),
            postalCode: v.optional(v.string()),
        }),
        items: v.array(
            v.object({
                productId: v.id("products"),
                productName: v.string(),
                productPrice: v.number(),
                quantity: v.number(),
                size: v.optional(v.string()),
                color: v.optional(v.string()),
            })
        ),
    },
    handler: async (ctx, args) => {
        // Insert the order
        const orderId = await ctx.db.insert("orders", {
            userId: args.userId,
            email: args.email,
            status: "pending",
            paymentStatus: "paid",
            paymentReference: args.paymentReference,
            subtotal: args.subtotal,
            shipping: args.shipping,
            total: args.total,
            shippingAddress: args.shippingAddress,
        });

        // Insert order items
        for (const item of args.items) {
            await ctx.db.insert("orderItems", {
                orderId,
                productId: item.productId,
                productName: item.productName,
                productPrice: item.productPrice,
                quantity: item.quantity,
                size: item.size,
                color: item.color,
            });
        }

        // Send admin email notification
        await ctx.scheduler.runAfter(0, internal.emails.sendOrderNotification, {
            orderId: orderId as string,
            customerEmail: args.email,
            customerName: `${args.shippingAddress.firstName} ${args.shippingAddress.lastName}`,
            total: args.total,
            itemCount: args.items.length,
        });

        // Send customer email confirmation
        await ctx.scheduler.runAfter(0, internal.emails.sendOrderConfirmation, {
            orderId: orderId as string,
            customerEmail: args.email,
            customerName: args.shippingAddress.firstName,
            total: args.total,
            orderUrl: `${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}`,
        });

        // Notify Admin (System Notification)
        await ctx.scheduler.runAfter(0, internal.notifications.create, {
            type: "order",
            title: "New Order Received",
            message: `Order #${(orderId as string).substring(0, 8)} from ${args.shippingAddress.firstName} - ${args.items.length} items`,
            link: `/admin/orders/${orderId}`,
            recipient: "admin",
        });

        // Notify User (System Notification)
        if (args.userId) {
            await ctx.scheduler.runAfter(0, internal.notifications.create, {
                userId: args.userId,
                type: "order",
                title: "Order Confirmed",
                message: `Your order #${(orderId as string).substring(0, 8)} has been placed successfully.`,
                link: `/account/orders/${orderId}`,
                recipient: "user",
            });
        }

        return orderId;
    },
});

// Get orders for a user
export const getByUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_userId", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();

        // Attach items to each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await ctx.db
                    .query("orderItems")
                    .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
                    .collect();
                return { ...order, items };
            })
        );

        return ordersWithItems;
    },
});

// Get a single order by ID
export const getById = query({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return null;

        const items = await ctx.db
            .query("orderItems")
            .withIndex("by_orderId", (q) => q.eq("orderId", args.id))
            .collect();

        return { ...order, items };
    },
});

// Get order by payment reference
export const getByReference = query({
    args: { reference: v.string() },
    handler: async (ctx, args) => {
        const order = await ctx.db
            .query("orders")
            .withIndex("by_paymentReference", (q) =>
                q.eq("paymentReference", args.reference)
            )
            .first();

        if (!order) return null;

        const items = await ctx.db
            .query("orderItems")
            .withIndex("by_orderId", (q) => q.eq("orderId", order._id))
            .collect();

        return { ...order, items };
    },
});

// Get recent orders (admin)
export const getRecent = query({
    args: { limit: v.optional(v.number()) },
    handler: async (ctx, args) => {
        const limit = args.limit ?? 5;
        const orders = await ctx.db
            .query("orders")
            .order("desc")
            .take(limit);

        return orders;
    },
});

// Get all orders (admin)
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("orders").order("desc").collect();
    },
});

// Update order status (admin)
export const updateStatus = mutation({
    args: {
        id: v.id("orders"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return;

        await ctx.db.patch(args.id, { status: args.status });

        // Notify user if they have an account
        if (order.userId) {
            await ctx.scheduler.runAfter(0, internal.notifications.create, {
                userId: order.userId,
                type: "order_update",
                title: "Order Updated",
                message: `Your order #${order._id.substring(0, 8)} status has been updated to ${args.status}.`,
                link: `/account/orders/${order._id}`,
                recipient: "user",
            });
        }
    },
});

// Update payment status (admin)
export const updatePaymentStatus = mutation({
    args: {
        id: v.id("orders"),
        paymentStatus: v.string(),
    },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return;

        await ctx.db.patch(args.id, { paymentStatus: args.paymentStatus });

        // Notify user
        if (order.userId) {
            await ctx.scheduler.runAfter(0, internal.notifications.create, {
                userId: order.userId,
                type: "order_update",
                title: "Payment Update",
                message: `Payment status for order #${order._id.substring(0, 8)} updated to ${args.paymentStatus}.`,
                link: `/account/orders/${order._id}`,
                recipient: "user",
            });
        }
    },
});

// Clear all orders (DEV ONLY - BE CAREFUL)
export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const orders = await ctx.db.query("orders").collect();
        const orderItems = await ctx.db.query("orderItems").collect();

        for (const order of orders) {
            await ctx.db.delete(order._id);
        }

        for (const item of orderItems) {
            await ctx.db.delete(item._id);
        }
    },
});

// Delete a single order (admin)
export const deleteOrder = mutation({
    args: { id: v.id("orders") },
    handler: async (ctx, args) => {
        const order = await ctx.db.get(args.id);
        if (!order) return;

        // Notify user BEFORE deletion if possible (or just notify them generally)
        // Since the order link won't work after deletion, point to orders list or show a static message
        if (order.userId) {
            await ctx.scheduler.runAfter(0, internal.notifications.create, {
                userId: order.userId,
                type: "order_update",
                title: "Order Cancelled",
                message: `Your order #${order._id.substring(0, 8)} has been cancelled and removed.`,
                link: `/account/orders`,
                recipient: "user",
            });
        }

        // Delete the order itself
        await ctx.db.delete(args.id);

        // Delete associated order items
        const items = await ctx.db
            .query("orderItems")
            .withIndex("by_orderId", (q) => q.eq("orderId", args.id))
            .collect();

        for (const item of items) {
            await ctx.db.delete(item._id);
        }
    },
});
