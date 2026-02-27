"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { Loader2, Save, Undo, Plus, Trash2, ArrowUp, ArrowDown, Clock, RotateCcw, Layout, Image as ImageIcon, Star } from "lucide-react";
import { ImagePicker } from "@/components/ImagePicker";
import { FontPicker } from "@/components/admin/FontPicker";
import { Download } from "lucide-react";

const PRESETS = [
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
        name: "Royal Midnight",
        colors: {
            primary: "#1e40af",
            secondary: "#0f172a",
            accent: "#3b82f6",
            background: "#ffffff",
            backgroundAlt: "#f1f5f9",
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

export default function SettingsPage() {
    const { theme, saveAll, reset } = useTheme();
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [isSaving, setIsSaving] = useState(false);
    const [isDoomed, setIsDoomed] = useState(false);

    // Site Settings State
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);
    const updateSiteSetting = useMutation(api.siteSettings.updateSiteSetting);
    const [logoText, setLogoText] = useState("");
    const [logoImage, setLogoImage] = useState("");
    const [logoFont, setLogoFont] = useState("");
    const [siteTitle, setSiteTitle] = useState("");
    const [faviconUrl, setFaviconUrl] = useState("");
    const [contactText, setContactText] = useState("");
    const [footerDescription, setFooterDescription] = useState("");
    const [footerCopyrightText, setFooterCopyrightText] = useState("");
    const [navLinks, setNavLinks] = useState<any[]>([]);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
    const [isSavingSite, setIsSavingSite] = useState(false);

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

    useEffect(() => {
        if (siteSettings) {
            setLogoText(siteSettings.logoText || "NatureBoon");
            setLogoImage(siteSettings.logoImage || "");
            setLogoFont(localTheme.typography?.logoFont || "Inter");
            setSiteTitle(siteSettings.siteTitle || "NatureBoon | Premium Manufacturing Platform");
            setFaviconUrl(siteSettings.faviconUrl || "");
            setContactText(siteSettings.contactText || "Contact Us");
            setFooterDescription(siteSettings.footerDescription || "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.");
            setFooterCopyrightText(siteSettings.footerCopyrightText || `© ${new Date().getFullYear()} NatureBoon. All rights reserved.`);
            setNavLinks(siteSettings.navLinks || [
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Products", href: "/products" },
                { label: "Blogs", href: "/blogs" },
            ]);
            setSocialLinks(siteSettings.socialLinks || [
                { platform: "linkedin", href: "#" },
                { platform: "instagram", href: "#" }
            ]);
            setDiscordWebhookUrl(siteSettings.discord_webhook_url || "");
        }
    }, [siteSettings]);


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
            // Also update buttons primaryBg just in case
            buttons: {
                ...prev.buttons,
                primaryBg: presetColors.primary
            }
        }));
    };

    const handleSaveAll = async () => {
        setIsSaving(true);
        setIsSavingSite(true);
        try {
            // Update logoFont in theme settings
            const updatedTheme = {
                ...localTheme,
                typography: {
                    ...localTheme.typography,
                    logoFont: logoFont
                }
            };

            await Promise.all([
                saveAll({ settings: updatedTheme }),
                updateSiteSetting({ key: "logoText", value: logoText }),
                updateSiteSetting({ key: "logoImage", value: logoImage }),
                updateSiteSetting({ key: "siteTitle", value: siteTitle }),
                updateSiteSetting({ key: "faviconUrl", value: faviconUrl }),
                updateSiteSetting({ key: "contactText", value: contactText }),
                updateSiteSetting({ key: "footerDescription", value: footerDescription }),
                updateSiteSetting({ key: "footerCopyrightText", value: footerCopyrightText }),
                updateSiteSetting({ key: "navLinks", value: navLinks }),
                updateSiteSetting({ key: "socialLinks", value: socialLinks }),
                updateSiteSetting({ key: "discord_webhook_url", value: discordWebhookUrl }),
            ]);

        } catch (error) {
            console.error(error);
            alert("Failed to save settings");
        } finally {
            setIsSaving(false);
            setIsSavingSite(false);
        }
    };

    const handleResetTheme = async () => {
        if (!confirm("Are you sure you want to reset to default theme?")) return;
        setIsDoomed(true);
        try {
            await reset();
        } finally {
            setIsDoomed(false);
        }
    };

    const addLink = () => {
        setNavLinks([...navLinks, { label: "New Link", href: "/" }]);
    };

    const removeLink = (index: number) => {
        const newLinks = [...navLinks];
        newLinks.splice(index, 1);
        setNavLinks(newLinks);
    };

    const updateLink = (index: number, key: string, value: string) => {
        const newLinks = [...navLinks];
        newLinks[index] = { ...newLinks[index], [key]: value };
        setNavLinks(newLinks);
    };

    const moveLink = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === navLinks.length - 1) return;

        const newLinks = [...navLinks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = newLinks[targetIndex];
        newLinks[targetIndex] = newLinks[index];
        newLinks[index] = temp;
        setNavLinks(newLinks);
    };

    const handleCreateSnapshot = async (isPreset = false) => {
        if (!snapshotName.trim()) return;
        setIsCreatingSnapshot(true);
        try {
            await createSnapshot({
                name: snapshotName,
                theme: localTheme,
                isPreset,
                siteSettings: {
                    logoText,
                    siteTitle,
                    faviconUrl,
                    contactText,
                    footerDescription,
                    footerCopyrightText,
                    navLinks,
                    socialLinks
                }
            });
            setSnapshotName("");
        } catch (err) {
            console.error(err);
            alert("Failed to create backup");
        } finally {
            setIsCreatingSnapshot(false);
        }
    };

    const handleRestoreSnapshot = async (snapshot: any) => {
        if (!confirm(`Are you sure you want to restore "${snapshot.name}"? Current unsaved changes will be lost.`)) return;
        setRestoringId(snapshot._id);
        try {
            await restoreSnapshot({
                theme: snapshot.theme,
                siteSettings: snapshot.siteSettings
            });
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Failed to restore backup");
            setRestoringId(null);
        }
    };

    const handleExportConfig = () => {
        const configToExport = {
            theme: localTheme,
            siteSettings: {
                logoText,
                logoImage,
                siteTitle,
                faviconUrl,
                contactText,
                footerDescription,
                footerCopyrightText,
                navLinks,
                socialLinks,
                discordWebhookUrl
            }
        };
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configToExport, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "natureboon-theme-config.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    if (!localTheme) return <div>Loading...</div>;

    return (
        <div className="space-y-4 pb-20 max-w-[1600px] mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-4 rounded-2xl border border-white/20 backdrop-blur-sm sticky top-0 z-50">
                <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <div className="w-2 h-8 bg-nb-green rounded-full animate-pulse" />
                        Site Intelligence
                    </h1>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest ml-4">Core visual & functional controls</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" size="sm" onClick={handleExportConfig} className="flex-1 md:flex-none" title="Download current settings as JSON for hardcoding">
                        <Download className="w-3 h-3 mr-2" />
                        Export Config
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleResetTheme} disabled={isSaving || isDoomed} className="flex-1 md:flex-none">
                        {isDoomed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo className="w-3 h-3 mr-2" />}
                        Reset
                    </Button>
                    <Button size="sm" onClick={handleSaveAll} disabled={isSaving || isSavingSite || isDoomed} className="flex-1 md:flex-none">
                        {(isSaving || isSavingSite) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-3 h-3 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
                {/* Row 1: Visual & Layout Logic */}
                <div className="lg:col-span-4 space-y-4">
                    {/* Theme Presets */}
                    <Card className="shadow-sm border-none bg-nb-green/5 overflow-hidden">
                        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-nb-green">Quick Styles</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-4">
                            <div className="grid grid-cols-2 gap-2">
                                {PRESETS.map((p, index) => {
                                    const presetId = `preset-${index}`;
                                    return (
                                        <button
                                            key={p.name}
                                            onClick={() => applyPreset(p.colors)}
                                            className={`flex flex-col items-start p-2.5 rounded-xl bg-white border border-nb-green/10 hover:border-nb-green/40 transition-all text-left group ${presetId}`}
                                        >
                                            <style>{`
                                                .${presetId} .p-color { background-color: ${p.colors.primary}; }
                                                .${presetId} .a-color { background-color: ${p.colors.accent}; }
                                                .${presetId} .s-color { background-color: ${p.colors.secondary}; }
                                            `}</style>
                                            <div className="flex gap-1 mb-2">
                                                <div className="w-3 h-3 rounded-full border border-black/5 p-color" />
                                                <div className="w-3 h-3 rounded-full border border-black/5 a-color" />
                                                <div className="w-3 h-3 rounded-full border border-black/5 s-color" />
                                            </div>
                                            <span className="text-[10px] font-black tracking-tight text-slate-700">{p.name}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Colors - Compact Grid */}
                    <Card className="h-full shadow-sm border-none bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                                <Star className="w-4 h-4 text-nb-green" />
                                Palette
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            <div className="grid grid-cols-2 gap-1.5 font-sans">
                                {Object.entries(localTheme.colors || {})
                                    .map(([key, value]) => (
                                        <div key={key} className="flex flex-col p-2 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group relative">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1 truncate">{key.replace(/-/g, " ")}</label>
                                            <ColorPicker
                                                value={value as string}
                                                onChange={(c) => updateSetting("colors", key, c)}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-5">
                    {/* Geometry & Typography */}
                    <Card className="h-full shadow-sm border-none bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-2">
                                <Layout className="w-4 h-4 text-nb-green" />
                                System Geometry
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Button Radius</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            value={localTheme.buttons?.borderRadius || "12"}
                                            onChange={(e) => updateSetting("buttons", "borderRadius", e.target.value)}
                                            className="h-10 text-sm font-black bg-slate-50 border-none transition-all focus-visible:bg-white focus-visible:ring-nb-green/20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 pointer-events-none group-focus-within:text-nb-green/40 transition-colors uppercase">px</span>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Max Width</label>
                                    <div className="relative group">
                                        <Input
                                            type="number"
                                            value={localTheme.spacing?.containerMaxWidth || "1280"}
                                            onChange={(e) => updateSetting("spacing", "containerMaxWidth", e.target.value)}
                                            className="h-10 text-sm font-black bg-slate-50 border-none transition-all focus-visible:bg-white focus-visible:ring-nb-green/20"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 pointer-events-none group-focus-within:text-nb-green/40 transition-colors uppercase">px</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-3">
                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Star className="w-3 h-3 text-slate-400" />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none">Headings</span>
                                    </div>
                                    <FontPicker
                                        value={localTheme.typography?.headingFont || "system-ui"}
                                        onChange={(f) => updateSetting("typography", "headingFont", f)}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={localTheme.typography?.headingWeight || "700"}
                                            onChange={(e) => updateSetting("typography", "headingWeight", e.target.value)}
                                            className="h-8 rounded-xl bg-white border-none text-[10px] font-bold text-slate-600 px-3 shadow-sm focus:ring-1 focus:ring-nb-green/20 cursor-pointer"
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
                                            className="h-8 text-[10px] font-bold bg-white border-none shadow-sm px-3 focus-visible:ring-1 focus-visible:ring-nb-green/20"
                                            placeholder="Spacing"
                                        />
                                    </div>
                                </div>

                                <div className="p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Star className="w-3 h-3 text-slate-400" />
                                        </div>
                                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest leading-none">Body</span>
                                    </div>
                                    <FontPicker
                                        value={localTheme.typography?.bodyFont || "system-ui"}
                                        onChange={(f) => updateSetting("typography", "bodyFont", f)}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <select
                                            value={localTheme.typography?.bodyWeight || "400"}
                                            onChange={(e) => updateSetting("typography", "bodyWeight", e.target.value)}
                                            className="h-8 rounded-xl bg-white border-none text-[10px] font-bold text-slate-600 px-3 shadow-sm focus:ring-1 focus:ring-nb-green/20 cursor-pointer"
                                            title="Body Weight"
                                        >
                                            <option value="300">Light</option>
                                            <option value="400">Regular</option>
                                            <option value="500">Medium</option>
                                            <option value="600">Semi-Bold</option>
                                        </select>
                                        <Input
                                            value={localTheme.typography?.lineHeight || "1.5"}
                                            onChange={(e) => updateSetting("typography", "lineHeight", e.target.value)}
                                            className="h-8 text-[10px] font-bold bg-white border-none shadow-sm px-3 focus-visible:ring-1 focus-visible:ring-nb-green/20"
                                            placeholder="Line Height"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    {/* Snapshot Area */}
                    <div className="h-full flex flex-col gap-4">
                        <Card className="shadow-sm border-none bg-nb-green/5 overflow-hidden">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-wider text-nb-green">Quick Snap</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 space-y-2">
                                <Input
                                    placeholder="Snapshot label..."
                                    value={snapshotName}
                                    onChange={(e) => setSnapshotName(e.target.value)}
                                    className="h-10 text-xs font-bold bg-white border-none shadow-sm focus-visible:ring-nb-green/20"
                                />
                                <Button
                                    className="w-full bg-nb-green hover:bg-nb-green/90 text-[10px] h-10 font-black uppercase tracking-widest text-white shadow-lg shadow-nb-green/20 border-nb-green"
                                    onClick={() => handleCreateSnapshot(false)}
                                    disabled={isCreatingSnapshot || !snapshotName}
                                >
                                    {isCreatingSnapshot ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Clock className="w-3 h-3 mr-2" />}
                                    Snap Backup
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="flex-1 shadow-sm border-none bg-white/50 backdrop-blur-sm overflow-hidden flex flex-col">
                            <CardHeader className="p-4 pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400">History</CardTitle>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 flex-1 overflow-y-auto">
                                <div className="space-y-1.5">
                                    {snapshots?.map((snap) => (
                                        <div key={snap._id} className="group p-2.5 rounded-xl bg-white border border-slate-100 hover:border-nb-green/30 transition-all flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-slate-700 tracking-tight">{snap.name}</span>
                                                <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                                                    {new Date(snap._creationTime).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleRestoreSnapshot(snap)}
                                                    className="p-1 text-slate-300 hover:text-nb-green"
                                                    title="Restore"
                                                >
                                                    <RotateCcw size={12} />
                                                </button>
                                                <button
                                                    onClick={() => deleteSnapshot({ id: snap._id })}
                                                    className="p-1 text-slate-300 hover:text-red-400"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {snapshots?.length === 0 && (
                                        <div className="py-8 text-center text-[10px] font-bold text-slate-300 italic">No backups found</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Row 2: Site Intelligence & Management */}
                <div className="lg:col-span-4">
                    {/* Branding Info */}
                    <Card className="h-full shadow-sm border-none bg-white/80 backdrop-blur-sm">
                        <CardHeader className="p-4 pt-3 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-wider">Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4 font-sans">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Site Title (Browser Tab)</label>
                                <Input
                                    value={siteTitle}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSiteTitle(e.target.value)}
                                    className="bg-slate-50 border-none font-bold text-sm h-10"
                                    placeholder="Company Name | Tagline"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Favicon (Browser Icon)</label>
                                <ImagePicker
                                    value={faviconUrl}
                                    onChange={setFaviconUrl}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo Text</label>
                                <Input
                                    value={logoText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoText(e.target.value)}
                                    className="bg-slate-50 border-none font-bold text-sm h-10"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo Image / SVG</label>
                                <ImagePicker
                                    value={logoImage}
                                    onChange={setLogoImage}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Logo Font</label>
                                <FontPicker
                                    value={logoFont}
                                    onChange={setLogoFont}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CTA Text</label>
                                <Input
                                    value={contactText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactText(e.target.value)}
                                    className="bg-slate-50 border-none font-bold text-sm h-10"
                                />
                            </div>
                            <div className="space-y-1.5 pt-2 border-t border-nb-green/10">
                                <label className="text-[9px] font-black text-nb-green uppercase tracking-widest">Discord Webhook Notification</label>
                                <Input
                                    value={discordWebhookUrl}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscordWebhookUrl(e.target.value)}
                                    placeholder="https://discord.com/api/webhooks/..."
                                    className="bg-nb-green/5 border-none font-medium text-xs h-10"
                                />
                                <p className="text-[8px] text-slate-400 font-bold uppercase italic">Inquiries will be sent here</p>
                            </div>
                        </CardContent>

                    </Card>
                </div>

                <div className="lg:col-span-4">
                    {/* Footer Controls */}
                    <Card className="h-full shadow-sm border-none bg-white/80 backdrop-blur-sm">
                        <CardHeader className="p-4 pt-3 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-wider">Footer Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-4 font-sans">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea
                                    value={footerDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFooterDescription(e.target.value)}
                                    className="w-full min-h-[80px] p-4 text-xs font-black rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-nb-green/10 resize-none transition-all"
                                    placeholder="Company footer description..."
                                />
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Social Graph</label>
                                    <button
                                        onClick={() => setSocialLinks([...socialLinks, { platform: "linkedin", href: "" }])}
                                        className="text-[9px] font-black text-nb-green flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={10} /> Add Account
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {socialLinks.map((link, i) => (
                                        <div key={i} className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100/50">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks[i].platform = e.target.value;
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="bg-transparent border-none text-[10px] font-black uppercase text-nb-green/60 p-0 focus:ring-0 cursor-pointer"
                                                title="Social Platform"
                                            >
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="twitter">Twitter</option>
                                            </select>
                                            <div className="w-px h-3 bg-slate-200" />
                                            <button
                                                onClick={() => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks.splice(i, 1);
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="text-slate-300 hover:text-red-400 transition-colors"
                                                title="Remove Account"
                                            >
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    {/* Navigation - Site Map */}
                    <Card className="h-full shadow-sm border-none bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardHeader className="p-4 pt-3 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-black uppercase tracking-wider">Navigation</CardTitle>
                            <Button variant="ghost" size="sm" onClick={addLink} className="h-7 px-2 text-[10px] font-black uppercase text-slate-500 hover:text-nb-green">
                                <Plus className="w-3 h-3 mr-1" /> Add Node
                            </Button>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            <div className="rounded-xl border border-slate-100 overflow-hidden bg-white">
                                <table className="w-full text-left text-[10px]">
                                    <thead className="bg-slate-50 border-b border-slate-100 uppercase tracking-widest text-[8px] font-black text-slate-400">
                                        <tr>
                                            <th className="px-3 py-2">Label</th>
                                            <th className="px-3 py-2">Path</th>
                                            <th className="px-3 py-2 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {navLinks.map((link, i) => (
                                            <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                                                <td className="p-1 px-3">
                                                    <Input
                                                        className="h-7 text-[10px] font-black bg-transparent border-none p-0 focus-within:ring-0"
                                                        value={link.label}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "label", e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-1 px-3">
                                                    <Input
                                                        className="h-7 text-[10px] font-bold text-slate-400 bg-transparent border-none p-0 focus-within:ring-0"
                                                        value={link.href}
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "href", e.target.value)}
                                                    />
                                                </td>
                                                <td className="p-1 px-3 text-right">
                                                    <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => moveLink(i, 'up')} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-0" title="Move Up"><ArrowUp size={10} /></button>
                                                        <button onClick={() => removeLink(i)} className="p-1 text-red-300 hover:text-red-500" title="Remove Node"><Trash2 size={10} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
