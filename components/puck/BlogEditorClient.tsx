"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Globe } from "lucide-react";
import { Data } from "@puckeditor/core";
import { CustomPuckEditor } from "@/components/puck/custom-puck-editor";
import { Id } from "@/convex/_generated/dataModel";

interface BlogEditorClientProps {
    id: Id<"blogs">;
}

export function BlogEditorClient({ id }: BlogEditorClientProps) {
    const router = useRouter();
    const [data, setData] = useState<Data>({ content: [], root: { props: { title: "" } } });
    const [loadedId, setLoadedId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");

    const blog = useQuery(api.blogs.getBlogById, { id });
    const updateBlog = useMutation(api.blogs.updateBlog);

    useEffect(() => {
        if (blog) {
            try {
                const parsed = JSON.parse(blog.content);
                setData(parsed);
                setLoadedId(blog._id);
                setSaveStatus("saved");
            } catch (e) {
                console.error("Failed to parse blog content", e);
                setData({ content: [], root: { props: { title: blog.title || "" } } });
                setLoadedId(blog._id);
            }
        }
    }, [blog]);

    const handleAutoSave = async (newData: Data) => {
        setData(newData);
        setSaveStatus("saving");
        try {
            await updateBlog({
                id,
                content: JSON.stringify(newData),
                title: newData.root.props?.title || blog?.title,
            });
            setSaveStatus("saved");
        } catch (error) {
            console.error("Auto-save failed:", error);
            setSaveStatus("unsaved");
        }
    };

    const handlePublish = async (newData: Data) => {
        setData(newData);
        setSaveStatus("saving");
        try {
            await updateBlog({
                id,
                content: JSON.stringify(newData),
                status: "published",
                title: newData.root.props?.title || blog?.title,
            });
            setSaveStatus("saved");
        } catch (error) {
            console.error("Publish failed:", error);
            setSaveStatus("unsaved");
        }
    };

    if (blog === undefined || loadedId !== id) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-nb-green" />
                <span className="text-slate-500 font-bold">Loading Blog Editor...</span>
            </div>
        );
    }

    if (blog === null) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-black text-slate-900">Blog Post Not Found</h1>
                <button
                    onClick={() => router.push("/admin/blogs")}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-xl"
                >
                    <ArrowLeft size={18} />
                    Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative bg-background">
            <CustomPuckEditor
                key={id}
                data={data}
                onPublish={handlePublish}
                onChange={handleAutoSave}
                currentPath={`/blogs/blog/${blog.slug}`}
                onPathChange={() => { }} // Blogs have fixed slugs based on identity
            />

            {/* Custom Overlay for Blog Identity */}
            <div className="fixed bottom-4 left-4 z-[100] bg-slate-900 text-white px-4 py-2 rounded-2xl shadow-2xl border border-slate-700/50 flex items-center gap-3">
                <div className="w-8 h-8 bg-nb-green rounded-lg flex items-center justify-center text-slate-900">
                    <Globe size={16} />
                </div>
                <div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Editing Post</div>
                    <div className="text-xs font-bold truncate max-w-[150px]">{blog.title}</div>
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${blog.status === 'published' ? 'bg-nb-green/20 text-nb-green' : 'bg-slate-700 text-slate-400'}`}>
                        {blog.status}
                    </span>
                    {blog.status === 'draft' && (
                        <button
                            onClick={() => handlePublish(data)}
                            className="text-[10px] font-black uppercase tracking-widest bg-nb-green text-slate-900 px-2 py-0.5 rounded hover:bg-nb-green/90 transition-colors"
                        >
                            Publish Now
                        </button>
                    )}
                </div>
                <div className="w-px h-6 bg-slate-700" />
                <div className={`text-[10px] font-black uppercase tracking-widest ${saveStatus === 'saved' ? 'text-nb-green' : 'text-amber-400 animate-pulse'}`}>
                    {saveStatus === 'saved' ? 'Synced' : 'Saving...'}
                </div>
            </div>
        </div>
    );
}
