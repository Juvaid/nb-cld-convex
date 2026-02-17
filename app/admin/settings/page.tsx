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

export default function SettingsPage() {
    const { theme, saveAll, reset } = useTheme();
    const [localTheme, setLocalTheme] = useState<any>(theme);
    const [isSaving, setIsSaving] = useState(false);
    const [isDoomed, setIsDoomed] = useState(false);

    // Site Settings State
    const siteSettings = useQuery(api.siteSettings.getSiteSettings);
    const updateSiteSetting = useMutation(api.siteSettings.updateSiteSetting);
    const [logoText, setLogoText] = useState("");
    const [contactText, setContactText] = useState("");
    const [footerDescription, setFooterDescription] = useState("");
    const [footerCopyrightText, setFooterCopyrightText] = useState("");
    const [navLinks, setNavLinks] = useState<any[]>([]);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
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

    const handleSaveTheme = async () => {
        setIsSaving(true);
        try {
            await saveAll({ settings: localTheme });
        } finally {
            setIsSaving(false);
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

    const handleSaveSiteSettings = async () => {
        setIsSavingSite(true);
        try {
            await Promise.all([
                updateSiteSetting({ key: "logoText", value: logoText }),
                updateSiteSetting({ key: "contactText", value: contactText }),
                updateSiteSetting({ key: "footerDescription", value: footerDescription }),
                updateSiteSetting({ key: "footerCopyrightText", value: footerCopyrightText }),
                updateSiteSetting({ key: "navLinks", value: navLinks }),
                updateSiteSetting({ key: "socialLinks", value: socialLinks }),
            ]);
        } catch (error) {
            console.error(error);
            alert("Failed to save site settings");
        } finally {
            setIsSavingSite(false);
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

    const handleUpdateSnapshot = useMutation(api.theme.createThemeSnapshot); // Re-using insert for update if needed or just patch
    // Actually schema allows patching isPreset. Let's add a toggle.
    // I need a separate mutation for patch or update if I want to edit existing.
    // For now, I'll add isPreset support to the list.

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

    if (!localTheme) return <div>Loading...</div>;

    return (
        <div className="space-y-12 pb-20">
            {/* Theme Settings Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Theme Settings</h1>
                        <p className="text-muted-foreground">Customize the visual appearance.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleResetTheme} disabled={isSaving || isDoomed}>
                            {isDoomed ? <Loader2 className="w-4 h-4 animate-spin" /> : <Undo className="w-4 h-4 mr-2" />}
                            Reset Defaults
                        </Button>
                        <Button onClick={handleSaveTheme} disabled={isSaving || isDoomed}>
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Theme
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Colors */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Colors</CardTitle>
                            <CardDescription>Brand and interface colors.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {Object.entries(localTheme.colors || {}).map(([key, value]) => (
                                <div key={key} className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-sm font-medium leading-none capitalize">{key.replace(/-/g, " ")}</label>
                                    <div className="col-span-3 flex gap-2">
                                        <div className="flex-1">
                                            <ColorPicker
                                                value={value as string}
                                                onChange={(c) => updateSetting("colors", key, c)}
                                            />
                                        </div>
                                        <Input
                                            value={value as string}
                                            onChange={(e) => updateSetting("colors", key, e.target.value)}
                                            className="w-24 hidden sm:block"
                                        />
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Layout & Typography */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Layout & Style</CardTitle>
                            <CardDescription>Global spacing and border styles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Border Radius</label>
                                <Input
                                    value={localTheme.layout?.borderRadius || ""}
                                    onChange={(e) => updateSetting("layout", "borderRadius", e.target.value)}
                                    placeholder="e.g. 12px"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Container Width</label>
                                <Input
                                    value={localTheme.layout?.containerWidth || ""}
                                    onChange={(e) => updateSetting("layout", "containerWidth", e.target.value)}
                                    placeholder="e.g. 1280px"
                                />
                            </div>

                            <hr className="border-slate-100 my-4" />

                            <div className="space-y-4">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Typography</h3>
                                <FontPicker
                                    label="Heading Font"
                                    value={localTheme.typography?.headingFont || "Inter"}
                                    onChange={(val) => updateSetting("typography", "headingFont", val)}
                                />
                                <FontPicker
                                    label="Body Font"
                                    value={localTheme.typography?.bodyFont || "Inter"}
                                    onChange={(val) => updateSetting("typography", "bodyFont", val)}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <hr className="border-slate-200" />

            {/* Site Settings Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Site Settings</h1>
                        <p className="text-muted-foreground">Manage global content and navigation.</p>
                    </div>
                    <Button onClick={handleSaveSiteSettings} disabled={isSavingSite} className="bg-nb-green hover:bg-nb-green/90 text-slate-900 font-bold">
                        {isSavingSite ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Site Settings
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* General Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>General Branding</CardTitle>
                            <CardDescription>Logo, contact info, and footer text.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Logo Text</label>
                                <Input
                                    value={logoText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoText(e.target.value)}
                                    placeholder="NatureBoon"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Contact Button Text</label>
                                <Input
                                    value={contactText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactText(e.target.value)}
                                    placeholder="Contact Us"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Footer Description</label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={footerDescription}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFooterDescription(e.target.value)}
                                    placeholder="Footer description..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">Copyright Text</label>
                                <Input
                                    value={footerCopyrightText}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFooterCopyrightText(e.target.value)}
                                    placeholder="Copyright notice..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                            <CardDescription>Configure social media icons in the footer.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {socialLinks.map((link, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                    <div className="grid grid-cols-2 gap-2 flex-1">
                                        <select
                                            aria-label="Social platform"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={link.platform}
                                            onChange={(e) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[i] = { ...newLinks[i], platform: e.target.value };
                                                setSocialLinks(newLinks);
                                            }}
                                        >
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="twitter">Twitter</option>
                                            <option value="github">GitHub</option>
                                        </select>
                                        <Input
                                            value={link.href}
                                            placeholder="URL"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                const newLinks = [...socialLinks];
                                                newLinks[i] = { ...newLinks[i], href: e.target.value };
                                                setSocialLinks(newLinks);
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const newLinks = [...socialLinks];
                                            newLinks.splice(i, 1);
                                            setSocialLinks(newLinks);
                                        }}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-0.5"
                                        title="Remove Social Link"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            <Button
                                variant="outline"
                                onClick={() => setSocialLinks([...socialLinks, { platform: "linkedin", href: "#" }])}
                                className="w-full border-dashed"
                            >
                                <Plus size={16} className="mr-2" />
                                Add Social Link
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Navigation Links */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Navigation</CardTitle>
                            <CardDescription>Manage header navigation links.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {navLinks.map((link, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3 group relative">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Link #{i + 1}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveLink(i, 'up')} disabled={i === 0} className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30" title="Move Up"><ArrowUp size={14} /></button>
                                                <button onClick={() => moveLink(i, 'down')} disabled={i === navLinks.length - 1} className="p-1 hover:bg-white rounded shadow-sm disabled:opacity-30" title="Move Down"><ArrowDown size={14} /></button>
                                                <button onClick={() => removeLink(i)} className="p-1 text-red-500 hover:bg-red-50 rounded shadow-sm" title="Remove"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                value={link.label}
                                                placeholder="Label (e.g. Home)"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "label", e.target.value)}
                                            />
                                            <Input
                                                value={link.href}
                                                placeholder="URL (e.g. /)"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateLink(i, "href", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={addLink}
                                    className="p-8 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-nb-green hover:border-nb-green hover:bg-nb-green/5 transition-all"
                                >
                                    <Plus size={24} />
                                    <span className="font-bold text-sm">Add New Link</span>
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <hr className="border-slate-200" />

            {/* Theme Backups Section */}
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Theme Library</h1>
                    <p className="text-muted-foreground">Manage your visual presets and backups.</p>
                </div>

                {/* Theme Gallery (Presets) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-nb-green">
                        <Star className="w-5 h-5 fill-current" />
                        <h2 className="text-xl font-bold">Theme Gallery</h2>
                    </div>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {snapshots?.filter((s: any) => s.isPreset).map((snapshot: any) => (
                            <Card key={snapshot._id} className="overflow-hidden border-2 border-nb-green/20 hover:border-nb-green transition-all group">
                                <div className="aspect-video bg-slate-100 relative overflow-hidden flex items-center justify-center">
                                    {snapshot.image && typeof snapshot.image === 'string' && snapshot.image !== "[object Object]" ? (
                                        <img
                                            src={snapshot.image.startsWith('http') ? snapshot.image : `/api/storage/${snapshot.image}`}
                                            alt={snapshot.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="text-slate-300 flex flex-col items-center gap-2">
                                            <Layout size={48} />
                                            <span className="text-xs font-bold uppercase tracking-widest">No Preview</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                        <Button
                                            size="sm"
                                            className="w-full bg-nb-green text-slate-900 font-bold"
                                            onClick={() => handleRestoreSnapshot(snapshot)}
                                        >
                                            Apply Theme
                                        </Button>
                                    </div>
                                </div>
                                <CardHeader className="p-4">
                                    <CardTitle className="text-lg">{snapshot.name}</CardTitle>
                                    <CardDescription>{new Date(snapshot.createdAt).toLocaleDateString()}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create Snapshot</CardTitle>
                        <CardDescription>Save the current theme and site settings as a backup.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <Input
                                    placeholder="Backup Name (e.g. 'Before Redesign')"
                                    value={snapshotName}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSnapshotName(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <Button onClick={() => handleCreateSnapshot(false)} disabled={!snapshotName || isCreatingSnapshot} variant="outline">
                                        {isCreatingSnapshot ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                        Backup
                                    </Button>
                                    <Button onClick={() => handleCreateSnapshot(true)} disabled={!snapshotName || isCreatingSnapshot} className="bg-nb-green text-slate-900 font-bold">
                                        <Star className="w-4 h-4 mr-2 fill-current" />
                                        Save as Preset
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Previous Backups</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {snapshots?.map((snapshot: any) => (
                            <Card key={snapshot._id}>
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-base font-bold">{snapshot.name}</CardTitle>
                                        <Clock size={16} className="text-muted-foreground" />
                                    </div>
                                    <CardDescription>
                                        {new Date(snapshot.createdAt).toLocaleDateString()} at {new Date(snapshot.createdAt).toLocaleTimeString()}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => handleRestoreSnapshot(snapshot)}
                                            disabled={!!restoringId}
                                        >
                                            {restoringId === snapshot._id ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3 mr-2" />}
                                            Restore
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => deleteSnapshot({ id: snapshot._id })}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {snapshots?.length === 0 && (
                            <div className="col-span-full text-center py-8 text-muted-foreground bg-slate-50 rounded-xl border border-dashed">
                                No backups found. Create one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
