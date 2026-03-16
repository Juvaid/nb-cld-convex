"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Plus,
    Search,
    Package,
    Loader2,
    Trash2,
    Edit,
    ImageIcon,
    MoreVertical,
    CheckCircle2,
    Archive,
    X,
    Pencil
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { OGPreviewCard } from "@/components/admin/OGPreviewCard";

export default function ProductsIndexPage() {
    const { token } = useAuth();
    const products = useQuery(api.products.listAll, {});
    const categories = useQuery(api.categories.list);
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    // Bulk Selection State
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredProducts = products?.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-100 text-emerald-800 border-emerald-200";
            case "draft": return "bg-amber-100 text-amber-800 border-amber-200";
            case "archived": return "bg-slate-100 text-slate-800 border-slate-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked && filteredProducts) {
            setSelectedIds(new Set(filteredProducts.map(p => p._id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleSelectOne = (id: string, checked: boolean) => {
        const next = new Set(selectedIds);
        if (checked) next.add(id);
        else next.delete(id);
        setSelectedIds(next);
    };

    const handleBulkDelete = async () => {
        if (confirm(`Are you sure you want to delete ${selectedIds.size} products? This cannot be undone.`)) {
            await Promise.all(Array.from(selectedIds).map(id => deleteProduct({ id: id as any, token: token ?? undefined })));
            setSelectedIds(new Set());
        }
    };

    const handleBulkStatusChange = async (status: "active" | "draft" | "archived") => {
        await Promise.all(Array.from(selectedIds).map(id => updateProduct({ id: id as any, status, token: token ?? undefined })));
        setSelectedIds(new Set());
    };

    if (products === undefined) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Loader2 className="animate-spin text-nb-green mb-4" size={32} />
                <p className="text-slate-500 font-semibold text-sm">Loading Product Catalog...</p>
            </div>
        );
    }

    const isAllSelected = filteredProducts && filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < (filteredProducts?.length || 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Products</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage your eCommerce catalog and inventory.</p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="flex items-center justify-center gap-2 bg-nb-green text-white px-4 h-10 flex-shrink-0 rounded-xl font-semibold shadow-sm hover:bg-nb-green/90 transition-all focus:ring-2 focus:ring-nb-green focus:ring-offset-2"
                >
                    <Plus size={18} />
                    Create New Product
                </Link>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Filters Bar */}
                <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 items-center bg-white/50 backdrop-blur-sm z-10 relative">
                    <div className="relative w-full sm:max-w-md group group-focus-within:text-nb-green">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-nb-green transition-colors" />
                        <input
                            type="text"
                            placeholder="Filter products..."
                            className="w-full pl-9 pr-3 h-10 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-nb-green focus:bg-white placeholder:text-slate-400 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            title="Filter by status"
                            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-nb-green focus:bg-white transition-all cursor-pointer flex-1 sm:flex-auto"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Status: All</option>
                            <option value="active">Active</option>
                            <option value="draft">Draft</option>
                            <option value="archived">Archived</option>
                        </select>

                        <select
                            title="Filter by category"
                            className="h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 focus:outline-none focus:ring-2 focus:ring-nb-green focus:bg-white transition-all cursor-pointer flex-1 sm:flex-auto max-w-[200px] truncate"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="all">Category: All</option>
                            {categories?.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Bulk Actions Bar (Floating inside header area) */}
                {selectedIds.size > 0 && (
                    <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                title="Select all products"
                                aria-label="Select all products"
                                className="w-4 h-4 rounded border-slate-300 text-nb-green focus:ring-nb-green/20"
                                checked={isAllSelected}
                                ref={el => { if (el) el.indeterminate = isIndeterminate; }}
                                onChange={handleSelectAll}
                            />
                            <span className="text-sm font-semibold text-slate-700">
                                {selectedIds.size} selected
                            </span>
                        </div>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className="flex gap-2">
                            <button className="h-8 px-3 rounded-lg flex items-center justify-center text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all" onClick={() => handleBulkStatusChange("active")}>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Set active
                            </button>
                            <button className="h-8 px-3 rounded-lg flex items-center justify-center text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm transition-all" onClick={() => handleBulkStatusChange("draft")}>
                                <Pencil className="w-3.5 h-3.5 mr-1" /> Set draft
                            </button>
                            <button className="h-8 px-3 rounded-lg flex items-center justify-center text-xs font-semibold bg-white border border-transparent text-rose-600 hover:bg-rose-50 transition-all" onClick={handleBulkDelete}>
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete products
                            </button>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        {selectedIds.size === 0 && (
                            <thead className="bg-slate-50/50 border-b border-slate-200">
                                <tr>
                                    <th className="px-5 py-4 w-12 text-xs font-semibold text-slate-500 uppercase tracking-widest pl-6">
                                        <input
                                            type="checkbox"
                                            title="Select all products"
                                            aria-label="Select all products"
                                            className="w-4 h-4 rounded border-slate-300 text-nb-green focus:ring-nb-green/20 cursor-pointer"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest w-16">Image</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Product</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Inventory / SKU</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">SEO / Preview</th>
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredProducts?.map((product) => {
                                const isSelected = selectedIds.has(product._id);
                                return (
                                    <tr
                                        key={product._id}
                                        className={`group transition-colors ${isSelected ? 'bg-nb-green/5' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="px-5 py-4 align-middle w-12 pl-6">
                                            <input
                                                type="checkbox"
                                                title={`Select product ${product.name}`}
                                                aria-label={`Select product ${product.name}`}
                                                className="w-4 h-4 rounded border-slate-300 text-nb-green focus:ring-nb-green/20 cursor-pointer"
                                                checked={isSelected}
                                                onChange={(e) => handleSelectOne(product._id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-5 py-4 align-middle w-16">
                                            <Link href={`/admin/products/${product._id}`} className="block">
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                                    {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                                        <img
                                                            src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <Link href={`/admin/products/${product._id}`} className="block">
                                                <div className="font-semibold text-sm text-slate-900 group-hover:text-nb-green transition-colors">
                                                    {product.name}
                                                </div>
                                                <div className="text-xs font-medium text-slate-500 mt-0.5">
                                                    {product.price ? `₹${product.price.toLocaleString()}` : "No price"}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${product.status === "active" ? "bg-nb-green/10 text-nb-green" :
                                                product.status === "draft" ? "bg-amber-50 text-amber-600" :
                                                    "bg-slate-100 text-slate-500"
                                                }`}>
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <code className="text-xs font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                                                {product.sku || (
                                                    <span className="text-slate-400 italic">No SKU</span>
                                                )}
                                            </code>
                                        </td>
                                        <td className="px-5 py-4 align-middle">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 font-semibold text-xs rounded-lg whitespace-nowrap">
                                                {categories?.find(c => c._id === product.categoryId)?.name || "Uncategorized"}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 align-middle text-right">
                                            <OGPreviewCard
                                                trigger="button"
                                                title={product.name}
                                                description={product.description}
                                                imageUrl={product.images?.[0]}
                                                url={`/products/${product.slug || product._id}`}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-24 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-2">
                                                <Search className="w-8 h-8 text-slate-300" />
                                            </div>
                                            <div className="font-semibold text-slate-900 text-sm">No products found</div>
                                            <div className="text-xs text-slate-500 mt-1">Try changing the filters or search term</div>
                                            <button
                                                className="mt-4 px-4 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-nb-green hover:border-nb-green/30"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setStatusFilter("all");
                                                    setCategoryFilter("all");
                                                }}
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
