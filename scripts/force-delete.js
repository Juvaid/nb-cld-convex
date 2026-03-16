import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function main() {
    const path = "/digital-marketing";
    console.log(`Deleting page: ${path}`);
    await client.mutation(api.ingestion_mutations.forceDeletePage, { path });
    console.log("Deleted.");
}

main().catch(console.error);
