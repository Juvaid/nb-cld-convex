'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Upload, Search, Image as ImageIcon, FileText, Trash2, Check, Loader2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export default function MediaPickerModal({ isOpen, onClose, onSelect, accept = 'image/*' }) {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    const supabase = getSupabase();
    const BUCKET = 'media';

    const fetchFiles = useCallback(async () => {
        if (!supabase) {
            // Demo files when Supabase is not connected
            setFiles([
                { name: 'sample-product.jpg', id: '1', metadata: { size: 245000, mimetype: 'image/jpeg' }, created_at: new Date().toISOString() },
                { name: 'logo.png', id: '2', metadata: { size: 32000, mimetype: 'image/png' }, created_at: new Date().toISOString() },
                { name: 'hero-bg.jpg', id: '3', metadata: { size: 890000, mimetype: 'image/jpeg' }, created_at: new Date().toISOString() },
            ]);
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.storage.from(BUCKET).list('', {
                limit: 100, sortBy: { column: 'created_at', order: 'desc' },
            });
            if (error) throw error;
            setFiles(data || []);
        } catch (err) {
            console.error('Failed to fetch files:', err);
        } finally {
            setLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        if (isOpen) fetchFiles();
    }, [isOpen, fetchFiles]);

    const handleUpload = async (fileList) => {
        if (!fileList?.length) return;

        setUploading(true);
        const file = fileList[0];

        if (!supabase) {
            // Demo mode: simulate upload
            const newFile = {
                name: file.name,
                id: Date.now().toString(),
                metadata: { size: file.size, mimetype: file.type },
                created_at: new Date().toISOString(),
            };
            setFiles(prev => [newFile, ...prev]);
            setUploading(false);
            return;
        }

        try {
            const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
            const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
            if (error) throw error;
            fetchFiles();
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleSelect = () => {
        if (!selectedFile) return;
        if (supabase) {
            const { data } = supabase.storage.from(BUCKET).getPublicUrl(selectedFile.name);
            onSelect(data.publicUrl);
        } else {
            onSelect(`/uploads/${selectedFile.name}`);
        }
        onClose();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        handleUpload(e.dataTransfer.files);
    };

    const filteredFiles = files.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const formatSize = (bytes) => {
        if (!bytes) return '—';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    };

    const isImage = (file) => file.metadata?.mimetype?.startsWith('image/');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Media Library</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Select or upload a file</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Upload zone */}
                <div
                    className={`mx-6 mt-4 border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/40'}`}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('media-upload-input')?.click()}
                >
                    {uploading ? (
                        <div className="flex items-center justify-center gap-2 text-primary">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-semibold">Uploading...</span>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 font-medium">Drop files here or <span className="text-primary font-bold">browse</span></p>
                        </>
                    )}
                    <input
                        id="media-upload-input"
                        type="file"
                        accept={accept}
                        className="hidden"
                        onChange={(e) => handleUpload(e.target.files)}
                    />
                </div>

                {/* Search */}
                <div className="mx-6 mt-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search files..."
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                        />
                    </div>
                </div>

                {/* File grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredFiles.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p className="font-semibold">No files found</p>
                            <p className="text-xs mt-1">Upload your first file above</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                            {filteredFiles.map((file) => (
                                <button
                                    key={file.id || file.name}
                                    onClick={() => setSelectedFile(file)}
                                    className={`relative group rounded-2xl border-2 overflow-hidden aspect-square flex flex-col items-center justify-center p-2 transition-all ${selectedFile?.name === file.name ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    {isImage(file) ? (
                                        <div className="w-full h-full bg-gray-50 rounded-xl flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                    ) : (
                                        <FileText className="w-8 h-8 text-gray-300" />
                                    )}
                                    <span className="absolute bottom-2 left-2 right-2 text-[9px] font-bold text-gray-600 truncate bg-white/80 px-1.5 py-0.5 rounded-lg">
                                        {file.name}
                                    </span>
                                    <span className="absolute top-2 right-2 text-[8px] font-medium text-gray-400">
                                        {formatSize(file.metadata?.size)}
                                    </span>
                                    {selectedFile?.name === file.name && (
                                        <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">{filteredFiles.length} file(s)</span>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                            Cancel
                        </button>
                        <button
                            onClick={handleSelect}
                            disabled={!selectedFile}
                            className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Select File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
