import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

export const getPage = query({
    args: { path: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();
    },
});

export const savePage = mutation({
    args: {
        path: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        keywords: v.optional(v.string()),
        ogImage: v.optional(v.string()),
        schemaType: v.optional(v.string()),
        draftData: v.string(),
        data: v.optional(v.string()), // Deprecated, keep optional for strict validation fixes
        status: v.optional(v.union(v.literal("draft"), v.literal("published"))),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "savePage");
        const existing = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        const now = Date.now();

        if (existing) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updateFields: Record<string, any> = {
                title: args.title,
                draftData: args.draftData,
                lastModified: now,
            };

            if (args.description !== undefined) updateFields.description = args.description;
            if (args.keywords !== undefined) updateFields.keywords = args.keywords;
            if (args.ogImage !== undefined) updateFields.ogImage = args.ogImage;
            if (args.schemaType !== undefined) updateFields.schemaType = args.schemaType;

            const statusToSave = args.status || existing.status || "draft";
            updateFields.status = statusToSave;

            if (statusToSave === "published" && !existing.publishedAt) {
                updateFields.publishedAt = now;
                updateFields.publishedData = args.draftData; // Instantly publish
            }

            await ctx.db.patch(existing._id, updateFields);
        } else {
            await ctx.db.insert("pages", {
                path: args.path,
                title: args.title,
                description: args.description,
                keywords: args.keywords,
                ogImage: args.ogImage,
                schemaType: args.schemaType,
                draftData: args.draftData,
                publishedData: args.status === "published" ? args.draftData : undefined,
                status: args.status || "draft",
                lastModified: now,
                publishedAt: args.status === "published" ? now : undefined,
            });
        }
    },
});

export const listPages = query({
    handler: async (ctx) => {
        return await ctx.db.query("pages").collect();
    },
});

export const getPublishedPage = query({
    args: { path: v.string() },
    handler: async (ctx, args) => {
        const page = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (!page || !page.publishedData) {
            return null;
        }

        // Return the published version. Status "draft" means there are UNPUBLISHED changes,
        // but the current published version should still be visible.
        return {
            ...page,
            data: page.publishedData,
        };
    },
});

export const createPageFromTemplate = mutation({
    args: {
        path: v.string(),
        title: v.string(),
        templateData: v.any(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "createPageFromTemplate");
        const existing = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (existing) {
            throw new Error("A page with this path already exists");
        }

        const now = Date.now();

        await ctx.db.insert("pages", {
            path: args.path,
            title: args.title,
            draftData: JSON.stringify(args.templateData),
            publishedData: JSON.stringify(args.templateData),
            status: "draft",
            lastModified: now,
        });

        return args.path;
    },
});

export const updatePageStatus = mutation({
    args: {
        id: v.id("pages"),
        status: v.union(v.literal("draft"), v.literal("published")),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "updatePageStatus");
        const now = Date.now();
        const page = await ctx.db.get(args.id);
        if (!page) throw new Error("Page not found");

        const updateFields: Record<string, any> = {
            status: args.status,
            lastModified: now,
        };

        if (args.status === "published") {
            updateFields.publishedAt = now;
            updateFields.publishedData = page.draftData; // Move draft to published
        }

        await ctx.db.patch(args.id, updateFields);
    },
});

export const publishPage = mutation({
    args: {
        path: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "publishPage");
        const page = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (!page) throw new Error("Page not found");

        await ctx.db.patch(page._id, {
            publishedData: page.draftData,
            status: "published",
            publishedAt: Date.now(),
            lastModified: Date.now()
        });
    }
});

export const revertDraft = mutation({
    args: {
        path: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "revertDraft");
        const page = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (!page) throw new Error("Page not found");

        // Revert draftData to what is currently published
        await ctx.db.patch(page._id, {
            draftData: page.publishedData || "[]",
            lastModified: Date.now()
        });
    }
});

export const forceDeletePage = mutation({
    args: {
        path: v.string(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "forceDeletePage");
        const existing = await ctx.db
            .query("pages")
            .withIndex("by_path", (q) => q.eq("path", args.path))
            .unique();

        if (existing) {
            await ctx.db.delete(existing._id);
        }
    },
});

export const getAllPagePaths = query({
    handler: async (ctx) => {
        const pages = await ctx.db.query("pages").collect();
        return pages.map((page) => ({
            path: page.path,
            lastModified: page.lastModified || Date.now(),
        }));
    },
});

export const listLite = query({
    handler: async (ctx) => {
        const pages = await ctx.db.query("pages").collect();
        return pages.map((page) => ({
            _id: page._id,
            path: page.path,
            title: page.title,
            status: page.status,
            lastModified: page.lastModified,
        }));
    },
});

export const createPageSnapshot = mutation({
    args: {
        pageId: v.id("pages"),
        name: v.optional(v.string()),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "createPageSnapshot");
        const page = await ctx.db.get(args.pageId);
        if (!page) throw new Error("Page not found");

        await ctx.db.insert("pageSnapshots", {
            pageId: page._id,
            pagePath: page.path,
            data: page.draftData || "",
            title: page.title,
            description: page.description,
            createdAt: Date.now(),
            name: args.name || `Backup ${new Date().toLocaleString()}`,
        });
    },
});

export const listPageSnapshots = query({
    args: { pageId: v.id("pages") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("pageSnapshots")
            .withIndex("by_pageId", (q) => q.eq("pageId", args.pageId))
            .order("desc")
            .collect();
    },
});

export const restorePageSnapshot = mutation({
    args: {
        snapshotId: v.id("pageSnapshots"),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "restorePageSnapshot");
        const snapshot = await ctx.db.get(args.snapshotId);
        if (!snapshot) throw new Error("Snapshot not found");

        const page = await ctx.db.get(snapshot.pageId);
        if (!page) throw new Error("Target page not found");

        // Create a backup of the *current* state before restoring
        await ctx.db.insert("pageSnapshots", {
            pageId: page._id,
            pagePath: page.path,
            data: page.draftData || "",
            title: page.title,
            description: page.description,
            createdAt: Date.now(),
            name: `Auto-Backup before restoring ${snapshot.name || "snapshot"}`,
        });

        await ctx.db.patch(page._id, {
            draftData: snapshot.data,
            title: snapshot.title,
            description: snapshot.description,
            lastModified: Date.now(),
        });
    },
});


