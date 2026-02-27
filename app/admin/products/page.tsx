"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
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

export default function ProductsIndexPage() {
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
            await Promise.all(Array.from(selectedIds).map(id => deleteProduct({ id: id as any })));
            setSelectedIds(new Set());
        }
    };

    const handleBulkStatusChange = async (status: "active" | "draft" | "archived") => {
        await Promise.all(Array.from(selectedIds).map(id => updateProduct({ id: id as any, status })));
        setSelectedIds(new Set());
    };

    if (products === undefined) {
        return (
            <Flex align="center" justify="center" className="h-96">
                <Loader2 className="w-8 h-8 animate-spin text-nb-green" />
            </Flex>
        );
    }

    const isAllSelected = filteredProducts && filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;
    const isIndeterminate = selectedIds.size > 0 && selectedIds.size < (filteredProducts?.length || 0);

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <Flex justify="between" align="center">
                <div>
                    <Typography variant="h2" className="text-slate-900 font-bold text-2xl tracking-tight">Products</Typography>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-[#1a1a1a] hover:bg-black text-white font-medium px-4 shadow-sm h-9 rounded-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add product
                    </Button>
                </Link>
            </Flex>

            <Card className="border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
                {/* Filters Bar */}
                <div className="p-3 border-b border-slate-200 flex flex-wrap gap-2 items-center bg-white">
                    <div className="relative max-w-md flex-grow">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Filter products..."
                            className="w-full pl-9 pr-3 py-1.5 h-9 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green transition-shadow"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        title="Filter by status"
                        className="h-9 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-nb-green cursor-pointer"
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
                        className="h-9 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:border-nb-green cursor-pointer"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="all">Category: All</option>
                        {categories?.map(c => (
                            <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Bulk Actions Bar (Floating inside header area) */}
                {selectedIds.size > 0 && (
                    <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-4 animate-in fade-in slide-in-from-top-2">
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
                            <span className="text-sm font-medium text-slate-700">
                                {selectedIds.size} selected
                            </span>
                        </div>
                        <div className="h-4 w-px bg-slate-300"></div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => handleBulkStatusChange("active")}>
                                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Set active
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-medium" onClick={() => handleBulkStatusChange("draft")}>
                                <Pencil className="w-3.5 h-3.5 mr-1" /> Set draft
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-transparent bg-transparent shadow-none" onClick={handleBulkDelete}>
                                <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete products
                            </Button>
                        </div>
                    </div>
                )}

                {/* Data Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        {selectedIds.size === 0 && (
                            <thead className="bg-[#f9fafb] border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3 w-12">
                                        <input
                                            type="checkbox"
                                            title="Select all products"
                                            aria-label="Select all products"
                                            className="w-4 h-4 rounded border-slate-300 text-nb-green focus:ring-nb-green/20 cursor-pointer"
                                            checked={isAllSelected}
                                            onChange={handleSelectAll}
                                        />
                                    </th>
                                    <th className="px-4 py-3 text-xs font-medium text-slate-500 w-12">Image</th>
                                    <th className="px-4 py-3 text-xs font-medium text-slate-500">Product</th>
                                    <th className="px-4 py-3 text-xs font-medium text-slate-500">Status</th>
                                    <th className="px-4 py-3 text-xs font-medium text-slate-500">Inventory / SKU</th>
                                    <th className="px-4 py-3 text-xs font-medium text-slate-500">Category</th>
                                </tr>
                            </thead>
                        )}
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredProducts?.map((product) => {
                                const isSelected = selectedIds.has(product._id);
                                return (
                                    <tr
                                        key={product._id}
                                        className={`group transition-colors ${isSelected ? 'bg-slate-50/80' : 'hover:bg-slate-50/50'}`}
                                    >
                                        <td className="px-4 py-3 align-middle w-12">
                                            <input
                                                type="checkbox"
                                                title={`Select product ${product.name}`}
                                                aria-label={`Select product ${product.name}`}
                                                className="w-4 h-4 rounded border-slate-300 text-nb-green focus:ring-nb-green/20 cursor-pointer"
                                                checked={isSelected}
                                                onChange={(e) => handleSelectOne(product._id, e.target.checked)}
                                            />
                                        </td>
                                        <td className="px-4 py-3 align-middle w-12">
                                            <Link href={`/admin/products/${product._id}`} className="block">
                                                <div className="w-10 h-10 rounded-md bg-[#f3f4f6] border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {product.images && product.images.length > 0 && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                                        <img
                                                            src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <ImageIcon className="w-4 h-4 text-slate-400" />
                                                    )}
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <Link href={`/admin/products/${product._id}`} className="block">
                                                <Typography variant="body" className="font-semibold text-slate-900 group-hover:underline decoration-slate-300 underline-offset-2">
                                                    {product.name}
                                                </Typography>
                                                <Typography variant="small" className="text-slate-500 leading-none mt-1">
                                                    {product.price ? `₹${product.price.toLocaleString()}` : "No price"}
                                                </Typography>
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <Badge variant="outline" className={`capitalize font-medium text-[11px] px-2 py-0.5 ${getStatusColor(product.status)}`}>
                                                {product.status}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <Typography variant="small" className="text-slate-600 font-mono">
                                                {product.sku || (
                                                    <span className="text-slate-400 italic font-sans text-xs">No SKU</span>
                                                )}
                                            </Typography>
                                        </td>
                                        <td className="px-4 py-3 align-middle">
                                            <Badge variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-normal">
                                                {categories?.find(c => c._id === product.categoryId)?.name || "Uncategorized"}
                                            </Badge>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredProducts?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-24 text-center">
                                        <Flex direction="col" align="center" gap="4">
                                            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                                                <Search className="w-8 h-8 text-slate-400" />
                                            </div>
                                            <div>
                                                <Typography variant="body" className="font-semibold text-slate-900">No products found</Typography>
                                                <Typography variant="small" className="text-slate-500 mt-1">Try changing the filters or search term</Typography>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSearchQuery("");
                                                    setStatusFilter("all");
                                                    setCategoryFilter("all");
                                                }}
                                            >
                                                Clear filters
                                            </Button>
                                        </Flex>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
