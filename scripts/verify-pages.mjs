import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function verify() {
  console.log("🔍 Verifying restored pages...");
  
  const pages = ["/", "/about", "/services", "/products", "/contact", "/our-brands", "/case-studies"];
  
  for (const path of pages) {
    try {
      const page = await client.query("pages:getPage", { path });
      if (page) {
        console.log(`✅ ${path}: Found (ID: ${page._id}, Status: ${page.status})`);
      } else {
        console.log(`❌ ${path}: NOT FOUND`);
      }
    } catch (e) {
      console.log(`❌ ${path}: Error - ${e.message}`);
    }
  }
}

verify();
