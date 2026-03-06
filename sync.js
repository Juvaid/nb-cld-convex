const { execSync } = require('child_process');
require('dotenv').config({ path: '.env.local' });

try {
    console.log("Pushing convex changes...");
    execSync(`npx convex dev --until-success --url ${process.env.CONVEX_SELF_HOSTED_URL} --admin-key "${process.env.CONVEX_ADMIN_KEY.replace(/"/g, '')}"`, { stdio: 'inherit', env: process.env });
    console.log("Successfully pushed changes!");
} catch (e) {
    process.exit(1);
}
