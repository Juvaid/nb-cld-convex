import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Mutation to submit a new inquiry
export const submit = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.string(),
        productId: v.optional(v.string()),
        productName: v.optional(v.string()),
        productCategory: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const inquiryId = await ctx.db.insert("inquiries", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
            productId: args.productId,
            productName: args.productName,
            productCategory: args.productCategory,
            status: "new",
            submittedAt: Date.now(),
        });
        return inquiryId;
    },
});

// Query to list all inquiries
export const list = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("inquiries")
            .order("desc")
            .collect();
    },
});

// Mutation to update inquiry status
export const updateStatus = mutation({
    args: {
        id: v.id("inquiries"),
        status: v.union(v.literal("new"), v.literal("read"), v.literal("replied")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { status: args.status });
    },
});

// Mutation to delete an inquiry
export const deleteInquiry = mutation({
    args: { id: v.id("inquiries") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
