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
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    Package,
    Archive,
    Loader2,
    Trash2
} from "lucide-react";
import Link from "next/link";

export default function ProductsIndexPage() {
    const products = useQuery(api.products.listAll, {});
    const categories = useQuery(api.categories.list);
    const updateProduct = useMutation(api.products.update);
    const deleteProduct = useMutation(api.products.remove);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");

    const filteredProducts = products?.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStatus = statusFilter === "all" || p.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "draft": return "bg-slate-100 text-slate-600 border-slate-200";
            case "archived": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-600 border-gray-200";
        }
    };

    const handleStatusChange = async (id: any, newStatus: string) => {
        await updateProduct({ id, status: newStatus as any });
    };

    const handleDelete = async (id: any) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await deleteProduct({ id });
        }
    };

    if (products === undefined) {
        return (
            <Flex align="center" justify="center" className="h-96">
                <Loader2 className="w-8 h-8 animate-spin text-nb-green" />
            </Flex>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <Flex justify="between" align="center">
                <div>
                    <Typography variant="h2" className="text-slate-900 font-black">Products</Typography>
                    <Typography variant="small" className="text-slate-500">Manage your product catalog and inventory.</Typography>
                </div>
                <Link href="/admin/products/new">
                    <Button
                        className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold px-6 shadow-sm"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                    </Button>
                </Link>
            </Flex>

            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
                    <Flex gap="4" wrap align="center">
                        <div className="relative flex-grow max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search products by name or SKU..."
                                className="pl-10 bg-white border-slate-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Flex gap="2">
                            <select
                                title="Filter by category"
                                className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="all">All Categories</option>
                                {categories?.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <select
                                title="Filter by status"
                                className="h-10 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>
                        </Flex>
                    </Flex>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Product</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">Price</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredProducts?.map((product) => (
                                    <tr key={product._id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <Flex align="center" gap="4">
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                    {product.images && product.images[0] && typeof product.images[0] === 'string' && product.images[0] !== "[object Object]" ? (
                                                        <img
                                                            src={product.images[0].startsWith('http') ? product.images[0] : `/api/storage/${product.images[0]}`}
                                                            alt={product.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <Package className="w-5 h-5 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <Typography variant="body" className="font-bold text-slate-900 block group-hover:text-nb-green transition-colors">
                                                        {product.name}
                                                    </Typography>
                                                    <Typography variant="detail" className="text-slate-400 font-mono text-[10px]">
                                                        {product.slug}
                                                    </Typography>
                                                </div>
                                            </Flex>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={product.status}
                                                onChange={(e) => handleStatusChange(product._id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-nb-green/20 ${getStatusColor(product.status)}`}
                                                title="Change Status"
                                            >
                                                <option value="active">Active</option>
                                                <option value="draft">Draft</option>
                                                <option value="archived">Archived</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Typography variant="small" className="text-slate-600">
                                                {categories?.find(c => c._id === product.categoryId)?.name || "Uncategorized"}
                                            </Typography>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Typography variant="small" className="font-bold text-slate-900">
                                                {product.price ? `₹${product.price.toLocaleString()}` : "-"}
                                            </Typography>
                                            {product.compareAtPrice && (
                                                <Typography variant="detail" className="text-slate-400 line-through text-[10px]">
                                                    ₹{product.compareAtPrice.toLocaleString()}
                                                </Typography>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Typography variant="small" className="font-mono text-slate-500">
                                                {product.sku || "-"}
                                            </Typography>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Flex justify="end" gap="2">
                                                <Link href={`/admin/products/${product._id}`}>
                                                    <Button variant="ghost" size="sm" className="h-10 w-10 px-0 bg-white border border-slate-200 text-slate-900 hover:text-nb-green hover:border-nb-green hover:bg-nb-green/5 transition-all shadow-sm rounded-xl" title="Edit Product">
                                                        <Edit className="w-5 h-5" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-10 w-10 px-0 bg-white border border-slate-200 text-slate-900 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm rounded-xl"
                                                    onClick={() => handleDelete(product._id)}
                                                    title="Delete Product"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </Flex>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts?.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <Flex direction="col" align="center" gap="3" className="text-slate-400">
                                                <Package className="w-10 h-10 opacity-20" />
                                                <Typography variant="small" className="italic font-medium">No products found matching your filters.</Typography>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-nb-green"
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setStatusFilter("all");
                                                        setCategoryFilter("all");
                                                    }}
                                                >
                                                    Clear all filters
                                                </Button>
                                            </Flex>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
