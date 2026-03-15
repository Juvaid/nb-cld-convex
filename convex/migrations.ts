import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const findAndMigrateFooter = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx) => {
    const allPages = await ctx.db.query("pages").collect();
    let bestFooter = null;

    // 1. Find the most complete footer block
    for (const page of allPages) {
      if (page.publishedData) {
        const data = JSON.parse(page.publishedData);
        const footerBlock = data.content?.find((b: any) => b.type === "Footer" || b.type === "SiteFooter");
        if (footerBlock && Object.keys(footerBlock.props || {}).length > 1) {
          bestFooter = footerBlock;
          break; 
        }
      }
    }

    if (!bestFooter) {
       bestFooter = {
         type: "Footer",
         props: {
           logoText: "Nature's Boon",
           description: "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.",
           copyrightText: `© ${new Date().getFullYear()} Nature's Boon. All rights reserved.`
         }
       };
    }

    // 1.5 Sync Site Settings
    const settingsToUpdate = {
        logoText: bestFooter.props.logoText,
        footerDescription: bestFooter.props.description,
        footerCopyrightText: bestFooter.props.copyrightText,
        socialLinks: bestFooter.props.socialLinks,
    };

    for (const [key, value] of Object.entries(settingsToUpdate)) {
        const existing = await ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", key)).unique();
        if (existing) {
            await ctx.db.patch(existing._id, { value });
        } else {
            await ctx.db.insert("siteSettings", { key, value });
        }
    }

    // 2. Add it to every page missing it
    let updatedCount = 0;
    for (const page of allPages) {
      if (page.path.startsWith("/admin") || page.path.startsWith("/login")) continue;

      const patches: any = {};
      let changed = false;

      const dataFields = ['publishedData', 'draftData'] as const;
      for (const field of dataFields) {
        const val = page[field];
        if (val) {
          try {
            const data = JSON.parse(val);
            if (!data.content) data.content = [];
            const hasFooter = data.content.some((b: any) => b.type === "Footer" || b.type === "SiteFooter");
            if (!hasFooter) {
              data.content.push({ ...bestFooter, props: { ...bestFooter.props, id: `Footer-${page._id}-${field}` } });
              patches[field] = JSON.stringify(data);
              changed = true;
            }
          } catch (e) {}
        }
      }

      if (changed) {
        await ctx.db.patch(page._id, patches);
        updatedCount++;
      }
    }

    return { updatedCount, bestFooter, settingsSynced: true };
  }
});
