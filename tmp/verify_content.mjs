import fs from 'fs';

const content = fs.readFileSync('tmp/ssr_final_final_verified.html', 'utf8');

console.log("Total HTML Length:", content.length);

// Search for character-encoded versions of "Nature's Boon"
const encodedTargets = [
    "Nature&#x27;s Boon",
    "Nature&apos;s Boon",
    "Nature\\u0027s Boon",
    "Hero",
    "formulation",
    "products",
    "footer",
    "header"
];

console.log("\n--- Structural Analysis ---");
encodedTargets.forEach(target => {
    const found = content.includes(target);
    console.log(`${target}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
});

// Look for Puck-specific identifiers
const puckId = content.includes("puck-block");
console.log(`puck-block classes: ${puckId ? '✓ FOUND' : '✗ NOT FOUND'}`);

// Output a mid-section sample where content should be
console.log("\n--- Sample (chars 50,000 to 51,000) ---");
console.log(content.substring(50000, 51000).replace(/\n/g, ' '));
