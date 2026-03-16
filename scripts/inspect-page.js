import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

async function inspect() {
    try {
        const page = await client.query("pages:getPage", { path: "/digital-marketing" });
        console.log("Page Data:");
        console.log(JSON.stringify(page, null, 2));
    } catch (e) {
        console.error(e);
    }
}

inspect();
