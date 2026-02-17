"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
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
    Plus,
    Library
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ProductEditorPage() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const isNew = id === "new";

    const product = useQuery(api.products.getById, isNew ? "skip" : { id: id as any });
    const categories = useQuery(api.categories.list);
    const createProduct = useMutation(api.products.create);
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);
    const generateUploadUrl = useMutation(api.media.generateUploadUrl);

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
    });

    const [tagInput, setTagInput] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name,
                slug: product.slug,
                description: product.description,
                price: product.price || 0,
                compareAtPrice: product.compareAtPrice || 0,
                images: product.images || [],
                categoryId: product.categoryId,
                status: product.status,
                sku: product.sku || "",
                tags: product.tags || [],
            });
        }
    }, [product]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev: any) => ({
            ...prev,
            name,
            slug: isNew ? name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") : prev.slug,
        }));
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tags.includes(tagInput.trim())) {
                setFormData((prev: any) => ({
                    ...prev,
                    tags: [...prev.tags, tagInput.trim()],
                }));
            }
            setTagInput("");
        }
    };

    const removeTag = (tag: string) => {
        setFormData((prev: any) => ({
            ...prev,
            tags: prev.tags.filter((t: string) => t !== tag),
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (isNew) {
                await createProduct(formData);
                alert("Product created successfully");
                router.push("/admin/products");
            } else {
                await updateProduct({ id: id as any, ...formData });
                alert("Product updated successfully");
            }
        } catch (error) {
            console.error(error);
            alert("Error saving product");
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
                alert("Error deleting product");
            }
        }
    };

    if (!isNew && product === undefined) {
        return (
            <Flex align="center" justify="center" className="h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-nb-green" />
            </Flex>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto pb-24">
            <Flex justify="between" align="center">
                <Link href="/admin/products" className="flex items-center text-slate-500 hover:text-slate-900 transition-colors">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to Products
                </Link>
                <Flex gap="3">
                    {!isNew && (
                        <Button variant="ghost" onClick={handleDelete} className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </Button>
                    )}
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold px-8"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isNew ? "Create Product" : "Save Changes"}
                    </Button>
                </Flex>
            </Flex>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="shadow-sm border-slate-100">
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Typography variant="detail" className="text-slate-500 uppercase tracking-widest font-bold">Standard Details</Typography>
                                <Input
                                    placeholder="Product Name (e.g. Lavender Herbal Shampoo)"
                                    value={formData.name}
                                    onChange={handleNameChange}
                                    className="text-xl font-bold h-12 border-slate-200"
                                />
                                <div className="space-y-1">
                                    <Typography variant="detail" className="text-slate-400">Description</Typography>
                                    <textarea
                                        rows={8}
                                        className="w-full rounded-md border border-slate-200 p-4 text-sm focus:ring-2 focus:ring-nb-green/20 focus:outline-none bg-white"
                                        placeholder="Write a compelling description for your product..."
                                        value={formData.description}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold flex items-center">
                                <ImageIcon className="w-4 h-4 mr-2 text-nb-green" />
                                Product Media
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {formData.images.map((img: string, idx: number) => (
                                    <div key={img} className="relative group aspect-square rounded-xl bg-slate-50 border border-slate-100 overflow-hidden">
                                        <img
                                            src={typeof img === 'string' && img.startsWith('http') ? img : `/api/storage/${img}`}
                                            className="w-full h-full object-cover"
                                            alt=""
                                        />
                                        <button
                                            title="Delete image"
                                            onClick={() => setFormData((prev: any) => ({ ...prev, images: prev.images.filter((i: string) => i !== img) }))}
                                            className="absolute top-2 right-2 p-1.5 bg-white shadow-md rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {idx === 0 && (
                                            <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 text-white text-[9px] font-bold text-center py-1 uppercase tracking-widest">
                                                Cover
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-nb-green hover:bg-nb-green/5 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-nb-green group">
                                    <Upload className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                    {/* For brevity in this demo, actual upload logic would call generateUploadUrl and post to storage */}
                                    <input type="file" className="hidden" />
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsMediaModalOpen(true)}
                                    className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-nb-green hover:bg-nb-green/5 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-nb-green group"
                                >
                                    <Library className="w-6 h-6 mb-2 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-center px-2">Browse Library</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>

                    <MediaPickerModal
                        isOpen={isMediaModalOpen}
                        onClose={() => setIsMediaModalOpen(false)}
                        onSelect={(imageIds) => {
                            setFormData((prev: any) => ({
                                ...prev,
                                images: [...prev.images, ...imageIds]
                            }));
                        }}
                        selectedIds={formData.images}
                    />

                    <Card className="shadow-sm border-slate-100">
                        <CardHeader className="border-b border-slate-50">
                            <CardTitle className="text-sm font-bold text-slate-900">Pricing & Inventory</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Typography variant="detail">Selling Price (₹)</Typography>
                                    <Input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, price: Number(e.target.value) }))}
                                        className="font-bold text-slate-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="detail" className="text-slate-400 italic">Compare at Price (₹)</Typography>
                                    <Input
                                        type="number"
                                        value={formData.compareAtPrice}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, compareAtPrice: Number(e.target.value) }))}
                                        className="text-slate-400 line-through"
                                    />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <Typography variant="detail">SKU (Stock Keeping Unit)</Typography>
                                    <Input
                                        placeholder="e.g. NB-SKIN-001"
                                        value={formData.sku}
                                        onChange={(e) => setFormData((prev: any) => ({ ...prev, sku: e.target.value }))}
                                        className="font-mono"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-slate-100">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold">Status</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <select
                                title="Product Status"
                                className="w-full h-11 px-4 bg-white border border-slate-200 rounded-lg text-sm font-bold focus:ring-2 focus:ring-nb-green/20 outline-none"
                                value={formData.status}
                                onChange={(e) => setFormData((prev: any) => ({ ...prev, status: e.target.value }))}
                            >
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                            <Typography variant="detail" className="mt-3 text-slate-400 leading-relaxed block text-[11px]">
                                {formData.status === "active"
                                    ? "Active products are visible on the storefront and available for search."
                                    : "Draft products are only visible in the admin panel."}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold">Organization</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-2">
                                <Typography variant="detail">Product Category</Typography>
                                <select
                                    title="Choose category"
                                    className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 outline-none"
                                    value={formData.categoryId || ""}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, categoryId: e.target.value as any || undefined }))}
                                >
                                    <option value="">Uncategorized</option>
                                    {categories?.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-3">
                                <Typography variant="detail">Tags</Typography>
                                <div className="space-y-3">
                                    <Input
                                        placeholder="Add tag and press Enter..."
                                        value={tagInput}
                                        onChange={(e) => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                        className="h-10 border-slate-200"
                                    />
                                    <Flex gap="2" wrap>
                                        {formData.tags.map((tag: string) => (
                                            <span key={tag} className="flex items-center bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                                                {tag}
                                                <button title="Remove tag" onClick={() => removeTag(tag)} className="ml-2 text-slate-400 hover:text-red-500">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </Flex>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-100 overflow-hidden">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-50">
                            <CardTitle className="text-sm font-bold">SEO & URL</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-3">
                            <div className="space-y-1">
                                <Typography variant="detail">Product Slug</Typography>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData((prev: any) => ({ ...prev, slug: e.target.value }))}
                                    className="bg-slate-50 border-none font-mono text-[11px] h-9"
                                />
                                <Typography variant="detail" className="text-slate-400 text-[10px] italic">
                                    /products/{formData.slug || " lavender-shampoo"}
                                </Typography>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
