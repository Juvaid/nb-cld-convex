"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { Flex } from "@/components/ui/Flex";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit2, Loader2, Search } from "lucide-react";

export default function CategoriesPage() {
    const categories = useQuery(api.categories.list);
    const createCategory = useMutation(api.categories.create);
    const updateCategory = useMutation(api.categories.patch);
    const deleteCategory = useMutation(api.categories.remove);
    const listNames = useQuery(api.products.listNames);
    const { token } = useAuth();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        description: "",
        defaultShowcaseTitle: "",
        defaultShowcaseProductIds: [] as string[],
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, ""),
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory({
                    id: editingCategory._id,
                    ...formData,
                    defaultShowcaseProductIds: formData.defaultShowcaseProductIds as any,
                    token: token ?? undefined,
                });
                alert("Category updated successfully");
            } else {
                await createCategory({ 
                    ...formData, 
                    defaultShowcaseProductIds: formData.defaultShowcaseProductIds as any,
                    token: token ?? undefined 
                });
                alert("Category created successfully");
            }
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: "", slug: "", description: "", defaultShowcaseTitle: "", defaultShowcaseProductIds: [] });
        } catch (error) {
            alert("Error saving category");
        }
    };

    const handleDelete = async (id: any) => {
        if (confirm("Are you sure you want to delete this category?")) {
            try {
                await deleteCategory({ id, token: token ?? undefined });
                alert("Category deleted");
            } catch (error) {
                alert("Error deleting category");
            }
        }
    };

    const filteredCategories = categories?.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (categories === undefined) {
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
                    <Typography variant="h2" className="text-slate-900">Categories</Typography>
                    <Typography variant="small" className="text-slate-500">Manage your product categories and organization.</Typography>
                </div>
                <Button
                    onClick={() => {
                        setEditingCategory(null);
                        setFormData({ name: "", slug: "", description: "", defaultShowcaseTitle: "", defaultShowcaseProductIds: [] });
                        setIsModalOpen(true);
                    }}
                    className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </Flex>

            <Card className="border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50 border-b border-slate-100 px-6 py-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search categories..."
                            title="Search categories"
                            className="pl-10 bg-white border-slate-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredCategories?.map((category) => (
                                <tr key={category._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{category.name}</td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{category.slug}</td>
                                    <td className="px-6 py-4 text-slate-500 text-sm max-w-md truncate">{category.description || "-"}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Flex justify="end" gap="2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 px-0 bg-white border border-slate-200 text-slate-900 hover:text-nb-green hover:border-nb-green hover:bg-nb-green/5 transition-all shadow-sm rounded-xl"
                                                onClick={() => {
                                                    setEditingCategory(category);
                                                    setFormData({
                                                        name: category.name,
                                                        slug: category.slug,
                                                        description: category.description || "",
                                                        defaultShowcaseTitle: category.defaultShowcaseTitle || "",
                                                        defaultShowcaseProductIds: category.defaultShowcaseProductIds || [],
                                                    });
                                                    setIsModalOpen(true);
                                                }}
                                                title="Edit Category"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-10 w-10 px-0 bg-white border border-slate-200 text-slate-900 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm rounded-xl"
                                                onClick={() => handleDelete(category._id)}
                                                title="Delete Category"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </Flex>
                                    </td>
                                </tr>
                            ))}
                            {filteredCategories?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                                        No categories found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <Card className="w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
                        <CardHeader className="border-b border-slate-100">
                            <CardTitle>{editingCategory ? "Edit Category" : "Add New Category"}</CardTitle>
                        </CardHeader>
                        <form onSubmit={handleSave}>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <Typography variant="detail">Name</Typography>
                                    <Input
                                        required
                                        title="Category Name"
                                        placeholder="e.g. Skin Care"
                                        value={formData.name}
                                        onChange={handleNameChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="detail">Slug</Typography>
                                    <Input
                                        required
                                        title="Category Slug"
                                        placeholder="e.g. skin-care"
                                        value={formData.slug}
                                        readOnly
                                        className="bg-slate-50 font-mono text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="detail">Description</Typography>
                                    <Input
                                        title="Category Description"
                                        placeholder="Brief description of this category..."
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="detail">Default Showcase Title</Typography>
                                    <Input
                                        title="Default Showcase Title"
                                        placeholder="e.g. Recommended Products"
                                        value={formData.defaultShowcaseTitle}
                                        onChange={(e) => setFormData(prev => ({ ...prev, defaultShowcaseTitle: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="detail">Default Showcase Products</Typography>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                        {formData.defaultShowcaseProductIds.map((pid: string) => {
                                            const p = listNames?.find(n => n._id === pid);
                                            return (
                                                <div key={pid} className="flex items-center justify-between p-2 rounded-md border border-slate-200 bg-slate-50">
                                                    <span className="text-sm font-medium text-slate-700">{p?.name || pid}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                defaultShowcaseProductIds: prev.defaultShowcaseProductIds.filter(id => id !== pid)
                                                            }));
                                                        }} 
                                                        className="text-slate-400 hover:text-red-500"
                                                        title="Remove product"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <select 
                                        title="Add product to showcase"
                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md text-sm outline-none focus:border-nb-green"
                                        onChange={(e) => {
                                            if (e.target.value && !formData.defaultShowcaseProductIds.includes(e.target.value)) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    defaultShowcaseProductIds: [...prev.defaultShowcaseProductIds, e.target.value]
                                                }));
                                            }
                                            e.target.value = "";
                                        }}
                                        value=""
                                    >
                                        <option value="">+ Add Product to Default Showcase</option>
                                        {listNames?.filter(n => !formData.defaultShowcaseProductIds.includes(n._id)).map(p => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </CardContent>
                            <Flex justify="end" gap="3" className="p-6 bg-slate-50 border-t border-slate-100 rounded-b-xl">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold">
                                    {editingCategory ? "Update Category" : "Create Category"}
                                </Button>
                            </Flex>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
