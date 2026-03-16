import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveIngestedPage = mutation({
    args: {
        path: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        draftData: v.string(), // Puck JSON data
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                title: args.title,
                description: args.description,
                draftData: args.draftData,
                status: existing.status || "draft",
                lastModified: Date.now(),
            });
        } else {
            await ctx.db.insert("pages", {
                path: args.path,
                title: args.title,
                description: args.description,
                draftData: args.draftData,
                status: "draft",
                lastModified: Date.now(),
            });
        }
    },
});

export const saveIngestedProduct = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.string(),
        price: v.optional(v.number()),
        images: v.optional(v.array(v.string())),
        status: v.optional(v.union(v.literal("active"), v.literal("draft"), v.literal("archived"))),
        tags: v.optional(v.array(v.string())),
        meta: v.optional(v.any()),
        categoryId: v.optional(v.id("categories")),
    },
    handler: async (ctx, args) => {
        const { ...fields } = args;
        const insertData = {
            ...fields,
            images: fields.images || [],
            status: fields.status || "active",
            tags: fields.tags || [],
            description: fields.description || "",
        } as any;

        const existing = await ctx.db
            .query("products")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, insertData);
        } else {
            await ctx.db.insert("products", insertData);
        }
    },
});

export const forceDeletePage = mutation({
    args: { path: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});

export const saveIngestedBlog = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        content: v.string(),
        excerpt: v.optional(v.string()),
        author: v.optional(v.string()),
        coverImage: v.optional(v.string()),
        keywords: v.optional(v.string()),
        category: v.optional(v.union(v.literal("article"), v.literal("seo-page"))),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("blogs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        const blogData = {
            ...args,
            author: args.author || "Nature's Boon Team",
            status: "published" as const,
            publishedAt: Date.now(),
        };

        if (existing) {
            await ctx.db.patch(existing._id, blogData);
        } else {
            await ctx.db.insert("blogs", blogData);
        }
    },
});

export const addDocumentToCategory = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        storageId: v.string(),
    },
    handler: async (ctx, args) => {
        const category = await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();

        if (category) {
            const meta = (category as any).meta || {};
            const documents = meta.documents || [];
            if (!documents.find((d: any) => d.storageId === args.storageId)) {
                await ctx.db.patch(category._id, {
                    meta: { ...meta, documents: [...documents, { name: args.name, storageId: args.storageId }] }
                } as any);
            }
        }
    },
});
