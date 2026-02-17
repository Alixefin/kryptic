import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

// Generate a 6-digit OTP code
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create and send an OTP code
export const sendCode = mutation({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const code = generateOTP();
        const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

        // Invalidate any existing codes for this email
        const existingCodes = await ctx.db
            .query("otpCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .collect();

        for (const existing of existingCodes) {
            await ctx.db.patch(existing._id, { used: true });
        }

        // Store the new code
        await ctx.db.insert("otpCodes", {
            email: args.email,
            code,
            expiresAt,
            used: false,
        });

        // Send the email via the action
        await ctx.scheduler.runAfter(0, internal.emails.sendOTP, {
            email: args.email,
            code,
        });

        return { success: true };
    },
});

// Verify an OTP code
export const verifyCode = mutation({
    args: {
        email: v.string(),
        code: v.string(),
    },
    handler: async (ctx, args) => {
        const codes = await ctx.db
            .query("otpCodes")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .collect();

        // Find a valid, unused, non-expired code
        const validCode = codes.find(
            (c) => c.code === args.code && !c.used && c.expiresAt > Date.now()
        );

        if (!validCode) {
            return { success: false, error: "Invalid or expired code" };
        }

        // Mark the code as used
        await ctx.db.patch(validCode._id, { used: true });

        // Mark the user's email as verified
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .first();

        if (user) {
            await ctx.db.patch(user._id, {
                emailVerificationTime: Date.now(),
            });
        }

        return { success: true };
    },
});

// Check if email is verified
export const isEmailVerified = query({
    args: { email: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("email", (q) => q.eq("email", args.email))
            .first();

        return !!user?.emailVerificationTime;
    },
});
