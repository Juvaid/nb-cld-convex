"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
    Image as ImageIcon, Search, UploadCloud, Grid, List, Loader2,
    ArrowUpDown, Eye, Trash2, Copy, Check, X, ExternalLink,
    CheckCircle2, AlertCircle, FolderOpen, Plus, ChevronDown,
    Slash, Move, Square, CheckSquare
} from "lucide-react";
import { useState, useMemo, useRef, useCallback } from "react";
import { useUpload, FileUploadState } from "@/hooks/useUpload";
import { motion, AnimatePresence } from "framer-motion";

// ─── Confirmation Dialog ─────────────────────────────────────────────────────
function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel,
    dangerous,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    dangerous?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl"
                    >
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-slate-500 text-sm font-normal mb-8 leading-relaxed">{message}</p>
                        <div className="flex gap-3">
                            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                            <button
                                onClick={onConfirm}
                                className={`flex-1 py-3 rounded-xl font-semibold text-sm transition-colors ${dangerous ? "bg-red-500 hover:bg-red-600 text-white" : "bg-nb-green hover:bg-nb-green-deep text-slate-900"}`}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Move-to-Folder Modal ────────────────────────────────────────────────────
function MoveFolderModal({
    open,
    count,
    existingFolders,
    productNames,
    onMove,
    onCancel,
}: {
    open: boolean;
    count: number;
    existingFolders: string[];
    productNames: string[];
    onMove: (folder: string | undefined) => void;
    onCancel: () => void;
}) {
    const [selected, setSelected] = useState<string>("");
    const [custom, setCustom] = useState("");
    const [isCustom, setIsCustom] = useState(false);

    const allSuggestions = useMemo(() => {
        const defaults = ["Hero", "Products", "Blog", "Services", "Team", "Logos", "Banners"];
        return [...new Set([...defaults, ...existingFolders, ...productNames])].sort();
    }, [existingFolders, productNames]);

    const activeFolder = isCustom ? custom.trim() || undefined : selected || undefined;

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6"
                    onClick={onCancel}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-slate-900">Move {count} file{count !== 1 ? "s" : ""} to…</h3>

                        <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto">
                            <button
                                onClick={() => { setSelected(""); setIsCustom(false); }}
                                className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all text-left ${!selected && !isCustom ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100"}`}
                            >
                                <Slash size={11} className="shrink-0" /> Unfiled
                            </button>
                            {allSuggestions.map((s) => (
                                <button
                                    key={s}
                                    onClick={() => { setSelected(s); setIsCustom(false); }}
                                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all text-left truncate ${selected === s && !isCustom ? "bg-nb-green/10 text-nb-green border-nb-green/20" : "bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100"}`}
                                >
                                    <FolderOpen size={11} className="shrink-0" />
                                    <span className="truncate">{s}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setIsCustom(true)}
                                className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium bg-slate-50 text-slate-400 hover:bg-slate-100 border border-dashed border-slate-200 transition-all"
                            >
                                <Plus size={11} /> New folder
                            </button>
                        </div>

                        {isCustom && (
                            <input
                                autoFocus
                                type="text"
                                placeholder="New folder name…"
                                title="New folder name"
                                value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && onMove(activeFolder)}
                                className="w-full px-3 py-2.5 text-sm border border-nb-green/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 font-medium"
                            />
                        )}

                        <div className="flex gap-3 pt-2">
                            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors">Cancel</button>
                            <button
                                onClick={() => onMove(activeFolder)}
                                className="flex-1 py-3 rounded-xl bg-nb-green text-slate-900 font-medium text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                            >
                                <Move size={14} /> Move
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Upload Progress Toast ────────────────────────────────────────────────────
function UploadProgressPanel({ uploads, onDismiss }: { uploads: FileUploadState[]; onDismiss: () => void }) {
    if (uploads.length === 0) return null;
    const done = uploads.filter((u) => u.status === "done").length;
    const errors = uploads.filter((u) => u.status === "error").length;
    const total = uploads.length;
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 w-80 max-h-72 flex flex-col gap-3"
        >
            <div className="flex items-center justify-between">
                <p className="font-medium text-slate-900 text-sm">Uploading {done}/{total}{errors > 0 && <span className="text-red-500 ml-2">· {errors} failed</span>}</p>
                {done + errors === total && <button onClick={onDismiss} className="text-slate-400 hover:text-slate-600" title="Dismiss"><X size={16} /></button>}
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div className="h-full bg-nb-green rounded-full" animate={{ width: `${((done + errors) / total) * 100}%` }} transition={{ duration: 0.3 }} />
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
                {uploads.map((u, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                        {u.status === "done" ? <CheckCircle2 size={14} className="text-nb-green shrink-0" /> : u.status === "error" ? <AlertCircle size={14} className="text-red-500 shrink-0" /> : <Loader2 size={14} className="animate-spin text-slate-400 shrink-0" />}
                        <span className="truncate font-semibold text-slate-600">{u.file.name}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

// ─── Upload Button with Folder Picker ────────────────────────────────────────
function UploadButton({ disabled, isUploading, folders, productNames, onUpload }: {
    disabled: boolean; isUploading: boolean; folders: string[]; productNames: string[];
    onUpload: (files: File[], folder?: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const [folder, setFolder] = useState("");
    const [custom, setCustom] = useState("");
    const [isCustom, setIsCustom] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const allSuggestions = useMemo(() => {
        const defaults = ["Hero", "Products", "Blog", "Services", "Team", "Logos", "Banners"];
        return [...new Set([...defaults, ...folders, ...productNames])].sort();
    }, [folders, productNames]);

    const activeFolder = isCustom ? custom.trim() || undefined : folder || undefined;

    const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        onUpload(files, activeFolder);
        setOpen(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="relative">
            <button onClick={() => setOpen((o) => !o)} disabled={disabled}
                className="flex items-center gap-2 bg-nb-green text-slate-900 px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-nb-green/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                {isUploading ? <Loader2 size={20} className="animate-spin" /> : <UploadCloud size={20} />}
                {isUploading ? "Uploading…" : "Upload Files"}
                <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 w-72 space-y-3">
                        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">Choose a Folder</p>
                        <div className="grid grid-cols-2 gap-1.5 max-h-44 overflow-y-auto">
                            {allSuggestions.map((s) => (
                                <button key={s} onClick={() => { setFolder(s); setIsCustom(false); }}
                                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all text-left truncate ${folder === s && !isCustom ? "bg-nb-green/10 text-nb-green border border-nb-green/20" : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent"}`}>
                                    <FolderOpen size={12} className="shrink-0" /><span className="truncate">{s}</span>
                                </button>
                            ))}
                            <button onClick={() => setIsCustom(true)}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-50 text-slate-400 hover:bg-slate-100 border border-dashed border-slate-200 transition-all">
                                <Plus size={12} /> Custom
                            </button>
                        </div>
                        {isCustom && (
                            <input autoFocus type="text" placeholder="New folder name…" title="Custom folder name" value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-nb-green/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 font-medium" />
                        )}
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleFiles} accept="image/*,video/mp4,video/webm" multiple title="Upload files" aria-label="Upload files" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium text-sm hover:bg-nb-green hover:text-slate-900 transition-colors">
                            {activeFolder ? `Upload to "${activeFolder}"` : "Upload (no folder)"}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Drop Zone ────────────────────────────────────────────────────────────────
function DropZone({ onFiles, disabled }: { onFiles: (files: File[]) => void; disabled: boolean }) {
    const [dragOver, setDragOver] = useState(false);
    return (
        <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (!disabled) onFiles(Array.from(e.dataTransfer.files)); }}
            className={`border-2 border-dashed rounded-2xl py-7 text-center transition-all ${dragOver ? "border-nb-green bg-nb-green/5 scale-[1.01]" : "border-slate-200 bg-slate-50/50"} ${disabled ? "opacity-50" : "cursor-pointer"}`}>
            <UploadCloud size={22} className={`mx-auto mb-1.5 ${dragOver ? "text-nb-green" : "text-slate-300"}`} />
            <p className="text-slate-400 font-medium text-sm">Drop files here to upload</p>
            <p className="text-slate-300 text-xs mt-0.5">Images & videos · files go into the active folder</p>
        </div>
    );
}

// ─── Folder Tabs ─────────────────────────────────────────────────────────────
function FolderTabs({ folders, active, onChange }: { folders: string[]; active: string; onChange: (f: string) => void }) {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[{ label: "All Files", value: "" }, { label: "Unfiled", value: "__none" }].map(({ label, value }) => (
                <button key={value} onClick={() => onChange(value)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${active === value ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"}`}>
                    {label}
                </button>
            ))}
            {folders.map((f) => (
                <button key={f} onClick={() => onChange(f)}
                    className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${active === f ? "bg-nb-green text-slate-900 border-nb-green" : "bg-white text-slate-500 border-slate-100 hover:border-nb-green/30"}`}>
                    <FolderOpen size={11} /> {f}
                </button>
            ))}
        </div>
    );
}

// ─── Bulk Action Bar ─────────────────────────────────────────────────────────
function BulkActionBar({ count, total, onSelectAll, onClear, onDelete, onMove }: {
    count: number; total: number; onSelectAll: () => void; onClear: () => void;
    onDelete: () => void; onMove: () => void;
}) {
    return (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 bg-slate-900 text-white rounded-2xl px-5 py-3 shadow-2xl">
            <button onClick={onClear} className="text-slate-400 hover:text-white transition-colors" title="Clear selection"><X size={16} /></button>
            <span className="font-medium text-sm">{count} selected</span>
            <div className="flex-1" />
            {count < total && (
                <button onClick={onSelectAll} className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors">
                    <CheckSquare size={14} /> Select all {total}
                </button>
            )}
            <button onClick={onMove}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                <Move size={14} /> Move to folder
            </button>
            <button onClick={onDelete}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-red-500/80 hover:bg-red-500 rounded-xl transition-colors">
                <Trash2 size={14} /> Delete {count}
            </button>
        </motion.div>
    );
}

// ─── Checkbox Component ───────────────────────────────────────────────────────
function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
    return (
        <button onClick={(e) => { e.stopPropagation(); onChange(); }}
            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${checked ? "bg-nb-green border-nb-green" : "bg-white/80 border-white/60 hover:border-nb-green"}`}
            title={checked ? "Deselect" : "Select"}>
            {checked && <Check size={12} className="text-slate-900" strokeWidth={3} />}
        </button>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MediaAdmin() {
    const media = useQuery(api.media.listAll);
    const moveManyToFolder = useMutation(api.media.moveManyToFolder);
    const folders = useQuery(api.media.listFolders) ?? [];

    // Delete via API route so R2 objects are actually removed from Cloudflare
    const apiDelete = async (ids: string[]) => {
        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
        const res = await fetch("/api/media/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "x-auth-token": token } : {}),
            },
            body: JSON.stringify({ ids }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error ?? `Delete failed (${res.status})`);
        }
        return res.json();
    };

    const liveProducts = useQuery(api.products.listAll, { status: "active" });
    const productNames = useMemo(() => (liveProducts ?? []).map((p) => p.name), [liveProducts]);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "newest" | "oldest">("newest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [activeFolder, setActiveFolder] = useState("");
    const [previewImage, setPreviewImage] = useState<{ url: string; filename: string; type: string } | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Selection state
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [confirmDelete, setConfirmDelete] = useState<{ mode: "single" | "bulk"; id?: string } | null>(null);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);

    const { uploadFiles, uploads, isUploading, clearUploads } = useUpload();

    const startUpload = useCallback(async (files: File[], folder?: string) => {
        if (!files.length || isUploading) return;
        clearUploads();
        await uploadFiles(files, folder);
    }, [isUploading, uploadFiles, clearUploads]);

    const handleCopyLink = (item: { url: string; _id: string }) => {
        navigator.clipboard.writeText(item.url);
        setCopiedId(item._id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const toggleSelect = useCallback((id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    }, []);

    const filteredMedia = useMemo(() => {
        if (!media) return [];
        let result = [...media];
        if (activeFolder === "__none") result = result.filter((i) => !(i as any).folder);
        else if (activeFolder) result = result.filter((i) => (i as any).folder === activeFolder);
        if (searchQuery) result = result.filter((i) => i.filename.toLowerCase().includes(searchQuery.toLowerCase()));
        result.sort((a, b) => {
            if (sortBy === "name-asc") return a.filename.localeCompare(b.filename);
            if (sortBy === "name-desc") return b.filename.localeCompare(a.filename);
            if (sortBy === "oldest") return a._creationTime - b._creationTime;
            return b._creationTime - a._creationTime;
        });
        return result;
    }, [media, searchQuery, sortBy, activeFolder]);

    const confirmBulkDelete = async () => {
        if (!confirmDelete) return;
        try {
            if (confirmDelete.mode === "single" && confirmDelete.id) {
                await apiDelete([confirmDelete.id]);
                setSelectedIds((prev) => { const n = new Set(prev); n.delete(confirmDelete.id!); return n; });
            } else {
                await apiDelete(Array.from(selectedIds));
                setSelectedIds(new Set());
            }
        } catch (e) {
            console.error("Delete failed:", e);
        }
        setConfirmDelete(null);
    };

    const handleMove = async (folder: string | undefined) => {
        await moveManyToFolder({ ids: Array.from(selectedIds) as any[], folder });
        setSelectedIds(new Set());
        setShowMoveModal(false);
    };

    const hasSelection = selectedIds.size > 0;

    return (
        <div className="space-y-5 font-outfit admin-media-custom">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Media Library</h1>
                    <p className="text-slate-500 font-medium">Manage and browse your {media?.length || 0}+ brand assets.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => { setIsSelecting((s) => !s); if (isSelecting) setSelectedIds(new Set()); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm border transition-all ${isSelecting ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"}`}
                        title={isSelecting ? "Exit select mode" : "Select files"}
                    >
                        {isSelecting ? <><X size={16} /> Cancel</> : <><CheckSquare size={16} /> Select</>}
                    </button>
                    <UploadButton disabled={isUploading} isUploading={isUploading} folders={folders} productNames={productNames} onUpload={startUpload} />
                </div>
            </div>

            {/* Bulk Action Bar */}
            <AnimatePresence>
                {hasSelection && (
                    <BulkActionBar
                        count={selectedIds.size}
                        total={filteredMedia.length}
                        onSelectAll={() => setSelectedIds(new Set(filteredMedia.map((i) => i._id)))}
                        onClear={() => setSelectedIds(new Set())}
                        onDelete={() => setConfirmDelete({ mode: "bulk" })}
                        onMove={() => setShowMoveModal(true)}
                    />
                )}
            </AnimatePresence>

            {/* Drop Zone */}
            <DropZone onFiles={(files) => startUpload(files, activeFolder || undefined)} disabled={isUploading} />

            {/* Folder Tabs */}
            {folders.length > 0 && <FolderTabs folders={folders} active={activeFolder} onChange={setActiveFolder} />}

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search assets…" aria-label="Search assets" value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green focus:bg-white transition-all font-medium" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 border border-slate-100 rounded-xl bg-slate-50">
                        <ArrowUpDown size={16} className="text-slate-400" />
                        <select title="Sort by" value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} className="bg-transparent text-sm font-bold text-slate-600 outline-none cursor-pointer">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name-asc">Name (A-Z)</option>
                            <option value="name-desc">Name (Z-A)</option>
                        </select>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white shadow-sm text-nb-green" : "text-slate-400"}`} title="Grid view"><Grid size={18} /></button>
                        <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white shadow-sm text-nb-green" : "text-slate-400"}`} title="List view"><List size={18} /></button>
                    </div>
                </div>
            </div>

            {/* Assets */}
            {!media ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Loader2 className="animate-spin text-nb-green mb-4" size={40} />
                    <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Syncing Brand Assets…</p>
                </div>
            ) : filteredMedia.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
                    <ImageIcon className="text-slate-100 mb-4" size={60} />
                    <p className="text-slate-500 font-medium">{searchQuery ? `No assets matching "${searchQuery}"` : activeFolder ? `No files in "${activeFolder}"` : "Your library is empty."}</p>
                </div>
            ) : viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {filteredMedia.map((item) => {
                        const isSelected = selectedIds.has(item._id);
                        return (
                            <div key={item._id}
                                onClick={() => isSelecting && toggleSelect(item._id)}
                                className={`aspect-square bg-white border rounded-2xl overflow-hidden group relative transition-all cursor-default ${isSelected ? "border-nb-green ring-2 ring-nb-green/30 scale-[0.97]" : "border-slate-100 hover:shadow-2xl hover:shadow-nb-green/10"} ${isSelecting ? "cursor-pointer" : ""}`}>
                                {item.type === "video"
                                    ? <video src={item.url} className="w-full h-full object-cover" muted />
                                    : <img src={item.url} alt={item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />}

                                {/* Selection checkbox */}
                                {(isSelecting || isSelected) && (
                                    <div className="absolute top-2 left-2 z-10">
                                        <Checkbox checked={isSelected} onChange={() => toggleSelect(item._id)} />
                                    </div>
                                )}

                                {/* Folder badge */}
                                {(item as any).folder && !isSelecting && (
                                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-lg px-1.5 py-0.5 text-[9px] font-medium text-slate-600">
                                        <FolderOpen size={9} /> {(item as any).folder}
                                    </div>
                                )}

                                {/* Hover actions (hidden during select mode) */}
                                {!isSelecting && (
                                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                                        <button onClick={() => setPreviewImage({ url: item.url, filename: item.filename, type: item.type })} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-nb-green transition-colors" title="Preview"><Eye size={20} /></button>
                                        <button onClick={() => handleCopyLink(item)} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 hover:bg-nb-green transition-colors" title="Copy link">{copiedId === item._id ? <Check size={20} className="text-nb-green" /> : <Copy size={20} />}</button>
                                        <button onClick={() => setConfirmDelete({ mode: "single", id: item._id })} className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors" title="Delete"><Trash2 size={20} /></button>
                                    </div>
                                )}

                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-white text-[9px] font-medium truncate uppercase tracking-wider">{item.filename}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                    {/* Select all row */}
                    {isSelecting && (
                        <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 border-b border-slate-100">
                            <button
                                onClick={() => {
                                    if (selectedIds.size === filteredMedia.length) setSelectedIds(new Set());
                                    else setSelectedIds(new Set(filteredMedia.map((i) => i._id)));
                                }}
                                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
                            >
                                {selectedIds.size === filteredMedia.length ? <CheckSquare size={14} className="text-nb-green" /> : <Square size={14} />}
                                {selectedIds.size === filteredMedia.length ? "Deselect all" : `Select all ${filteredMedia.length}`}
                            </button>
                        </div>
                    )}
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                {isSelecting && <th className="px-6 py-4 w-10" />}
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Asset</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Filename</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Folder</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredMedia.map((item) => {
                                const isSelected = selectedIds.has(item._id);
                                return (
                                    <tr key={item._id}
                                        onClick={() => isSelecting && toggleSelect(item._id)}
                                        className={`transition-colors group ${isSelected ? "bg-nb-green/5" : "hover:bg-slate-50/50"} ${isSelecting ? "cursor-pointer" : ""}`}>
                                        {isSelecting && (
                                            <td className="px-6 py-3">
                                                <Checkbox checked={isSelected} onChange={() => toggleSelect(item._id)} />
                                            </td>
                                        )}
                                        <td className="px-6 py-3"><div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-100"><img src={item.url} alt={item.filename} className="w-full h-full object-cover" /></div></td>
                                        <td className="px-6 py-3">
                                            <p className="font-medium text-slate-700">{item.filename}</p>
                                            <p className="text-[10px] text-slate-400 font-normal uppercase tracking-widest mt-0.5">{new Date(item._creationTime).toLocaleDateString()}</p>
                                        </td>
                                        <td className="px-6 py-3">
                                            {(item as any).folder
                                                ? <span className="flex items-center gap-1 text-xs font-medium text-nb-green bg-nb-green/5 border border-nb-green/10 px-2 py-1 rounded-lg w-fit"><FolderOpen size={11} />{(item as any).folder}</span>
                                                : <span className="text-xs text-slate-300 font-medium">—</span>}
                                        </td>
                                        <td className="px-6 py-3">
                                            {!isSelecting && (
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setPreviewImage({ url: item.url, filename: item.filename, type: item.type })} className="p-2 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 rounded-xl transition-all" title="Preview"><Eye size={18} /></button>
                                                    <button onClick={() => handleCopyLink(item)} className="p-2 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 rounded-xl transition-all" title="Copy">{copiedId === item._id ? <Check size={18} className="text-nb-green" /> : <Copy size={18} />}</button>
                                                    <button onClick={() => setConfirmDelete({ mode: "single", id: item._id })} className="p-2 text-slate-900 bg-white border border-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete"><Trash2 size={18} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Preview Modal */}
            <AnimatePresence>
                {previewImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreviewImage(null)} className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-8 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[40px] overflow-hidden max-w-5xl w-full shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                            <button onClick={() => setPreviewImage(null)} title="Close" className="absolute top-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-slate-900 hover:scale-110 transition-all z-10"><X size={24} /></button>
                            <div className="flex flex-col md:flex-row h-[70vh]">
                                <div className="flex-grow bg-slate-50 flex items-center justify-center">
                                    {previewImage.type === "video"
                                        ? <video src={previewImage.url} controls autoPlay className="w-full h-full object-contain" />
                                        : <img src={previewImage.url} alt={previewImage.filename} className="w-full h-full object-contain" />}
                                </div>
                                <div className="w-full md:w-80 p-10 flex flex-col justify-between border-l border-slate-100">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-2 truncate">{previewImage.filename}</h2>
                                        <p className="text-slate-400 font-normal uppercase tracking-[0.2em] text-[10px] mb-8">Asset Preview</p>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">Direct URL</p>
                                            <p className="text-xs font-medium text-slate-600 truncate mb-3">{previewImage.url}</p>
                                            <button onClick={() => handleCopyLink({ url: previewImage.url, _id: "preview" })} className="w-full py-3 bg-white border border-slate-100 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-center gap-2 hover:border-nb-green hover:text-nb-green transition-all">
                                                {copiedId === "preview" ? <Check size={14} /> : <Copy size={14} />}
                                                {copiedId === "preview" ? "COPIED" : "COPY URL"}
                                            </button>
                                        </div>
                                    </div>
                                    <a href={previewImage.url} target="_blank" className="py-4 bg-slate-900 text-white rounded-2xl font-medium text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                                        <ExternalLink size={14} /> OPEN ORIGINAL
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={!!confirmDelete}
                title={confirmDelete?.mode === "bulk" ? `Delete ${selectedIds.size} files?` : "Delete this file?"}
                message={
                    confirmDelete?.mode === "bulk"
                        ? `You are about to permanently delete ${selectedIds.size} files. This action cannot be undone.`
                        : "This file will be permanently deleted and cannot be recovered."
                }
                confirmLabel={confirmDelete?.mode === "bulk" ? `Delete ${selectedIds.size} files` : "Delete"}
                dangerous
                onConfirm={confirmBulkDelete}
                onCancel={() => setConfirmDelete(null)}
            />

            {/* Move to Folder Modal */}
            <MoveFolderModal
                open={showMoveModal}
                count={selectedIds.size}
                existingFolders={folders}
                productNames={productNames}
                onMove={handleMove}
                onCancel={() => setShowMoveModal(false)}
            />

            {/* Upload Progress Toast */}
            <AnimatePresence>
                {uploads.length > 0 && <UploadProgressPanel uploads={uploads} onDismiss={clearUploads} />}
            </AnimatePresence>

            <div className="bg-nb-green/5 border border-nb-green/10 rounded-3xl p-6 text-center">
                <p className="text-slate-500 font-normal text-sm">
                    NatureBoon Asset Syncer is active.
                    {media ? ` Displaying ${filteredMedia.length} of ${media.length} verified brand assets.` : ""}
                </p>
            </div>
        </div>
    );
}
