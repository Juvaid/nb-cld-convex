"use client";

import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { ColorPicker } from "@/components/ui/color-picker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
    Loader2, Save, Undo, Clock, RotateCcw, Layout,
    Star, FileText, Download, Bookmark, Sparkles,
    Settings as SettingsIcon, Package, Palette, Mail, MessageSquare, Globe,
    Trash2, Plus, ArrowUp, ArrowDown, ArrowUpDown, Image as ImageIcon, Phone
} from "lucide-react";
import Link from "next/link";
import { ImagePicker } from "@/components/ImagePicker";
import { FontPicker } from "@/components/admin/FontPicker";
import { MegaMenuConfigModal } from "@/components/admin/MegaMenuConfigModal";
import { MegaMenuConfig } from "@/components/MegaMenu";

export default function SettingsPage() {
    const { theme, saveAll, reset } = useTheme();
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [isSaving, setIsSaving] = useState(false);
    const [isDoomed, setIsDoomed] = useState(false);
    const { token } = useAuth();
    const router = useRouter();

    // Site Settings State
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);
    const updateSiteSetting = useMutation(api.siteSettings.updateSiteSetting);
    const [logoText, setLogoText] = useState("");
    const [logoImage, setLogoImage] = useState("");
    const [siteTitle, setSiteTitle] = useState("");
    const [faviconUrl, setFaviconUrl] = useState("");
    const [contactText, setContactText] = useState("");
    const [footerDescription, setFooterDescription] = useState("");
    const [footerCopyrightText, setFooterCopyrightText] = useState("");
    const [navLinks, setNavLinks] = useState<any[]>([]);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const [discordWebhookUrl, setDiscordWebhookUrl] = useState("");
    const [whatsappApiKey, setWhatsappApiKey] = useState("");
    const [whatsappPhone, setWhatsappPhone] = useState("");
    const [whatsappMessage, setWhatsappMessage] = useState("");
    const [floatingWidget, setFloatingWidget] = useState<any>({
        enabled: false,
        position: "right",
        vAlign: "bottom",
        whatsapp: "",
        phone: "",
        catalogStorageId: "",
        popupDelay: 0,
        enableSearch: true,
        isDismissible: true,
    });
    const [isSavingSite, setIsSavingSite] = useState(false);

    // Snapshots State
    const snapshots = useQuery(api.theme.listThemeSnapshots, {});
    const createSnapshot = useMutation(api.theme.createThemeSnapshot);
    const deleteSnapshot = useMutation(api.theme.deleteThemeSnapshot);
    const restoreSnapshot = useMutation(api.theme.restoreThemeSnapshot);
    const [snapshotName, setSnapshotName] = useState("");
    const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
    const [restoringId, setRestoringId] = useState<string | null>(null);

    // Mega Menu Modal State
    const [editingMegaMenuIdx, setEditingMegaMenuIdx] = useState<number | null>(null);

    useEffect(() => {
        if (theme) {
            setLocalTheme(theme);
        }
    }, [theme]);

    useEffect(() => {
        if (siteSettings) {
            setLogoText(siteSettings.logoText || "Nature's Boon");
            setLogoImage(siteSettings.logoImage || "");
            setSiteTitle(siteSettings.siteTitle || "Nature's Boon | Premium Manufacturing Platform");
            setFaviconUrl(siteSettings.faviconUrl || "");
            setContactText(siteSettings.contactText || "Contact Us");
            setFooterDescription(siteSettings.footerDescription || "A global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions.");
            setFooterCopyrightText(siteSettings.footerCopyrightText || `© ${new Date().getFullYear()} Nature's Boon. All rights reserved.`);
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
            setWhatsappApiKey(siteSettings.whatsapp_api_key || "");
            setWhatsappPhone(siteSettings.whatsapp_phone || "");
            setWhatsappMessage(siteSettings.whatsapp_message || "Hi, I'd like to enquire about manufacturing services.");
            setFloatingWidget(siteSettings.floating_widget || {
                enabled: false,
                position: "right",
                vAlign: "bottom",
                whatsapp: "",
                phone: "",
                catalogStorageId: "",
                popupDelay: 0,
                enableSearch: true,
                isDismissible: true,
            });
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

    const handleSaveAll = async () => {
        if (!token) {
            alert("Session not found. Please log in again.");
            router.push("/login");
            return;
        }
        setIsSaving(true);
        setIsSavingSite(true);
        try {
            await Promise.all([
                // We don't save theme here anymore to avoid overwriting designer changes
                // saveAll({ settings: updatedTheme }),
                updateSiteSetting({ key: "logoText", value: logoText, token: token ?? undefined }),
                updateSiteSetting({ key: "logoImage", value: logoImage, token: token ?? undefined }),
                updateSiteSetting({ key: "siteTitle", value: siteTitle, token: token ?? undefined }),
                updateSiteSetting({ key: "faviconUrl", value: faviconUrl, token: token ?? undefined }),
                updateSiteSetting({ key: "contactText", value: contactText, token: token ?? undefined }),
                updateSiteSetting({ key: "footerDescription", value: footerDescription, token: token ?? undefined }),
                updateSiteSetting({ key: "footerCopyrightText", value: footerCopyrightText, token: token ?? undefined }),
                updateSiteSetting({ key: "navLinks", value: navLinks, token: token ?? undefined }),
                updateSiteSetting({ key: "socialLinks", value: socialLinks, token: token ?? undefined }),
                updateSiteSetting({ key: "discord_webhook_url", value: discordWebhookUrl, token: token ?? undefined }),
                updateSiteSetting({ key: "whatsapp_api_key", value: whatsappApiKey, token: token ?? undefined }),
                updateSiteSetting({ key: "whatsapp_phone", value: whatsappPhone, token: token ?? undefined }),
                updateSiteSetting({ key: "whatsapp_message", value: whatsappMessage, token: token ?? undefined }),
                updateSiteSetting({ key: "floating_widget", value: floatingWidget, token: token ?? undefined }),
            ]);

            // Clear cache so metadata (favicon, title) updates immediately
            fetch('/api/revalidate?path=layout', { method: 'POST' }).catch(console.error);

        } catch (error: any) {
            console.error(error);
            const message = error.data || error.message || "Failed to save settings";
            alert(message);
        } finally {
            setIsSaving(false);
            setIsSavingSite(false);
        }
    };

    const handleResetTheme = async () => {
        if (!confirm("Are you sure you want to reset to default theme?")) return;
        setIsDoomed(true);
        try {
            await reset({ token: token ?? undefined });
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
                    socialLinks,
                },
                token: token ?? undefined
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
                siteSettings: snapshot.siteSettings,
                token: token ?? undefined
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
                discordWebhookUrl,
                whatsappApiKey,
                whatsappPhone,
                floatingWidget
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
        <div className="space-y-6 pb-24 max-w-[1200px] mx-auto px-6">
            {/* High-End Command Center Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white/70 backdrop-blur-2xl p-6 rounded-[24px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] sticky top-6 z-50">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-12 h-12 bg-nb-green/10 rounded-2xl flex items-center justify-center transform rotate-3">
                            <SettingsIcon className="w-6 h-6 text-nb-green animate-spin-slow" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-nb-green rounded-full border-4 border-white animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
                            Site Intelligence
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-nb-green" />
                            <p className="text-sm text-slate-500 font-semibold uppercase tracking-widest">Global Control Center</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                    <Button 
                        variant="outline" 
                        onClick={handleExportConfig} 
                        className="flex-1 md:flex-none h-12 px-6 rounded-2xl bg-white border-slate-200 hover:border-nb-green hover:text-nb-green hover:shadow-lg hover:shadow-nb-green/5 transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={handleResetTheme} 
                        disabled={isSaving || isDoomed} 
                        className="flex-1 md:flex-none h-12 px-6 rounded-2xl bg-white border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-95"
                    >
                        {isDoomed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo className="w-4 h-4 mr-2" />}
                        Reset
                    </Button>
                    <Button 
                        onClick={handleSaveAll} 
                        disabled={isSaving || isSavingSite || isDoomed} 
                        className="flex-1 md:flex-none h-12 px-8 rounded-2xl bg-nb-green hover:bg-nb-green/90 text-white font-bold shadow-xl shadow-nb-green/20 hover:shadow-nb-green/30 transition-all active:scale-95"
                    >
                        {(isSaving || isSavingSite) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </header>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Visual Branding Card */}
                <div className="lg:col-span-4 group">
                    <Card className="h-full rounded-[24px] overflow-hidden border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 bg-white">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="p-1.5 bg-nb-green/10 rounded-lg">
                                    <Palette className="w-4 h-4 text-nb-green" />
                                </div>
                                Visual Branding
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-6 h-[calc(100%-60px)]">
                            <div className="relative">
                                <div className="w-24 h-24 bg-nb-green/5 rounded-[32px] flex items-center justify-center transform group-hover:rotate-6 transition-transform duration-500">
                                    <Palette className="w-12 h-12 text-nb-green" />
                                </div>
                                <div className="absolute -top-2 -right-2 p-2 bg-nb-green text-white rounded-full shadow-lg">
                                    <Sparkles size={16} />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">Theme & Design System</h3>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[240px]">
                                    Colors, typography and brand geometry are managed in the dedicated Theme section.
                                </p>
                            </div>
                            <Link href="/admin/theme" className="w-full">
                                <Button className="w-full h-14 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold group-hover:scale-[1.02] transition-all">
                                    Open Designer
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Snapshots / History Card */}
                <div className="lg:col-span-8 grid md:grid-cols-2 gap-8 h-full">
                    <Card className="rounded-[24px] border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="p-1.5 bg-nb-green/10 rounded-lg">
                                    <Bookmark className="w-4 h-4 text-nb-green" />
                                </div>
                                Quick Backup
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-center">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Snapshot Label</label>
                                <Input
                                    placeholder="Enter name..."
                                    value={snapshotName}
                                    onChange={(e) => setSnapshotName(e.target.value)}
                                    className="h-12 px-4 text-sm font-bold rounded-xl border-slate-200 focus:ring-4 focus:ring-nb-green/10 transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <Button
                                className="w-full h-12 rounded-xl bg-nb-green hover:bg-nb-green/90 text-white font-black text-[11px] tracking-wide shadow-lg shadow-nb-green/20 transition-all hover:scale-[1.02] active:scale-95"
                                onClick={() => handleCreateSnapshot(false)}
                                disabled={isCreatingSnapshot || !snapshotName}
                            >
                                {isCreatingSnapshot ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                                CREATE SNAPSHOT
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[24px] border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-base font-bold tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="p-1.5 bg-nb-green/10 rounded-lg">
                                    <Clock className="w-4 h-4 text-nb-green" />
                                </div>
                                System History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto max-h-[250px] scrollbar-hide">
                            <div className="divide-y divide-slate-50">
                                {snapshots?.map((snap) => (
                                    <div key={snap._id} className="group p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-black group-hover:bg-nb-green/10 group-hover:text-nb-green transition-colors">
                                                {snap.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">{snap.name}</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1.5 pt-0.5">
                                                    <Clock size={10} />
                                                    {new Date(snap._creationTime).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRestoreSnapshot(snap)}
                                                className="p-3 text-slate-300 hover:text-nb-green bg-white rounded-xl border border-transparent hover:border-nb-green/20 hover:shadow-lg transition-all"
                                                title="Restore"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteSnapshot({ id: snap._id, token: token ?? undefined })}
                                                className="p-3 text-slate-300 hover:text-rose-500 bg-white rounded-xl border border-transparent hover:border-rose-100 hover:shadow-lg transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {snapshots?.length === 0 && (
                                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                                            <RotateCcw className="w-8 h-8 text-slate-200" />
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No history points found</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Branding Identity Card */}
                <div className="lg:col-span-8">
                    <Card className="h-full rounded-[32px] border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-nb-green/10 rounded-xl">
                                    <ImageIcon className="w-5 h-5 text-nb-green" />
                                </div>
                                Branding Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Site Title</label>
                                        <Input
                                            value={siteTitle}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSiteTitle(e.target.value)}
                                            className="h-14 px-5 text-base font-bold rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10"
                                            placeholder="Nature's Boon | Premium..."
                                        />
                                    </div>
                                    <div className="space-y-2 text-center p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col items-center">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Favicon</label>
                                        <ImagePicker
                                            value={faviconUrl}
                                            onChange={setFaviconUrl}
                                        />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-2">Recommended: 32x32 PNG</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Logo Text</label>
                                        <Input
                                            value={logoText}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoText(e.target.value)}
                                            className="h-14 px-5 text-base font-bold rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10"
                                        />
                                    </div>
                                    <div className="space-y-2 text-center p-6 rounded-3xl bg-slate-50/50 border border-slate-100 flex flex-col items-center">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Logo Image</label>
                                        <ImagePicker
                                            value={logoImage}
                                            onChange={setLogoImage}
                                        />
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-2">Recommended: SVG or Transparent PNG</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-slate-50 grid md:grid-cols-2 gap-10">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Main CTA Label</label>
                                    <Input
                                        value={contactText}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactText(e.target.value)}
                                        className="h-14 px-5 text-base font-bold rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10"
                                        placeholder="Ex: Get Started"
                                    />
                                </div>
                                <div className="p-6 rounded-3xl bg-nb-green/[0.03] border border-nb-green/10 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-nb-green" />
                                        <span className="text-[10px] font-black text-nb-green uppercase tracking-widest">Notification Channels</span>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Input
                                                value={discordWebhookUrl}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscordWebhookUrl(e.target.value)}
                                                placeholder="Discord Webhook URL"
                                                className="h-10 text-xs font-medium border-slate-200 bg-white"
                                            />
                                        </div>
                                        <div className="flex gap-4">
                                            <Input
                                                value={whatsappPhone}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappPhone(e.target.value)}
                                                placeholder="WhatsApp #"
                                                className="flex-1 h-10 text-xs font-medium border-slate-200 bg-white"
                                            />
                                            <Input
                                                value={whatsappApiKey}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappApiKey(e.target.value)}
                                                placeholder="API Key"
                                                className="flex-1 h-10 text-xs font-medium border-slate-200 bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    {/* Footer Controls */}
                    <Card className="h-full rounded-[32px] border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
                            <CardTitle className="text-lg font-bold tracking-tight text-slate-800 flex items-center gap-3">
                                <div className="p-2 bg-nb-green/10 rounded-xl">
                                    <MessageSquare className="w-5 h-5 text-nb-green" />
                                </div>
                                Footer Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8 flex-1">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Brand Description</label>
                                <textarea
                                    value={footerDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFooterDescription(e.target.value)}
                                    className="w-full min-h-[120px] p-5 text-sm font-medium rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10 focus:border-nb-green/30 resize-none transition-all shadow-sm placeholder:text-slate-300"
                                    placeholder="Tell your brand story in the footer..."
                                />
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Social Profiles</label>
                                    <button
                                        onClick={() => setSocialLinks([...socialLinks, { platform: "linkedin", href: "" }])}
                                        className="text-[10px] font-black text-nb-green uppercase tracking-widest hover:text-nb-green/80 flex items-center gap-1.5 transition-colors"
                                    >
                                        <Plus size={12} strokeWidth={3} /> Add Profile
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {socialLinks.map((link, i) => (
                                        <div key={i} className="group flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-nb-green/20 hover:bg-white hover:shadow-lg transition-all">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks[i].platform = e.target.value;
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="w-24 h-9 rounded-xl border-slate-200 text-[10px] font-black uppercase tracking-tight px-3 focus:ring-nb-green cursor-pointer bg-white"
                                                title="Select Social Platform"
                                            >
                                                <option value="linkedin">LinkedIn</option>
                                                <option value="instagram">Instagram</option>
                                                <option value="facebook">Facebook</option>
                                                <option value="twitter">X (Twitter)</option>
                                            </select>
                                            <Input
                                                value={link.href}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks[i].href = e.target.value;
                                                    setSocialLinks(newLinks);
                                                }}
                                                placeholder="Profile URL"
                                                className="flex-1 h-9 text-xs font-bold bg-white border-slate-200 focus:ring-nb-green/20"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks.splice(i, 1);
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                                                title="Remove Profile"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    {/* Floating Contact Widget Configuration */}
                    <Card className="rounded-[40px] border-nb-green/20 bg-nb-green/[0.02] shadow-[0_20px_60px_rgba(34,197,94,0.05)] overflow-hidden">
                        <CardHeader className="p-10 border-b border-nb-green/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-nb-green/10 rounded-[20px] flex items-center justify-center">
                                    <MessageSquare className="w-7 h-7 text-nb-green" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">
                                        Support HUD Widget
                                    </CardTitle>
                                    <CardDescription className="text-slate-500 font-medium">Manage the persistent contact gateway for your visitors.</CardDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 text-slate-400 border-r border-slate-100 mr-1">Status</span>
                                <Button
                                    onClick={() => setFloatingWidget({ ...floatingWidget, enabled: !floatingWidget.enabled })}
                                    className={cn(
                                        "h-10 px-6 rounded-xl font-black text-[10px] tracking-widest transition-all",
                                        floatingWidget.enabled 
                                            ? "bg-nb-green text-white shadow-lg shadow-nb-green/20" 
                                            : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                    )}
                                >
                                    {floatingWidget.enabled ? "LIVE & ACTIVE" : "DORMANT"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid lg:grid-cols-12 gap-12">
                                <div className="lg:col-span-4 space-y-10">
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-nb-green">Interface Layout</h4>
                                        <div className="flex gap-4">
                                            {['left', 'right'].map((pos) => (
                                                <button
                                                    key={pos}
                                                    onClick={() => setFloatingWidget({ ...floatingWidget, position: pos as any })}
                                                    className={cn(
                                                        "flex-1 py-12 rounded-[32px] border-2 transition-all flex flex-col items-center justify-center gap-4 group relative overflow-hidden",
                                                        floatingWidget.position === pos
                                                            ? "border-nb-green bg-nb-green/[0.03] ring-8 ring-nb-green/5"
                                                            : "border-slate-100 bg-white hover:border-slate-200 shadow-sm hover:shadow-md"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-16 h-20 rounded-xl border-2 border-slate-200 relative bg-white",
                                                        pos === 'left' ? "bg-gradient-to-r from-nb-green/10 to-transparent" : "bg-gradient-to-l from-nb-green/10 to-transparent"
                                                    )}>
                                                        <div className={cn(
                                                            "absolute w-4 h-4 rounded-full bg-nb-green shadow-xl transition-all duration-500",
                                                            floatingWidget.vAlign === 'top' ? "top-3" : floatingWidget.vAlign === 'middle' ? "top-1/2 -translate-y-1/2" : "bottom-3",
                                                            pos === 'left' ? "left-3" : "right-3"
                                                        )} />
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-900 capitalize">{pos} Screen</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-nb-green">Precision Alignment</h4>
                                        <div className="flex gap-3">
                                            {[
                                                { id: 'top', icon: <ArrowUp className="w-4 h-4" /> },
                                                { id: 'middle', icon: <ArrowUpDown className="w-4 h-4" /> },
                                                { id: 'bottom', icon: <ArrowDown className="w-4 h-4" /> }
                                            ].map((pos) => (
                                                <button
                                                    key={pos.id}
                                                    onClick={() => setFloatingWidget({ ...floatingWidget, vAlign: pos.id as any })}
                                                    className={cn(
                                                        "flex-1 py-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2",
                                                        floatingWidget.vAlign === pos.id
                                                            ? "border-nb-green bg-nb-green/10 text-nb-green"
                                                            : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                                                    )}
                                                >
                                                    {pos.icon}
                                                    <span className="text-[10px] font-black uppercase tracking-tight">{pos.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-8 grid md:grid-cols-2 gap-10">
                                    <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white p-8 space-y-8">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Connection Details</h4>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase">
                                                    <div className="w-5 h-5 bg-[#25D366]/10 rounded-md flex items-center justify-center">
                                                        <MessageSquare className="w-3 h-3 text-[#25D366]" />
                                                    </div>
                                                    WhatsApp Hotline
                                                </label>
                                                <Input
                                                    value={floatingWidget.whatsapp}
                                                    onChange={(e) => setFloatingWidget({ ...floatingWidget, whatsapp: e.target.value })}
                                                    placeholder="+91 98765 43210"
                                                    className="h-14 text-base font-bold rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase">
                                                    <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
                                                        <Phone className="w-3 h-3 text-blue-600" />
                                                    </div>
                                                    Voice Line
                                                </label>
                                                <Input
                                                    value={floatingWidget.phone}
                                                    onChange={(e) => setFloatingWidget({ ...floatingWidget, phone: e.target.value })}
                                                    placeholder="+91 98765 43210"
                                                    className="h-14 text-base font-bold rounded-2xl border-slate-200 focus:ring-4 focus:ring-nb-green/10"
                                                />
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white p-8 space-y-6 flex flex-col">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Interaction & UX</h4>
                                        <div className="flex-1 space-y-6">
                                            <div className="space-y-4 pt-2">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase">Enable Global Search</label>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setFloatingWidget({ ...floatingWidget, enableSearch: !floatingWidget.enableSearch })}
                                                        className={cn("h-8 px-4 rounded-lg text-[9px] font-black", floatingWidget.enableSearch ? "bg-nb-green text-white" : "bg-slate-100 text-slate-400")}
                                                    >
                                                        {floatingWidget.enableSearch ? "ACTIVE" : "DISABLED"}
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase">Mobile Swipe Dismiss</label>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => setFloatingWidget({ ...floatingWidget, isDismissible: !floatingWidget.isDismissible })}
                                                        className={cn("h-8 px-4 rounded-lg text-[9px] font-black", floatingWidget.isDismissible ? "bg-nb-green text-white" : "bg-slate-100 text-slate-400")}
                                                    >
                                                        {floatingWidget.isDismissible ? "ACTIVE" : "DISABLED"}
                                                    </Button>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase">Popup Delay (Seconds)</label>
                                                        <span className="text-xs font-black text-nb-green">{floatingWidget.popupDelay || 0}s</span>
                                                    </div>
                                                    <input
                                                        id="popup-delay-slider"
                                                        title="Adjust Popup Delay"
                                                        type="range"
                                                        min="0"
                                                        max="30"
                                                        step="1"
                                                        value={floatingWidget.popupDelay || 0}
                                                        onChange={(e) => setFloatingWidget({ ...floatingWidget, popupDelay: parseInt(e.target.value) })}
                                                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-nb-green"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 border-t border-slate-50 pt-4">
                                                <label className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase">
                                                    <FileText className="w-3 h-3 text-nb-green" /> Digital Catalog
                                                </label>
                                                <div className="p-2 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <ImagePicker
                                                        value={floatingWidget.catalogStorageId}
                                                        onChange={(val) => setFloatingWidget({ ...floatingWidget, catalogStorageId: val })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-12">
                    {/* Navigation - Site Map */}
                    <Card className="rounded-[24px] border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden">
                        <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-nb-green/10 rounded-lg">
                                    <Layout className="w-4 h-4 text-nb-green" />
                                </div>
                                <CardTitle className="text-base font-bold tracking-tight text-slate-800">Navigation Nodes</CardTitle>
                            </div>
                            <Button variant="outline" size="sm" onClick={addLink} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border-slate-200 hover:border-nb-green transition-all">
                                <Plus className="w-4 h-4 mr-1.5" /> ADD NODE
                            </Button>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {navLinks.map((link, i) => (
                                    <div key={i} className="group relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100 hover:border-nb-green/20 hover:bg-white hover:shadow-lg transition-all">
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Label</label>
                                                <Input
                                                    className="h-10 text-sm font-bold border-slate-100 bg-white focus:ring-nb-green/10 transition-all rounded-xl"
                                                    value={link.label}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "label", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Target path</label>
                                                <Input
                                                    className="h-9 text-xs font-medium text-slate-500 border-slate-100 bg-white/50 focus:ring-nb-green/10 transition-all rounded-xl"
                                                    value={link.href}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "href", e.target.value)}
                                                />
                                            </div>
                                            
                                            <div className="flex items-center justify-between pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className={cn(
                                                        "h-8 px-3 rounded-lg text-[9px] font-black uppercase tracking-tighter border-slate-200 transition-all bg-white",
                                                        link.megaMenu?.enabled 
                                                            ? "text-nb-green border-nb-green/20 bg-nb-green/5" 
                                                            : "text-slate-500 hover:text-nb-green"
                                                    )}
                                                    onClick={() => setEditingMegaMenuIdx(i)}
                                                >
                                                    {link.megaMenu?.enabled ? "MEGA MENU: ON" : "CONFIG MENU"}
                                                </Button>
                                                
                                                <div className="flex items-center gap-1">
                                                    <button 
                                                        onClick={() => moveLink(i, 'up')} 
                                                        disabled={i === 0} 
                                                        className="p-1.5 text-slate-300 hover:text-slate-600 disabled:opacity-0 transition-colors"
                                                        title="Move Left"
                                                    >
                                                        <ArrowUpDown size={14} className="rotate-90" />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeLink(i)} 
                                                        className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                                                        title="Remove Node"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <MegaMenuConfigModal 
                isOpen={editingMegaMenuIdx !== null}
                initialConfig={editingMegaMenuIdx !== null ? navLinks[editingMegaMenuIdx as number]?.megaMenu : undefined}
                onClose={() => setEditingMegaMenuIdx(null)}
                onSave={(config) => {
                    if (editingMegaMenuIdx !== null) {
                        const idx = editingMegaMenuIdx as number;
                        const newLinks = [...navLinks];
                        newLinks[idx] = { ...newLinks[idx], megaMenu: config };
                        setNavLinks(newLinks);
                    }
                }}
            />
        </div >
    );
}
