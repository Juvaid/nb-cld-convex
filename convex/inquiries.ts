import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

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
        companyType: v.optional(v.string()),
        annualVolume: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // 1. Rate Limiting Check (Simple Implementation)
        const RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes
        const MAX_SUBMISSIONS = 5;
        const now = Date.now();
        const rateLimitKey = `inquiry:${args.email}`;

        const rateLimit = await ctx.db
            .query("rate_limits")
            .withIndex("by_key", (q) => q.eq("key", rateLimitKey))
            .unique();

        if (rateLimit) {
            if (now < rateLimit.resetAt) {
                if (rateLimit.value >= MAX_SUBMISSIONS) {
                    throw new Error("Too many submissions. Please try again in 10 minutes.");
                }
                await ctx.db.patch(rateLimit._id, { value: rateLimit.value + 1 });
            } else {
                await ctx.db.patch(rateLimit._id, { value: 1, resetAt: now + RATE_LIMIT_WINDOW });
            }
        } else {
            await ctx.db.insert("rate_limits", { key: rateLimitKey, value: 1, resetAt: now + RATE_LIMIT_WINDOW });
        }

        // 2. Lead Qualification Logic
        const highVolumeThreshold = 500; // kg or units
        let isHighValue = false;

        if (args.annualVolume) {
            const volumeNum = parseInt(args.annualVolume.replace(/[^0-9]/g, ''));
            if (!isNaN(volumeNum) && volumeNum >= highVolumeThreshold) {
                isHighValue = true;
            }
        }

        const inquiryId = await ctx.db.insert("inquiries", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
            productId: args.productId,
            productName: args.productName,
            productCategory: args.productCategory,
            companyType: args.companyType,
            annualVolume: args.annualVolume,
            isHighValue: isHighValue,
            status: "new",
            submittedAt: Date.now(),
        });

        // Trigger Discord Notification
        await ctx.scheduler.runAfter(0, (internal as any).notifications.sendInquiryToDiscord, {
            inquiryId,
        });

        return inquiryId;
    },
});

export const getInternal = internalQuery({
    args: { id: v.id("inquiries") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
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
