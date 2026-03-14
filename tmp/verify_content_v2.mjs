import fs from 'fs';

// Read without assumptions, check for padding or encoding
const buffer = fs.readFileSync('tmp/ssr_final_utf8.html');
console.log("Buffer Length:", buffer.length);

// Check for null characters or excessive spacing
let nullCount = 0;
for (let i = 0; i < Math.min(buffer.length, 1000); i++) {
    if (buffer[i] === 0) nullCount++;
}
console.log("Null bytes in first 1000:", nullCount);

// Try to normalize by removing nulls or converting
let content = '';
if (nullCount > 100) {
    content = buffer.toString('utf16le');
} else {
    content = buffer.toString('utf8');
}

// Clean up any weird spacing derived from the previous capture issues
const cleanContent = content.replace(/\0/g, '');

const targets = [
    "Nature's Boon",
    "HeroCarousel",
    "ModernServices",
    "Ludhiana",
    "manufacture",
    "since 2006"
];

console.log("\n--- Searching Clean Content ---");
targets.forEach(t => {
    const found = cleanContent.toLowerCase().includes(t.toLowerCase());
    console.log(`${t}: ${found ? '✓ FOUND' : '✗ NOT FOUND'}`);
});

if (cleanContent.toLowerCase().includes("nature's boon")) {
     const index = cleanContent.toLowerCase().indexOf("nature's boon");
     console.log("\n--- Match Snippet ---");
     console.log(cleanContent.substring(index - 100, index + 200));
}
