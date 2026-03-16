import { mutation, query } from "./_generated/server";
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
        let updatedCount = 0;
        const messages: string[] = [];

        // 1. Update Page Titles and Schema Types
        const pages = await ctx.db.query("pages").collect();
        const pageUpdates: Record<string, any> = {
            "/about": {
                title: "About",
                schemaType: "about"
            },
            "/services": {
                title: "Services",
                schemaType: "service"
            },
            "/products": {
                title: "Products",
                schemaType: "product-list"
            },
            "/contact": {
                title: "Contact",
                schemaType: "contact"
            }
        };

        for (const page of pages) {
            if (pageUpdates[page.path]) {
                const updates = pageUpdates[page.path];
                let changed = false;
                const patch: any = {};
                
                if (page.title !== updates.title) {
                    patch.title = updates.title;
                    changed = true;
                }
                if (page.schemaType !== updates.schemaType) {
                    patch.schemaType = updates.schemaType;
                    changed = true;
                }

                if (changed) {
                    patch.lastModified = Date.now();
                    await ctx.db.patch(page._id, patch);
                    updatedCount++;
                    messages.push(`Updated ${page.path}: set title/schemaType`);
                }
            }
        }

        // 2. Publish Privacy Policy and Terms of Service (or ensure they are published)
        for (const path of ["/privacy-policy", "/terms-of-service"]) {
            const page = pages.find(p => p.path === path);
            if (page && page.status !== "published") {
                await ctx.db.patch(page._id, {
                    status: "published",
                    publishedData: page.draftData,
                    publishedAt: Date.now(),
                    lastModified: Date.now()
                });
                updatedCount++;
                messages.push(`Published ${path}`);
            }
        }

        // 3. Update Site Settings (Re-enable Blogs in Nav)
        const settingsList = await ctx.db.query("siteSettings").collect();
        if (settingsList.length > 0) {
            const settings = settingsList[0];
            const currentLinks = settings.value?.navLinks || [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Products", href: "/products" }
            ];

            let navChanged = false;
            let newLinks = [...currentLinks];
            
            if (!newLinks.some((link: any) => link.href === "/blogs")) {
                newLinks.push({ label: "Blogs", href: "/blogs" });
                navChanged = true;
            }

            if (navChanged) {
                await ctx.db.patch(settings._id, { value: { ...settings.value, navLinks: newLinks } });
                updatedCount++;
                messages.push(`Updated navigation menu, added missing links (Blogs)`);
            }
        }

        return {
            success: true,
            updatedRecords: updatedCount,
            logs: messages
        };
    }
});

export const executePhase5BlogCleanup = mutation({
    args: {},
    handler: async (ctx) => {
        let updatedCount = 0;
        const messages: string[] = [];

        const blogs = await ctx.db.query("blogs").collect();
        
        // Default cover image for SEO blogs (using a generic factory/production image if available, else standard placeholder)
        // We'll leave it blank if we don't know the exact storage ID, but as per task, we can use the main site OG image or similar.
        // For now, let's just add the excerpt and keywords.

        for (const blog of blogs) {
            let changed = false;
            const patch: any = {};

            // 1. Fix typo in specific blog title
            if (blog.title.toLowerCase().includes("manufacuturers")) {
                patch.title = blog.title.replace(/Manufacuturers/i, "Manufacturers");
                // Also fix capitalization
                patch.title = patch.title.replace("best skin care", "Best Skin Care");
                patch.title = patch.title.replace("in india", "in India");
                changed = true;
                messages.push(`Fixed typo in title for ${blog.slug}`);
            }

            // 2. Add realistic meta excerpts if missing
            if (!blog.excerpt || blog.excerpt.length < 10) {
                // Generate a generic excerpt from title
                patch.excerpt = `Discover the ${blog.title}. Nature's Boon offers premium private label manufacturing with top-quality ingredients and GMP certification.`;
                changed = true;
            }

            // 3. Add default keywords if empty
            if (!blog.keywords || blog.keywords.trim() === "") {
                const keywordBase = blog.title.replace(/in India/i, "").replace(/Best /i, "").replace(/Top /i, "").replace(/Manufacturers/i, "").trim();
                const defaultKeywords = [
                    keywordBase,
                    "Private Label Custom Formulation",
                    "GMP Certified Manufacturer",
                    "Third Party Manufacturing"
                ].join(", ");
                patch.keywords = defaultKeywords;
                changed = true;
            }

            // 4. Set category to "seo-page" since these are our seeded SEO pages
            if (!blog.category || blog.category !== "seo-page") {
                patch.category = "seo-page";
                changed = true;
            }

            if (changed) {
                await ctx.db.patch(blog._id, patch);
                updatedCount++;
            }
        }

        return {
            success: true,
            updatedRecords: updatedCount,
            logs: messages
        };
    }
});

export const getRawSettings = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("siteSettings").collect();
    }
});
