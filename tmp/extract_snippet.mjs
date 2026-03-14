import fs from 'fs';

const html = fs.readFileSync('tmp/audit_result.html', 'utf8');

console.log("Searching for 'Your Global Partner in'...");
const index = html.indexOf("Your Global Partner in");
if (index !== -1) {
    console.log("FOUND at index:", index);
    const snippet = html.substring(index - 50, index + 300);
    console.log("Snippet:", snippet);
} else {
    console.log("Text NOT FOUND in HTML.");
}

console.log("\nSearching for all <h tags:");
const hTags = html.match(/<h[1-6][^>]*>/g);
console.log("Found h tags:", hTags || "None");
