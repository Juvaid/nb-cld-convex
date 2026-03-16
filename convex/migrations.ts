<<<<<<< HEAD
import { mutation, query } from "./_generated/server";
=======
import { mutation } from "./_generated/server";
import { v } from "convex/values";
>>>>>>> b856db2f9083dcb27cc3a4b3b771b1e01e90ceea

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
