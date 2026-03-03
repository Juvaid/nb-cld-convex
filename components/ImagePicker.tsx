"use client";

import { useState, useMemo, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Image as ImageIcon, X, Loader2, UploadCloud, Check, ArrowUpDown, Video, FileText, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUpload } from "@/hooks/useUpload";

interface ImagePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function ImagePicker({ value, onChange }: ImagePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("newest");
    const media = useQuery(api.media.listAll);

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

    const filteredMedia = useMemo(() => {
        if (!media) return [];

        let result = [...media];

        // Search
        if (searchQuery) {
            result = result.filter(item =>
                item.filename.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
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

    const handleSelect = (url: string) => {
        onChange(url);
        setIsOpen(false);
    };

    const [editingMetadata, setEditingMetadata] = useState<{ id: string; alt: string; caption: string } | null>(null);

    const handleSaveMetadata = async () => {
        if (!editingMetadata) return;
        // In a real app, you would save this to the database
        console.log("Saving metadata:", editingMetadata);
        setEditingMetadata(null);
    };

    return (
        <div className="flex flex-col gap-2 relative">
            <div
                onClick={() => setIsOpen(true)}
                className={cn(
                    "group relative w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
                    value ? "border-nb-green bg-nb-green/5" : "border-slate-200 hover:border-nb-green hover:bg-slate-50"
                )}
            >
                {value ? (
                    <div className="w-full h-full flex items-center justify-center p-2">
                        {value.match(/\.(mp4|webm|ogg)$/i) || value.includes('video') ? (
                            <div className="relative w-full h-full bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                                <video src={value} className="w-full h-full object-cover" muted loop autoPlay playsInline />
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <Play size={24} className="text-white fill-white" />
                                </div>
                            </div>
                        ) : value.match(/\.(pdf)$/i) || value.includes('pdf') ? (
                            <div className="flex flex-col items-center justify-center gap-2 text-nb-green">
                                <FileText size={40} />
                                <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">Document Selected</span>
                            </div>
                        ) : (
                            <img src={value} alt="Selected" className="w-full h-full object-contain rounded-lg" />
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(true); }}
                                className="bg-white text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:scale-105 transition-transform"
                            >
                                Change
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingMetadata({ id: "current", alt: "", caption: "" });
                                }}
                                className="bg-nb-green text-slate-900 px-3 py-1.5 rounded-lg text-[10px] font-black shadow-lg hover:scale-105 transition-transform"
                            >
                                SEO/Alt
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center font-inter">
                        <div className="w-10 h-10 bg-nb-green/10 text-nb-green rounded-full flex items-center justify-center mx-auto mb-2">
                            <UploadCloud size={20} />
                        </div>
                        <p className="text-xs font-bold text-slate-500">Pick Brand Asset</p>
                    </div>
                )}
            </div>

            {/* Metadata Editor Popup */}
            {editingMetadata && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-[2000] animate-in slide-in-from-bottom-4 duration-200">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Image Metadata</h4>
                        <button
                            onClick={() => setEditingMetadata(null)}
                            className="text-slate-400 hover:text-slate-600"
                            title="Close metadata editor"
                        >
                            <X size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Alt Text (SEO)</label>
                            <input
                                type="text"
                                value={editingMetadata.alt}
                                onChange={(e) => setEditingMetadata({ ...editingMetadata, alt: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:border-nb-green focus:outline-none"
                                placeholder="Describe the image..."
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Caption</label>
                            <textarea
                                value={editingMetadata.caption}
                                onChange={(e) => setEditingMetadata({ ...editingMetadata, caption: e.target.value })}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:border-nb-green focus:outline-none min-h-[60px]"
                                placeholder="Display caption..."
                            />
                        </div>
                        <button
                            onClick={handleSaveMetadata}
                            className="w-full bg-slate-900 text-white py-2 rounded-lg text-[10px] font-black hover:bg-slate-800 transition-colors"
                        >
                            Save Metadata
                        </button>
                    </div>
                </div>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 sm:p-12">
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        onClick={() => setIsOpen(false)}
                    />

                    <div className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Media Library</h2>
                                <p className="text-xs text-slate-500 font-bold tracking-tight">Browse {media?.length || 0} production-ready assets</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close media picker"
                                className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Controls Bar */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex flex-col sm:flex-row items-center gap-4">
                            <div className="relative flex-grow w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search by filename..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green font-bold text-sm"
                                    autoFocus
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl flex-grow sm:flex-grow-0">
                                    <ArrowUpDown size={16} className="text-slate-400" />
                                    <select
                                        title="Sort assets by"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="bg-transparent text-xs font-black text-slate-600 outline-none cursor-pointer pr-4"
                                    >
                                        <option value="newest">Newest</option>
                                        <option value="oldest">Oldest</option>
                                        <option value="name-asc">A-Z</option>
                                        <option value="name-desc">Z-A</option>
                                    </select>
                                </div>

                                <input
                                    type="file"
                                    className="hidden"
                                    ref={fileInputRef}
                                    onChange={handleUpload}
                                    accept="image/*,video/*,application/pdf"
                                    title="Upload brand asset"
                                />

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-xl hover:bg-slate-800 transition-all flex-shrink-0 disabled:opacity-50"
                                >
                                    {isUploading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <UploadCloud size={18} />
                                    )}
                                    {isUploading ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>

                        {/* Media Grid */}
                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                            {!media ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <Loader2 className="animate-spin text-nb-green mb-4" size={48} />
                                    <p className="font-black text-slate-800 text-lg">Indexing Assets</p>
                                    <p className="text-sm text-slate-500">Contacting NatureBoon Media Server...</p>
                                </div>
                            ) : filteredMedia.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                        <ImageIcon size={40} className="text-slate-300" />
                                    </div>
                                    <p className="font-black text-slate-800 text-xl">No assets found</p>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">Adjust your search or upload a new asset to your library.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {filteredMedia.map((item) => (
                                        <div
                                            key={item._id}
                                            onClick={() => handleSelect(item.url)}
                                            className="group relative aspect-square bg-slate-50 rounded-[24px] overflow-hidden cursor-pointer hover:ring-4 hover:ring-nb-green transition-all shadow-sm border border-slate-100 flex items-center justify-center"
                                        >
                                            {item.type.includes('video') ? (
                                                <div className="relative w-full h-full">
                                                    <video src={item.url} className="w-full h-full object-cover" muted />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
                                                        <Video size={32} />
                                                    </div>
                                                </div>
                                            ) : item.type.includes('pdf') ? (
                                                <div className="flex flex-col items-center justify-center gap-2 text-slate-400 group-hover:text-nb-green transition-colors">
                                                    <FileText size={48} />
                                                    <span className="text-[10px] font-black uppercase px-2 text-center break-all">{item.filename}</span>
                                                </div>
                                            ) : (
                                                <img
                                                    src={item.url}
                                                    alt={item.filename}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            )}
                                            {value === item.url && (
                                                <div className="absolute top-3 right-3 bg-nb-green text-slate-900 p-1.5 rounded-full shadow-2xl z-20 border-2 border-white animate-in zoom-in">
                                                    <Check size={16} strokeWidth={4} />
                                                </div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-white text-[10px] font-black truncate tracking-wide max-w-[80%]">{item.filename}</p>
                                                    {item.type.includes('video') && <Video size={12} className="text-white" />}
                                                    {item.type.includes('pdf') && <FileText size={12} className="text-white" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-slate-50 text-center border-t border-slate-100 flex items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-nb-green animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Media Sync Active</span>
                            </div>
                            <div className="w-px h-3 bg-slate-200" />
                            <span className="text-[10px] font-bold text-slate-400 italic">v2.0 Advanced Picker</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
