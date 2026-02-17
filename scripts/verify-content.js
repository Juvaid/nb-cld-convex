const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function verify() {
    console.log("Verifying Page Content...");
    const paths = ["/", "/services", "/contact", "/about"];

    for (const path of paths) {
        const page = await client.query("pages:getPage", { path });
        if (!page) {
            console.log(`[FAIL] ${path} NOT FOUND`);
            continue;
        }

        try {
            const data = JSON.parse(page.data);
            const title = data.root?.props?.title || "NO_TITLE";
            const firstBlock = data.content?.[0]?.type || "NO_CONTENT";
            console.log(`[OK] ${path} -> Title: "${title}", First Block: ${firstBlock}`);
        } catch (e) {
            console.log(`[FAIL] ${path} -> JSON Parse Error`);
        }
    }
}

verify();
