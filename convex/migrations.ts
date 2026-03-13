import { mutation, internalMutation } from "./_generated/server";

export const moveBlogPages = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Fetch all pages
        const allPages = await ctx.db.query("pages").collect();

        // 2. Define pages to KEEP in root (The "System Pages")
        const keepInRoot = ["/", "/contact", "/about", "/services", "/products", "/home"];
        let movedCount = 0;
        let skippedCount = 0;

        for (const page of allPages) {
            // If it's NOT a system page and NOT already in /blogs
            if (!keepInRoot.includes(page.path) && !page.path.startsWith("/blogs/")) {

                // Clean up the path (ensure leading slash)
                const oldPath = page.path.startsWith("/") ? page.path : `/${page.path}`;
                const newPath = `/blogs${oldPath}`;

                // Update the database
                await ctx.db.patch(page._id, { path: newPath });
                movedCount++;
            } else {
                skippedCount++;
            }
        }
        return `Success: Moved ${movedCount} pages to /blogs/. Skipped ${skippedCount} items.`;
    },
});

export const migrateBlogPaths = mutation({
    args: {},
    handler: async (ctx) => {
        const skipPaths = ["/", "/contact", "/about", "/services", "/products"];
        const pages = await ctx.db.query("pages").collect();

        let movedCount = 0;
        let skippedCount = 0;

        for (const page of pages) {
            // Skip core pages
            if (skipPaths.includes(page.path)) {
                skippedCount++;
                continue;
            }

            // Skip if already in /blog/
            if (page.path.startsWith("/blog/")) {
                skippedCount++;
                continue;
            }

            // Move to /blog/
            const newPath = page.path.startsWith("/")
                ? `/blog${page.path}`
                : `/blog/${page.path}`;

            await ctx.db.patch(page._id, {
                path: newPath
            });
            movedCount++;
            console.log(`Moved ${page.path} to ${newPath}`);
        }

        return {
            success: true,
            movedCount,
            skippedCount,
            total: pages.length
        };
    }
});

export const syncPuckToProducts = mutation({
    args: {},
    handler: async (ctx) => {
        const pages = await ctx.db.query("pages").collect();
        const products = await ctx.db.query("products").collect();

        let updateCount = 0;

        for (const page of pages) {
            try {
                const dataContent = page.draftData || (page as any).data || '{"content":[]}';
                const data = JSON.parse(dataContent);
                // Puck data structure usually has 'content' array
                const blocks = data.content || [];

                for (const block of blocks) {
                    if (block.type === "ProductBrowser") {
                        const categories = block.props.categories || [];
                        for (const cat of categories) {
                            const productsInCat = cat.products || [];
                            for (const p of productsInCat) {
                                // Find product in DB by slug or name
                                const dbProduct = products.find(dp => dp.slug === p.slug || dp.name === p.name);
                                if (dbProduct) {
                                    const updates: any = {};
                                    if (p.sku && !dbProduct.sku) updates.sku = p.sku;
                                    if (p.usp && !dbProduct.usp) updates.usp = p.usp;

                                    if (Object.keys(updates).length > 0) {
                                        await ctx.db.patch(dbProduct._id, updates);
                                        updateCount++;
                                        console.log(`Updated product ${dbProduct.name} with ${JSON.stringify(updates)}`);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (e) {
                console.error(`Failed to parse page data for ${page.path}`, e);
            }
        }
        return `Successfully synced ${updateCount} product fields from Puck data.`;
    }
});

export const fixGlobalStats = mutation({
    args: {},
    handler: async (ctx) => {
        const stats = await ctx.db.query("stats").collect();
        let count = 0;
        for (const stat of stats) {
            if (stat.label === "Years Experience") {
                await ctx.db.patch(stat._id, { value: "20+" });
                count++;
            }
        }
        return `Successfully updated ${count} global stat records.`;
    }
});

export const contentRefresh2026 = mutation({
    args: {},
    handler: async (ctx) => {
        const pages = await ctx.db.query("pages").collect();
        const stats = await ctx.db.query("stats").collect();
        
        let pageUpdates = 0;
        let statUpdates = 0;

        // 1. Update Stats table
        for (const stat of stats) {
            if (stat.value === "15+" || stat.value === "17+") {
                await ctx.db.patch(stat._id, { value: "20+" });
                statUpdates++;
            }
        }

        // 2. Update Pages (Surgical Replace)
        for (const page of pages) {
            const dataFields = ["publishedData", "draftData"];
            const updates: any = {};
            let changed = false;

            for (const field of dataFields) {
                const rawData = (page as any)[field];
                if (rawData) {
                    let newContent = rawData
                        .replace(/15\+/g, "20+")
                        .replace(/17\+/g, "20+")
                        .replace(/2006-2023/g, "2006-present")
                        .replace(/copyright \u00a9 2023/gi, "Copyright \u00a9 2026")
                        .replace(/since 2006 \(15\+ years\)/gi, "since 2006 (20+ years)")
                        .replace(/since 2006 \(17\+ years\)/gi, "since 2006 (20+ years)")
                        .replace(/OUr CLIENTS/g, "Our Clients");
                    
                    if (newContent !== rawData) {
                        updates[field] = newContent;
                        changed = true;
                    }
                }
            }

            if (changed) {
                await ctx.db.patch(page._id, updates);
                pageUpdates++;
            }
        }

        return `Success: Updated ${statUpdates} stats and ${pageUpdates} pages to 2026 standards.`;
    }
});
