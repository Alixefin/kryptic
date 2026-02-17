import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    // Extend the auth users table with a role field
    users: defineTable({
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        phone: v.optional(v.string()),
        image: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        role: v.optional(v.string()),
    }).index("email", ["email"]),

    // Products table
    products: defineTable({
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
    })
        .index("by_category", ["category"])
        .index("by_featured", ["featured"]),

    // Orders table
    orders: defineTable({
        userId: v.optional(v.string()),
        email: v.string(),
        status: v.string(),
        paymentStatus: v.string(),
        paymentReference: v.optional(v.string()),
        subtotal: v.number(),
        shipping: v.number(),
        total: v.number(),
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
    })
        .index("by_userId", ["userId"])
        .index("by_paymentReference", ["paymentReference"])
        .index("by_status", ["status"]),

    // Order items table
    orderItems: defineTable({
        orderId: v.id("orders"),
        productId: v.id("products"),
        productName: v.string(),
        productPrice: v.number(),
        quantity: v.number(),
        size: v.optional(v.string()),
        color: v.optional(v.string()),
    }).index("by_orderId", ["orderId"]),

    // OTP verification codes
    otpCodes: defineTable({
        email: v.string(),
        code: v.string(),
        expiresAt: v.number(),
        used: v.boolean(),
    }).index("by_email", ["email"]),
});

export default schema;
