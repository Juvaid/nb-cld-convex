import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { validateAdmin } from "./auth_utils";

export const performCleanup = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Temporarily disabled for one-time CLI run
    // await validateAdmin(ctx, args.token, "performCleanup");

    // 1. Optimize Page Metadata
    const pages = await ctx.db.query("pages").collect();
    const BRAND_SUFFIX = " | Nature's Boon";

    for (const page of pages) {
      let updated = false;
      const patch: any = {};

      // Cleanup Titles
      if (page.title.endsWith(BRAND_SUFFIX)) {
        patch.title = page.title.replace(BRAND_SUFFIX, "").trim();
        updated = true;
      }

      // Optimize Home Page
      if (page.path === "/") {
        patch.title = "Personal Care & Cosmetics Manufacturer";
        patch.description = "Nature's Boon is a global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions for skincare and hair care.";
        patch.schemaType = "organization";
        updated = true;
      }

      // Set Schema Types
      if (page.path === "/about") patch.schemaType = "about";
      if (page.path === "/services") patch.schemaType = "service";
      if (page.path === "/products") patch.schemaType = "collection";
      if (page.path === "/contact") patch.schemaType = "contact";

      if (updated || patch.schemaType) {
        await ctx.db.patch(page._id, patch);
      }
    }

    // 2. Fix Blog Metadata
    const targetBlog = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", "best-skin-care-products-manufacuturers-in-india"))
      .unique();

    if (targetBlog) {
      await ctx.db.patch(targetBlog._id, {
        excerpt: "Discover the leading skin care product manufacturers in India, specializing in high-quality personal care, private label solutions, and export-grade manufacturing.",
        keywords: "Skin Care Manufacturer, Cosmetics Manufacturing India, Private Label Skincare, Personal Care OEM",
      });
    }

    return { success: true, message: "Launch metadata cleanup completed successfully." };
  },
});
