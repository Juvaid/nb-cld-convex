import { execSync } from "child_process";
import fs from 'fs';

async function run() {
  try {
    const blogs = JSON.parse(fs.readFileSync('tmp/single_blog.json', 'utf8'));
    console.log("Attempting to import 1 blog via npx convex run...");
    
    // Create a temporary file for the arguments to avoid command line length limits
    const args = { blogs };
    fs.writeFileSync('tmp/import_args.json', JSON.stringify(args));
    
    const output = execSync('npx convex run blogs:batchImportSeoBlogs --prod tmp/import_args.json', { encoding: 'utf8' });
    console.log("Output:", output);
  } catch (err) {
    console.error("Import failed:");
    console.error(err.stdout || err.message);
  } finally {
    process.exit();
  }
}

run();

