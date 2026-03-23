import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;
const client = new ConvexHttpClient(CONVEX_URL);

async function check() {
    const slug = "best-face-wash-manufacturers-in-india";
    console.log(`Checking blog: ${slug}`);
    const blog = await client.query(api.blogs.getBlogBySlug, { slug });
    console.log("Blog Found:", blog.title);
    console.log("Content Structure (JSON):");
    try {
        const data = JSON.parse(blog.content);
        console.log("Total Blocks:", data.content.length);
        data.content.forEach((block, i) => {
            console.log(`[Block ${i}] Type: ${block.type} | ID: ${block.props.id}`);
        });
    } catch (e) {
        console.log("Raw Content:", blog.content.substring(0, 200));
    }
}

check().catch(console.error);
