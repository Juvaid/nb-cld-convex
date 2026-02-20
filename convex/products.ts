import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listAll = query({
    args: {
        status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
        categoryId: v.optional(v.id("categories")),
        search: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Auth check for gated pricing
        let isAuthorized = false;
        if (args.token) {
            const session = await ctx.db.query("sessions").withIndex("by_token", q => q.eq("token", args.token as string)).first();
            if (session && session.expiresAt > Date.now()) {
                const user = await ctx.db.get(session.userId);
                if (user && (user.role === "admin" || user.role === "client")) {
                    isAuthorized = true;
                }
            }
        }

        let productsQuery = ctx.db.query("products");

        // Simple filtering (Note: dynamic multiple filters on indexed fields is limited in Convex,
        // so we'll filter mostly in memory or pick one primary index if needed.
        // For admin dashboard, in-memory filtering of all products is usually fine if count is < few thousands)

        let products = await productsQuery.collect();

        if (args.status) {
            products = products.filter(p => p.status === args.status);
        }

        if (args.categoryId) {
            products = products.filter(p => p.categoryId === args.categoryId);
        }

        if (args.search) {
            const searchLower = args.search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.slug.toLowerCase().includes(searchLower) ||
                (p.sku && p.sku.toLowerCase().includes(searchLower))
            );
        }

        // Apply gating to pricingTiers
        return products.map(p => {
            if (!isAuthorized) {
                const { pricingTiers, ...rest } = p;
                return rest;
            }
            return p;
        });
    },
});

export const getById = query({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

export const getBySlug = query({
    args: { slug: v.string(), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const product = await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (!product) return null;

        // Auth check for gated pricing
        let isAuthorized = false;
        if (args.token) {
            const session = await ctx.db.query("sessions").withIndex("by_token", q => q.eq("token", args.token as string)).first();
            if (session && session.expiresAt > Date.now()) {
                const user = await ctx.db.get(session.userId);
                if (user && (user.role === "admin" || user.role === "client")) {
                    isAuthorized = true;
                }
            }
        }

        if (!isAuthorized) {
            const { pricingTiers, ...rest } = product as any;
            return rest;
        }

        return product;
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        price: v.optional(v.number()),
        compareAtPrice: v.optional(v.number()),
        images: v.array(v.string()),
        categoryId: v.optional(v.id("categories")),
        status: v.union(v.literal("active"), v.literal("draft"), v.literal("archived")),
        sku: v.optional(v.string()),
        usp: v.optional(v.string()),
        tags: v.array(v.string()),
        moq: v.optional(v.number()),
        pricingTiers: v.optional(v.array(v.object({ minQty: v.number(), price: v.number() }))),
        botanicalName: v.optional(v.string()),
        extractionMethod: v.optional(v.string()),
        activeCompounds: v.optional(v.string()),
        documents: v.optional(v.array(v.object({ name: v.string(), storageId: v.string() }))),
    },
    handler: async (ctx, args) => {
        const id = await ctx.db.insert("products", args);
        return id;
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        compareAtPrice: v.optional(v.number()),
        images: v.optional(v.array(v.string())),
        categoryId: v.optional(v.id("categories")),
        status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
        sku: v.optional(v.string()),
        usp: v.optional(v.string()),
        tags: v.optional(v.array(v.string())),
        moq: v.optional(v.number()),
        pricingTiers: v.optional(v.array(v.object({ minQty: v.number(), price: v.number() }))),
        botanicalName: v.optional(v.string()),
        extractionMethod: v.optional(v.string()),
        activeCompounds: v.optional(v.string()),
        documents: v.optional(v.array(v.object({ name: v.string(), storageId: v.string() }))),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const listNames = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.map((p) => ({
            _id: p._id,
            name: p.name,
        }));
    },
});
