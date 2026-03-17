"use client";

export const dynamic = "force-dynamic";

import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
    Loader2, Save, Undo, Clock, RotateCcw, Layout,
    Star, FileText, Download, Bookmark, Sparkles,
    Palette, Type, Maximize, Trash2
} from "lucide-react";
import { FontPicker } from "@/components/admin/FontPicker";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

const PRESETS = [
    {
        name: "Nature's Boon (Default)",
        colors: {
            primary: "#15803d",
            secondary: "#0f172a",
            accent: "#16a34a",
            background: "#ffffff",
            backgroundAlt: "#f8fafc",
            text: "#0f172a",
            textMuted: "#64748b",
            border: "#e2e8f0",
        }
    },
    {
        name: "Forest Emerald",
        colors: {
            primary: "#16a34a",
            secondary: "#0f172a",
            accent: "#22c55e",
            background: "#ffffff",
            backgroundAlt: "#f8fafc",
            text: "#0f172a",
            textMuted: "#64748b",
            border: "#e2e8f0",
        }
    },
    {
        name: "Organic Earth",
        colors: {
            primary: "#0d9488",
            secondary: "#134e4a",
            accent: "#2dd4bf",
            background: "#ffffff",
            backgroundAlt: "#f0fdfa",
            text: "#042f2e",
            textMuted: "#5da399",
            border: "#ccfbf1",
        }
    },
    {
        name: "Sleek Onyx",
        colors: {
            primary: "#18181b",
            secondary: "#000000",
            accent: "#3f3f46",
            background: "#ffffff",
            backgroundAlt: "#f4f4f5",
            text: "#09090b",
            textMuted: "#71717a",
            border: "#e4e4e7",
        }
    }
];

export default function ThemePage() {
    const { theme, saveAll, reset } = useTheme();
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [isSaving, setIsSaving] = useState(false);
    const [isDoomed, setIsDoomed] = useState(false);
    const { token } = useAuth();

    // Snapshots State
    const snapshots = useQuery(api.theme.listThemeSnapshots, {});
    const createSnapshot = useMutation(api.theme.createThemeSnapshot);
    const deleteSnapshot = useMutation(api.theme.deleteThemeSnapshot);
    const restoreSnapshot = useMutation(api.theme.restoreThemeSnapshot);
    const [snapshotName, setSnapshotName] = useState("");
    const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    useEffect(() => {
        if (theme) {
            setLocalTheme(theme);
        }
    }, [theme]);

    const updateSetting = (section: string, key: string, value: any) => {
        setLocalTheme((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value,
            },
        }));
    };

    const applyPreset = (presetColors: any) => {
        setLocalTheme((prev: any) => ({
            ...prev,
            colors: {
                ...prev.colors,
                ...presetColors
            },
            buttons: {
                ...prev.buttons,
                primaryBg: presetColors.primary
            }
        }));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        try {
            await saveAll({ settings: localTheme, token: token ?? undefined });
        } catch (error) {
            console.error(error);
            alert("Failed to save design settings");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetTheme = async () => {
        if (!confirm("Are you sure you want to reset to default brand styles?")) return;
        setIsDoomed(true);
        try {
            await reset({ token: token ?? undefined });
        } finally {
            setIsDoomed(false);
        }
    };

    const handleCreateSnapshot = async () => {
        if (!snapshotName.trim()) return;
        setIsCreatingSnapshot(true);
        try {
            await createSnapshot({
                name: snapshotName,
                theme: localTheme,
                isPreset: false,
                siteSettings: {}, // We only care about theme here
                token: token ?? undefined
            });
            setSnapshotName("");
        } catch (err) {
            console.error(err);
            alert("Failed to create snapshot");
        } finally {
            setIsCreatingSnapshot(false);
        }
    };

    const handleRestoreSnapshot = async (snapshot: any) => {
        if (!confirm(`Restore "${snapshot.name}"? Current unsaved changes will be lost.`)) return;
        setRestoringId(snapshot._id);
        try {
            await restoreSnapshot({
                theme: snapshot.theme,
                siteSettings: snapshot.siteSettings || {},
                token: token ?? undefined
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to restore snapshot");
            setRestoringId(null);
        }
    };

    const handleDeleteSnapshot = async (id: any) => {
        if (!confirm("Are you sure you want to delete this snapshot?")) return;
        try {
            await deleteSnapshot({ id, token: token ?? undefined });
        } catch (err) {
            console.error(err);
            alert("Failed to delete snapshot");
        }
    };

    if (!localTheme) return <div className="p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-nb-green" />
    </div>;

    return (
        <div className="space-y-6 pb-20 max-w-6xl mx-auto">
            {/* Design Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 p-5 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md sticky top-0 z-50">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <Palette className="w-5 h-5 text-nb-green" />
                        Theme & Design System
                    </h1>
                    <p className="text-[11px] text-slate-500 font-medium ml-8">Manage brand identity, colors, and typography</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" onClick={handleResetTheme} disabled={isSaving || isDoomed} className="flex-1 md:flex-none bg-white hover:text-rose-600">
                        {isDoomed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo className="w-4 h-4 mr-2" />}
                        Reset Styles
                    </Button>
                    <Button onClick={handleSaveAll} disabled={isSaving || isDoomed} className="flex-1 md:flex-none shadow-md">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Apply Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-12">
                {/* Visual Preview - Stickily moves with the user */}
                <div className="lg:col-span-12">
                    <Card className="shadow-sm border-slate-200 overflow-hidden">
                        <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-nb-green" />
                                Live Design Preview
                            </CardTitle>
                            <span className="text-[9px] bg-nb-green/10 text-nb-green px-2 py-0.5 rounded font-bold uppercase tracking-wider">Real-time</span>
                        </CardHeader>
                        <CardContent className="p-6 bg-slate-50/30">
                            <div className="max-w-4xl mx-auto space-y-12">
                                {/* Headings Preview */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-px flex-1 bg-slate-200" />
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Typography Scale</span>
                                        <div className="h-px flex-1 bg-slate-200" />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="group relative">
                                            <Typography variant="h1" className="mb-2 text-4xl">The Nature's Boon Heritage</Typography>
                                            <span className="text-[9px] text-slate-400 font-medium">Hero / H1 - {localTheme.typography?.headingFont}</span>
                                        </div>

                                        <div className="group relative">
                                            <Typography variant="section-title" className="mb-2">Sustainable Manufacturing Expertise</Typography>
                                            <span className="text-[9px] text-slate-400 font-medium">Section Title - {localTheme.typography?.headingFont}</span>
                                        </div>

                                        <div className="group relative">
                                            <Typography variant="section-subtitle" color="slate-600">
                                                We combine traditional herbal wisdom with state-of-the-art laboratory testing
                                                to deliver unmatched purity in personal care manufacturing.
                                            </Typography>
                                            <span className="text-[10px] text-slate-400 font-medium mt-2 block">Section Subtitle - {localTheme.typography?.bodyFont}</span>
                                        </div>

                                        <div className="group relative">
                                            <Typography variant="body" color="slate-500">
                                                Nature's Boon is a global leader in personal care manufacturing, specializing in OEM,
                                                Private Label, and innovative R&D solutions for premium brands worldwide.
                                                Our facilities are ISO certified and follow strict GMP guidelines.
                                            </Typography>
                                            <span className="text-[10px] text-slate-400 font-medium mt-2 block">Body Text / Paragraph - {localTheme.typography?.bodyFont}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-4 items-center">
                                            <Typography variant="detail" color="nb-green" uppercase className="px-3 py-1 bg-nb-green/10 rounded-full border border-nb-green/20">
                                                Premium Quality
                                            </Typography>
                                            <Typography variant="detail" color="slate-600" weight="bold" uppercase>
                                                ISO 9001 Certified
                                            </Typography>
                                            <span className="text-[10px] text-slate-400 font-medium">Detail / Tags</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Color Swatches */}
                                <div className="pt-8 border-t border-slate-200/60">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Core Palette</span>
                                    <style suppressHydrationWarning>{`
                                        .swatch-primary { background-color: ${localTheme.colors?.primary}; }
                                        .swatch-secondary { background-color: ${localTheme.colors?.secondary}; }
                                        .swatch-muted { background-color: ${localTheme.colors?.textMuted}; }
                                        .swatch-accent { background-color: ${localTheme.colors?.accent}; }
                                    `}</style>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <div className="h-16 rounded-xl border border-black/5 shadow-inner swatch-primary" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">Brand Green</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">{localTheme.colors?.primary}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-16 rounded-xl border border-black/5 shadow-inner swatch-secondary" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">Ebony / Dark</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">{localTheme.colors?.secondary}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-16 rounded-xl border border-black/5 shadow-inner swatch-muted" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">Steel / Muted</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">{localTheme.colors?.textMuted}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-16 rounded-xl border border-black/5 shadow-inner swatch-accent" />
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-800">Highlight Green</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">{localTheme.colors?.accent}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Left Column: Color & Geometry */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Brand Presets */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-nb-green" />
                                Brand Presets
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {PRESETS.map((p, index) => (
                                    <button
                                        key={p.name}
                                        onClick={() => applyPreset(p.colors)}
                                        className="flex flex-col items-start p-3 rounded-xl bg-white border border-slate-200 hover:border-nb-green/40 hover:bg-nb-green/5 transition-all text-left"
                                    >
                                        <style suppressHydrationWarning>{`
                                            .preset-${index}-0 { background-color: ${p.colors.primary}; }
                                            .preset-${index}-1 { background-color: ${p.colors.accent}; }
                                            .preset-${index}-2 { background-color: ${p.colors.secondary}; }
                                        `}</style>
                                        <div className="flex gap-1 mb-2">
                                            <div className={`w-3 h-3 rounded-full border border-black/5 preset-${index}-0`} />
                                            <div className={`w-3 h-3 rounded-full border border-black/5 preset-${index}-1`} />
                                            <div className={`w-3 h-3 rounded-full border border-black/5 preset-${index}-2`} />
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-700 leading-tight">{p.name}</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* color Palette */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-nb-green" />
                                Brand Colors
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            {[
                                { key: 'primary', label: 'Primary Brand Green' },
                                { key: 'secondary', label: 'Ebony (Deep Text/Dark)' },
                                { key: 'accent', label: 'Accent / Highlight Green' },
                                { key: 'text', label: 'Base Text Color' },
                                { key: 'textMuted', label: 'Steel (Muted/Secondary Text)' },
                                { key: 'backgroundAlt', label: 'Surface / Background Alt' },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-all group">
                                    <div className="flex flex-col">
                                        <label className="text-[11px] font-bold text-slate-700">{item.label}</label>
                                        <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider">{localTheme.colors?.[item.key]}</span>
                                    </div>
                                    <ColorPicker
                                        value={localTheme.colors?.[item.key]}
                                        onChange={(c) => updateSetting("colors", item.key, c)}
                                    />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Geometry */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Maximize className="w-4 h-4 text-nb-green" />
                                System Geometry
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">Button Corner Radius</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={localTheme.buttons?.borderRadius || "12"}
                                        onChange={(e) => updateSetting("buttons", "borderRadius", e.target.value)}
                                        className="h-10 text-sm font-bold border-slate-200 focus:ring-2 focus:ring-nb-green pr-10"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">px</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700">Max Container Width</label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={localTheme.spacing?.containerMaxWidth || "1280"}
                                        onChange={(e) => updateSetting("spacing", "containerMaxWidth", e.target.value)}
                                        className="h-10 text-sm font-bold border-slate-200 focus:ring-2 focus:ring-nb-green pr-12"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">px</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Typography & History */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Typography Settings */}
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Type className="w-4 h-4 text-nb-green" />
                                Typography Control
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-6">
                            {/* Headings Font */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                        <Star className="w-4 h-4 text-nb-green" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Brand Headings</span>
                                </div>
                                <FontPicker
                                    value={localTheme.typography?.headingFont || "system-ui"}
                                    onChange={(f) => updateSetting("typography", "headingFont", f)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={localTheme.typography?.headingWeight || "700"}
                                        onChange={(e) => updateSetting("typography", "headingWeight", e.target.value)}
                                        className="h-10 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 px-3 shadow-sm focus:ring-2 focus:ring-nb-green outline-none"
                                        title="Heading Weight"
                                    >
                                        <option value="400">Regular</option>
                                        <option value="600">Semi-Bold</option>
                                        <option value="700">Bold</option>
                                        <option value="900">Black</option>
                                    </select>
                                    <Input
                                        value={localTheme.typography?.headingLetterSpacing || "0em"}
                                        onChange={(e) => updateSetting("typography", "headingLetterSpacing", e.target.value)}
                                        className="h-10 text-sm font-bold bg-white border-slate-200 focus:ring-2 focus:ring-nb-green"
                                        placeholder="Letter Spacing"
                                    />
                                </div>
                            </div>

                            {/* Body Font */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reading Experience</span>
                                </div>
                                <FontPicker
                                    value={localTheme.typography?.bodyFont || "system-ui"}
                                    onChange={(f) => updateSetting("typography", "bodyFont", f)}
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <select
                                        value={localTheme.typography?.bodyWeight || "400"}
                                        onChange={(e) => updateSetting("typography", "bodyWeight", e.target.value)}
                                        className="h-10 rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700 px-3 shadow-sm focus:ring-2 focus:ring-nb-green outline-none"
                                        title="Body Weight"
                                    >
                                        <option value="300">Light</option>
                                        <option value="400">Regular</option>
                                        <option value="500">Medium</option>
                                        <option value="600">Semi-Bold</option>
                                    </select>
                                    <Input
                                        value={localTheme.typography?.bodyLineHeight || "1.5"}
                                        onChange={(e) => updateSetting("typography", "bodyLineHeight", e.target.value)}
                                        className="h-10 text-sm font-bold bg-white border-slate-200 focus:ring-2 focus:ring-nb-green"
                                        placeholder="Line Height"
                                    />
                                </div>
                            </div>

                            {/* Logo Font */}
                            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm">
                                        <Layout className="w-4 h-4 text-nb-green" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Logo Branding</span>
                                </div>
                                <FontPicker
                                    value={localTheme.typography?.logoFont || "Inter"}
                                    onChange={(f) => updateSetting("typography", "logoFont", f)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Snapshots Column */}
                <div className="lg:col-span-3">
                    <div className="h-full flex flex-col gap-6">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 text-nb-green" />
                                    Snapshots
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <Input
                                    placeholder="Version label..."
                                    value={snapshotName}
                                    onChange={(e) => setSnapshotName(e.target.value)}
                                    className="h-10 text-sm font-bold border-slate-200 focus:ring-2 focus:ring-nb-green"
                                />
                                <Button
                                    className="w-full bg-nb-green hover:bg-nb-green/90 text-xs h-10 font-bold tracking-wide text-white shadow-sm"
                                    onClick={handleCreateSnapshot}
                                    disabled={isCreatingSnapshot || !snapshotName}
                                >
                                    {isCreatingSnapshot ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                                    Create Backup
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="flex-1 shadow-sm border-slate-200 flex flex-col min-h-[300px]">
                            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-sm font-semibold tracking-tight text-slate-800">Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 flex-1 overflow-y-auto">
                                <div className="space-y-1.5 pt-2">
                                    {snapshots?.map((snap) => (
                                        <div key={snap._id} className="group p-3 rounded-xl bg-white border border-slate-100 hover:border-nb-green/30 transition-all flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-700">{snap.name}</span>
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                                    {new Date(snap._creationTime).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleRestoreSnapshot(snap)}
                                                    className="p-1.5 text-slate-400 hover:text-nb-green bg-slate-50 rounded-lg"
                                                    title="Restore"
                                                >
                                                    {restoringId === snap._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw size={14} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSnapshot(snap._id)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500 bg-slate-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {snapshots?.length === 0 && (
                                        <div className="py-12 text-center flex flex-col items-center gap-2">
                                            <Clock className="w-8 h-8 text-slate-200" />
                                            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No history yet</span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
