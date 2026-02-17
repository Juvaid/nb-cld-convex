import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveMedia = mutation({
    args: {
        filename: v.string(),
        storageId: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        const url = (await ctx.storage.getUrl(args.storageId))!;
        return await ctx.db.insert("media", {
            filename: args.filename,
            storageId: args.storageId,
            url,
            type: args.type,
        });
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("media").order("desc").collect();
    },
});

export const getMediaByFilename = query({
    args: { filename: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("media")
            .withIndex("by_filename", (q) => q.eq("filename", args.filename))
            .unique();
    },
});

export const remove = mutation({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        const item = await ctx.db.get(args.id);
        if (item) {
            await ctx.storage.delete(item.storageId);
            await ctx.db.delete(args.id);
        }
    },
});
export const getUrlByStorageId = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});
