import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List all products, newest first
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("products").order("desc").collect();
    },
});

// Get products by category
export const getByCategory = query({
    args: { category: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("products")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .order("desc")
            .collect();
    },
});

// Get a single product by ID
export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get featured products
export const getFeatured = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("products")
            .withIndex("by_featured", (q) => q.eq("featured", true))
            .order("desc")
            .collect();
    },
});

// Create a product (admin only)
export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        price: v.number(),
        originalPrice: v.optional(v.number()),
        discount: v.optional(v.number()),
        category: v.string(),
        imageStorageId: v.optional(v.id("_storage")),
        hoverImageStorageId: v.optional(v.id("_storage")),
        imageUrl: v.optional(v.string()),
        hoverImageUrl: v.optional(v.string()),
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
        stock: v.number(),
        soldOut: v.boolean(),
        featured: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get image URLs from storage if provided
        let imageUrl = args.imageUrl;
        let hoverImageUrl = args.hoverImageUrl;

        if (args.imageStorageId) {
            imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
        }
        if (args.hoverImageStorageId) {
            hoverImageUrl =
                (await ctx.storage.getUrl(args.hoverImageStorageId)) ?? undefined;
        }

        // Auto-set soldOut when stock is 0
        const soldOut = args.stock === 0 ? true : args.soldOut;

        return await ctx.db.insert("products", {
            name: args.name,
            description: args.description,
            price: args.price,
            originalPrice: args.originalPrice,
            discount: args.discount,
            category: args.category,
            imageStorageId: args.imageStorageId,
            hoverImageStorageId: args.hoverImageStorageId,
            imageUrl,
            hoverImageUrl,
            sizes: args.sizes,
            colors: args.colors,
            stock: args.stock,
            soldOut,
            featured: args.featured,
        });
    },
});

// Update a product (admin only)
export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        originalPrice: v.optional(v.number()),
        discount: v.optional(v.number()),
        category: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        hoverImageStorageId: v.optional(v.id("_storage")),
        imageUrl: v.optional(v.string()),
        hoverImageUrl: v.optional(v.string()),
        sizes: v.optional(v.array(v.string())),
        colors: v.optional(v.array(v.string())),
        stock: v.optional(v.number()),
        soldOut: v.optional(v.boolean()),
        featured: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        // Resolve storage URLs if new images provided
        if (updates.imageStorageId) {
            updates.imageUrl =
                (await ctx.storage.getUrl(updates.imageStorageId)) ?? undefined;
        }
        if (updates.hoverImageStorageId) {
            updates.hoverImageUrl =
                (await ctx.storage.getUrl(updates.hoverImageStorageId)) ?? undefined;
        }

        // Auto-set soldOut when stock is updated to 0
        if (updates.stock !== undefined) {
            updates.soldOut = updates.stock === 0;
        }

        // Filter out undefined values
        const patch: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                patch[key] = value;
            }
        }

        await ctx.db.patch(id, patch);
    },
});

// Delete a product (admin only)
export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        // Delete associated storage files
        const product = await ctx.db.get(args.id);
        if (product?.imageStorageId) {
            await ctx.storage.delete(product.imageStorageId);
        }
        if (product?.hoverImageStorageId) {
            await ctx.storage.delete(product.hoverImageStorageId);
        }

        await ctx.db.delete(args.id);
    },
});
