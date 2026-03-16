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

export const executePhase4AdminTasks = mutation({
    args: {},
    handler: async (ctx) => {
        let productUpdates = 0;
        let blogUpdates = 0;
        const messages: string[] = [];

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
