async function verify() {
    console.log("Verifying deployment with fetch API...");
    const baseUrl = 'http://localhost:3000';

    try {
        console.log(`Fetching ${baseUrl}...`);
        const home = await fetch(baseUrl);
        console.log(`Home: ${home.status} ${home.statusText}`);

        console.log(`Fetching ${baseUrl}/sitemap.xml...`);
        const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
        console.log(`Sitemap: ${sitemap.status} ${sitemap.statusText}`);
        const sitemapText = await sitemap.text();
        console.log(`Sitemap length: ${sitemapText.length}`);
        if (sitemapText.includes('<urlset')) console.log("✓ Sitemap XML valid");

        const productUrl = `${baseUrl}/best-body-lotion-manufacturers-in-india`;
        console.log(`Fetching ${productUrl}...`);
        const product = await fetch(productUrl);
        console.log(`Product: ${product.status} ${product.statusText}`);
        const productText = await product.text();
        if (productText.includes('<meta name="description"')) console.log("✓ Meta description found");

    } catch (e) {
        console.error("Verification failed:", e);
    }
}

verify();
