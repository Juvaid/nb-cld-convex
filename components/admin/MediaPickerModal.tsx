"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Search, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { Flex } from "@/components/ui/Flex";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";

interface MediaPickerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (imageIds: string[]) => void;
    selectedIds: string[];
}

export function MediaPickerModal({ isOpen, onClose, onSelect, selectedIds }: MediaPickerModalProps) {
    const media = useQuery(api.media.listAll);
    const [searchQuery, setSearchQuery] = useState("");
    const [localSelected, setLocalSelected] = useState<string[]>([]);

    if (!isOpen) return null;

    const filteredMedia = media?.filter(item =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const toggleSelect = (id: string) => {
        setLocalSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        // Find storage IDs of localSelected items that aren't already in selectedIds
        const selectedItems = filteredMedia.filter(item => localSelected.includes(item._id));
        const newStorageIds = selectedItems.map(item => item.storageId);

        onSelect(newStorageIds);
        onClose();
        setLocalSelected([]);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                <Flex justify="between" align="center" className="p-6 border-b border-slate-100">
                    <Typography variant="h3" className="text-slate-900 font-black">Browse Media</Typography>
                    <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full w-10 h-10 px-0">
                        <X className="w-5 h-5 text-slate-400" />
                    </Button>
                </Flex>

                <div className="p-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search your library..."
                            className="pl-10 bg-white border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-6 min-h-[300px]">
                    {!media ? (
                        <Flex direction="col" align="center" justify="center" className="h-full py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-nb-green mb-3" />
                            <Typography variant="small" className="text-slate-400 font-bold uppercase tracking-widest">Accessing Library...</Typography>
                        </Flex>
                    ) : filteredMedia.length === 0 ? (
                        <Flex direction="col" align="center" justify="center" className="h-full py-20 text-slate-300">
                            <ImageIcon className="w-12 h-12 mb-3 opacity-20" />
                            <Typography variant="body" className="font-bold">No assets found</Typography>
                        </Flex>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {filteredMedia.map((item) => {
                                const isAlreadyAdded = selectedIds.includes(item.storageId);
                                const isSelected = localSelected.includes(item._id);

                                return (
                                    <div
                                        key={item._id}
                                        onClick={() => !isAlreadyAdded && toggleSelect(item._id)}
                                        className={`aspect-square rounded-xl border-2 overflow-hidden relative cursor-pointer transition-all group ${isAlreadyAdded ? 'opacity-50 cursor-not-allowed border-slate-100' :
                                            isSelected ? 'border-nb-green ring-4 ring-nb-green/10' : 'border-slate-100 hover:border-slate-200'
                                            }`}
                                    >
                                        <img src={item.url} className="w-full h-full object-cover" alt="" />

                                        {isAlreadyAdded && (
                                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                <Typography variant="detail" className="font-black text-[9px] uppercase tracking-tighter text-slate-500">Already Added</Typography>
                                            </div>
                                        )}

                                        {!isAlreadyAdded && isSelected && (
                                            <div className="absolute inset-0 bg-nb-green/20 flex items-center justify-center">
                                                <div className="w-8 h-8 bg-nb-green text-slate-900 rounded-full flex items-center justify-center shadow-lg transform scale-110">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                            <Typography variant="detail" className="text-white text-[9px] truncate tracking-tight">{item.filename}</Typography>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <Flex justify="between" align="center" className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                    <Typography variant="small" className="text-slate-500 font-medium">
                        {localSelected.length} {localSelected.length === 1 ? 'asset' : 'assets'} selected
                    </Typography>
                    <Flex gap="3">
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        <Button
                            className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold px-8 shadow-sm"
                            disabled={localSelected.length === 0}
                            onClick={handleConfirm}
                        >
                            Add to Product
                        </Button>
                    </Flex>
                </Flex>
            </div>
        </div>
    );
}
