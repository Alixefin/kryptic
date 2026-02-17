import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// List active categories (public)
// TODO: Filter to only show categories with > 0 items if strictly required by backend, 
// but often easier to do on frontend or just assume active = has items if managed manually.
// Requirement: "if any category does not have any item under it it should not be displayed"
// We can do a join-like logic here or just fetch all and filter in UI. 
// For scalability, strict filtering here is better but Convex doesn't support complex joins easily.
// We will return all active categories, and let the frontend check if they have products, 
// OR we can do a second lookup here.
export const listActive = query({
    args: {},
    handler: async (ctx) => {
        const categories = await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("active"), true))
            .collect();

        // Check product counts in parallel
        const results = await Promise.all(
            categories.map(async (cat) => {
                const product = await ctx.db
                    .query("products")
                    .withIndex("by_category", (q) => q.eq("category", cat.slug))
                    .first();
                return product ? cat : null;
            })
        );

        return results.filter((c): c is typeof categories[0] => c !== null);
    },
});

// List all categories (admin)
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

// Create category
export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        imageUrl: v.optional(v.string()),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existing) throw new Error("Category slug already exists");

        let imageUrl = args.imageUrl;
        if (args.imageStorageId) {
            imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;
        }

        await ctx.db.insert("categories", { ...args, imageUrl });
    },
});

// Update category
export const update = mutation({
    args: {
        id: v.id("categories"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        imageUrl: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        if (updates.imageStorageId) {
            updates.imageUrl = (await ctx.storage.getUrl(updates.imageStorageId)) ?? undefined;
        }

        await ctx.db.patch(id, updates);
    },
});

// Delete category
export const remove = mutation({
    args: { id: v.id("categories") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// Seed default categories
export const seed = mutation({
    args: {},
    handler: async (ctx) => {
        const defaults = [
            { name: "Shirts", slug: "shirts", description: "Men's and Women's Shirts", active: true },
            { name: "Bottoms", slug: "bottoms", description: "Pants, Shorts, and Skirts", active: true },
            { name: "Jackets", slug: "jackets", description: "Coats and Jackets", active: true },
            { name: "T-Shirts", slug: "t-shirts", description: "Casual Tees", active: true },
            { name: "Accessories", slug: "accessories", description: "Hats, Bags, and more", active: true },
        ];

        for (const cat of defaults) {
            const existing = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
                .first();

            if (!existing) {
                await ctx.db.insert("categories", cat);
            }
        }
    },
});
