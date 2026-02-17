const { ConvexHttpClient } = require("convex/browser");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function dump() {
    console.log("Dumping DB...");
    const pages = await client.query("pages:listPages");
    const dumpData = pages.map(p => {
        let parsedData = null;
        try {
            parsedData = JSON.parse(p.data);
        } catch (e) {
            parsedData = "ERROR_PARSING_JSON";
        }
        return {
            _id: p._id,
            path: p.path,
            title: p.title,
            // Extract key identifying info from data
            rootTitle: parsedData?.root?.props?.title,
            firstBlockType: parsedData?.content?.[0]?.type,
            badgeText: parsedData?.content?.[0]?.props?.badgeText,
            heading: parsedData?.content?.[0]?.props?.heading,
            heroTitle: parsedData?.content?.[0]?.props?.title,
        };
    });

    fs.writeFileSync("db_dump.json", JSON.stringify(dumpData, null, 2));
    console.log("Dumped to db_dump.json");
}

dump();
