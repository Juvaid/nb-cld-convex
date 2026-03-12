import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

export const getBySlug = query({
    args: { slug: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .unique();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        slug: v.string(),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "createCategory");
        const { token, ...data } = args;
        const id = await ctx.db.insert("categories", data);
        return id;
    },
});

export const patch = mutation({
    args: {
        id: v.id("categories"),
        name: v.optional(v.string()),
        slug: v.optional(v.string()),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "patchCategory");
        const { id, token, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("categories"), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "deleteCategory");
        await ctx.db.delete(args.id);
    },
});
