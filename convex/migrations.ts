import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Migration to update existing product images from legacy storage IDs to direct R2 public URLs.
 * This ensures OG image previews work reliably in WhatsApp, Discord, etc.
 */
export const migrateProductImagesToUrls = mutation({
  args: {
    dryRun: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const products = await ctx.db.query("products").collect();
    let updatedCount = 0;
    let fallbackCount = 0;

    for (const product of products) {
      const newImages: string[] = [];
      let changed = false;

      for (const image of product.images) {
        // If it's already a URL (starts with http), keep it
        if (image.startsWith("http")) {
          newImages.push(image);
          continue;
        }

        // If it's a storage ID, attempt to look up in media table or use fallback public URL
        const mediaRecord = await ctx.db
          .query("media")
          .withIndex("by_storageId", (q) => q.eq("storageId", image))
          .unique();

        if (mediaRecord?.url) {
          newImages.push(mediaRecord.url);
          changed = true;
        } else {
          // Fallback construction using the public site URL
          const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
          if (siteUrl) {
            newImages.push(`${siteUrl}/api/storage/${image}`);
            changed = true;
          } else {
            // If no site URL, keep storage ID (not ideal but safe)
            newImages.push(image);
            fallbackCount++;
          }
        }
      }

      if (changed && !args.dryRun) {
        await ctx.db.patch(product._id, { images: newImages });
        updatedCount++;
      } else if (changed) {
        updatedCount++;
      }
    }

    return {
      success: true,
      updatedCount,
      fallbackCount,
      dryRun: !!args.dryRun,
    };
  },
});
