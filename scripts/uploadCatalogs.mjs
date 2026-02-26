import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const PRODUCT_DATA_DIR = "nb scraped data/output/Product data";
const CONVEX_SITE_URL = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;

async function uploadCatalogs() {
    const files = fs.readdirSync(PRODUCT_DATA_DIR).filter(f => f.endsWith(".pdf"));

    console.log(`Found ${files.length} PDF catalogs.`);

    for (const file of files) {
        const filePath = path.join(PRODUCT_DATA_DIR, file);
        const fileName = file.replace(".pdf", "");

        // Determine slug from file name
        let slug = "general";
        const lowerFile = file.toLowerCase();
        if (lowerFile.includes("skin")) slug = "skin-care";
        else if (lowerFile.includes("hair")) slug = "hair-care";
        else if (lowerFile.includes("men")) slug = "mens-grooming";
        else if (lowerFile.includes("body") || lowerFile.includes("personal")) slug = "body-personal-care";

        console.log(`Uploading ${file} for slug ${slug}...`);

        try {
            // Get upload URL
            const getUrlResponse = await fetch(`${CONVEX_SITE_URL}/api/storage/upload_url`, { method: "POST" });
            const { uploadUrl } = await getUrlResponse.json();

            // Upload the file
            const fileData = fs.readFileSync(filePath);
            const uploadResponse = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": "application/pdf" },
                body: fileData
            });
            const { storageId } = await uploadResponse.json();

            console.log(`Uploaded ${file}, storageId: ${storageId}`);

            // Link to product/category via mutation
            const linkResponse = await fetch(`${CONVEX_SITE_URL}/uploadDocument`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: fileName.split("-").join(" "),
                    slug: slug,
                    storageId: storageId
                })
            });

            const linkResult = await linkResponse.json();
            if (linkResult.success) {
                console.log(`Successfully linked ${file} to ${slug}`);
            }
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}

uploadCatalogs().catch(console.error);
