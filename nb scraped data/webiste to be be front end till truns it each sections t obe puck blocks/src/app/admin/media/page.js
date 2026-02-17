'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Upload, Search, Trash2, Download, Copy, Image as ImageIcon,
    FileText, Film, File, Grid, List, Loader2, Check, X, Filter
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/components/admin/Toast';

const BUCKET = 'media';

// Demo files for when Supabase is not connected
const demoFiles = [
    { name: 'product-hero.jpg', id: '1', metadata: { size: 245000, mimetype: 'image/jpeg' }, created_at: '2025-01-15T10:00:00Z' },
    { name: 'nature-boon-logo.png', id: '2', metadata: { size: 32000, mimetype: 'image/png' }, created_at: '2025-01-14T09:30:00Z' },
    { name: 'skincare-banner.jpg', id: '3', metadata: { size: 890000, mimetype: 'image/jpeg' }, created_at: '2025-01-13T15:20:00Z' },
    { name: 'product-catalog.pdf', id: '4', metadata: { size: 1540000, mimetype: 'application/pdf' }, created_at: '2025-01-12T11:45:00Z' },
    { name: 'haircare-promo.mp4', id: '5', metadata: { size: 5200000, mimetype: 'video/mp4' }, created_at: '2025-01-11T08:10:00Z' },
    { name: 'ingredients-list.docx', id: '6', metadata: { size: 78000, mimetype: 'application/docx' }, created_at: '2025-01-10T14:00:00Z' },
];

function getFileIcon(mimetype) {
    if (mimetype?.startsWith('image/')) return <ImageIcon className="w-8 h-8" />;
    if (mimetype?.startsWith('video/')) return <Film className="w-8 h-8" />;
    if (mimetype?.includes('pdf') || mimetype?.includes('doc')) return <FileText className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
}

function formatSize(bytes) {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function MediaLibrary() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [view, setView] = useState('grid');
    const [filter, setFilter] = useState('all');
    const [selected, setSelected] = useState([]);
    const [dragOver, setDragOver] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const supabase = getSupabase();

    const fetchFiles = useCallback(async () => {
        setLoading(true);
        if (!supabase) {
            setFiles(demoFiles);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase.storage.from(BUCKET).list('', {
                limit: 200, sortBy: { column: 'created_at', order: 'desc' },
            });
            if (error) throw error;
            setFiles(data || []);
        } catch (err) {
            console.error('Failed to fetch files:', err);
            showToast('Failed to load files', 'error');
        } finally {
            setLoading(false);
        }
    }, [supabase, showToast]);

    useEffect(() => {
        fetchFiles();
    }, [fetchFiles]);

    const handleUpload = async (fileList) => {
        if (!fileList?.length) return;
        setUploading(true);

        const uploadPromises = Array.from(fileList).map(async (file) => {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;

            if (!supabase) {
                return {
                    name: fileName,
                    id: Date.now().toString() + Math.random(),
                    metadata: { size: file.size, mimetype: file.type },
                    created_at: new Date().toISOString(),
                };
            }

            const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
            if (error) throw error;
            return null;
        });

        try {
            const results = await Promise.all(uploadPromises);
            if (!supabase) {
                setFiles(prev => [...results.filter(Boolean), ...prev]);
            } else {
                await fetchFiles();
            }
            showToast(`${fileList.length} file(s) uploaded successfully`);
        } catch (err) {
            console.error('Upload failed:', err);
            showToast('Upload failed: ' + err.message, 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (fileName) => {
        if (!supabase) {
            setFiles(prev => prev.filter(f => f.name !== fileName));
            setSelected(prev => prev.filter(n => n !== fileName));
            setDeleteConfirm(null);
            showToast('File deleted');
            return;
        }
        try {
            const { error } = await supabase.storage.from(BUCKET).remove([fileName]);
            if (error) throw error;
            setFiles(prev => prev.filter(f => f.name !== fileName));
            setSelected(prev => prev.filter(n => n !== fileName));
            setDeleteConfirm(null);
            showToast('File deleted');
        } catch (err) {
            showToast('Delete failed: ' + err.message, 'error');
        }
    };

    const handleBulkDelete = async () => {
        if (selected.length === 0) return;
        if (!supabase) {
            setFiles(prev => prev.filter(f => !selected.includes(f.name)));
            setSelected([]);
            showToast(`${selected.length} file(s) deleted`);
            return;
        }
        try {
            const { error } = await supabase.storage.from(BUCKET).remove(selected);
            if (error) throw error;
            setFiles(prev => prev.filter(f => !selected.includes(f.name)));
            setSelected([]);
            showToast(`${selected.length} file(s) deleted`);
        } catch (err) {
            showToast('Bulk delete failed: ' + err.message, 'error');
        }
    };

    const handleDownload = (fileName) => {
        if (!supabase) {
            showToast('Download available when Supabase is connected', 'info');
            return;
        }
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        window.open(data.publicUrl, '_blank');
    };

    const handleCopyUrl = (fileName) => {
        if (!supabase) {
            navigator.clipboard.writeText(`/uploads/${fileName}`);
            showToast('URL copied to clipboard');
            return;
        }
        const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        navigator.clipboard.writeText(data.publicUrl);
        showToast('URL copied to clipboard');
    };

    const toggleSelect = (fileName) => {
        setSelected(prev =>
            prev.includes(fileName) ? prev.filter(n => n !== fileName) : [...prev, fileName]
        );
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    };

    // Filtering
    const filteredFiles = files.filter(f => {
        const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
        const mime = f.metadata?.mimetype || '';
        const matchesFilter =
            filter === 'all' ||
            (filter === 'images' && mime.startsWith('image/')) ||
            (filter === 'videos' && mime.startsWith('video/')) ||
            (filter === 'documents' && !mime.startsWith('image/') && !mime.startsWith('video/'));
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-[80vh]">
            <ToastContainer />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
                    <p className="text-gray-500 text-sm mt-1">Upload, manage, and organize your media files.</p>
                </div>
                <div className="flex items-center gap-2">
                    {selected.length > 0 && (
                        <button
                            onClick={handleBulkDelete}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl font-medium text-sm hover:bg-red-600 transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete {selected.length}
                        </button>
                    )}
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Upload Files
                        <input type="file" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
                    </label>
                </div>
            </div>

            {/* Upload drop zone */}
            <div
                className={`mb-6 border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${dragOver ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50/50'}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
            >
                {uploading ? (
                    <div className="flex items-center justify-center gap-3 text-primary">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-sm font-bold">Uploading files...</span>
                    </div>
                ) : (
                    <>
                        <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500 font-medium">Drag and drop files here, or <span className="text-primary font-bold">click to browse</span></p>
                        <p className="text-xs text-gray-400 mt-1">Supports images, videos, PDFs, and documents</p>
                    </>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search files..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter */}
                    <div className="flex items-center bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <button className="p-2 px-3 text-gray-400"><Filter className="w-4 h-4" /></button>
                        {['all', 'images', 'videos', 'documents'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-2 text-xs font-bold capitalize transition-all ${filter === f ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* View toggle */}
                    <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2.5 ${view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2.5 ${view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* File count */}
            <div className="text-xs text-gray-400 font-medium mb-4">
                {filteredFiles.length} file(s) {filter !== 'all' && `(filtered: ${filter})`}
            </div>

            {/* Files */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="text-center py-24 text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="font-bold text-lg">No files found</p>
                    <p className="text-sm mt-1">Upload your first file using the button above</p>
                </div>
            ) : view === 'grid' ? (
                /* Grid View */
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredFiles.map((file) => {
                        const isSelected = selected.includes(file.name);
                        return (
                            <div
                                key={file.id || file.name}
                                className={`group relative bg-white rounded-2xl border-2 overflow-hidden transition-all hover:shadow-lg ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-200'}`}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={() => toggleSelect(file.name)}
                                    className={`absolute top-3 left-3 z-10 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white/80 opacity-0 group-hover:opacity-100'}`}
                                >
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                </button>

                                {/* Thumbnail */}
                                <div className="aspect-square flex items-center justify-center bg-gray-50 text-gray-300 p-4">
                                    {getFileIcon(file.metadata?.mimetype)}
                                </div>

                                {/* Info */}
                                <div className="p-3">
                                    <p className="text-xs font-bold text-gray-800 truncate">{file.name}</p>
                                    <div className="flex items-center justify-between mt-1.5">
                                        <span className="text-[10px] text-gray-400 font-medium">{formatSize(file.metadata?.size)}</span>
                                        <span className="text-[10px] text-gray-400">{formatDate(file.created_at)}</span>
                                    </div>
                                </div>

                                {/* Actions overlay */}
                                <div className="absolute top-3 right-3 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleCopyUrl(file.name)}
                                        className="p-1.5 rounded-lg bg-white/90 shadow-sm hover:bg-white text-gray-500 hover:text-primary"
                                        title="Copy URL"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(file.name)}
                                        className="p-1.5 rounded-lg bg-white/90 shadow-sm hover:bg-white text-gray-500 hover:text-primary"
                                        title="Download"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(file.name)}
                                        className="p-1.5 rounded-lg bg-white/90 shadow-sm hover:bg-white text-gray-500 hover:text-red-500"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* List View */
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {filteredFiles.map((file) => {
                        const isSelected = selected.includes(file.name);
                        return (
                            <div key={file.id || file.name} className="flex items-center gap-4 p-4 hover:bg-gray-50/50 transition-colors group">
                                <button
                                    onClick={() => toggleSelect(file.name)}
                                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300'}`}
                                >
                                    {isSelected && <Check className="w-3 h-3 text-white" />}
                                </button>
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                                    {getFileIcon(file.metadata?.mimetype)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-800 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-400">{file.metadata?.mimetype || 'Unknown type'}</p>
                                </div>
                                <span className="text-xs text-gray-400 font-medium hidden sm:block">{formatSize(file.metadata?.size)}</span>
                                <span className="text-xs text-gray-400 hidden md:block">{formatDate(file.created_at)}</span>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleCopyUrl(file.name)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary" title="Copy URL">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDownload(file.name)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary" title="Download">
                                        <Download className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setDeleteConfirm(file.name)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete File?</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            This will permanently delete <span className="font-bold text-gray-700">{deleteConfirm}</span>. This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm)}
                                className="flex-1 px-5 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
