import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

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

export const getMany = query({
    args: { ids: v.array(v.id("products")) },
    handler: async (ctx, args) => {
        return await Promise.all(args.ids.map(id => ctx.db.get(id)));
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
        showcaseTitle: v.optional(v.string()),
        showcaseProductIds: v.optional(v.array(v.id("products"))),
        token: v.optional(v.string()), // Added token for auth
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "createProduct"); // Auth guard
        const { token, ...productData } = args; // Destructure token
        const id = await ctx.db.insert("products", productData);
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
        showcaseTitle: v.optional(v.string()),
        showcaseProductIds: v.optional(v.array(v.id("products"))),
        token: v.optional(v.string()), // Added token for auth
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "updateProduct"); // Auth guard
        const { id, token, ...rest } = args; // Destructure token
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: {
        id: v.id("products"),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "removeProduct");
        await ctx.db.delete(args.id);
    },
});

export const listNames = query({
    handler: async (ctx) => {
        const products = await ctx.db.query("products").collect();
        return products.map((p) => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
        }));
    },
});

export const listLite = query({
    args: {
        status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
        categoryId: v.optional(v.id("categories")),
    },
    handler: async (ctx, args) => {
        let products;
        if (args.status) {
            products = await ctx.db
                .query("products")
                .withIndex("by_status", (q) => q.eq("status", args.status as any))
                .collect();
        } else {
            products = await ctx.db.query("products").collect();
        }

        let filtered = products;

        if (args.categoryId) {
            filtered = products.filter(p => p.categoryId === args.categoryId);
        }

        // Return only essential fields to save bandwidth
        return filtered.map(p => ({
            _id: p._id,
            name: p.name,
            slug: p.slug,
            images: p.images.slice(0, 1), // Only first image
            status: p.status,
            categoryId: p.categoryId,
            price: p.price,
            sku: p.sku,
            usp: p.usp,
        }));
    },
});

// ── Backfill: add missing slugs to products that were inserted without one ─────
export const backfillSlugs = mutation({
    args: {},
    handler: async (ctx) => {
        function toSlug(name: string) {
            return name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        const all = await ctx.db.query("products").collect();
        let patched = 0;

        for (const product of all) {
            if (!product.slug) {
                const slug = toSlug(product.name);
                await ctx.db.patch(product._id, { slug });
                patched++;
            }
        }

        return { patched };
    },
});

