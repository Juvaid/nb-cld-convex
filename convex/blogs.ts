import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdmin } from "./auth_utils";

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("blogs").order("desc").collect();
    },
});

export const listBlogs = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("blogs")
            .filter((q) => q.eq(q.field("status"), "published"))
            .order("desc")
            .collect();
    },
});

export const getBlogBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("blogs")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

export const getBlogById = query({
    args: { id: v.id("blogs") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

const defaultBlogContent = (title: string) => JSON.stringify({
    content: [
        {
            type: "ModernHero",
            props: {
                badgeText: "Blog",
                title: title,
                description: "Insights and stories from the world of personal care manufacturing.",
                id: "Hero-blog-default"
            }
        },
        {
            type: "Section",
            props: {
                id: "Section-blog-content",
                heading: "Article Content",
                padding: "py-20"
            }
        }
    ],
    root: { props: { title: title } }
});



export const createDraft = mutation({
    args: {
        title: v.string(),
        slug: v.string(),
        author: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "createBlogDraft");
        const blogId = await ctx.db.insert("blogs", {
            title: args.title,
            slug: args.slug,
            author: args.author || "Nature's Boon Team",
            status: "draft",
            content: defaultBlogContent(args.title),
        });
        return blogId;
    },
});

export const updateBlog = mutation({
    args: {
        id: v.id("blogs"),
        title: v.optional(v.string()),
        slug: v.optional(v.string()),
        content: v.optional(v.string()),
        author: v.optional(v.string()),
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
        coverImage: v.optional(v.string()),
        excerpt: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "updateBlog");
        const { id, token, ...updates } = args;
        const now = Date.now();
        const patch: any = { ...updates };

        if (args.status === "published") {
            patch.publishedAt = now;
        }

        await ctx.db.patch(id, patch);
    },
});

export const deleteBlog = mutation({
    args: { id: v.id("blogs"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "deleteBlog");
        await ctx.db.delete(args.id);
    },
});
