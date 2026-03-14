import fs from 'fs';

const content = fs.readFileSync('tmp/ssr_final_direct.html', 'utf8');

console.log("Searching for alternative error patterns...");

// Broad search for data-msg attributes which Next.js often uses for bailouts
const msgMatch = content.match(/data-msg="([^"]+)"/);
if (msgMatch) {
    console.log("\nFOUND data-msg:");
    console.log(msgMatch[1]);
}

// Search for data-stck (stack trace)
const stckMatch = content.match(/data-stck="([^"]+)"/);
if (stckMatch) {
    console.log("\nFOUND data-stck (head):");
    console.log(stckMatch[1].substring(0, 500));
}

// Search for any mention of "useMemo" or "useQuery" in the source
const hooksMatch = content.match(/(useMemo|useQuery|useContext)[^a-zA-Z]/g);
if (hooksMatch) {
    console.log("\nFound Hook mentions in source:", [...new Set(hooksMatch)]);
}

// Search for "digest"
const digestMatch = content.match(/"digest":"([^"]+)"/);
if (digestMatch) {
    console.log("\nFOUND digest:", digestMatch[1]);
}
