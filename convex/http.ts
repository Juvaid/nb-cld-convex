import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/ingestPage",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await request.json();
        const { path, title, data } = body;

        await ctx.runMutation(api.ingestion_mutations.saveIngestedPage, {
            path,
            title,
            data,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
});

export default http;
