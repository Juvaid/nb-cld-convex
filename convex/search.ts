import { v } from "convex/values";
import { query } from "./_generated/server";

export const globalSearch = query({
    args: { query: v.string() },
    handler: async (ctx, args) => {
        try {
            if (!args.query || args.query.length < 2) return [];

            const searchLower = args.query.toLowerCase();

            // Use collect() but handle potential table missing errors gracefully
            const [products, blogs, categories] = await Promise.all([
                ctx.db.query("products").collect().catch(() => []),
                ctx.db.query("blogs").collect().catch(() => []),
                ctx.db.query("categories").collect().catch(() => []),
            ]);

            const productResults = products
                .filter(p => 
                    (p.name?.toLowerCase()?.includes(searchLower) || false) || 
                    (p.slug?.toLowerCase()?.includes(searchLower) || false)
                )
                .map(p => ({
                    id: p._id,
                    title: p.name,
                    type: "Product",
                    href: `/products/${p.slug}`,
                    image: (p.images && p.images.length > 0) ? p.images[0] : null
                }));

            const blogResults = blogs
                .filter(b => 
                    (b.title?.toLowerCase()?.includes(searchLower) || false) || 
                    (b.slug?.toLowerCase()?.includes(searchLower) || false)
                )
                .map(b => ({
                    id: b._id,
                    title: b.title,
                    type: "Blog",
                    href: `/blogs/${b.slug}`,
                    image: b.coverImage || null
                }));

            const categoryResults = categories
                .filter(c => 
                    (c.name?.toLowerCase()?.includes(searchLower) || false) || 
                    (c.slug?.toLowerCase()?.includes(searchLower) || false)
                )
                .map(c => ({
                    id: c._id,
                    title: c.name,
                    type: "Category",
                    href: `/categories/${c.slug}`,
                    image: c.image || null
                }));

            return [...productResults, ...blogResults, ...categoryResults].slice(0, 10);
        } catch (error) {
            console.error("Error in globalSearch:", error);
            // Return empty array instead of crashing the client
            return [];
        }
    },
});
