import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function checkProducts() {
    console.log("Checking products at:", process.env.NEXT_PUBLIC_CONVEX_URL);
    const products = await convex.query("products:listAll", { status: "active" });
    console.log("All Active Products:");
    products.forEach(p => console.log(`- ${p.name} (slug: ${p.slug})`));

    const faceWash = products.find(p => p.slug === "face-wash");
    if (faceWash) {
        console.log("\nFound face-wash:", faceWash);
    } else {
        console.log("\nface-wash NOT found in active products.");
    }
}

checkProducts().catch(console.error);
