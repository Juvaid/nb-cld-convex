const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function inspect() {
    console.log("Starting Inspection...");
    try {
        const paths = ["/", "/services", "/contact", "/about"];

        for (const path of paths) {
            console.log(`\n--- Inspecting: ${path} ---`);
            const page = await client.query("pages:getPage", { path });
            if (!page) {
                console.log("RESULT: Page NOT FOUND");
                continue;
            }

            console.log(`RESULT: Found Page [${page._id}]`);
            console.log(`DB Title: "${page.title}"`);

            try {
                const data = JSON.parse(page.data);
                console.log(`Root Title: "${data.root?.props?.title}"`);

                if (data.content && data.content.length > 0) {
                    const first = data.content[0];
                    console.log(`First Block Type: ${first.type}`);
                    console.log(`First Block ID:   ${first.props?.id}`);
                    if (first.props?.badgeText) console.log(`Badge Text:      "${first.props.badgeText}"`);
                    if (first.props?.heading) console.log(`Heading:         "${first.props.heading}"`);
                } else {
                    console.log("Content: EMPTY");
                }
            } catch (e) {
                console.log("JSON Parse Error:", e.message);
            }
        }

    } catch (err) {
        console.error("FATAL ERROR:", err);
    }
}

inspect().then(() => process.exit(0));
