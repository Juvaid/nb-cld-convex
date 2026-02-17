const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function clear() {
    console.log("Clearing Pages Database...");
    try {
        const pages = await client.query("pages:listPages");
        console.log(`Found ${pages.length} pages to delete.`);

        for (const page of pages) {
            console.log(`Deleting: ${page.title} (${page.path}) [${page._id}]`);
            await client.mutation("ingestion_mutations:forceDeletePage", { path: page.path });
        }
        console.log("Database cleared.");
    } catch (err) {
        console.error("Clear failed:", err);
    }
}

clear();
