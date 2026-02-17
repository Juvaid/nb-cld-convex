import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createProduct = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        price: v.optional(v.number()),
        description: v.string(),
        images: v.optional(v.array(v.string())),
        status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
        tags: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const insertData = {
            ...args,
            images: args.images || [],
            status: args.status || "active",
            tags: args.tags || [],
        };

        const existing = await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (existing) {
            return await ctx.db.patch(existing._id, insertData as any);
        }
        return await ctx.db.insert("products", insertData as any);
    },
});

export const listProducts = query({
    handler: async (ctx) => {
        return await ctx.db.query("products").collect();
    },
});

export const getProduct = query({
    args: { id: v.union(v.id("products"), v.string()) },
    handler: async (ctx, args) => {
        const id = typeof args.id === "string" ? ctx.db.normalizeId("products", args.id) : args.id;
        if (!id) return null;
        return await ctx.db.get(id);
    },
});
