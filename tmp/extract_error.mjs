import fs from 'fs';

const fileName = 'tmp/ssr_final_final.html';
if (!fs.existsSync(fileName)) {
    console.error(`File ${fileName} not found!`);
    process.exit(1);
}

const buffer = fs.readFileSync(fileName);
let content = '';

if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
    content = buffer.toString('utf16le');
} else {
    content = buffer.toString('utf8');
}

console.log("File length:", content.length);

// Search for technical error messages
const patterns = [
    /"message":"([^"]+)"/,
    /ReferenceError: [^"<]+/,
    /TypeError: [^"<]+/,
    /Error: [^"<]+/
];

let found = false;
for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
        console.log(`Found pattern match (${pattern}):`);
        console.log(match[0]);
        found = true;
    }
}

if (!found) {
    console.log("No specific error patterns matched.");
}

console.log("--- TAIL OF FILE (Last 2000 chars) ---");
console.log(content.slice(-2000));
