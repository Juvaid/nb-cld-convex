"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChevronLeft,
    Save,
    Trash2,
    Upload,
    X,
    Loader2,
    Image as ImageIcon,
    Library,
    Plus,
    FileText,
    Leaf
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function ProductEditorPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const isNew = id === "new";

    const product = useQuery(api.products.getById, isNew ? "skip" : { id: id as any });
    const categories = useQuery(api.categories.list);
    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);

    const [formData, setFormData] = useState<any>({
        name: "",
        slug: "",
        description: "",
        price: 0,
        compareAtPrice: 0,
        images: [],
        categoryId: undefined,
        status: "draft",
        sku: "",
        tags: [],
        usp: "",
        moq: 1,
        botanicalName: "",
        extractionMethod: "",
        activeCompounds: "",
        pricingTiers: [],
        documents: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        if (product && !isNew) {
            setFormData({
                name: product.name || "",
                slug: product.slug || "",
                description: product.description || "",
                price: product.price || 0,
                compareAtPrice: product.compareAtPrice || 0,
                images: product.images || [],
                categoryId: product.categoryId,
                status: product.status || "draft",
                sku: product.sku || "",
                tags: product.tags || [],
                usp: product.usp || "",
                moq: product.moq || 1,
                botanicalName: product.botanicalName || "",
                extractionMethod: product.extractionMethod || "",
                activeCompounds: product.activeCompounds || "",
                pricingTiers: product.pricingTiers || [],
                documents: product.documents || [],
            });
            // reset dirtiness when loaded
            setTimeout(() => setHasUnsavedChanges(false), 100);
        }
    }, [product, isNew]);

    const updateField = (field: string, value: any) => {
        setFormData((prev: any) => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(true);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            name,
            slug: isNew ? name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : prev.slug,
        }));
        setHasUnsavedChanges(true);
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                updateField("tags", [...formData.tags, tagInput.trim()]);
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        updateField("tags", formData.tags.filter((t: string) => t !== tag));
    };

    // Tiered Pricing Handlers
    const addPricingTier = () => {
        updateField("pricingTiers", [...formData.pricingTiers, { minQty: 10, price: formData.price }]);
    };
    const updatePricingTier = (index: number, field: "minQty" | "price", value: number) => {
        const newTiers = [...formData.pricingTiers];
        newTiers[index][field] = value;
        updateField("pricingTiers", newTiers);
    };
    const removePricingTier = (index: number) => {
        const newTiers = [...formData.pricingTiers];
        newTiers.splice(index, 1);
        updateField("pricingTiers", newTiers);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isNew) {
                const newId = await createProduct(formData);
                setHasUnsavedChanges(false);
                router.push(`/admin/products/${newId}`);
            } else {
                await updateProduct({ id: id as any, ...formData });
                setHasUnsavedChanges(false);
            }
        } catch (error) {
            console.error(error);
            alert("Error saving product. Please check the console.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct({ id: id as any });
                router.push("/admin/products");
            } catch (error) {
                alert("Error deleting product.");
            }
        }
    };

    if (!isNew && product === undefined) {
        return (
            <Flex align="center" justify="center" className="h-screen bg-[#f3f4f6]">
                <Loader2 className="w-8 h-8 animate-spin text-nb-green" />
            </Flex>
        );
    }

    return (
        <div className="bg-[#f6f6f8] min-h-screen pb-32">
            {/* Sticky Header / Save Bar */}
            <header className="sticky top-0 z-50 bg-[#f6f6f8] border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm transition-all">
                <Flex align="center" gap="4">
                    <Link href="/admin/products" className="w-8 h-8 flex items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                        <ChevronLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <Typography variant="h3" className="font-bold text-slate-900 tracking-tight leading-none mb-1">
                            {isNew ? "Create Product" : formData.name || "Untitled Product"}
                        </Typography>
                        {!isNew && (
                            <Badge variant="outline" className={`text-[10px] uppercase shadow-none font-bold ${formData.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600'}`}>
                                {formData.status}
                            </Badge>
                        )}
                    </div>
                </Flex>

                <Flex align="center" gap="3">
                    {hasUnsavedChanges && (
                        <span className="text-sm font-medium text-amber-600 mr-2 flex items-center animate-in fade-in">
                            <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                            Unsaved changes
                        </span>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/admin/products')}
                        className="text-slate-600 hover:bg-slate-200 h-9 px-4"
                    >
                        Discard
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving || (!hasUnsavedChanges && !isNew)}
                        className={`h-9 px-6 font-medium shadow-sm transition-all ${hasUnsavedChanges || isNew ? 'bg-[#1a1a1a] hover:bg-black text-white' : 'bg-slate-200 text-slate-500'}`}
                    >
                        {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save
                    </Button>
                </Flex>
            </header>

            <div className="max-w-[1000px] mx-auto pt-8 px-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* ---------------- MAIN COLUMN ---------------- */}
                <div className="lg:col-span-2 space-y-6">

                    {/* General Information */}
                    <Card className="shadow-sm border-slate-200 overflow-hidden bg-white rounded-xl">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Title</label>
                                    <Input
                                        placeholder="Short name, e.g. Lavender Essential Oil"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                        className="h-9 focus:ring-nb-green/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Unique Selling Proposition (USP)</label>
                                    <Input
                                        placeholder="e.g. 100% Pure & Therapeutic Grade"
                                        value={formData.usp}
                                        onChange={(e) => updateField("usp", e.target.value)}
                                        className="h-9 focus:ring-nb-green/20"
                                    />
                                    <p className="text-xs text-slate-500">A short punchy line displayed prominently on the product page.</p>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Description</label>
                                    <textarea
                                        rows={6}
                                        className="w-full rounded-md border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green focus:outline-none bg-white transition-shadow"
                                        placeholder="Formulate a detailed description..."
                                        value={formData.description}
                                        onChange={(e) => updateField("description", e.target.value)}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Media */}
                    <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold text-slate-800">Media</CardTitle>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-nb-green hover:bg-nb-green/10" onClick={() => setIsMediaModalOpen(true)}>
                                Add media from URL
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {formData.images.map((img: string, idx: number) => (
                                    <div key={img} className="relative group aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50">
                                        <img
                                            src={typeof img === 'string' && img.startsWith('http') ? img : `/api/storage/${img}`}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                title="Remove image"
                                                onClick={() => updateField("images", formData.images.filter((i: string) => i !== img))}
                                                className="p-1.5 bg-white/20 hover:bg-red-500 rounded text-white transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setIsMediaModalOpen(true)}
                                    className="aspect-square rounded-lg border border-dashed border-slate-300 hover:border-nb-green hover:bg-slate-50 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-500 hover:text-nb-green"
                                >
                                    <Library className="w-6 h-6 mb-2" />
                                    <span className="text-xs font-medium">Browse Library</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <MediaPickerModal
                        isOpen={isMediaModalOpen}
                        onClose={() => setIsMediaModalOpen(false)}
                        onSelect={(imageIds) => {
                            updateField("images", [...formData.images, ...imageIds]);
                        }}
                        selectedIds={formData.images}
                    />

                    {/* Pricing & B2B Inventory */}
                    <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold text-slate-800">Pricing & B2B Rules</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Base Price (₹)</label>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => updateField("price", Number(e.target.value))}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Compare at price (₹)</label>
                                    <Input
                                        type="number"
                                        value={formData.compareAtPrice}
                                        onChange={(e) => updateField("compareAtPrice", Number(e.target.value))}
                                        className="h-9"
                                    />
                                </div>
                            </div>

                            <hr className="border-slate-200" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Minimum Order Qty (MOQ)</label>
                                    <div className="flex items-center">
                                        <Input
                                            type="number"
                                            value={formData.moq}
                                            onChange={(e) => updateField("moq", Number(e.target.value))}
                                            className="h-9 rounded-r-none border-r-0"
                                            min="1"
                                        />
                                        <div className="h-9 px-3 bg-slate-50 border border-slate-300 rounded-r-md flex items-center text-sm text-slate-500 font-medium whitespace-nowrap">
                                            Units
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Flex justify="between" align="center" className="mb-3">
                                    <label className="text-sm font-medium text-slate-800 flex items-center">
                                        Tiered Pricing
                                        <Badge variant="secondary" className="ml-2 text-[10px] font-normal tracking-wider bg-blue-50 text-blue-700 hover:bg-blue-50">B2B Feature</Badge>
                                    </label>
                                    <Button variant="ghost" size="sm" onClick={addPricingTier} className="h-7 text-xs text-nb-green hover:bg-nb-green/10">
                                        <Plus className="w-3 h-3 mr-1" /> Add tier
                                    </Button>
                                </Flex>

                                {formData.pricingTiers.length > 0 ? (
                                    <div className="space-y-2 border border-slate-200 rounded-md p-1 bg-slate-50">
                                        {formData.pricingTiers.map((tier: any, idx: number) => (
                                            <div key={idx} className="flex gap-2 items-center bg-white p-2 rounded border border-slate-200 shadow-sm">
                                                <div className="flex-1 flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 w-16 text-right font-medium">Qty ≥</span>
                                                    <Input
                                                        type="number"
                                                        value={tier.minQty}
                                                        onChange={(e) => updatePricingTier(idx, "minQty", Number(e.target.value))}
                                                        className="h-8 text-sm"
                                                    />
                                                </div>
                                                <div className="flex-1 flex items-center gap-2">
                                                    <span className="text-xs text-slate-500 w-16 text-right font-medium">Price ₹</span>
                                                    <Input
                                                        type="number"
                                                        value={tier.price}
                                                        onChange={(e) => updatePricingTier(idx, "price", Number(e.target.value))}
                                                        className="h-8 text-sm text-nb-green font-bold"
                                                    />
                                                </div>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50" onClick={() => removePricingTier(idx)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="border border-dashed border-slate-300 rounded-md p-6 text-center">
                                        <p className="text-sm text-slate-500 mb-2">Offer discounts for bulk purchases.</p>
                                        <Button variant="outline" size="sm" onClick={addPricingTier} className="h-8 text-xs font-medium">Add first tier</Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Specifications */}
                    <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-600" />
                            <CardTitle className="text-sm font-semibold text-slate-800">Technical Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Botanical Name</label>
                                    <Input
                                        placeholder="e.g. Lavandula angustifolia"
                                        value={formData.botanicalName}
                                        onChange={(e) => updateField("botanicalName", e.target.value)}
                                        className="h-9 italic text-slate-700"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-800">Extraction Method</label>
                                    <Input
                                        placeholder="e.g. Steam Distillation"
                                        value={formData.extractionMethod}
                                        onChange={(e) => updateField("extractionMethod", e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-sm font-medium text-slate-800">Active Compounds / Constituents</label>
                                    <Input
                                        placeholder="e.g. Linalyl acetate, Linalool"
                                        value={formData.activeCompounds}
                                        onChange={(e) => updateField("activeCompounds", e.target.value)}
                                        className="h-9"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Secure Documents */}
                    <Card className="shadow-sm border-slate-200 rounded-xl overflow-hidden bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-blue-600" />
                                <CardTitle className="text-sm font-semibold text-slate-800">Secure Documents (B2B)</CardTitle>
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50">
                                <Upload className="w-3 h-3 mr-1" /> Upload
                            </Button>
                        </CardHeader>
                        <CardContent className="p-6">
                            {formData.documents && formData.documents.length > 0 ? (
                                <div className="space-y-2">
                                    {formData.documents.map((doc: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 rounded-md border border-slate-200 bg-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded shadow-sm">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-700">{doc.name || `Document ${idx + 1}`}</p>
                                                    <p className="text-xs text-slate-500">{doc.type || "PDF Document"}</p>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3">
                                        <FileText className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-800 mb-1">Attach compliant documents</p>
                                    <p className="text-xs text-slate-500 mb-4 max-w-xs">Upload Certificate of Analysis (CoA), Safety Data Sheets (SDS), or technical brochures for B2B buyers.</p>
                                    <Button variant="outline" size="sm" className="h-8 text-xs font-medium">Browse Files</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* ---------------- SIDEBAR COLUMN ---------------- */}
                <div className="space-y-6">

                    {/* Status */}
                    <Card className="shadow-sm border-slate-200 rounded-xl bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold text-slate-800">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <select
                                title="Product Status"
                                className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-sm font-medium outline-none focus:border-nb-green"
                                value={formData.status}
                                onChange={(e) => updateField("status", e.target.value)}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </CardContent>
                    </Card>

                    {/* Organization */}
                    <Card className="shadow-sm border-slate-200 rounded-xl bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold text-slate-800">Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Category</label>
                                <select
                                    title="Choose category"
                                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-md text-sm outline-none focus:border-nb-green"
                                    value={formData.categoryId || ""}
                                    onChange={(e) => updateField("categoryId", e.target.value || undefined)}
                                >
                                    <option value="">None</option>
                                    {categories?.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <hr className="border-slate-100 pl-4 ml-[-1rem] pr-4 mr-[-1rem]" />

                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-500">Tags</label>
                                <Input
                                    placeholder="Add tag and press Enter"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    className="h-9 text-sm"
                                />
                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                        {formData.tags.map((tag: string) => (
                                            <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                                                {tag}
                                                <button title="Remove tag" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-700">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Inventory */}
                    <Card className="shadow-sm border-slate-200 rounded-xl bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold text-slate-800">Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-1.5">
                            <label className="text-xs font-medium text-slate-500">SKU (Stock Keeping Unit)</label>
                            <Input
                                value={formData.sku}
                                onChange={(e) => updateField("sku", e.target.value)}
                                className="h-9 font-mono text-sm"
                                placeholder="NB-VAR-001"
                            />
                        </CardContent>
                    </Card>

                    {/* SEO */}
                    <Card className="shadow-sm border-slate-200 rounded-xl bg-white">
                        <CardHeader className="py-4 px-6 border-b border-slate-100">
                            <CardTitle className="text-sm font-semibold text-slate-800">Search engine listing</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <div>
                                <h4 className="text-sm font-medium text-blue-800 line-clamp-1 truncate">{formData.name || "Product Title"}</h4>
                                <p className="text-xs text-emerald-700 truncate">https://store.com/products/{formData.slug || "product-slug"}</p>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{formData.description || "Product description will appear here..."}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-100">
                                <label className="text-xs font-medium text-slate-500">URL handle</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => updateField("slug", e.target.value)}
                                    className="h-8 font-mono text-xs mt-1 bg-slate-50"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {!isNew && (
                        <div className="pt-4 flex justify-center">
                            <Button variant="ghost" onClick={handleDelete} className="text-red-500 hover:bg-red-50 hover:text-red-600 text-sm h-9">
                                Delete Product entirely
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
