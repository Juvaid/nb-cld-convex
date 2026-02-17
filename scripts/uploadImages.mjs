import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const IMAGES_DIR = "nb scraped data/output/images";

async function uploadImages() {
    const files = fs.readdirSync(IMAGES_DIR);
    console.log(`Found ${files.length} images. Starting upload...`);

    for (const file of files) {
        const filePath = path.join(IMAGES_DIR, file);
        if (!fs.lstatSync(filePath).isFile()) continue;

        try {
            // 1. Generate upload URL via CLI
            const uploadUrl = execSync("npx convex run media:generateUploadUrl", { encoding: "utf8" }).trim().replace(/^"|"$/g, '');

            // 2. Upload file via fetch (Node 18+)
            const content = fs.readFileSync(filePath);
            const response = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": "image/jpeg" },
                body: content,
            });

            if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);
            const { storageId } = await response.json();

            // 3. Save to media table via CLI
            // We need to format the arguments for the CLI. It usually expects JSON.
            const args = JSON.stringify({
                filename: file,
                storageId: storageId,
                type: "image",
            });
            execSync(`npx convex run media:saveMedia "${args.replace(/"/g, '\\"')}"`);

            console.log(`Uploaded: ${file}`);
        } catch (err) {
            console.error(`Failed to upload ${file}:`, err.message);
        }
    }

    console.log("Upload complete!");
}

uploadImages().catch(console.error);
