'use client';

import { useState } from 'react';
import {
    Save, ChevronDown, ChevronRight, Eye, EyeOff, GripVertical,
    Palette, Type, Layout, ChevronLeft, Paintbrush, Image, RotateCcw,
    Layers, Settings2, Monitor, Smartphone
} from 'lucide-react';
import { defaultTheme } from '@/lib/theme';
import { getSupabase } from '@/lib/supabase';
import { useToast } from '@/components/admin/Toast';
import MediaPickerModal from '@/components/admin/MediaPickerModal';

// Shopify-inspired section definitions
const defaultSections = [
    {
        id: 'header',
        name: 'Header',
        icon: 'Layout',
        visible: true,
        blocks: [
            { id: 'logo', name: 'Logo', type: 'image', value: '/images/logo.png' },
            { id: 'site_name', name: 'Site Name', type: 'text', value: "Nature's Boon" },
            { id: 'tagline', name: 'Tagline', type: 'text', value: 'Since 2006' },
            { id: 'sticky', name: 'Sticky Navigation', type: 'toggle', value: true },
        ],
    },
    {
        id: 'hero',
        name: 'Hero Banner',
        icon: 'Image',
        visible: true,
        blocks: [
            { id: 'heading', name: 'Heading', type: 'text', value: 'Your Global Partner in Personal Care Excellence' },
            { id: 'subheading', name: 'Subheading', type: 'textarea', value: '15+ Years of Manufacturing Leadership | 750+ Tons Annual Capacity' },
            { id: 'cta_text', name: 'CTA Button Text', type: 'text', value: 'Inquire Now' },
            { id: 'cta_link', name: 'CTA Link', type: 'text', value: '/contact' },
            { id: 'bg_image', name: 'Background Image', type: 'image', value: '' },
            { id: 'show_cards', name: 'Show Feature Cards', type: 'toggle', value: true },
        ],
    },
    {
        id: 'stats',
        name: 'Stats Counter',
        icon: 'Settings2',
        visible: true,
        blocks: [
            { id: 'heading', name: 'Section Heading', type: 'text', value: 'Trusted by Brands Worldwide' },
            { id: 'show_animation', name: 'Animate Numbers', type: 'toggle', value: true },
            { id: 'columns', name: 'Columns per Row', type: 'select', value: '3', options: ['2', '3', '4', '6'] },
        ],
    },
    {
        id: 'services',
        name: 'Services Grid',
        icon: 'Layout',
        visible: true,
        blocks: [
            { id: 'heading', name: 'Section Heading', type: 'text', value: 'Our Expertise' },
            { id: 'subtitle', name: 'Subtitle', type: 'text', value: 'End-to-end solutions for your brand' },
            { id: 'show_icons', name: 'Show Icons', type: 'toggle', value: true },
            { id: 'card_style', name: 'Card Style', type: 'select', value: 'glass', options: ['glass', 'solid', 'outline', 'minimal'] },
        ],
    },
    {
        id: 'testimonials',
        name: 'Testimonials',
        icon: 'Type',
        visible: true,
        blocks: [
            { id: 'heading', name: 'Section Heading', type: 'text', value: 'What Our Partners Say' },
            { id: 'autoplay', name: 'Auto-Play', type: 'toggle', value: true },
            { id: 'speed', name: 'Slide Speed (ms)', type: 'text', value: '5000' },
        ],
    },
    {
        id: 'footer',
        name: 'Footer',
        icon: 'Layout',
        visible: true,
        blocks: [
            { id: 'show_newsletter', name: 'Show Newsletter', type: 'toggle', value: false },
            { id: 'copyright', name: 'Copyright Text', type: 'text', value: '© 2025 Nature\'s Boon. All rights reserved.' },
            { id: 'show_social', name: 'Show Social Links', type: 'toggle', value: true },
        ],
    },
];

export default function ThemeEditor() {
    const [sections, setSections] = useState(defaultSections);
    const [selectedSection, setSelectedSection] = useState('header');
    const [expandedSections, setExpandedSections] = useState(['header']);
    const [themeColors, setThemeColors] = useState({
        primaryColor: defaultTheme.primaryColor,
        secondaryColor: defaultTheme.secondaryColor,
        accentColor: defaultTheme.accentColor,
    });
    const [fontFamily, setFontFamily] = useState(defaultTheme.fontFamily);
    const [tab, setTab] = useState('sections'); // 'sections' | 'theme'
    const [previewDevice, setPreviewDevice] = useState('desktop');
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
    const { showToast, ToastContainer } = useToast();

    const supabase = getSupabase();

    const toggleExpand = (sectionId) => {
        setExpandedSections(prev =>
            prev.includes(sectionId) ? prev.filter(id => id !== sectionId) : [...prev, sectionId]
        );
    };

    const toggleVisibility = (sectionId) => {
        setSections(prev =>
            prev.map(s => s.id === sectionId ? { ...s, visible: !s.visible } : s)
        );
    };

    const updateBlock = (sectionId, blockId, value) => {
        setSections(prev =>
            prev.map(s =>
                s.id === sectionId
                    ? { ...s, blocks: s.blocks.map(b => b.id === blockId ? { ...b, value } : b) }
                    : s
            )
        );
    };

    const openMediaPicker = (sectionId, blockId) => {
        setMediaPickerTarget({ sectionId, blockId });
        setMediaPickerOpen(true);
    };

    const handleMediaSelect = (url) => {
        if (mediaPickerTarget) {
            updateBlock(mediaPickerTarget.sectionId, mediaPickerTarget.blockId, url);
        }
    };

    const handleSave = async () => {
        if (!supabase) {
            showToast('Theme saved locally! Connect Supabase to persist.', 'info');
            return;
        }
        try {
            const { error } = await supabase.from('site_settings').update({
                primary_color: themeColors.primaryColor,
                secondary_color: themeColors.secondaryColor,
                accent_color: themeColors.accentColor,
                font_family: fontFamily,
            }).eq('id', (await supabase.from('site_settings').select('id').single()).data.id);

            if (error) throw error;
            showToast('Theme published successfully!');
        } catch (err) {
            showToast('Save failed: ' + err.message, 'error');
        }
    };

    const handleReset = () => {
        setSections(defaultSections);
        setThemeColors({
            primaryColor: defaultTheme.primaryColor,
            secondaryColor: defaultTheme.secondaryColor,
            accentColor: defaultTheme.accentColor,
        });
        setFontFamily(defaultTheme.fontFamily);
        showToast('Theme reset to defaults', 'info');
    };

    const activeSection = sections.find(s => s.id === selectedSection);

    return (
        <div className="min-h-[85vh] -m-6 lg:-m-8">
            <ToastContainer />
            <MediaPickerModal
                isOpen={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
            />

            <div className="flex h-[calc(100vh-2rem)]">
                {/* Left Panel — Layer Tree */}
                <div className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">
                    {/* Panel Header */}
                    <div className="p-5 border-b border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                <Paintbrush className="w-5 h-5 text-primary" />
                                Theme Editor
                            </h1>
                            <div className="flex gap-1.5">
                                <button onClick={handleReset} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600" title="Reset to defaults">
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                                <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-dark transition-colors">
                                    <Save className="w-3.5 h-3.5" /> Publish
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setTab('sections')}
                                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${tab === 'sections' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                            >
                                <Layers className="w-3.5 h-3.5 inline mr-1.5" />Sections
                            </button>
                            <button
                                onClick={() => setTab('theme')}
                                className={`flex-1 text-xs font-bold py-2 rounded-lg transition-all ${tab === 'theme' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                            >
                                <Palette className="w-3.5 h-3.5 inline mr-1.5" />Theme
                            </button>
                        </div>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-y-auto">
                        {tab === 'sections' ? (
                            <div className="p-3">
                                {sections.map((section) => (
                                    <div key={section.id} className="mb-1">
                                        {/* Section header */}
                                        <button
                                            onClick={() => {
                                                toggleExpand(section.id);
                                                setSelectedSection(section.id);
                                            }}
                                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${selectedSection === section.id ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50'}`}
                                        >
                                            <GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab shrink-0" />
                                            {expandedSections.includes(section.id)
                                                ? <ChevronDown className="w-4 h-4 shrink-0" />
                                                : <ChevronRight className="w-4 h-4 shrink-0" />
                                            }
                                            <span className="flex-1 text-left">{section.name}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                                                className={`p-1 rounded-md transition-colors ${section.visible ? 'text-gray-400 hover:text-gray-600' : 'text-red-400'}`}
                                            >
                                                {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            </button>
                                        </button>

                                        {/* Blocks */}
                                        {expandedSections.includes(section.id) && (
                                            <div className="ml-7 mt-1 space-y-0.5 mb-2">
                                                {section.blocks.map((block) => (
                                                    <div
                                                        key={block.id}
                                                        className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500 rounded-lg hover:bg-gray-50 cursor-default"
                                                    >
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                        <span className="font-medium">{block.name}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            /* Theme Tab */
                            <div className="p-5 space-y-6">
                                {/* Colors */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Colors</h3>
                                    {[
                                        { label: 'Primary', key: 'primaryColor' },
                                        { label: 'Secondary', key: 'secondaryColor' },
                                        { label: 'Accent', key: 'accentColor' },
                                    ].map((c) => (
                                        <div key={c.key} className="flex items-center gap-3 mb-3">
                                            <input
                                                type="color"
                                                value={themeColors[c.key]}
                                                onChange={(e) => setThemeColors({ ...themeColors, [c.key]: e.target.value })}
                                                className="w-9 h-9 rounded-xl border-0 cursor-pointer"
                                            />
                                            <div className="flex-1">
                                                <label className="block text-xs font-semibold text-gray-600">{c.label}</label>
                                                <input
                                                    value={themeColors[c.key]}
                                                    onChange={(e) => setThemeColors({ ...themeColors, [c.key]: e.target.value })}
                                                    className="w-full px-2 py-1 border border-gray-200 rounded-lg text-xs font-mono mt-0.5"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Typography */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Typography</h3>
                                    <select
                                        value={fontFamily}
                                        onChange={(e) => setFontFamily(e.target.value)}
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium"
                                    >
                                        <option value="Inter">Inter</option>
                                        <option value="Montserrat">Montserrat</option>
                                        <option value="Roboto">Roboto</option>
                                        <option value="Outfit">Outfit</option>
                                        <option value="Poppins">Poppins</option>
                                        <option value="DM Sans">DM Sans</option>
                                    </select>
                                </div>

                                {/* Preview swatches */}
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Preview</h3>
                                    <div className="flex gap-2">
                                        {Object.values(themeColors).map((color, i) => (
                                            <div key={i} className="flex-1 h-14 rounded-xl shadow-inner" style={{ backgroundColor: color }} />
                                        ))}
                                    </div>
                                    <p className="text-center text-sm mt-3 font-bold" style={{ fontFamily }}>{fontFamily}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel — Property Editor + Preview */}
                <div className="flex-1 bg-gray-50 flex flex-col">
                    {/* Top toolbar */}
                    <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">{activeSection?.name || 'Select a section'}</span>
                            {activeSection && !activeSection.visible && (
                                <span className="text-[10px] font-bold text-red-400 bg-red-50 px-2 py-0.5 rounded-full">HIDDEN</span>
                            )}
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            <button
                                onClick={() => setPreviewDevice('desktop')}
                                className={`p-2 rounded-lg ${previewDevice === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                            >
                                <Monitor className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setPreviewDevice('mobile')}
                                className={`p-2 rounded-lg ${previewDevice === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}
                            >
                                <Smartphone className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Property editor */}
                    {activeSection && (
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                    <h2 className="text-sm font-black text-gray-900 mb-5 flex items-center gap-2">
                                        <Settings2 className="w-4 h-4 text-primary" />
                                        {activeSection.name} Settings
                                    </h2>

                                    <div className="space-y-5">
                                        {activeSection.blocks.map((block) => (
                                            <div key={block.id}>
                                                <label className="block text-xs font-bold text-gray-600 mb-1.5">{block.name}</label>

                                                {block.type === 'text' && (
                                                    <input
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(activeSection.id, block.id, e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    />
                                                )}

                                                {block.type === 'textarea' && (
                                                    <textarea
                                                        rows={3}
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(activeSection.id, block.id, e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    />
                                                )}

                                                {block.type === 'toggle' && (
                                                    <button
                                                        onClick={() => updateBlock(activeSection.id, block.id, !block.value)}
                                                        className={`relative w-12 h-7 rounded-full transition-all ${block.value ? 'bg-primary' : 'bg-gray-300'}`}
                                                    >
                                                        <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all ${block.value ? 'left-6' : 'left-1'}`} />
                                                    </button>
                                                )}

                                                {block.type === 'select' && (
                                                    <select
                                                        value={block.value}
                                                        onChange={(e) => updateBlock(activeSection.id, block.id, e.target.value)}
                                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                    >
                                                        {block.options.map((opt) => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                )}

                                                {block.type === 'image' && (
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-16 h-16 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                                            {block.value ? (
                                                                <Image className="w-6 h-6 text-primary" />
                                                            ) : (
                                                                <Image className="w-6 h-6 text-gray-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1">
                                                            <input
                                                                value={block.value}
                                                                onChange={(e) => updateBlock(activeSection.id, block.id, e.target.value)}
                                                                placeholder="Image URL or select from media"
                                                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                                            />
                                                            <button
                                                                onClick={() => openMediaPicker(activeSection.id, block.id)}
                                                                className="mt-1.5 text-xs font-bold text-primary hover:underline"
                                                            >
                                                                Browse Media Library
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Live preview hint */}
                                <div className="mt-6 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/10 text-center">
                                    <Monitor className="w-8 h-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm font-bold text-gray-700">
                                        {previewDevice === 'desktop' ? 'Desktop' : 'Mobile'} Preview
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Changes are reflected on your live site after publishing.
                                        <br />Visit <a href="/" target="_blank" className="text-primary font-bold hover:underline">your site</a> to see the current version.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
