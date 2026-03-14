import fs from 'fs';
import { execSync } from 'child_process';

async function auditHtml() {
    const url = "http://localhost:3000/";
    console.log(`Auditing SSR content from: ${url}`);
    
    try {
        const html = execSync(`curl -s ${url}`).toString('utf8');
        fs.writeFileSync('tmp/audit_result.html', html);
        
        const results = {
            "Meta & Title": {
                "Title Tag": html.includes("<title>") ? "✓ Found" : "✗ Missing",
                "Meta Description": html.includes('name="description"') ? "✓ Found" : "✗ Missing",
                "Canonical Link": html.includes('rel="canonical"') ? "✓ Found" : "✗ Missing"
            },
            "Business Content": {
                "Brand Name (Nature's Boon)": (html.match(/Nature's Boon/gi) || []).length,
                "Location (Ludhiana)": html.includes("Ludhiana") ? "✓ Found" : "✗ Missing",
                "Tagline (Since 2006)": html.includes("Since 2006") ? "✓ Found" : "✗ Missing",
                "Contact Number": html.includes("9877659808") ? "✓ Found" : "✗ Missing"
            },
            "Semantic Structure": {
                "H1 Count": (html.match(/<h1/g) || []).length,
                "H2 Count": (html.match(/<h2/g) || []).length,
                "H3 Count": (html.match(/<h3/g) || []).length,
                "Main Sections (Puck)": {
                    "Hero": html.includes("HeroCarousel") || html.includes("ModernHero") ? "✓ Found" : "✗ Missing",
                    "Services": html.includes("ModernServices") ? "✓ Found" : "✗ Missing",
                    "Footer": html.includes("<footer") ? "✓ Found" : "✗ Missing"
                }
            },
            "Technical Health": {
                "Total Size (KB)": Math.round(html.length / 1024),
                "Bailout Message": html.includes("BAILOUT_TO_CLIENT_SIDE_RENDERING") ? "⚠️ DETECTED" : "✓ Clean",
                "useMemo Error": html.includes("useMemo") ? "⚠️ DETECTED" : "✓ Clean",
                "JSON-LD Schema": html.includes('type="application/ld+json"') ? "✓ Found" : "✗ Missing"
            }
        };

        console.log(JSON.stringify(results, null, 2));
        
        // Print snippets of critical parts
        console.log("\n--- H1 Snippet ---");
        const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
        console.log(h1Match ? h1Match[0].trim() : "No H1 found");

        console.log("\n--- Schema Snippet (First 500 chars) ---");
        const schemaMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (schemaMatch) {
            console.log(schemaMatch[1].trim().substring(0, 500) + "...");
        }

    } catch (err) {
        console.error("Audit failed:", err.message);
    }
}

auditHtml();
