"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Globe, Settings, X } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { ImagePicker } from "@/components/ImagePicker";
import { Puck } from "@puckeditor/core";
import { blogConfig } from "./blog-config";
import "@puckeditor/core/dist/index.css";

interface BlogEditorClientProps {
    id: Id<"blogs">;
}

// Default empty Puck data for new posts
const defaultPuckData = () => ({
    content: [
        {
            type: "TextBlock",
            props: {
                id: "intro-text",
                content: "<p>Start writing your article here...</p>",
                alignment: "left",
                maxWidth: "none",
            },
        },
    ],
    root: { props: {} },
});

// Convert legacy markdown string into a single TextBlock for editing
function markdownToPuckData(markdown: string) {
    // Wrap old markdown in a TextBlock as plain text
    // so it appears in the editor and can be re-edited
    const escaped = markdown
        .split("\n")
        .map((l) => `<p>${l.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>`)
        .join("");
    return {
        content: [
            {
                type: "TextBlock",
                props: {
                    id: "migrated-content",
                    content: escaped,
                    alignment: "left",
                    maxWidth: "none",
                },
            },
        ],
        root: { props: {} },
    };
}

export function BlogEditorClient({ id }: BlogEditorClientProps) {
    const router = useRouter();
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [puckData, setPuckData] = useState<any>(null);
    const [loadedId, setLoadedId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Metadata
    const [author, setAuthor] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");
    const [keywords, setKeywords] = useState("");

    const blog = useQuery(api.blogs.getBlogById, { id });
    const updateBlog = useMutation(api.blogs.updateBlog);
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (blog && loadedId !== blog._id) {
            const raw = blog.content || "";

            let parsed: any = null;
            if (raw.trim().startsWith("{")) {
                try {
                    const attempt = JSON.parse(raw);
                    if (attempt.content && Array.isArray(attempt.content)) {
                        parsed = attempt;
                    }
                } catch {}
            }

            // If valid Puck JSON, use it; if legacy markdown, wrap it
            setPuckData(parsed || (raw.trim() ? markdownToPuckData(raw) : defaultPuckData()));

            setTitle(blog.title || "");
            setAuthor(blog.author || "");
            setExcerpt(blog.excerpt || "");
            setCoverImage(blog.coverImage || "");
            setKeywords((blog as any).keywords || "");
            setLoadedId(blog._id);
            setSaveStatus("saved");
        }
    }, [blog, loadedId]);

    const debouncedSave = useCallback(
        (newTitle: string, newContent: string) => {
            setSaveStatus("saving");
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(async () => {
                try {
                    await updateBlog({
                        id,
                        title: newTitle,
                        content: newContent,
                        token: token ?? undefined,
                    });
                    setSaveStatus("saved");
                } catch {
                    setSaveStatus("unsaved");
                }
            }, 1200);
        },
        [id, updateBlog, token]
    );

    const handlePuckChange = (data: any) => {
        setPuckData(data);
        setSaveStatus("unsaved");
        debouncedSave(title, JSON.stringify(data));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setSaveStatus("unsaved");
        if (puckData) debouncedSave(e.target.value, JSON.stringify(puckData));
    };

    const handlePublish = async () => {
        try {
            await updateBlog({
                id,
                title,
                content: JSON.stringify(puckData),
                author,
                excerpt,
                coverImage,
                status: "published",
                token: token ?? undefined,
            });
            setSaveStatus("saved");
        } catch (err) {
            console.error("Failed to publish:", err);
        }
    };

    const handleSaveSettings = async () => {
        try {
            await updateBlog({
                id,
                author,
                excerpt,
                coverImage,
                token: token ?? undefined,
            });
            setIsSettingsOpen(false);
        } catch (err) {
            console.error("Failed to save settings:", err);
        }
    };

    if (!blog || !puckData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-nb-green" size={32} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white flex flex-col">
            {/* Top bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => router.push("/admin/blogs")}
                        className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors"
                        title="Back to blogs"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div className="hidden sm:block">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                            {saveStatus === "saving"
                                ? "Saving…"
                                : saveStatus === "unsaved"
                                ? "Unsaved changes"
                                : "All changes saved"}
                        </p>
                    </div>
                </div>

                <input
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Article title…"
                    className="flex-1 text-lg font-black text-slate-900 bg-transparent border-none focus:ring-0 placeholder-slate-300 text-center"
                />

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors"
                        title="Post settings"
                    >
                        <Settings size={18} />
                    </button>
                    <button
                        onClick={handlePublish}
                        className="flex items-center gap-2 bg-nb-green text-white px-4 py-2 rounded-xl font-black text-sm hover:bg-nb-green-deep transition-colors shadow-sm"
                    >
                        <Globe size={14} />
                        Publish
                    </button>
                </div>
            </div>

            {/* Puck editor */}
            <div className="flex-1">
                <Puck
                    config={blogConfig}
                    data={puckData}
                    onChange={handlePuckChange}
                    onPublish={handlePublish}
                />
            </div>

            {/* Settings drawer */}
            {isSettingsOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
                        onClick={() => setIsSettingsOpen(false)}
                    />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[200] border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Post Settings</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1">Metadata & cover image</p>
                            </div>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Cover Image
                                </label>
                                <p className="text-[10px] text-slate-400 italic">
                                    Shown as hero background and in social share cards
                                </p>
                                <ImagePicker value={coverImage} onChange={setCoverImage} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green"
                                    placeholder="Nature's Boon Team"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Excerpt
                                </label>
                                <p className="text-[10px] text-slate-400 italic">
                                    Shown on the blogs listing page and in OG previews (max 160 chars)
                                </p>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    rows={3}
                                    maxLength={200}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green resize-none"
                                    placeholder="Brief summary shown in previews…"
                                />
                                <p className="text-[10px] text-slate-400 text-right">{excerpt.length}/200</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">
                                    Keywords
                                </label>
                                <p className="text-[10px] text-slate-400 italic">
                                    Comma separated. Shown as tags on the post.
                                </p>
                                <input
                                    type="text"
                                    value={keywords}
                                    onChange={(e) => setKeywords(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green"
                                    placeholder="face wash, private label, OEM manufacturer"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100">
                            <button
                                onClick={handleSaveSettings}
                                className="w-full flex items-center justify-center gap-2 bg-nb-green text-white py-3 rounded-2xl font-black hover:bg-nb-green-deep transition-colors"
                            >
                                <Save size={16} />
                                Save Settings
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
