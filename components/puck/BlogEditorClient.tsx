"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, Save, Globe, Settings, X, Image as ImageIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { ImagePicker } from "@/components/ImagePicker";
import ReactMarkdown from "react-markdown";

interface BlogEditorClientProps {
    id: Id<"blogs">;
}

export function BlogEditorClient({ id }: BlogEditorClientProps) {
    const router = useRouter();
    const { token } = useAuth();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loadedId, setLoadedId] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Metadata
    const [author, setAuthor] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [coverImage, setCoverImage] = useState("");

    const [viewMode, setViewMode] = useState<"write" | "preview">("write");

    const blog = useQuery(api.blogs.getBlogById, { id });
    const updateBlog = useMutation(api.blogs.updateBlog);

    // Debounce timer ref
    const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (blog && loadedId !== blog._id) {
            let initialContent = blog.content || "";
            // Extract from puck format if needed
            if (initialContent.startsWith("{") && initialContent.includes('"content"')) {
                try {
                    const parsedData = JSON.parse(initialContent);
                    initialContent = parsedData.content
                        ?.map((block: any) => block.props?.text || "")
                        .join("\n\n") || "";
                } catch (e) {
                    console.error("Failed to parse legacy JSON blog content", e);
                }
            }

            setTitle(blog.title || "");
            setContent(initialContent);
            setAuthor(blog.author || "");
            setExcerpt(blog.excerpt || "");
            setCoverImage(blog.coverImage || "");

            setLoadedId(blog._id);
            setSaveStatus("saved");
        }
    }, [blog, loadedId]);

    const handleAutoSave = useCallback((newTitle: string, newContent: string) => {
        setSaveStatus("saving");

        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }

        saveTimerRef.current = setTimeout(async () => {
            try {
                await updateBlog({
                    id,
                    title: newTitle,
                    content: newContent,
                    token: token ?? undefined,
                });
                setSaveStatus("saved");
            } catch (error) {
                console.error("Auto-save failed:", error);
                setSaveStatus("unsaved");
            }
        }, 1000); // 1 second debounce
    }, [id, updateBlog]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        setSaveStatus("unsaved");
        handleAutoSave(e.target.value, content);
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setSaveStatus("unsaved");
        handleAutoSave(title, e.target.value);
    };

    const handlePublish = async () => {
        setSaveStatus("saving");
        try {
            await updateBlog({
                id,
                title,
                content,
                status: "published",
                token: token ?? undefined,
            });
            setSaveStatus("saved");
        } catch (error) {
            console.error("Publish failed:", error);
            setSaveStatus("unsaved");
        }
    };

    const handleSaveSettings = async () => {
        setSaveStatus("saving");
        try {
            await updateBlog({
                id,
                author,
                excerpt,
                coverImage,
                token: token ?? undefined,
            });
            setSaveStatus("saved");
            setIsSettingsOpen(false);
        } catch (error) {
            console.error("Settings save failed:", error);
            setSaveStatus("unsaved");
        }
    };

    if (blog === undefined || loadedId !== id) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-nb-green" />
                <span className="text-slate-500 font-bold">Loading Editor...</span>
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
        <div className="min-h-screen w-full bg-[#f8f9fa] flex flex-col font-outfit">
            {/* Top Navigation Bar */}
            <div className="h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push("/admin/blogs")}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Back to Blogs"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode("write")}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === "write" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setViewMode("preview")}
                            className={`px-4 py-1.5 text-sm font-bold rounded-md transition-colors ${viewMode === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Preview
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className={`text-xs font-bold ${saveStatus === 'saved' ? 'text-slate-400' : 'text-amber-500 animate-pulse'}`}>
                        {saveStatus === 'saved' ? 'Saved to cloud' : 'Saving...'}
                    </div>

                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                        title="Post Settings"
                    >
                        <Settings size={20} />
                    </button>

                    <div className="h-6 w-px bg-slate-200" />

                    {blog.status === 'draft' && (
                        <button
                            onClick={handlePublish}
                            disabled={saveStatus === "saving"}
                            className="bg-nb-green text-slate-900 px-4 py-2 rounded-lg text-sm font-black shadow-sm shadow-nb-green/20 hover:scale-[1.02] transition-transform disabled:opacity-50"
                        >
                            Publish Post
                        </button>
                    )}
                    {blog.status === 'published' && (
                        <div className="bg-slate-100 text-nb-green px-4 py-2 rounded-lg text-sm font-black flex items-center gap-2">
                            <Globe size={16} />
                            Published
                        </div>
                    )}
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-8 md:p-12">
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    placeholder="Article Title..."
                    className="w-full text-4xl sm:text-5xl font-black text-slate-900 bg-transparent border-none focus:ring-0 placeholder-slate-300 mb-8 p-0"
                />

                {viewMode === "write" ? (
                    <textarea
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start writing your story here (Markdown supported)..."
                        className="w-full min-h-[60vh] text-lg font-medium text-slate-700 bg-transparent border-none focus:ring-0 placeholder-slate-300 resize-none leading-relaxed p-0"
                    />
                ) : (
                    <div className="prose prose-lg prose-slate prose-headings:font-black prose-p:font-medium prose-p:leading-[1.8] prose-a:text-nb-green w-full max-w-full">
                        <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                )}
            </div>

            {/* Settings Drawer */}
            {isSettingsOpen && (
                <>
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]" onClick={() => setIsSettingsOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[200] border-l border-slate-100 flex flex-col font-outfit animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">Post Settings</h3>
                                <p className="text-sm font-bold text-slate-400 mt-1">Configure metadata & cover image</p>
                            </div>
                            <button
                                onClick={() => setIsSettingsOpen(false)}
                                className="p-2 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors"
                                title="Close Settings"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-grow overflow-y-auto p-6 space-y-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Cover Image</label>
                                    <p className="text-[10px] font-bold text-slate-400 italic mt-0.5 ml-1">Hero visual for the article</p>
                                </div>
                                <ImagePicker
                                    value={coverImage}
                                    onChange={setCoverImage}
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Written By</label>
                                <input
                                    type="text"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                    placeholder="Author name..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green font-bold text-slate-700 text-sm"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Article Excerpt</label>
                                    <p className="text-[10px] font-bold text-slate-400 italic mt-0.5 ml-1">Short summary for the blog grid</p>
                                </div>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="A brief summary of the post..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green font-bold text-slate-700 text-sm resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <button
                                onClick={handleSaveSettings}
                                className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-black shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                Save & Close
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
