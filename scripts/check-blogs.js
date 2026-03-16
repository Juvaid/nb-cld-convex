import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const convexUrl = process.argv[2] || process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexHttpClient(convexUrl);

async function check() {
    try {
        const blogs = await client.query("blogs:listAll");
        console.log(`Blogs in DB (${convexUrl}):`);
        blogs.forEach(b => {
            console.log(`- ${b.slug} (${b.status})`);
        });
    } catch (e) {
        console.error(e);
    }
}

check();
