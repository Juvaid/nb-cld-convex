import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
    path: "/ingestPage",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await request.json();
        const { path, title, data, draftData, description } = body;
        
        await ctx.runMutation(api.ingestion_mutations.saveIngestedPage, {
            path,
            title,
            description,
            draftData: draftData || data,
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
});

http.route({
    path: "/ingestBlog",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const body = await request.json();
        await ctx.runMutation(api.ingestion_mutations.saveIngestedBlog, body);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
});

http.route({
    path: "/uploadDocument",
    method: "POST",
    handler: httpAction(async (ctx, request) => {
        const { name, slug, storageId } = await request.json();
        await ctx.runMutation(api.ingestion_mutations.addDocumentToCategory, {
            name,
            slug,
            storageId,
        });
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }),
});

export default http;
