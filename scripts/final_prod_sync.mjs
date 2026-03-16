import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const CONVEX_SITE_URL = "https://calculating-hyena-431.eu-west-1.convex.site"; // Production URL from user
const CONTENT_DIR = "./nb scraped data/extracted_markdown";

function parseFrontmatter(content) {
    const lines = content.split('\n');
    const frontmatter = {};
    let isFrontmatter = false;
    let mdContent = "";

    let startIdx = 0;
    if (lines.length > 0 && lines[0].trim() === '---') {
        isFrontmatter = true;
        startIdx = 1;
    }

    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '---' && isFrontmatter) {
            isFrontmatter = false;
            mdContent = lines.slice(i + 1).join('\n');
            break;
        }
        if (isFrontmatter) {
            const match = line.match(/^(\w+):\s*(.*)$/);
            if (match) {
                frontmatter[match[1]] = match[2].replace(/^["'](.*)["']$/, '$1');
            }
        } else {
            mdContent = lines.slice(i).join('\n');
            break;
        }
    }
    if (mdContent === "" && !isFrontmatter) {
        mdContent = content;
    }
    return { frontmatter, content: mdContent.trim() };
}

async function runSync() {
    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Directory not found: ${CONTENT_DIR}`);
        return;
    }

    const files = fs.readdirSync(CONTENT_DIR);
    console.log(`Found ${files.length} files to sync to production.`);

    for (const file of files) {
        if (!file.endsWith('.md')) continue;

        const filePath = path.join(CONTENT_DIR, file);
        const rawContent = fs.readFileSync(filePath, 'utf-8');
        const { frontmatter, content } = parseFrontmatter(rawContent);

        const type = frontmatter.type || (file.includes('blog') ? 'blog' : 'page');
        const title = frontmatter.title || file.replace('.md', '').replaceAll('-', ' ');
        const slug = frontmatter.slug || file.replace('.md', '');

        // Simple MD to Paragraphs (Convex ingestion wraps this in TextBlock)
        const htmlContent = content.split('\n\n').map(p => p.trim() ? `<p>${p.trim()}</p>` : '').join('');

        if (type === 'blog') {
            const blogData = {
                title,
                slug: slug.startsWith('/') ? slug.substring(1) : slug,
                content: JSON.stringify({
                    content: [
                        {
                            type: "TextBlock",
                            props: {
                                content: htmlContent,
                                align: "left",
                                maxWidth: "1200px"
                            }
                        }
                    ],
                    root: { props: { title } }
                }),
                author: "Nature's Boon Team",
            };

            const res = await fetch(`${CONVEX_SITE_URL}/ingestBlog`, {
                method: "POST",
                body: JSON.stringify(blogData),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                console.log(`✅ Synced Blog: ${title}`);
            } else {
                console.error(`❌ Failed to sync blog: ${title} (${res.status})`);
            }
        } else {
            let pagePath = slug === 'home' ? '/' : `/${slug}`;
            if (!pagePath.startsWith('/')) pagePath = '/' + pagePath;

            const pageData = {
                path: pagePath,
                title,
                data: JSON.stringify({
                    content: [
                        {
                            type: "TextBlock",
                            props: {
                                content: htmlContent,
                                align: "left",
                                maxWidth: "1200px"
                            }
                        }
                    ],
                    root: { props: { title } }
                }),
            };

            const res = await fetch(`${CONVEX_SITE_URL}/ingestPage`, {
                method: "POST",
                body: JSON.stringify(pageData),
                headers: { "Content-Type": "application/json" },
            });
            if (res.ok) {
                console.log(`✅ Synced Page: ${title}`);
            } else {
                console.error(`❌ Failed to sync page: ${title} (${res.status})`);
            }
        }
    }

    console.log("\n🚀 All content pushed to Production.");
}

runSync().catch(console.error);
