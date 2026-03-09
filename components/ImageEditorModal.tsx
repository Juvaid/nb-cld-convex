"use client";

import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface ImageEditorModalProps {
    imageUrl: string;
    onClose: () => void;
    onSave: (editedBlob: Blob) => Promise<void>;
}

export type FilterType = 'none' | 'invert' | 'grayscale' | 'sepia';

const createImage = async (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        try {
            // Using a Next.js proxy route to cleanly add Access-Control-Allow-Origin: *
            // bypassing standard Canvas taint CORS security policies globally.
            const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
            const image = new window.Image();
            image.setAttribute('crossOrigin', 'anonymous');

            image.addEventListener('load', () => resolve(image));
            image.addEventListener('error', () => reject(new Error('Failed to load proxy image into Canvas.')));

            image.src = proxyUrl;
        } catch (e) {
            reject(e instanceof Error ? e : new Error(String(e)));
        }
    });
};

export function ImageEditorModal({ imageUrl, onClose, onSave }: ImageEditorModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [filter, setFilter] = useState<FilterType>('none');
    const [isSaving, setIsSaving] = useState(false);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const image = await createImage(imageUrl);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get 2d context for canvas');
            }
            if (!croppedAreaPixels) {
                throw new Error('No crop area defined yet');
            }

            // Set canvas size to the cropped size
            canvas.width = croppedAreaPixels.width;
            canvas.height = croppedAreaPixels.height;

            // Apply filter context
            switch (filter) {
                case 'invert':
                    ctx.filter = 'invert(100%)';
                    break;
                case 'grayscale':
                    ctx.filter = 'grayscale(100%)';
                    break;
                case 'sepia':
                    ctx.filter = 'sepia(100%)';
                    break;
                case 'none':
                default:
                    ctx.filter = 'none';
                    break;
            }

            ctx.drawImage(
                image,
                croppedAreaPixels.x,
                croppedAreaPixels.y,
                croppedAreaPixels.width,
                croppedAreaPixels.height,
                0,
                0,
                croppedAreaPixels.width,
                croppedAreaPixels.height
            );

            // Export canvas as blob
            canvas.toBlob(async (blob) => {
                if (blob) {
                    await onSave(blob);
                    onClose();
                } else {
                    console.error('Canvas is empty');
                }
                setIsSaving(false);
            }, 'image/jpeg', 0.95);

        } catch (e) {
            console.error('Error cropping image:', e instanceof Error ? e.message : e);
            alert(`Error processing image: ${e instanceof Error ? e.message : 'Unknown error'}`);
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 sm:p-6">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden max-h-[95vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 h-[72px]">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <ImageIcon size={20} className="text-nb-green" />
                            Edit Image
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        disabled={isSaving}
                        title="Close Modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[400px]">
                    {/* Cropper Container */}
                    <div className="relative flex-1 bg-slate-100 min-h-[300px] md:min-h-full">
                        <Cropper
                            image={imageUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspectRatio}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                            style={{
                                containerStyle: { backgroundColor: '#f1f5f9' },
                                mediaStyle: {
                                    filter: filter === 'invert' ? 'invert(100%)' :
                                        filter === 'grayscale' ? 'grayscale(100%)' :
                                            filter === 'sepia' ? 'sepia(100%)' : 'none'
                                }
                            }}
                        />
                    </div>

                    {/* Sidebar Controls */}
                    <div className="w-full md:w-80 bg-white border-l border-slate-100 p-6 flex flex-col gap-8 overflow-y-auto">

                        {/* Zoom Controls */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Zoom Level</label>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setZoom(z => Math.max(1, z - 0.1))}
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <input
                                    type="range"
                                    value={zoom}
                                    min={1}
                                    max={3}
                                    step={0.1}
                                    aria-label="Zoom"
                                    title="Zoom level"
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="flex-1 accent-nb-green"
                                />
                                <button
                                    onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Aspect Ratios */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop Ratio</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(
                                    [
                                        { id: 'free', label: 'Free', value: undefined },
                                        { id: '1:1', label: 'Square 1:1', value: 1 },
                                        { id: '16:9', label: '16:9', value: 16 / 9 },
                                        { id: '4:3', label: '4:3', value: 4 / 3 },
                                        { id: '21:9', label: 'Hero 21:9', value: 21 / 9 },
                                    ] as const
                                ).map((r) => (
                                    <button
                                        key={r.id}
                                        onClick={() => setAspectRatio(r.value)}
                                        className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${aspectRatio === r.value
                                            ? 'bg-nb-green/10 border-nb-green text-nb-green'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Effects */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Effects</label>
                            <div className="grid grid-cols-2 gap-2">
                                {(
                                    [
                                        { id: 'none', label: 'Original' },
                                        { id: 'invert', label: 'Invert' },
                                        { id: 'grayscale', label: 'Grayscale' },
                                        { id: 'sepia', label: 'Sepia' },
                                    ] as const
                                ).map((f) => (
                                    <button
                                        key={f.id}
                                        onClick={() => setFilter(f.id)}
                                        className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all border ${filter === f.id
                                            ? 'bg-nb-green/10 border-nb-green text-nb-green'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                            }`}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3 rounded-b-3xl">
                    <Button variant="outline" onClick={onClose} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave} disabled={isSaving} className="min-w-[140px]">
                        {isSaving ? (
                            <>
                                <Loader2 size={16} className="animate-spin mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Check size={16} className="mr-2" />
                                Save as New
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

