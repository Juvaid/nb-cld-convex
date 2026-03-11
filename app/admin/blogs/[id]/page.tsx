export const dynamic = "force-dynamic";

import { BlogEditorClient } from "@/components/puck/BlogEditorClient";
import { Id } from "@/convex/_generated/dataModel";

interface BlogEditorPageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogEditorPage({
    params,
}: BlogEditorPageProps) {
    const { id } = await params;

    return <BlogEditorClient id={id as Id<"blogs">} />;
}
