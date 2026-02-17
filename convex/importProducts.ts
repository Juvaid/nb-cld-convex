import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const importFromStatic = mutation({
    args: {
        data: v.array(v.object({
            name: v.string(),
            slug: v.string(),
            description: v.optional(v.string()),
            products: v.array(v.object({
                name: v.string(),
                usp: v.optional(v.string()),
            }))
        }))
    },
    handler: async (ctx, args) => {
        let importedCount = 0;
        for (const cat of args.data) {
            // 1. Check/Create Category
            let existingCategory = await ctx.db
                .query("categories")
                .withIndex("by_slug", (q) => q.eq("slug", cat.slug))
                .unique();

            let categoryId = existingCategory?._id;

            if (!categoryId) {
                categoryId = await ctx.db.insert("categories", {
                    name: cat.name,
                    slug: cat.slug,
                    description: cat.description || "",
                });
            }

            // 2. Import Products
            for (const prod of cat.products) {
                const slug = prod.name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");

                const existing = await ctx.db
                    .query("products")
                    .withIndex("by_slug", (q) => q.eq("slug", slug))
                    .unique();

                const productData: any = {
                    name: prod.name,
                    slug: slug,
                    description: prod.usp || "",
                    images: [],
                    status: "active",
                    categoryId: categoryId,
                    tags: [],
                };

                if (existing) {
                    await ctx.db.patch(existing._id, productData);
                } else {
                    await ctx.db.insert("products", productData);
                }
                importedCount++;
            }
        }
        return `Import completed: ${importedCount} products imported across ${args.data.length} categories.`;
    }
});
