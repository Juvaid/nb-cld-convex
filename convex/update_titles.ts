import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdmin } from "./auth_utils";

export const updateTitles = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await validateAdmin(ctx, args.token, "updateTitles");

    const pagesToUpdate = [
      { path: "/products", newTitle: "Our Products | Nature's Boon" },
      { path: "/services", newTitle: "Our Services | Nature's Boon" },
      { path: "/contact", newTitle: "Contact Us | Nature's Boon" },
    ];

    for (const page of pagesToUpdate) {
      const existing = await ctx.db
        .query("pages")
        .withIndex("by_path", (q) => q.eq("path", page.path))
        .unique();

      if (existing) {
        await ctx.db.patch(existing._id, { title: page.newTitle });
      }
    }
  },
});
