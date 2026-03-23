"use client";

import { Config, Data, Puck } from "@puckeditor/core";
import "@puckeditor/core/dist/index.css";
import { config as defaultConfig } from "./config";
import { ReactNode, useState, useEffect } from "react";
import { Plus, PenTool, Layout, Palette, Layers, Loader2, Save, RotateCcw, Globe, ExternalLink, History, Search, X, Archive, Trash2, Copy, PanelLeftClose, PanelLeft } from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@/lib/auth-context";

interface Page {
    _id: Id<"pages">;
    path: string;
    title: string;
    status?: "draft" | "published";
}

interface CustomPuckEditorProps {
    data: Data;
    configOverride?: Config;
    onPublish: (data: Data) => void;
    onChange?: (data: Data) => void;
    pages?: Page[];
    currentPath: string;
    onPathChange: (path: string) => void;
    hasUnpublishedChanges?: boolean;
    onDiscardDraft?: () => void;
    isSaving?: boolean;
}

interface ThemeData {
    colors: {
        primary: string;
        secondary: string;
    };
    typography: {
        headingFont: string;
        headingWeight: string;
    };
    buttons: {
        borderRadius: string;
    };
}

const ThemeSettings = () => {
    const themeData = useQuery(api.theme.getThemeSettings);
    const saveAll = useMutation(api.theme.saveAllThemeSettings);
    const reset = useMutation(api.theme.resetThemeSettings);
    const { token } = useAuth();
    const [localTheme, setLocalTheme] = useState<ThemeData | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (themeData) {
            setLocalTheme(themeData as ThemeData);
        }
    }, [themeData]);

    if (!localTheme) return (
        <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-nb-green" />
        </div>
    );

    const handleColorChange = (section: string, key: string, value: string) => {
        setLocalTheme((prev) => {
            if (!prev) return null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updated = { ...prev } as any;
            updated[section] = {
                ...updated[section],
                [key]: value
            };
            return updated;
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await saveAll({ settings: localTheme, token: token ?? undefined });
        } catch (error) {
            console.error("Failed to save theme:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        if (confirm("Reset theme to defaults?")) {
            await reset({ token: token ?? undefined });
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Live Theme</h3>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        title="Reset to Default"
                    >
                        <RotateCcw size={16} />
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-nb-green text-slate-900 px-4 py-2 rounded-xl font-bold text-xs shadow-lg shadow-nb-green/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                        SAVE THEME
                    </button>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 pb-20">
                <section className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Colors</div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">Primary (Emerald)</label>
                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200">
                                <input
                                    type="color"
                                    title="Primary Color"
                                    value={localTheme.colors.primary}
                                    onChange={(e) => handleColorChange('colors', 'primary', e.target.value)}
                                    className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-slate-400">{localTheme.colors.primary}</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">Secondary (Navy)</label>
                            <div className="flex items-center gap-2 p-1.5 bg-white rounded-xl border border-slate-200">
                                <input
                                    type="color"
                                    title="Secondary Color"
                                    value={localTheme.colors.secondary}
                                    onChange={(e) => handleColorChange('colors', 'secondary', e.target.value)}
                                    className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer"
                                />
                                <span className="text-[10px] font-mono text-slate-400">{localTheme.colors.secondary}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Typography</div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">Heading Font Family</label>
                            <input
                                type="text"
                                title="Heading Font Family"
                                value={localTheme.typography.headingFont}
                                onChange={(e) => handleColorChange('typography', 'headingFont', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700"
                                placeholder="e.g. system-ui, Inter"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">Heading Weight</label>
                            <select
                                title="Heading Weight"
                                value={localTheme.typography.headingWeight}
                                onChange={(e) => handleColorChange('typography', 'headingWeight', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700"
                            >
                                <option value="400">Normal (400)</option>
                                <option value="600">Semibold (600)</option>
                                <option value="700">Bold (700)</option>
                                <option value="900">Black (900)</option>
                            </select>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interface</div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-500 block uppercase">Button Roundness (px)</label>
                            <input
                                type="range"
                                title="Button Roundness"
                                min="0"
                                max="50"
                                value={localTheme.buttons.borderRadius}
                                onChange={(e) => handleColorChange('buttons', 'borderRadius', e.target.value)}
                                className="w-full accent-nb-green"
                            />
                            <div className="text-[10px] text-right text-slate-400 font-bold">{localTheme.buttons.borderRadius}px</div>
                        </div>
                    </div>
                </section>

                <div className="bg-nb-green/5 p-4 rounded-3xl border border-nb-green/10">
                    <p className="text-[10px] font-bold text-nb-green leading-relaxed">
                        Tip: Theme changes are applied globally across all pages instantly. Click Save to persist.
                    </p>
                </div>
            </div>
        </div>
    );
};

const HistoryPanel = ({ pageId }: { pageId: Id<"pages"> }) => {
    const snapshots = useQuery(api.pages.listPageSnapshots, { pageId });
    const restore = useMutation(api.pages.restorePageSnapshot);
    const createSnapshot = useMutation(api.pages.createPageSnapshot);
    const { token } = useAuth();
    const [isCreating, setIsCreating] = useState(false);

    const handleCreateBackup = async () => {
        setIsCreating(true);
        try {
            await createSnapshot({ pageId, token: token ?? undefined });
        } catch (error) {
            console.error("Failed to create backup:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleRestore = async (snapshotId: Id<"pageSnapshots">) => {
        if (confirm("Are you sure? Current changes will be backed up before restoring.")) {
            await restore({ snapshotId, token: token ?? undefined });
            window.location.reload(); // Reload to fetch restored data cleanly
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Page History</h3>
                <button
                    onClick={handleCreateBackup}
                    disabled={isCreating}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                    {isCreating ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                    NEW BACKUP
                </button>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-4 pb-20">
                {!snapshots ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : snapshots.length === 0 ? (
                    <div className="text-center text-slate-400 text-xs py-8">No backups found.</div>
                ) : (
                    snapshots.map((snap) => (
                        <div key={snap._id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-nb-green/50 transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-slate-700 text-xs">{snap.name || "Unnamed Backup"}</h4>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    {new Date(snap.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-[10px] text-slate-400">
                                    {new Date(snap.createdAt).toLocaleTimeString()}
                                </span>
                                <button
                                    onClick={() => handleRestore(snap._id)}
                                    className="text-[10px] font-bold text-nb-green hover:text-green-600 bg-nb-green/5 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-nb-green/10"
                                >
                                    RESTORE
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

const LibraryPanel = ({ onInsert }: { onInsert: (type: string, props: any) => void }) => {
    const templates = useQuery(api.templates.listSavedBlocks);
    const deleteTemplate = useMutation(api.templates.deleteSavedBlock);
    const { token } = useAuth();
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = templates?.filter((t: any) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.componentType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full bg-[#f8fafc]">
            <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Saved Blocks</h3>
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-nb-green/20"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-3 pb-20">
                {!templates ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-300" /></div>
                ) : filtered?.length === 0 ? (
                    <div className="text-center py-12">
                        <Archive className="mx-auto text-slate-200 mb-4" size={40} />
                        <p className="text-xs text-slate-400 font-bold">No saved blocks found</p>
                    </div>
                ) : (
                    filtered?.map((tpl: any) => (
                        <div key={tpl._id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-nb-green transition-all group relative overflow-hidden">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-black text-slate-900 text-[11px] truncate pr-8">{tpl.name}</h4>
                                <button
                                    onClick={() => deleteTemplate({ id: tpl._id, token: token ?? undefined })}
                                    className="text-slate-300 hover:text-red-500 transition-colors absolute top-4 right-4"
                                    title="Delete block template"
                                >
                                    <Trash2 size={12} aria-hidden="true" />
                                    <span className="sr-only">Delete</span>
                                </button>
                            </div>
                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-4">
                                Type: {tpl.componentType}
                            </div>
                            <button
                                onClick={() => onInsert(tpl.componentType, tpl.props)}
                                className="w-full bg-slate-900 text-white py-2 rounded-xl text-[10px] font-black hover:bg-nb-green hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                            >
                                <Copy size={12} />
                                INSERT BLOCK
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export function CustomPuckEditor({
    data,
    configOverride,
    onPublish,
    onChange,
    pages = [],
    currentPath,
    onPathChange,
    hasUnpublishedChanges,
    onDiscardDraft,
    isSaving
}: CustomPuckEditorProps) {
    const [activeTab, setActiveTab] = useState<"structure" | "components" | "library" | "theme" | "history">("structure");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const currentPageId = pages.find(p => p.path === currentPath)?._id;
    const saveTemplate = useMutation(api.templates.saveSavedBlock);
    const { token } = useAuth();

    return (
        <div className="h-screen w-full relative admin-editor-custom flex bg-slate-100 overflow-hidden">
            <style jsx global>{`
                :root { --puck-color-brand: #2bee6c; }
                
                /* Sidebar styling */

                /* Full screen height and cleaner layout */
                .puck-editor { height: 100vh !important; border: 0 !important; }
                
                /* Unified Sidebar Styling */
                .puck-sidebar { 
                    background: rgba(255, 255, 255, 0.7) !important; 
                    backdrop-filter: blur(20px) !important;
                    border-right: 1px solid rgba(226, 232, 240, 0.8) !important;
                    width: 340px !important;
                    box-shadow: 10px 0 30px rgba(0,0,0,0.02) !important;
                }
                
                .puck-outline-item { 
                    border-radius: 12px !important; 
                    margin: 4px 12px !important; 
                    padding: 12px 16px !important; 
                    font-weight: 700 !important; 
                    color: #334155 !important; 
                    background: white !important; 
                    border: 1px solid #F1F5F9 !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.02) !important;
                    transition: all 0.2s ease !important;
                }
                
                .puck-outline-item--selected { 
                    background: white !important; 
                    border-color: #2BEE6C !important; 
                    color: #064E3B !important;
                    box-shadow: 0 4px 12px rgba(43, 238, 108, 0.15) !important;
                    transform: translateX(4px) !important;
                }

                .puck-sidebar-section-title { 
                    font-size: 0.65rem !important; 
                    text-transform: uppercase !important; 
                    font-weight: 900 !important; 
                    color: #94A3B8 !important; 
                    margin: 24px 20px 12px !important; 
                    letter-spacing: 0.1em !important; 
                }

                /* GRID LAYOUT FOR COMPONENTS */
                [data-testid="puck-sidebar-tab-components"] {
                   padding: 12px !important;
                }
                
                [data-testid="puck-sidebar-tab-components"] .puck-sidebar-item {
                   margin: 0 !important;
                   padding: 10px !important;
                   display: flex !important;
                   flex-direction: column !important;
                   align-items: center !important;
                   text-align: center !important;
                   gap: 8px !important;
                   font-size: 10px !important;
                   aspect-ratio: 1/1 !important;
                   justify-content: center !important;
                   min-width: 0 !important;
                }

                /* Attempt to force grid on Puck's sidebar item container */
                [data-testid="puck-sidebar-tab-components"] > div > div {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 12px !important;
                    padding: 12px !important;
                }

                .puck-sidebar-item { 
                    border-radius: 14px !important; 
                    margin: 4px 12px !important; 
                    background: white !important; 
                    border: 1px solid #F1F5F9 !important;
                    font-weight: 700 !important;
                    padding: 12px !important;
                    transition: all 0.2s ease !important;
                }

                .puck-sidebar-item:hover {
                    border-color: #2BEE6C !important;
                    background: #F0FFF4 !important;
                }

                /* Header Refinement - Ensure no clipping */
                .puck-header, 
                .Puck-header,
                [class*="header"],
                [class*="Header"],
                [class*="puck-Header"] { 
                    background: white !important; 
                    border-bottom: 1px solid #E2E8F0 !important; 
                    padding: 0 32px !important; 
                    height: 72px !important;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
                    overflow: visible !important;
                    position: relative !important;
                    z-index: 1001 !important;
                }

                /* Ensure parent containers also allow overflow for the dropdown */
                .puck-editor > div:first-child,
                .Puck-editor > div:first-child {
                    overflow: visible !important;
                }

                .puck-button--primary { 
                    background: #2BEE6C !important; 
                    color: #0F172A !important; 
                    font-weight: 900 !important; 
                    border-radius: 14px !important; 
                    padding: 10px 24px !important;
                    box-shadow: 0 8px 16px rgba(43, 238, 108, 0.25) !important;
                    border: 0 !important;
                    transition: all 0.2s ease !important;
                }
                
                .puck-button--primary:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 12px 20px rgba(43, 238, 108, 0.35) !important;
                    background: #25D361 !important;
                }

                /* Field Styling */
                .puck-field-label { 
                    font-weight: 800 !important; 
                    color: #0F172A !important; 
                    font-size: 0.8rem !important; 
                    margin-bottom: 8px !important;
                    letter-spacing: -0.01em !important;
                }

                .puck-field-input { 
                    border-radius: 12px !important; 
                    border: 1px solid #F1F5F9 !important; 
                    font-weight: 600 !important;
                    padding: 10px 14px !important;
                    background: #F8FAFC !important;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.01) !important;
                    transition: all 0.2s ease !important;
                }

                .puck-field-input:focus { 
                    border-color: #2BEE6C !important; 
                    background: white !important;
                    box-shadow: 0 0 0 4px rgba(43, 238, 108, 0.1) !important;
                    outline: none !important;
                }

                /* Hide default Puck tabs to merge sidebar experience */
                /* [class*="puck-Tabs"] { display: none !important; } */

                .admin-editor-custom .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .admin-editor-custom .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .admin-editor-custom .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .admin-editor-custom .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }

                /* Puck Frame Viewport Styling */
                [class*="Frame-device-"] {
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    background: #f1f5f9 !important;
                }

                [class*="Frame-device-mobile"] [class*="Frame-frame"],
                [class*="Frame-device-mobile"] [class*="Canvas-frame"] {
                    border: 14px solid #1e293b !important;
                    border-radius: 48px !important;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.3) !important;
                    margin: 40px auto !important;
                }

                [class*="Frame-device-tablet"] [class*="Frame-frame"],
                [class*="Frame-device-tablet"] [class*="Canvas-frame"] {
                    border: 10px solid #1e293b !important;
                    border-radius: 32px !important;
                    box-shadow: 0 40px 80px -15px rgba(0,0,0,0.2) !important;
                    margin: 40px auto !important;
                }

                /* Native Puck Button Styling */
                [class*="IconButton"] {
                    background: white !important;
                    border: 1px solid #e2e8f0 !important;
                    border-radius: 10px !important;
                    transition: all 0.2s ease !important;
                    width: 36px !important;
                    height: 36px !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
                }

                [class*="IconButton"]:hover {
                    border-color: #2bee6c !important;
                    background: #f0fff4 !important;
                    transform: translateY(-1px) !important;
                }

                [class*="IconButton"]--active {
                    background: #2bee6c !important;
                    border-color: #2bee6c !important;
                    color: #064e3b !important;
                    box-shadow: 0 4px 12px rgba(43, 238, 108, 0.2) !important;
                }

                /* Toolbar/Bottombar Refinement */
                [class*="Frame-status"] {
                    background: white !important;
                    border-top: 1px solid #e2e8f0 !important;
                    padding: 8px 16px !important;
                    height: 56px !important;
                    display: flex !important;
                    align-items: center !important;
                }

                /* Zoom and Viewport controls at bottom */
                [class*="Frame-status"] [class*="IconButton"] {
                    width: 32px !important;
                height: 32px !important;
                }

                /* Form Fields in Sidebar Labels */
                [class*="Field-label"], .puck-field-label {
                    font-size: 11px !important;
                    font-weight: 800 !important;
                    letter-spacing: 0.05em !important;
                    text-transform: uppercase !important;
                    color: #64748b !important;
                }

                /* Hide Redundant puck bars if they reappear */
                .puck-action-bar { border-top-color: #e2e8f0 !important; }

                ${!isSidebarOpen ? `
                /* Hide Left Sidebar */
                .puck-editor > div:nth-child(2) > div:first-child,
                .Puck-editor > div:nth-child(2) > div:first-child {
                    display: none !important;
                    width: 0 !important;
                }
                ` : ''}
            `}</style>

            <div className="flex-1 w-full flex flex-col">
                <Puck
                    config={configOverride || defaultConfig}
                    data={data}
                    onPublish={onPublish}
                    onChange={onChange}
                    iframe={{ enabled: false }}
                    overrides={{
                        outline: ({ children }: { children: ReactNode }) => {
                            if (activeTab === "theme") {
                                return <ThemeSettings />;
                            }
                            if (activeTab === "library") {
                                return (
                                    <LibraryPanel
                                        onInsert={(type, props) => {
                                            const newBlock = { ...props, id: `${type}-${Date.now()}` };
                                            onChange?.({
                                                ...data,
                                                content: [...data.content, { type, props: newBlock }]
                                            });
                                        }}
                                    />
                                );
                            }
                            if (activeTab === "history") {
                                return currentPageId ? <HistoryPanel pageId={currentPageId} /> : <div className="p-8 text-center text-xs text-slate-400">Select a page to view history</div>;
                            }
                            return (
                                <div className="flex flex-col h-full relative">
                                    <div className="p-4 border-b border-slate-50 space-y-3 sticky top-0 bg-white/50 backdrop-blur-md z-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                {activeTab === "structure" ? "Page Structure" : "Components"}
                                            </h3>
                                            <div className="flex gap-2">
                                                {activeTab === "structure" && (
                                                    <button
                                                        onClick={async () => {
                                                            // Find the selected item's ID from the DOM
                                                            const selectedEl = document.querySelector('.puck-outline-item--selected');
                                                            if (!selectedEl) {
                                                                alert("Please select a component in the editor first.");
                                                                return;
                                                            }

                                                            // Puck doesn't make it easy to map DOM to data. 
                                                            // As a robust workaround, we'll prompt for the name and find the match in data.content
                                                            const componentName = selectedEl.textContent?.trim();
                                                            const tplName = prompt(`Enter a name for this ${componentName} template:`, `Custom ${componentName}`);

                                                            if (tplName) {
                                                                // We'll search for the first component in data.content that matches this type
                                                                // (Ideally we'd use ID but Puck hides internal IDs well)
                                                                const match = data.content.find(item => {
                                                                    // Basic heuristic: match by type. If multiple exist, we take the first.
                                                                    // For a truly robust version, we'd need ID tracking.
                                                                    return item.type === componentName;
                                                                });

                                                                if (match) {
                                                                    await saveTemplate({
                                                                        name: tplName,
                                                                        componentType: match.type,
                                                                        props: match.props,
                                                                        token: token ?? undefined
                                                                    });
                                                                    alert("Block saved to Library!");
                                                                    setActiveTab("library");
                                                                } else {
                                                                    alert("Could not find block data. Make sure it's the right component.");
                                                                }
                                                            }
                                                        }}
                                                        className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:text-nb-green hover:border-nb-green transition-all shadow-sm"
                                                        title="Save Selected Block to Library"
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {activeTab === "structure" && (
                                                    <button
                                                        onClick={() => {
                                                            const componentsTab = document.querySelector('[data-testid="puck-sidebar-tab-components"]');
                                                            if (componentsTab instanceof HTMLElement) {
                                                                const parent = componentsTab.closest('[class*="Sidebar-tabs"]') as HTMLElement;
                                                                if (parent) {
                                                                    const originalDisplay = parent.style.display;
                                                                    parent.style.display = 'flex';
                                                                    componentsTab.click();
                                                                    parent.style.display = originalDisplay;
                                                                    setActiveTab("components"); // Sync our state
                                                                } else {
                                                                    componentsTab.click();
                                                                    setActiveTab("components"); // Sync our state
                                                                }
                                                            }
                                                        }}
                                                        className="w-8 h-8 bg-nb-green text-slate-900 rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-sm group"
                                                        title="Add New Block"
                                                    >
                                                        <Plus className="w-4 h-4 text-slate-900 group-hover:stroke-[3px]" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {activeTab === "components" && (
                                            <div className="relative">
                                                <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search blocks..."
                                                    className="w-full pl-8 pr-4 py-2 bg-slate-100/50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green transition-all"
                                                    onChange={(e) => {
                                                        const query = e.target.value.toLowerCase();
                                                        const items = document.querySelectorAll('.puck-sidebar-item');
                                                        items.forEach(item => {
                                                            const text = item.textContent?.toLowerCase() || "";
                                                            (item as HTMLElement).style.display = text.includes(query) ? 'flex' : 'none';
                                                        });
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
                                        {children}
                                    </div>
                                </div>
                            );
                        },
                        header: ({ actions }: { actions: ReactNode }) => (
                            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-slate-200 shadow-sm z-[1001] relative overflow-visible">
                                <div className="flex items-center gap-6">
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg hover:bg-slate-800 transition-all active:scale-95 border border-white/10 group"
                                    >
                                        <PenTool size={14} className="text-nb-green group-hover:rotate-12 transition-transform" />
                                        EXIT TO ADMIN
                                    </Link>

                                    <div className="w-px h-6 bg-slate-200" />

                                    <div className="w-[240px]">
                                        <CustomSelect
                                            value={currentPath}
                                            onChange={onPathChange}
                                            options={pages.map((p) => ({
                                                value: p.path,
                                                label: p.title || "Untitled Page",
                                                description: `${p.path} • ${p.status === "published" ? "Live" : "Draft"}`,
                                                icon: p.status === "published"
                                                    ? <Globe size={14} className="text-nb-green" />
                                                    : <Layout size={14} className="text-slate-400" />
                                            }))}
                                            placeholder="Select a page..."
                                        />
                                    </div>

                                    <div className="w-px h-6 bg-slate-200" />

                                    {pages.find(p => p.path === currentPath)?.status === "published" && (
                                        <a
                                            href={currentPath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-nb-green transition-colors mr-2"
                                            title="View Live Page"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}

                                    <div className="w-px h-6 bg-slate-200" />

                                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                                        <button
                                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/50 transition-colors mr-2"
                                            title="Toggle Sidebar"
                                        >
                                            {isSidebarOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("structure")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "structure"
                                                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                                }`}
                                        >
                                            <Layers className="w-3.5 h-3.5" />
                                            Outline
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("components")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "components"
                                                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                                }`}
                                        >
                                            <Layout className="w-3.5 h-3.5" />
                                            Blocks
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("library")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "library"
                                                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                                }`}
                                        >
                                            <Archive className="w-3.5 h-3.5" />
                                            Library
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("theme")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "theme"
                                                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                                }`}
                                        >
                                            <Palette className="w-3.5 h-3.5" />
                                            Theme
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("history")}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === "history"
                                                ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                                }`}
                                        >
                                            <History className="w-3.5 h-3.5" />
                                            History
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {isSaving && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                            <Loader2 size={12} className="animate-spin" />
                                            SAVING...
                                        </div>
                                    )}
                                    {hasUnpublishedChanges && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
                                            UNPUBLISHED CHANGES
                                        </div>
                                    )}
                                    {hasUnpublishedChanges && onDiscardDraft && (
                                        <button
                                            onClick={onDiscardDraft}
                                            className="text-[10px] font-bold text-slate-500 hover:text-red-500 transition-colors border-r border-slate-200 pr-4 mr-1"
                                        >
                                            DISCARD DRAFT
                                        </button>
                                    )}
                                    {actions}
                                </div>
                            </div>
                        )
                    }}
                />
            </div>
        </div>
    );
}
