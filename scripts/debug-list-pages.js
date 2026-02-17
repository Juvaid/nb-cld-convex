const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function list() {
    try {
        console.log("Fetching all pages...");
        const pages = await client.query("pages:listPages");
        console.log("--- DB DUMP ---");
        pages.forEach(p => {
            console.log(`ID: ${p._id}`);
            console.log(`Title: "${p.title}"`);
            console.log(`Path:  "${p.path}"`);
            console.log("----------------");
        });
    } catch (err) {
        console.error("List failed:", err);
    }
}

list();
