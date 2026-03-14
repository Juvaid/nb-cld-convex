import http from 'http';
import fs from 'fs';

const url = 'http://localhost:3000/';

console.log("Fetching SSR content from:", url);

http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
        console.log("HTML length received:", data.length);
        
        fs.writeFileSync('tmp/ssr_final_direct.html', data);
        
        const targets = [
            "Nature's Boon",
            "HeroCarousel",
            "ModernServices",
            "Ludhiana",
            "manufacture",
            "since 2006",
            "Featured Formulations"
        ];

        console.log("\n--- Content Verification ---");
        targets.forEach(t => {
            const found = data.toLowerCase().includes(t.toLowerCase());
            console.log(`${t}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
        });

        if (data.toLowerCase().includes("nature's boon")) {
            const index = data.toLowerCase().indexOf("nature's boon");
            console.log("\n--- Snippet ---");
            console.log(data.substring(index - 50, index + 150).replace(/\n/g, ' '));
        }

        const crashMatch = data.match(/Switched to client rendering/);
        if (crashMatch) {
            console.log("\n⚠️ CRASH DETECTED: Page still contains bailout message.");
        } else if (data.length < 5000) {
             console.log("\n⚠️ WARNING: HTML is suspiciously short.");
        } else {
            console.log("\n✅ SUCCESS: Dense HTML captured without bailout indicator.");
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
