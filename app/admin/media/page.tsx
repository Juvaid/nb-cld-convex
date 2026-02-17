"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Image as ImageIcon, Search, UploadCloud, Grid, List, Loader2, ArrowUpDown, Calendar, SortAsc, SortDesc, Eye, Trash2, Copy, Check, X, ExternalLink } from "lucide-react";
import { useState, useMemo, useRef } from "react";
import { useUpload } from "@/hooks/useUpload";
import { motion, AnimatePresence } from "framer-motion";

export default function MediaAdmin() {
    const media = useQuery(api.media.listAll);
    const removeMedia = useMutation(api.media.remove);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("newest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [previewImage, setPreviewImage] = useState<{ url: string; filename: string } | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const { uploadFile, isUploading } = useUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const success = await uploadFile(file);
            if (success && fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleCopyLink = (item: any) => {
        navigator.clipboard.writeText(item.url);
        setCopiedId(item._id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDelete = async (id: any) => {
        if (confirm("Are you sure you want to permanently delete this asset?")) {
            await removeMedia({ id });
        }
    };

    const filteredMedia = useMemo(() => {
        if (!media) return [];
        let result = [...media];
        if (searchQuery) {
            result = result.filter(item =>
                item.filename.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        result.sort((a, b) => {
            switch (sortBy) {
                case "name-asc": return a.filename.localeCompare(b.filename);
                case "name-desc": return b.filename.localeCompare(a.filename);
                case "newest": return b._creationTime - a._creationTime;
                case "oldest": return a._creationTime - b._creationTime;
                default: return 0;
            }
        });
        return result;
    }, [media, searchQuery, sortBy]);

    return (
        <div className="space-y-6 font-outfit admin-media-custom">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Media Library</h1>
                    <p className="text-slate-500 font-medium">Manage and browse your {media?.length || 0}+ brand assets.</p>
                </div>
                <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    accept="image/*"
                    title="Upload file"
                />

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2 bg-nb-green text-slate-900 px-6 py-2.5 rounded-xl font-black shadow-lg shadow-nb-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                    {isUploading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <UploadCloud size={20} />
                    )}
                    {isUploading ? "Uploading..." : "Upload Files"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        title="Search assets"
                        aria-label="Search assets"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green focus:bg-white transition-all font-medium"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl bg-slate-50">
                        <ArrowUpDown size={16} className="text-slate-400" />
                        <select
                            title="Sort media by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                        </select>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-nb-green' : 'text-slate-400 hover:text-slate-600'}`}
                            title="Grid view"
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-nb-green' : 'text-slate-400 hover:text-slate-600'}`}
                            title="List view"
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {!media ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-nb-green mb-4" size={40} />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Brand Assets...</p>
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <ImageIcon className="text-slate-100 mb-4" size={60} />
                    <p className="text-slate-500 font-black">
                        {searchQuery ? `No assets matching "${searchQuery}"` : "Your library is empty."}
                    </p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {filteredMedia.map((item) => (
                        <div key={item._id} className="aspect-square bg-white border border-slate-100 rounded-2xl overflow-hidden group relative transition-all hover:shadow-2xl hover:shadow-nb-green/10 cursor-default">
                            <img
                                src={item.url}
                                alt={item.filename}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                <button
                                    onClick={() => setPreviewImage({ url: item.url, filename: item.filename })}
                                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-nb-green transition-colors"
                                    title="Preview"
                                >
                                    <Eye size={24} />
                                </button>
                                <button
                                    onClick={() => handleCopyLink(item)}
                                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-nb-green transition-colors"
                                    title="Copy Link"
                                >
                                    {copiedId === item._id ? <Check size={24} className="text-nb-green" /> : <Copy size={24} />}
                                </button>
                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={24} />
                                </button>
                            </div>

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white text-[10px] font-black truncate uppercase tracking-wider">{item.filename}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">Filename</th>
                                <th className="px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMedia.map((item) => (
                                <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-3">
                                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                                            <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-3">
                                        <p className="font-black text-slate-700">{item.filename}</p>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{new Date(item._creationTime).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-3">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setPreviewImage({ url: item.url, filename: item.filename })}
                                                className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 hover:border-nb-green/20 rounded-xl transition-all shadow-sm"
                                                title="Preview"
                                            >
                                                <Eye size={20} />
                                            </button>
                                            <button
                                                onClick={() => handleCopyLink(item)}
                                                className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 hover:border-nb-green/20 rounded-xl transition-all shadow-sm"
                                                title="Copy Link"
                                            >
                                                {copiedId === item._id ? <Check size={20} className="text-nb-green" /> : <Copy size={20} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-red-500 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setPreviewImage(null)}
                        className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-8 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[40px] overflow-hidden max-w-5xl w-full relative shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/20"
                        >
                            <button
                                onClick={() => setPreviewImage(null)}
                                title="Close preview"
                                className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 hover:scale-110 active:scale-95 transition-all z-10"
                            >
                                <X size={24} />
                            </button>
                            <div className="flex flex-col md:flex-row h-[70vh]">
                                <div className="flex-grow bg-slate-50 relative overflow-hidden group">
                                    <img
                                        src={previewImage.url}
                                        alt={previewImage.filename}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                                <div className="w-full md:w-80 p-10 flex flex-col justify-between border-l border-slate-100">
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 mb-2 truncate" title={previewImage.filename}>{previewImage.filename}</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">Asset Preview</p>

                                        <div className="space-y-4">
                                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Direct URL</p>
                                                <p className="text-xs font-medium text-slate-600 truncate mb-3">{previewImage.url}</p>
                                                <button
                                                    onClick={() => handleCopyLink({ url: previewImage.url, _id: 'preview' })}
                                                    className="w-full py-3 bg-white border border-slate-100 rounded-xl text-xs font-black text-slate-700 flex items-center justify-center gap-2 hover:border-nb-green hover:text-nb-green transition-all"
                                                >
                                                    {copiedId === 'preview' ? <Check size={14} /> : <Copy size={14} />}
                                                    {copiedId === 'preview' ? "COPIED" : "COPY URL"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <a
                                            href={previewImage.url}
                                            target="_blank"
                                            className="flex-grow py-4 bg-slate-900 text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                                        >
                                            <ExternalLink size={14} />
                                            OPEN ORIGINAL
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-nb-green/5 border border-nb-green/10 rounded-3xl p-8 text-center">
                <p className="text-slate-500 font-bold text-sm">
                    NatureBoon Asset Syncer is active.
                    {media ? ` Displaying ${filteredMedia.length} verified brand assets.` : ""}
                </p>
            </div>
        </div>
    );
}
