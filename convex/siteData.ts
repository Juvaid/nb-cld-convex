import { query } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("stats")
            .collect();
    },
});

export const getServices = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("services")
            .collect();
    },
});

export const getServiceBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("services")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});
