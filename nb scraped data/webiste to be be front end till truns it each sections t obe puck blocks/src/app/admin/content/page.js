'use client';

import { useState, useEffect, useCallback } from 'react';
import { Save, Plus, Trash2, ChevronDown, Image as ImageIcon, GripVertical, FileText, Loader2 } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/components/admin/Toast';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

const defaultBlocks = [
    { id: '1', pageSlug: 'home', sectionKey: 'hero', title: 'Your Global Partner in Personal Care Excellence', subtitle: '15+ Years of Manufacturing Leadership | 750+ Tons Annual Capacity', body: '', imageUrl: '', ctaText: 'Inquire Now', ctaLink: '/contact', sortOrder: 0, isVisible: true },
    { id: '2', pageSlug: 'home', sectionKey: 'about', title: 'About Us', subtitle: '', body: 'Established in 2006 at Ludhiana (Punjab, India), Nature\'s Boon is recognized as one of the most trusted Manufacturers and Suppliers of high quality personal care products.', imageUrl: '', ctaText: 'Learn More', ctaLink: '/about', sortOrder: 1, isVisible: true },
    { id: '3', pageSlug: 'about', sectionKey: 'story', title: 'Our Journey', subtitle: '', body: 'Established in the year 2006, we have formulated & packaged for quality brands such as Luster Cosmetics, True Derma Essentials, Man Pride, and many more.', imageUrl: '', ctaText: '', ctaLink: '', sortOrder: 0, isVisible: true },
    { id: '4', pageSlug: 'services', sectionKey: 'hero', title: 'End-to-End Solutions for Your Personal Care Brand', subtitle: 'From concept to shelf', body: 'We provide comprehensive services to build, grow, and scale your brand.', imageUrl: '', ctaText: '', ctaLink: '', sortOrder: 0, isVisible: true },
];

const PAGE_OPTIONS = ['home', 'about', 'services', 'products', 'contact'];

export default function ContentManager() {
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(null);
    const [activePage, setActivePage] = useState('all');
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const supabase = getSupabase();

    const fetchBlocks = useCallback(async () => {
        setLoading(true);
        if (!supabase) {
            setBlocks(defaultBlocks);
            setLoading(false);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('content_blocks')
                .select('*')
                .order('sort_order', { ascending: true });
            if (error) throw error;
            setBlocks(data?.length ? data.map(b => ({
                id: b.id,
                pageSlug: b.page_slug,
                sectionKey: b.section_key,
                title: b.title || '',
                subtitle: b.subtitle || '',
                body: b.body || '',
                imageUrl: b.image_url || '',
                ctaText: b.cta_text || '',
                ctaLink: b.cta_link || '',
                sortOrder: b.sort_order,
                isVisible: b.is_visible,
            })) : defaultBlocks);
        } catch (err) {
            console.error('Failed to load content:', err);
            setBlocks(defaultBlocks);
            showToast('Using default content (Supabase unavailable)', 'info');
        } finally {
            setLoading(false);
        }
    }, [supabase, showToast]);

    useEffect(() => {
        fetchBlocks();
    }, [fetchBlocks]);

    const handleSave = async (block) => {
        setSaving(true);
        setBlocks(blocks.map(b => b.id === block.id ? block : b));

        if (!supabase) {
            setEditing(null);
            setSaving(false);
            showToast('Content saved locally! Connect Supabase to persist.', 'info');
            return;
        }

        try {
            const payload = {
                page_slug: block.pageSlug,
                section_key: block.sectionKey,
                title: block.title,
                subtitle: block.subtitle,
                body: block.body,
                image_url: block.imageUrl,
                cta_text: block.ctaText,
                cta_link: block.ctaLink,
                sort_order: block.sortOrder,
                is_visible: block.isVisible,
                updated_at: new Date().toISOString(),
            };

            if (block.id.startsWith('new-')) {
                const { data, error } = await supabase.from('content_blocks').insert(payload).select().single();
                if (error) throw error;
                setBlocks(prev => prev.map(b => b.id === block.id ? { ...b, id: data.id } : b));
            } else {
                const { error } = await supabase.from('content_blocks').update(payload).eq('id', block.id);
                if (error) throw error;
            }
            showToast('Content saved successfully!');
        } catch (err) {
            showToast('Save failed: ' + err.message, 'error');
        } finally {
            setEditing(null);
            setSaving(false);
        }
    };

    const handleDelete = async (blockId) => {
        if (!supabase) {
            setBlocks(blocks.filter(b => b.id !== blockId));
            showToast('Block deleted');
            return;
        }
        try {
            const { error } = await supabase.from('content_blocks').delete().eq('id', blockId);
            if (error) throw error;
            setBlocks(blocks.filter(b => b.id !== blockId));
            showToast('Block deleted');
        } catch (err) {
            showToast('Delete failed: ' + err.message, 'error');
        }
    };

    const handleAdd = () => {
        const newBlock = {
            id: 'new-' + Date.now(),
            pageSlug: activePage === 'all' ? 'home' : activePage,
            sectionKey: 'new_section',
            title: 'New Section',
            subtitle: '',
            body: '',
            imageUrl: '',
            ctaText: '',
            ctaLink: '',
            sortOrder: blocks.length,
            isVisible: true,
        };
        setBlocks([...blocks, newBlock]);
        setEditing(newBlock.id);
    };

    const openMediaPicker = (blockId) => {
        setMediaPickerTarget(blockId);
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url) => {
        if (mediaPickerTarget) {
            setBlocks(blocks.map(b =>
                b.id === mediaPickerTarget ? { ...b, imageUrl: url } : b
            ));
        }
    };

    const filteredBlocks = activePage === 'all' ? blocks : blocks.filter(b => b.pageSlug === activePage);
    const pages = [...new Set(blocks.map(b => b.pageSlug))];

    return (
        <div>
            <ToastContainer />
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Content Blocks</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage text, images, and CTAs for each page section.</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add Block
                </button>
            </div>

            {/* Page filter tabs */}
            <div className="flex flex-wrap gap-1.5 mb-6 bg-gray-100 p-1.5 rounded-2xl">
                <button
                    onClick={() => setActivePage('all')}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${activePage === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    All Pages
                </button>
                {PAGE_OPTIONS.map((page) => (
                    <button
                        key={page}
                        onClick={() => setActivePage(page)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-all capitalize ${activePage === page ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredBlocks.map((block) => (
                        <div key={block.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            {editing === block.id ? (
                                <EditForm
                                    block={block}
                                    onSave={handleSave}
                                    onCancel={() => setEditing(null)}
                                    onOpenMedia={() => openMediaPicker(block.id)}
                                    saving={saving}
                                />
                            ) : (
                                <div className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <GripVertical className="w-4 h-4 text-gray-300 shrink-0 cursor-grab" />
                                        {block.imageUrl ? (
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <ImageIcon className="w-5 h-5 text-primary" />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                                                <FileText className="w-5 h-5 text-gray-300" />
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full uppercase">{block.pageSlug}</span>
                                                <span className="text-[10px] font-medium text-gray-400">{block.sectionKey}</span>
                                                {!block.isVisible && <span className="text-[10px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">Hidden</span>}
                                            </div>
                                            <h3 className="font-bold text-gray-900 text-sm truncate">{block.title}</h3>
                                            {block.body && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{block.body}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0 ml-4">
                                        <button onClick={() => setEditing(block.id)} className="px-3 py-1.5 text-sm font-semibold text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(block.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {filteredBlocks.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                            <p className="font-bold">No content blocks</p>
                            <p className="text-xs mt-1">Add your first block above</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function EditForm({ block, onSave, onCancel, onOpenMedia, saving }) {
    const [form, setForm] = useState({ ...block });

    return (
        <div className="p-6 bg-gray-50 space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Page</label>
                    <select value={form.pageSlug} onChange={e => setForm({ ...form, pageSlug: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm">
                        {PAGE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Section Key</label>
                    <input value={form.sectionKey} onChange={e => setForm({ ...form, sectionKey: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.isVisible} onChange={e => setForm({ ...form, isVisible: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary" />
                        <span className="text-sm font-semibold text-gray-600">Visible</span>
                    </label>
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Title</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Body</label>
                <textarea rows={4} value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm resize-none" />
            </div>
            {/* Image field */}
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
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">CTA Text</label>
                    <input value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">CTA Link</label>
                    <input value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm" />
                </div>
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
