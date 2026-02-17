import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

// List active hero slides (public)
export const list = query({
    args: {},
    handler: async (ctx) => {
        const slides = await ctx.db
            .query("heroSlides")
            .withIndex("by_order")
            .collect();

        return slides.filter(s => s.active);
    },
});

// List all hero slides (admin)
export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("heroSlides")
            .withIndex("by_order")
            .collect();
    },
});

// Create a hero slide (admin only)
export const create = mutation({
    args: {
        title: v.string(),
        subtitle: v.string(),
        imageStorageId: v.id("_storage"),
        ctaLink: v.string(),
        ctaText: v.string(),
        active: v.boolean(),
    },
    handler: async (ctx, args) => {
        // Get image URL
        const imageUrl = (await ctx.storage.getUrl(args.imageStorageId)) ?? undefined;

        // Get max order to append to end
        const existing = await ctx.db.query("heroSlides").collect();
        const maxOrder = existing.reduce((max, s) => Math.max(max, s.order), 0);

        return await ctx.db.insert("heroSlides", {
            ...args,
            imageUrl,
            order: maxOrder + 1,
        });
    },
});

// Update a hero slide (admin only)
export const update = mutation({
    args: {
        id: v.id("heroSlides"),
        title: v.optional(v.string()),
        subtitle: v.optional(v.string()),
        imageStorageId: v.optional(v.id("_storage")),
        ctaLink: v.optional(v.string()),
        ctaText: v.optional(v.string()),
        active: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        const patch: any = { ...updates };

        // Update image URL if storage ID changed
        if (updates.imageStorageId) {
            patch.imageUrl = (await ctx.storage.getUrl(updates.imageStorageId)) ?? undefined;
        }

        await ctx.db.patch(id, patch);
    },
});

// Remove a hero slide (admin only)
export const remove = mutation({
    args: { id: v.id("heroSlides") },
    handler: async (ctx, args) => {
        const slide = await ctx.db.get(args.id);
        if (slide?.imageStorageId) {
            await ctx.storage.delete(slide.imageStorageId);
        }
        await ctx.db.delete(args.id);
    },
});

// Reorder slides (admin only)
export const reorder = mutation({
    args: {
        slides: v.array(v.object({
            id: v.id("heroSlides"),
            order: v.number(),
        })),
    },
    handler: async (ctx, args) => {
        for (const slide of args.slides) {
            await ctx.db.patch(slide.id, { order: slide.order });
        }
    },
});
