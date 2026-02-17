import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!CONVEX_URL) {
    console.error("Please set NEXT_PUBLIC_CONVEX_URL in .env.local");
    process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

const blogs = [
    { title: "Best Body Lotion Manufacturers In India", slug: "best-body-lotion-manufacturers-in-india" },
    { title: "Best Body Scrub Manufacturers In India", slug: "best-body-scrub-manufacturers-in-india" },
    { title: "Best Face Serum Manufacturers In India", slug: "best-face-serum-manufacturers-in-india" },
    { title: "Best Face Wash Manufacturers In India", slug: "best-face-wash-manufacturers-in-india" },
    { title: "Best Facial Kit Manufacturers In India", slug: "best-facial-kit-manufacturers-in-india" },
    { title: "Best Hair Serum Manufacturers In India", slug: "best-hair-serum-manufacturers-in-india" },
    { title: "Best Shampoo Manufacturers In India", slug: "best-shampoo-manufacturers-in-india" },
    { title: "Best Sunscreen Manufacturers In India", slug: "best-sunscreen-manufacturers-in-india" },
    { title: "Body Personal Care", slug: "body-personal-care" },
    { title: "Case Study", slug: "case-study" },
    { title: "Customised Finished Product", slug: "customised-finished-product" },
    { title: "Digital Marketing", slug: "digital-marketing" },
    { title: "Hair Care Products", slug: "hair-care-products" },
    { title: "Hair Oil Manufacturers In India", slug: "hair-oil-manufacturers-in-india" },
    { title: "Label Packaging Designing", slug: "label-packaging-designing" },
    { title: "Mens Grooming Products", slug: "mens-grooming-products" },
    { title: "Our Brands", slug: "our-brands" },
    { title: "Private Label Skin Care Products Manufacturers In India", slug: "private-label-skin-care-products-manufacturers-in-india" },
    { title: "Private Label Third Party Beard Oil Manufacturers In India", slug: "private-label-third-party-beard-oil-manufacturers-in-india" },
    { title: "Skin Care Products", slug: "skin-care-products" },
    { title: "Third Party Contract Cosmetics Products Manufacturers In India", slug: "third-party-contract-cosmetics-products-manufacturers-in-india" },
    { title: "Top Derma Products Manufacturers In India", slug: "top-derma-products-manufacturers-in-india" },
    { title: "Trademark Logo", slug: "trademark-logo" }
];

async function ingest() {
    console.log(`Starting ingestion of ${blogs.length} blog posts...`);

    for (const blog of blogs) {
        try {
            const blogId = await client.mutation(api.blogs.createDraft, {
                title: blog.title,
                slug: blog.slug,
                author: "Nature's Boon Editorial",
            });
            console.log(`✅ Created: ${blog.title} (ID: ${blogId})`);
        } catch (error) {
            console.error(`❌ Failed to create ${blog.title}:`, error);
        }
    }

    console.log("Ingestion complete.");
}

ingest().catch(console.error);
