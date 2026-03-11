export const dynamic = "force-dynamic";

import { EditorClient } from "@/components/puck/EditorClient";

interface EditorPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditorPage({
    searchParams,
}: EditorPageProps) {
    const params = await searchParams;
    const path = typeof params.path === "string" ? params.path : "/";

    return <EditorClient path={path} />;
}
