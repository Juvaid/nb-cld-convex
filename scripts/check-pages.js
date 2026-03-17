import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

async function check() {
    try {
        const pages = await client.query("pages:listLite");
        console.log("Pages in DB:");
        pages.forEach(p => console.log(`- ${p.path} (${p.status})`));
    } catch (e) {
        console.error(e);
    }
}

check();
