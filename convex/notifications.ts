import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// List notifications for the current user
export const list = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);

        // If user is logged in, get their notifications
        if (userId) {
            return await ctx.db
                .query("notifications")
                .withIndex("by_user", (q) => q.eq("userId", userId))
                .filter((q) => q.eq(q.field("read"), false))
                .order("desc")
                .collect();
        }

        return [];
    },
});

// List admin notifications (protected in UI, but query is public-ish so we check for admin role if possible, 
// though for now we'll just return all admin notifications and rely on client-side hiding/RLS if we had it)
// Actually, better to check if the user is an admin.
export const listAdmin = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const user = await ctx.db.get(userId);
        if (!user || user.role !== "admin") return [];

        return await ctx.db
            .query("notifications")
            .withIndex("by_recipient", (q) => q.eq("recipient", "admin").eq("read", false))
            .order("desc")
            .collect();
    },
});

// Mark a notification as read
export const markAsRead = mutation({
    args: { id: v.id("notifications") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const notification = await ctx.db.get(args.id);
        if (!notification) throw new Error("Notification not found");

        // Verify ownership or admin status
        if (notification.recipient === "user" && notification.userId !== userId) {
            throw new Error("Unauthorized");
        }

        if (notification.recipient === "admin") {
            const user = await ctx.db.get(userId);
            if (!user || user.role !== "admin") throw new Error("Unauthorized");
        }

        await ctx.db.patch(args.id, { read: true });
    },
});

// Mark all as read (for admin or user)
export const markAllRead = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Unauthorized");

        const user = await ctx.db.get(userId);
        const isAdmin = user?.role === "admin";

        // Mark user notifications
        const userNotifs = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("read"), false))
            .collect();

        for (const n of userNotifs) {
            await ctx.db.patch(n._id, { read: true });
        }

        // If admin, mark admin notifications
        if (isAdmin) {
            const adminNotifs = await ctx.db
                .query("notifications")
                .withIndex("by_recipient", (q) => q.eq("recipient", "admin").eq("read", false))
                .collect();

            for (const n of adminNotifs) {
                await ctx.db.patch(n._id, { read: true });
            }
        }
    },
});

// Create a notification (internal use only)
export const create = internalMutation({
    args: {
        userId: v.optional(v.string()),
        type: v.string(),
        title: v.string(),
        message: v.string(),
        link: v.optional(v.string()),
        recipient: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            ...args,
            read: false,
        });
    },
});
