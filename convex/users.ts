import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// Get current authenticated user
export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;
        return await ctx.db.get(userId);
    },
});

// Update user profile
export const updateProfile = mutation({
    args: {
        name: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const patch: Record<string, unknown> = {};
        if (args.name !== undefined) patch.name = args.name;
        if (args.phone !== undefined) patch.phone = args.phone;

        await ctx.db.patch(userId, patch);
    },
});

// Set user role (admin only — call from dashboard)
export const setRole = mutation({
    args: {
        userId: v.id("users"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(currentUserId);
        if (!currentUser || currentUser.role !== "admin") {
            throw new Error("Not authorized");
        }

        await ctx.db.patch(args.userId, { role: args.role });
    },
});

// Get admin dashboard stats
export const getAdminStats = query({
    args: {},
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        const orders = await ctx.db.query("orders").collect();
        const users = await ctx.db.query("users").collect();

        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;
        const totalCustomers = users.filter((u) => u.role !== "admin").length;

        return {
            totalRevenue,
            totalOrders,
            totalProducts,
            totalCustomers,
        };
    },
});

// List all users (admin)
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("users").order("desc").collect();
    },
});

// Promote a user to admin by email (bootstrap helper)
export const promoteToAdmin = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .first();

        if (!user) throw new Error(`No user found with email: ${args.email}`);

        await ctx.db.patch(user._id, { role: "admin" });
        return { success: true, userId: user._id, email: args.email };
    },
});

// Get the default shipping address for the authenticated user
export const getShippingAddress = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const address = await ctx.db
            .query("shippingAddresses")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        return address;
    },
});

// Save (upsert) the user's default shipping address
export const saveShippingAddress = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        email: v.string(),
        phone: v.string(),
        street: v.string(),
        city: v.string(),
        state: v.string(),
        country: v.string(),
        postalCode: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if user already has a saved address
        const existing = await ctx.db
            .query("shippingAddresses")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            // Update existing address
            await ctx.db.patch(existing._id, {
                ...args,
                isDefault: true,
            });
        } else {
            // Create new address
            await ctx.db.insert("shippingAddresses", {
                userId,
                ...args,
                isDefault: true,
            });
        }
    },
});

// Delete a user (admin only)
export const deleteUser = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const currentUserId = await auth.getUserId(ctx);
        if (!currentUserId) throw new Error("Not authenticated");

        const currentUser = await ctx.db.get(currentUserId);
        if (!currentUser || currentUser.role !== "admin") {
            throw new Error("Not authorized");
        }

        await ctx.db.delete(args.userId);
    },
});
