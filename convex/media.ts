import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

export const generateUploadUrl = mutation({
    args: { token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "generateUploadUrl");
        return await ctx.storage.generateUploadUrl();
    },
});

export const saveMedia = mutation({
    args: {
        filename: v.string(),
        storageId: v.string(),
        type: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "saveMedia");
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

// Used by the delete API route to retrieve the R2 key before deleting from R2
export const getById = query({
    args: { id: v.id("media") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});


export const remove = mutation({
    args: {
        id: v.id("media"),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "removeMedia");
        const item = await ctx.db.get(args.id);
        if (item) {
            // Only delete from Convex storage if it's an old-style upload (not an R2 URL)
            if (item.storageId && !item.storageId.startsWith("http")) {
                try { await ctx.storage.delete(item.storageId); } catch { }
            }
            await ctx.db.delete(args.id);
        }
    },
});

// Bulk delete multiple items by ID
export const removeMany = mutation({
    args: { ids: v.array(v.id("media")), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "removeMediaMany");
        await Promise.all(
            args.ids.map(async (id) => {
                const item = await ctx.db.get(id);
                if (item) {
                    if (item.storageId && !item.storageId.startsWith("http")) {
                        try { await ctx.storage.delete(item.storageId); } catch { }
                    }
                    await ctx.db.delete(id);
                }
            })
        );
        return { deleted: args.ids.length };
    },
});

// Update the folder tag on a single media item
export const patchFolder = mutation({
    args: { id: v.id("media"), folder: v.optional(v.string()), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "patchMediaFolder");
        await ctx.db.patch(args.id, { folder: args.folder });
    },
});

// Bulk move items to a folder
export const moveManyToFolder = mutation({
    args: { ids: v.array(v.id("media")), folder: v.optional(v.string()), token: v.optional(v.string()) },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "moveMediaManyToFolder");
        await Promise.all(args.ids.map((id) => ctx.db.patch(id, { folder: args.folder })));
        return { moved: args.ids.length };
    },
});

// New mutation for R2-hosted media — stores only the CDN URL in Convex
export const saveR2Media = mutation({
    args: {
        filename: v.string(),
        r2Key: v.string(),       // R2 object key (used for deletion)
        url: v.string(),          // Public CDN URL from R2
        type: v.string(),         // "image" | "video" | "pdf"
        size: v.optional(v.number()),
        folder: v.optional(v.string()), // Media folder/group label
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "saveR2Media");
        const { token, ...data } = args;
        return await ctx.db.insert("media", {
            filename: args.filename,
            storageId: args.r2Key,  // Repurposed: store r2Key here for future deletion
            url: args.url,
            type: args.type,
            folder: args.folder,
        });
    },
});
export const getUrlByStorageId = query({
    args: { storageId: v.string() },
    handler: async (ctx, args) => {
        // First, check if there's a media document with this storageId (e.g. R2 storage)
        const mediaRecord = await ctx.db
            .query("media")
            .withIndex("by_storageId", (q) => q.eq("storageId", args.storageId))
            .first();

        if (mediaRecord?.url) {
            return mediaRecord.url;
        }

        // Fallback to Convex native storage
        try {
            return await ctx.storage.getUrl(args.storageId as any);
        } catch (error) {
            console.error("Native storage getUrl failed for ID:", args.storageId, error);
            return null;
        }
    },
});

// Returns distinct folder names for the folder-filter UI
export const listFolders = query({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("media").collect();
        const folders = [...new Set(all.map((m) => m.folder).filter(Boolean))] as string[];
        return folders.sort();
    },
});
