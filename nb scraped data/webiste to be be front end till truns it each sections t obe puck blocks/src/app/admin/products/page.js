'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    Save, Plus, Trash2, Search, Package, Tag, Image as ImageIcon,
    ChevronDown, Loader2, Eye, EyeOff, Filter, X
} from 'lucide-react';
import { defaultProductCategories } from '@/lib/theme';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/components/admin/Toast';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

const defaultProducts = [
    { id: '1', category: 'Skin Care', name: 'Face Wash', slug: 'face-wash', description: 'Gentle cleansing formula', usp: 'Sulphate Free', imageUrl: '', visible: true, sortOrder: 0 },
    { id: '2', category: 'Skin Care', name: 'Facial Kit', slug: 'facial-kit', description: 'Complete skincare routine', usp: 'Premium Ingredients', imageUrl: '', visible: true, sortOrder: 1 },
    { id: '3', category: 'Hair Care', name: 'Hair Shampoo', slug: 'hair-shampoo', description: 'Deep cleansing formula', usp: 'Paraben Free', imageUrl: '', visible: true, sortOrder: 0 },
    { id: '4', category: 'Hair Care', name: 'Hair Oil', slug: 'hair-oil', description: 'Nourishing blend', usp: 'Ayurvedic Blend', imageUrl: '', visible: true, sortOrder: 1 },
    { id: '5', category: "Men's Grooming", name: 'Beard Oil', slug: 'beard-oil', description: 'Premium grooming essential', usp: 'Natural Growth', imageUrl: '', visible: true, sortOrder: 0 },
    { id: '6', category: 'Body & Personal Care', name: 'Body Lotion', slug: 'body-lotion', description: 'Intensive moisture', usp: 'Deep Nourishing', imageUrl: '', visible: true, sortOrder: 0 },
];

export default function ProductsManager() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [tab, setTab] = useState('products'); // 'products' | 'categories'
    const [categories, setCategories] = useState(defaultProductCategories);
    const [editingCat, setEditingCat] = useState(null);
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const supabase = getSupabase();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        if (!supabase) {
            setProducts(defaultProducts);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*, product_categories(name)')
                .order('sort_order', { ascending: true });
            if (error) throw error;
            setProducts(data?.length ? data.map(p => ({
                id: p.id,
                category: p.product_categories?.name || 'Uncategorized',
                name: p.name,
                slug: p.slug || '',
                description: p.description || '',
                usp: p.usp || '',
                imageUrl: p.image_url || '',
                visible: p.is_visible,
                sortOrder: p.sort_order,
            })) : defaultProducts);
        } catch (err) {
            console.error('Failed to load products:', err);
            setProducts(defaultProducts);
            showToast('Using default products (Supabase unavailable)', 'info');
        } finally {
            setLoading(false);
        }
    }, [supabase, showToast]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSave = async (product) => {
        setSaving(true);
        setProducts(products.map(p => p.id === product.id ? product : p));

        if (!supabase) {
            setEditing(null);
            setSaving(false);
            showToast('Product saved locally! Connect Supabase to persist.', 'info');
            return;
        }

        try {
            const payload = {
                name: product.name,
                slug: product.slug,
                description: product.description,
                usp: product.usp,
                image_url: product.imageUrl,
                is_visible: product.visible,
                sort_order: product.sortOrder,
            };

            if (product.id.startsWith('new-')) {
                const { data, error } = await supabase.from('products').insert(payload).select().single();
                if (error) throw error;
                setProducts(prev => prev.map(p => p.id === product.id ? { ...product, id: data.id } : p));
            } else {
                const { error } = await supabase.from('products').update(payload).eq('id', product.id);
                if (error) throw error;
            }
            showToast('Product saved!');
        } catch (err) {
            showToast('Save failed: ' + err.message, 'error');
        } finally {
            setEditing(null);
            setSaving(false);
        }
    };

    const handleDelete = async (productId) => {
        if (!supabase) {
            setProducts(products.filter(p => p.id !== productId));
            setDeleteConfirm(null);
            showToast('Product deleted');
            return;
        }
        try {
            const { error } = await supabase.from('products').delete().eq('id', productId);
            if (error) throw error;
            setProducts(products.filter(p => p.id !== productId));
            setDeleteConfirm(null);
            showToast('Product deleted');
        } catch (err) {
            showToast('Delete failed: ' + err.message, 'error');
        }
    };

    const handleAdd = () => {
        const newProduct = {
            id: 'new-' + Date.now(),
            category: filterCategory !== 'all' ? filterCategory : 'Skin Care',
            name: 'New Product',
            slug: 'new-product',
            description: '',
            usp: '',
            imageUrl: '',
            visible: true,
            sortOrder: products.length,
        };
        setProducts([...products, newProduct]);
        setEditing(newProduct.id);
    };

    const openMediaPicker = (target) => {
        setMediaPickerTarget(target);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url) => {
        if (mediaPickerTarget?.type === 'product') {
            setProducts(products.map(p =>
                p.id === mediaPickerTarget.id ? { ...p, imageUrl: url } : p
            ));
        } else if (mediaPickerTarget?.type === 'category') {
            setCategories(categories.map(c =>
                c.slug === mediaPickerTarget.slug ? { ...c, imageUrl: url } : c
            ));
        }
    };

    // Category handlers
    const handleSaveCat = async (cat) => {
        setCategories(categories.map(c => c.slug === cat.slug ? cat : c));
        setEditingCat(null);
        if (!supabase) {
            showToast('Category saved locally!', 'info');
            return;
        }
        try {
            const { error } = await supabase.from('product_categories').upsert({
                name: cat.name, slug: cat.slug, description: cat.description, image_url: cat.imageUrl,
            }, { onConflict: 'slug' });
            if (error) throw error;
            showToast('Category saved!');
        } catch (err) {
            showToast('Save failed: ' + err.message, 'error');
        }
    };

    const handleAddCat = () => {
        const newCat = { name: 'New Category', slug: 'new-category-' + Date.now(), description: '', imageUrl: '' };
        setCategories([...categories, newCat]);
        setEditingCat(newCat.slug);
    };

    const handleDeleteCat = (slug) => {
        setCategories(categories.filter(c => c.slug !== slug));
        showToast('Category removed');
    };

    // Filtering
    const allCategories = [...new Set(products.map(p => p.category))];
    const filteredProducts = products
        .filter(p => filterCategory === 'all' || p.category === filterCategory)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            <ToastContainer />
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your product catalog and categories.</p>
                </div>
                <button
                    onClick={tab === 'products' ? handleAdd : handleAddCat}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors"
                >
                    <Plus className="w-4 h-4" /> {tab === 'products' ? 'Add Product' : 'Add Category'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-1.5 mb-6 bg-gray-100 p-1.5 rounded-2xl w-fit">
                <button
                    onClick={() => setTab('products')}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${tab === 'products' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    <Package className="w-3.5 h-3.5" /> Products ({products.length})
                </button>
                <button
                    onClick={() => setTab('categories')}
                    className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${tab === 'categories' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    <Tag className="w-3.5 h-3.5" /> Categories ({categories.length})
                </button>
            </div>

            {tab === 'products' ? (
                <>
                    {/* Search & Filter */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-5">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none bg-white"
                            />
                        </div>
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <span className="pl-3 text-gray-400"><Filter className="w-4 h-4" /></span>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="pr-8 py-2.5 text-sm font-medium text-gray-600 border-0 focus:outline-none bg-transparent"
                            >
                                <option value="all">All Categories</option>
                                {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Products list */}
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="text-center py-20 text-gray-400">
                            <Package className="w-14 h-14 mx-auto mb-3 opacity-40" />
                            <p className="font-bold text-lg">No products found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filter</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredProducts.map((product) => (
                                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    {editing === product.id ? (
                                        <ProductEditForm
                                            product={product}
                                            categories={allCategories}
                                            onSave={handleSave}
                                            onCancel={() => setEditing(null)}
                                            onOpenMedia={() => openMediaPicker({ type: 'product', id: product.id })}
                                            saving={saving}
                                        />
                                    ) : (
                                        <div className="p-4 flex items-center gap-4">
                                            {/* Thumbnail */}
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center shrink-0">
                                                {product.imageUrl ? (
                                                    <ImageIcon className="w-6 h-6 text-primary" />
                                                ) : (
                                                    <Package className="w-6 h-6 text-gray-300" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="font-bold text-gray-900 text-sm">{product.name}</h3>
                                                    {product.usp && (
                                                        <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">{product.usp}</span>
                                                    )}
                                                    {!product.visible && (
                                                        <span className="text-[10px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Hidden</span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-400 font-medium">{product.category}</span>
                                                    {product.description && (
                                                        <>
                                                            <span className="text-gray-300">·</span>
                                                            <span className="text-xs text-gray-400 truncate">{product.description}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => setEditing(product.id)}
                                                    className="px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => setDeleteConfirm(product.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                /* Categories Tab */
                <div className="space-y-3">
                    {categories.map((cat) => (
                        <div key={cat.slug} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {editingCat === cat.slug ? (
                                <div className="p-6 bg-gray-50 space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Name</label>
                                            <input
                                                value={cat.name}
                                                onChange={e => setCategories(categories.map(c => c.slug === cat.slug ? { ...c, name: e.target.value } : c))}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-600 mb-1">Slug</label>
                                            <input
                                                value={cat.slug}
                                                onChange={e => setCategories(categories.map(c => c.slug === cat.slug ? { ...c, slug: e.target.value } : c))}
                                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                                        <textarea
                                            rows={2}
                                            value={cat.description}
                                            onChange={e => setCategories(categories.map(c => c.slug === cat.slug ? { ...c, description: e.target.value } : c))}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-600 mb-1">Image</label>
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                                                <ImageIcon className={`w-5 h-5 ${cat.imageUrl ? 'text-primary' : 'text-gray-300'}`} />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    value={cat.imageUrl}
                                                    onChange={e => setCategories(categories.map(c => c.slug === cat.slug ? { ...c, imageUrl: e.target.value } : c))}
                                                    placeholder="Image URL"
                                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs"
                                                />
                                                <button onClick={() => openMediaPicker({ type: 'category', slug: cat.slug })} className="mt-1 text-xs font-bold text-primary hover:underline">
                                                    Browse Media
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => handleSaveCat(cat)} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark">
                                            <Save className="w-4 h-4" /> Save
                                        </button>
                                        <button onClick={() => setEditingCat(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center shrink-0">
                                        <Tag className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm">{cat.name}</h3>
                                        <p className="text-xs text-gray-400 truncate">{cat.description}</p>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => setEditingCat(cat.slug)} className="px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5">Edit</button>
                                        <button onClick={() => handleDeleteCat(cat.slug)} className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete confirmation */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
                    <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
                        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                            <Trash2 className="w-7 h-7 text-red-500" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50">
                                Cancel
                            </button>
                            <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-5 py-3 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function ProductEditForm({ product, categories, onSave, onCancel, onOpenMedia, saving }) {
    const [form, setForm] = useState({ ...product });

    return (
        <div className="p-6 bg-gray-50 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Product Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Slug</label>
                    <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                        {[...new Set([...categories, form.category])].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">USP Tag</label>
                    <input value={form.usp} onChange={e => setForm({ ...form, usp: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Image</label>
                <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <ImageIcon className={`w-5 h-5 ${form.imageUrl ? 'text-primary' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex-1">
                        <input value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} placeholder="Image URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs" />
                        <button onClick={onOpenMedia} className="mt-1 text-xs font-bold text-primary hover:underline">Browse Media</button>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.visible} onChange={e => setForm({ ...form, visible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary" />
                    <span className="text-sm font-semibold text-gray-600">Visible on site</span>
                </label>
            </div>
            <div className="flex gap-2 pt-2">
                <button onClick={() => onSave(form)} disabled={saving} className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark disabled:opacity-50 transition-colors">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={onCancel} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
}
