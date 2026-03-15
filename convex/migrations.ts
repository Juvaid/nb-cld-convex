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

export const migrateToDirectUrls = mutation({
  args: {
    token: v.optional(v.string()),
  },
  handler: async (ctx) => {
    let productUpdates = 0;
    let blogUpdates = 0;

    // 1. Migrate Products
    const allProducts = await ctx.db.query("products").collect();
    for (const product of allProducts) {
      const newImages = [];
      let changed = false;

      for (const img of product.images) {
        if (img.startsWith("http")) {
          newImages.push(img);
        } else {
          // Assume it's a storage ID and try to find the R2 URL
          const mediaItem = await ctx.db
            .query("media")
            .withIndex("by_storageId", (q) => q.eq("storageId", img))
            .unique();
          
          if (mediaItem) {
            newImages.push(mediaItem.url);
            changed = true;
          } else {
            // Fallback if media item not found
            newImages.push(img);
          }
        }
      }

      if (changed) {
        await ctx.db.patch(product._id, { images: newImages });
        productUpdates++;
      }
    }

    // 2. Migrate Blogs
    const allBlogs = await ctx.db.query("blogs").collect();
    for (const blog of allBlogs) {
      // Use type assertion blog.coverImage as string after non-null/non-url check
      if (blog.coverImage && !blog.coverImage.startsWith("http")) {
        const mediaItem = await ctx.db
          .query("media")
          .withIndex("by_storageId", (q) => q.eq("storageId", blog.coverImage as string))
          .unique();
        
        if (mediaItem) {
          await ctx.db.patch(blog._id, { coverImage: mediaItem.url });
          blogUpdates++;
        }
      }
    }

    return { productUpdates, blogUpdates };
  }
});
