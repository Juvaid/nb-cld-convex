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
    const [floatingWidget, setFloatingWidget] = useState<any>({
        enabled: false,
        position: "right",
        vAlign: "bottom",
        whatsapp: "",
        phone: "",
        catalogStorageId: "",
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

    useEffect(() => {
        if (theme) {
            setLocalTheme(theme);
        }
    }, [theme]);

    useEffect(() => {
        if (siteSettings) {
            setLogoText(siteSettings.logoText || "NatureBoon");
            setLogoImage(siteSettings.logoImage || "");
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
            setWhatsappApiKey(siteSettings.whatsapp_api_key || "");
            setWhatsappPhone(siteSettings.whatsapp_phone || "");
            setFloatingWidget(siteSettings.floating_widget || {
                enabled: false,
                position: "right",
                vAlign: "bottom",
                whatsapp: "",
                phone: "",
                catalogStorageId: "",
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
        <div className="space-y-6 pb-20 max-w-6xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 p-6 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-md sticky top-0 z-50">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <div className="w-2 h-6 bg-nb-green rounded-full animate-pulse" />
                        Site Intelligence
                    </h1>
                    <p className="text-sm text-slate-500 font-medium ml-5">Core visual & functional controls</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <Button variant="outline" onClick={handleExportConfig} className="flex-1 md:flex-none bg-white">
                        <Download className="w-4 h-4 mr-2" />
                        Export Config
                    </Button>
                    <Button variant="outline" onClick={handleResetTheme} disabled={isSaving || isDoomed} className="flex-1 md:flex-none bg-white hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50">
                        {isDoomed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo className="w-4 h-4 mr-2" />}
                        Reset To Default
                    </Button>
                    <Button onClick={handleSaveAll} disabled={isSaving || isSavingSite || isDoomed} className="flex-1 md:flex-none shadow-md">
                        {(isSaving || isSavingSite) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                    <Card className="shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <Palette className="w-4 h-4 text-nb-green" />
                                Visual Branding
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-nb-green/10 rounded-full flex items-center justify-center">
                                <Palette className="w-8 h-8 text-nb-green" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-bold text-slate-900">Theme & Design System</h3>
                                <p className="text-xs text-slate-500 max-w-[200px]">Colors, typography and brand geometry are now managed in the dedicated Theme section.</p>
                            </div>
                            <Link href="/admin/theme">
                                <Button variant="outline" size="sm" className="w-full">
                                    Open Designer
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-3">
                    {/* Snapshot Area */}
                    <div className="h-full flex flex-col gap-4">
                        <Card className="shadow-sm border-slate-200">
                            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                    <Bookmark className="w-4 h-4 text-nb-green" />
                                    Quick Snap
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-5 space-y-3">
                                <Input
                                    placeholder="Snapshot label..."
                                    value={snapshotName}
                                    onChange={(e) => setSnapshotName(e.target.value)}
                                    className="h-10 text-sm font-semibold border-slate-200 focus:ring-2 focus:ring-nb-green"
                                />
                                <Button
                                    className="w-full bg-nb-green hover:bg-nb-green/90 text-xs h-10 font-bold tracking-wide text-white shadow-sm"
                                    onClick={() => handleCreateSnapshot(false)}
                                    disabled={isCreatingSnapshot || !snapshotName}
                                >
                                    {isCreatingSnapshot ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Clock className="w-4 h-4 mr-2" />}
                                    Create Backup
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="flex-1 shadow-sm border-slate-200 flex flex-col">
                            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <CardTitle className="text-sm font-semibold tracking-tight text-slate-800">History</CardTitle>
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
                                                    onClick={() => deleteSnapshot({ id: snap._id, token: token ?? undefined })}
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
                    <Card className="h-full shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800 flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-nb-green" />
                                Branding Identity
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">Site Title (Browser Tab)</label>
                                <Input
                                    value={siteTitle}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSiteTitle(e.target.value)}
                                    className="h-10 text-sm font-semibold border-slate-200 focus:ring-2 focus:ring-nb-green"
                                    placeholder="Company Name | Tagline"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">Favicon (Browser Icon)</label>
                                <ImagePicker
                                    value={faviconUrl}
                                    onChange={setFaviconUrl}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">Logo Text</label>
                                <Input
                                    value={logoText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoText(e.target.value)}
                                    className="h-10 text-sm font-semibold border-slate-200 focus:ring-2 focus:ring-nb-green"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">Logo Image / SVG</label>
                                <ImagePicker
                                    value={logoImage}
                                    onChange={setLogoImage}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium">Font selection moved to Designer</p>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">CTA Button Text</label>
                                <Input
                                    value={contactText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactText(e.target.value)}
                                    className="h-10 text-sm font-semibold border-slate-200 focus:ring-2 focus:ring-nb-green"
                                />
                            </div>
                            <div className="space-y-2 pt-4 border-t border-slate-200">
                                <label className="text-xs font-medium text-nb-green">Discord Webhook Notification URL</label>
                                <Input
                                    value={discordWebhookUrl}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDiscordWebhookUrl(e.target.value)}
                                    placeholder="https://discord.com/api/webhooks/..."
                                    className="h-10 text-sm font-medium bg-nb-green/5 border-nb-green/20 focus:ring-2 focus:ring-nb-green"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-nb-green">WhatsApp CallMeBot Phone</label>
                                    <Input
                                        value={whatsappPhone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappPhone(e.target.value)}
                                        placeholder="+919876543210 (include + and country code)"
                                        className="h-10 text-sm font-medium bg-nb-green/5 border-nb-green/20 focus:ring-2 focus:ring-nb-green"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-nb-green">CallMeBot API Key</label>
                                    <Input
                                        value={whatsappApiKey}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWhatsappApiKey(e.target.value)}
                                        placeholder="1234567"
                                        className="h-10 text-sm font-medium bg-nb-green/5 border-nb-green/20 focus:ring-2 focus:ring-nb-green"
                                    />
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-500 italic mt-0">Inquiries will be forwarded to your Discord channel and WhatsApp via CallMeBot if configured.</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    {/* Footer Controls */}
                    <Card className="h-full shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800">Footer Intelligence</CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-slate-600">Description</label>
                                <textarea
                                    value={footerDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFooterDescription(e.target.value)}
                                    className="w-full min-h-[100px] p-3 text-sm rounded-lg border-slate-200 focus:ring-2 focus:ring-nb-green focus:border-nb-green resize-none transition-all shadow-sm"
                                    placeholder="Company footer description..."
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-medium text-slate-600">Social Graph</label>
                                    <button
                                        onClick={() => setSocialLinks([...socialLinks, { platform: "linkedin", href: "" }])}
                                        className="text-xs font-medium text-nb-green flex items-center gap-1 hover:underline"
                                    >
                                        <Plus size={14} /> Add Account
                                    </button>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {socialLinks.map((link, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                            <select
                                                value={link.platform}
                                                onChange={(e) => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks[i].platform = e.target.value;
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="h-8 rounded-md border-slate-200 text-xs font-medium text-slate-700 px-2 focus:ring-1 focus:ring-nb-green cursor-pointer bg-white"
                                                title="Social Platform"
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
                                                className="flex-1 h-8 text-xs bg-white border-slate-200 focus:ring-1 focus:ring-nb-green"
                                            />
                                            <button
                                                onClick={() => {
                                                    const newLinks = [...socialLinks];
                                                    newLinks.splice(i, 1);
                                                    setSocialLinks(newLinks);
                                                }}
                                                className="text-slate-400 hover:text-rose-500 transition-colors px-1"
                                                title="Remove Account"
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
                    <Card className="shadow-md border-nb-green/20 bg-nb-green/[0.02]">
                        <CardHeader className="p-6 border-b border-nb-green/10 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-nb-green" />
                                    Floating Contact Widget
                                </CardTitle>
                                <CardDescription>Configure the persistent floating actions (WhatsApp, Phone, Catalog) for your customers.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200">
                                <label className="text-[10px] font-black uppercase tracking-widest px-2 text-slate-400">Status</label>
                                <Button
                                    variant={floatingWidget.enabled ? "primary" : "outline"}
                                    size="sm"
                                    onClick={() => setFloatingWidget({ ...floatingWidget, enabled: !floatingWidget.enabled })}
                                    className={cn("h-8 px-4 font-black text-[10px]", floatingWidget.enabled ? "bg-nb-green" : "opacity-50")}
                                >
                                    {floatingWidget.enabled ? "ENABLED" : "DISABLED"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Widget Layout</h4>
                                        <div className="flex gap-2">
                                            {['left', 'right'].map((pos) => (
                                                <button
                                                    key={pos}
                                                    onClick={() => setFloatingWidget({ ...floatingWidget, position: pos })}
                                                    className={cn(
                                                        "flex-1 py-10 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3",
                                                        floatingWidget.position === pos
                                                            ? "border-nb-green bg-nb-green/5 ring-4 ring-nb-green/10"
                                                            : "border-slate-100 bg-white hover:border-slate-200"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-16 rounded-lg border-2 border-slate-200 relative",
                                                        pos === 'left' ? "bg-gradient-to-r from-nb-green/20 to-transparent" : "bg-gradient-to-l from-nb-green/20 to-transparent"
                                                    )}>
                                                        <div className={cn(
                                                            "absolute w-3 h-3 rounded-full bg-nb-green shadow-lg transition-all duration-300",
                                                            floatingWidget.vAlign === 'top' ? "top-2" : floatingWidget.vAlign === 'middle' ? "top-1/2 -translate-y-1/2" : "bottom-2",
                                                            pos === 'left' ? "left-2" : "right-2"
                                                        )} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest capitalize">{pos} Side</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Vertical Alignment</h4>
                                        <div className="flex gap-2">
                                            {[
                                                { id: 'top', icon: <ArrowUp className="w-3 h-3" /> },
                                                { id: 'middle', icon: <ArrowUpDown className="w-3 h-3" /> },
                                                { id: 'bottom', icon: <ArrowDown className="w-3 h-3" /> }
                                            ].map((pos) => (
                                                <button
                                                    key={pos.id}
                                                    onClick={() => setFloatingWidget({ ...floatingWidget, vAlign: pos.id })}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1",
                                                        floatingWidget.vAlign === pos.id
                                                            ? "border-nb-green bg-nb-green/5 ring-2 ring-nb-green/10"
                                                            : "border-slate-100 bg-white hover:border-slate-200"
                                                    )}
                                                >
                                                    {pos.icon}
                                                    <span className="text-[8px] font-black uppercase tracking-tight">{pos.id}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Direct Contact</h4>
                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase">
                                                        <MessageSquare className="w-3 h-3 text-[#25D366]" /> WhatsApp Number
                                                    </label>
                                                    <Input
                                                        value={floatingWidget.whatsapp}
                                                        onChange={(e) => setFloatingWidget({ ...floatingWidget, whatsapp: e.target.value })}
                                                        placeholder="+91 98765 43210"
                                                        className="h-10 text-sm font-semibold border-slate-200"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase">
                                                        <Phone className="w-3 h-3 text-blue-600" /> Phone Dialer Number
                                                    </label>
                                                    <Input
                                                        value={floatingWidget.phone}
                                                        onChange={(e) => setFloatingWidget({ ...floatingWidget, phone: e.target.value })}
                                                        placeholder="+91 98765 43210"
                                                        className="h-10 text-sm font-semibold border-slate-200"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Downloadable Resources</h4>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase">
                                                    <FileText className="w-3 h-3 text-nb-green" /> Product Catalog (PDF)
                                                </label>
                                                <ImagePicker
                                                    value={floatingWidget.catalogStorageId}
                                                    onChange={(val) => setFloatingWidget({ ...floatingWidget, catalogStorageId: val })}
                                                />
                                                <p className="text-[9px] text-slate-400 italic">Select or upload your latest B2B catalog PDF here.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4">
                    {/* Navigation - Site Map */}
                    <Card className="h-full shadow-sm border-slate-200">
                        <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                            <CardTitle className="text-sm font-semibold tracking-tight text-slate-800">Navigation Nodes</CardTitle>
                            <Button variant="outline" size="sm" onClick={addLink} className="h-8 text-xs font-medium text-slate-700 bg-white">
                                <Plus className="w-4 h-4 mr-1" /> Add Node
                            </Button>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Label</th>
                                        <th className="px-4 py-3 font-medium">Path</th>
                                        <th className="px-4 py-3 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {navLinks.map((link, i) => (
                                        <tr key={i} className="group hover:bg-slate-50 transition-colors">
                                            <td className="p-2 px-4">
                                                <Input
                                                    className="h-8 text-sm font-medium border-none shadow-none focus-visible:ring-1 focus-visible:ring-nb-green p-0 px-2"
                                                    value={link.label}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "label", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 px-4">
                                                <Input
                                                    className="h-8 text-sm font-medium text-slate-500 border-none shadow-none focus-visible:ring-1 focus-visible:ring-nb-green p-0 px-2"
                                                    value={link.href}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "href", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-2 px-4 text-right align-middle">
                                                <div className="flex justify-end gap-1 opacity-10 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => moveLink(i, 'up')} disabled={i === 0} className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-0" title="Move Up"><ArrowUp size={14} /></button>
                                                    <button onClick={() => removeLink(i)} className="p-1.5 text-rose-400 hover:text-rose-600" title="Remove Node"><Trash2 size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    );
}
