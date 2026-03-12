import { v } from "convex/values";
import { query, mutation, internalQuery } from "./_generated/server";
import { validateAdmin } from "./auth_utils";

export const getSiteSettings = query({
    handler: async (ctx) => {
        const settings = await ctx.db.query("siteSettings").collect();
        const settingsMap: Record<string, any> = {};
        for (const setting of settings) {
            settingsMap[setting.key] = setting.value;
        }
        return settingsMap;
    },
});

export const updateSiteSetting = mutation({
    args: {
        key: v.string(),
        value: v.any(),
        token: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await validateAdmin(ctx, args.token, "updateSiteSetting");
        const existing = await ctx.db
            .query("siteSettings")
            .withIndex("by_key", (q) => q.eq("key", args.key))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { value: args.value });
        } else {
            await ctx.db.insert("siteSettings", { key: args.key, value: args.value });
        }
    },
});
export const getInternal = internalQuery({
    handler: async (ctx) => {
        return await ctx.db.query("siteSettings").collect();
    },
});
