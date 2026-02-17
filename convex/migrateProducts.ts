import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const migrateProductsToNewSchema = mutation({
    args: {},
    handler: async (ctx) => {
        // 1. Create a default "Uncategorized" category if it doesn't exist
        let defaultCategoryId = await ctx.db
            .query("categories")
            .withIndex("by_slug", (q) => q.eq("slug", "uncategorized"))
            .unique();

        if (!defaultCategoryId) {
            const id = await ctx.db.insert("categories", {
                name: "Uncategorized",
                slug: "uncategorized",
                description: "Default category for migrated products",
            });
            defaultCategoryId = { _id: id } as any;
        }

        // 2. Fetch all products
        const products = await ctx.db.query("products").collect();
        let migratedCount = 0;

        for (const product of products) {
            // Check if product already has status (idempotency check)
            if ((product as any).status) continue;

            const oldProduct = product as any;

            // Prepare new product data
            const updateData: any = {
                status: "active",
                categoryId: defaultCategoryId?._id,
                images: oldProduct.image ? [oldProduct.image] : [],
                tags: oldProduct.tags || [],
            };

            // Remove old explicit fields if they exist and conflict with new schema logic
            // Note: Convex patch will add/update, but we should clean up where possible
            // In Convex, we can't easily "delete" a field via patch, but we can update others.

            await ctx.db.patch(product._id, updateData);
            migratedCount++;
        }

        return `Migrated ${migratedCount} products to the new schema.`;
    },
});
