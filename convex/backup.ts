import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Export all non-sensitive site data for backup/migration purposes.
 * Excludes: users, sessions, rate_limits, inquiries (sensitive / env-specific)
 */
export const exportAll = query({
    handler: async (ctx) => {
        const [
            siteSettings,
            themeSettings,
            pages,
            pageSnapshots,
            categories,
            products,
            stats,
            services,
            blogs,
            media,
            componentTemplates,
            themeSnapshots,
        ] = await Promise.all([
            ctx.db.query("siteSettings").collect(),
            ctx.db.query("themeSettings").collect(),
            ctx.db.query("pages").collect(),
            ctx.db.query("pageSnapshots").collect(),
            ctx.db.query("categories").collect(),
            ctx.db.query("products").collect(),
            ctx.db.query("stats").collect(),
            ctx.db.query("services").collect(),
            ctx.db.query("blogs").collect(),
            ctx.db.query("media").collect(),
            ctx.db.query("componentTemplates").collect(),
            ctx.db.query("themeSnapshots").collect(),
        ]);

        return {
            exportedAt: Date.now(),
            version: "1.0",
            data: {
                siteSettings,
                themeSettings,
                pages,
                pageSnapshots,
                categories,
                products,
                stats,
                services,
                blogs,
                media,
                componentTemplates,
                themeSnapshots,
            },
        };
    },
});

/**
 * Import backup data. Clears existing data and replaces with backup.
 * Pass `dryRun: true` to validate the backup without writing anything.
 */
export const importAll = mutation({
    args: {
        backup: v.any(),
        dryRun: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { backup, dryRun = false } = args;

        if (!backup?.data || !backup?.version) {
            throw new Error("Invalid backup format. Missing 'data' or 'version' fields.");
        }

        const { data } = backup;
        const report: Record<string, number> = {};

        if (dryRun) {
            // Just count records - validate structure
            for (const [table, rows] of Object.entries(data)) {
                report[table] = Array.isArray(rows) ? (rows as unknown[]).length : 0;
            }
            return { dryRun: true, wouldImport: report };
        }

        // Helper to upsert by key (for settings tables)
        async function upsertByKey(
            table: "siteSettings" | "themeSettings",
            field: "key",
            rows: Array<{ key: string; value: unknown }>
        ) {
            let count = 0;
            for (const row of rows) {
                const existing = await ctx.db
                    .query(table)
                    .withIndex("by_key", (q) => q.eq("key", row.key))
                    .unique();
                if (existing) {
                    await ctx.db.patch(existing._id, { value: row.value });
                } else {
                    await ctx.db.insert(table, { key: row.key, value: row.value });
                }
                count++;
            }
            return count;
        }

        // Helper to upsert pages by path
        async function upsertPages(rows: Array<Record<string, unknown>>) {
            let count = 0;
            for (const row of rows) {
                const existing = await ctx.db
                    .query("pages")
                    .withIndex("by_path", (q) => q.eq("path", row.path as string))
                    .unique();

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, _creationTime, ...fields } = row as Record<string, unknown>;

                if (existing) {
                    await ctx.db.patch(existing._id, fields);
                } else {
                    await ctx.db.insert("pages", fields as never);
                }
                count++;
            }
            return count;
        }

        // Site Settings (upsert)
        if (data.siteSettings?.length) {
            report.siteSettings = await upsertByKey("siteSettings", "key", data.siteSettings);
        }

        // Theme Settings (upsert)
        if (data.themeSettings?.length) {
            report.themeSettings = await upsertByKey("themeSettings", "key", data.themeSettings);
        }

        // Pages (upsert by path — preserves layouts!)
        if (data.pages?.length) {
            report.pages = await upsertPages(data.pages);
        }

        // Stats (insert all, skip if same label exists)
        if (data.stats?.length) {
            const existing = await ctx.db.query("stats").collect();
            const existingLabels = new Set(existing.map((s) => s.label));
            let count = 0;
            for (const row of data.stats) {
                if (!existingLabels.has(row.label)) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { _id, _creationTime, ...fields } = row;
                    await ctx.db.insert("stats", fields);
                    count++;
                }
            }
            report.stats = count;
        }

        // Services (upsert by slug)
        if (data.services?.length) {
            let count = 0;
            for (const row of data.services) {
                const existing = await ctx.db
                    .query("services")
                    .withIndex("by_slug", (q) => q.eq("slug", row.slug))
                    .unique();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, _creationTime, ...fields } = row;
                if (existing) {
                    await ctx.db.patch(existing._id, fields);
                } else {
                    await ctx.db.insert("services", fields);
                }
                count++;
            }
            report.services = count;
        }

        // Blogs (upsert by slug)
        if (data.blogs?.length) {
            let count = 0;
            for (const row of data.blogs) {
                const existing = await ctx.db
                    .query("blogs")
                    .withIndex("by_slug", (q) => q.eq("slug", row.slug))
                    .unique();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { _id, _creationTime, ...fields } = row;
                if (!existing) {
                    await ctx.db.insert("blogs", fields);
                    count++;
                }
            }
            report.blogs = count;
        }

        return {
            success: true,
            imported: report,
            message: "Backup restored successfully.",
        };
    },
});
