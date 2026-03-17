"use client";

/**
 * OGPreviewCard.tsx
 *
 * Shows how a URL will look when pasted into WhatsApp or Discord.
 * Drop this anywhere in the admin — pages list, products list, blog list.
 *
 * Usage:
 *   <OGPreviewCard
 *     title="Face Wash"
 *     description="Sulphate free formula for all skin types."
 *     imageUrl="https://pub-xxx.r2.dev/face-wash.jpg"
 *     url="/products/face-wash"
 *   />
 */

import { useState } from "react";
import { Monitor, MessageCircle, X, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";

const SITE_URL = "https://naturesboon.net";
const SITE_NAME = "naturesboon.net";
const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;

function resolveImageUrl(imageUrl?: string): string {
    if (!imageUrl) return DEFAULT_OG;
    if (imageUrl.startsWith("http")) return imageUrl;
    if (imageUrl.startsWith("/")) return `${SITE_URL}${imageUrl}`;
    // Convex storage ID
    if (!imageUrl.includes("/") && !imageUrl.includes(".")) {
        return `${SITE_URL}/api/storage/${imageUrl}`;
    }
    return `${SITE_URL}/${imageUrl}`;
}

function truncate(str: string, len: number) {
    if (!str) return "";
    return str.length > len ? str.slice(0, len) + "…" : str;
}

// ─── SEO health check for the preview header ─────────────────────────────────

function getSeoIssues(title?: string, description?: string, imageUrl?: string) {
    const issues: { level: "error" | "warn"; msg: string }[] = [];
    if (!title) issues.push({ level: "error", msg: "No title" });
    else if (title.includes("||")) issues.push({ level: "error", msg: "Double pipe in title" });
    else if (/\|\s*Nature['']s Boon\s*$/i.test(title)) issues.push({ level: "warn", msg: "Brand suffix will be duplicated by Next.js template" });
    else if (title.length > 60) issues.push({ level: "warn", msg: `Title ${title.length} chars (max 60)` });

    if (!description) issues.push({ level: "error", msg: "No meta description" });
    else if (description.length < 50) issues.push({ level: "warn", msg: `Description too short (${description.length}/50 min)` });
    else if (description.length > 160) issues.push({ level: "warn", msg: `Description too long (${description.length}/160 max)` });

    if (!imageUrl) issues.push({ level: "warn", msg: "No OG image — using default" });

    return issues;
}

// ─── WhatsApp preview ─────────────────────────────────────────────────────────

function WhatsAppPreview({ title, description, imageUrl, url }: PreviewProps) {
    const resolvedImage = resolveImageUrl(imageUrl);
    const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

    return (
        <div className="bg-[#0b141a] rounded-2xl p-4 font-sans">
            {/* Chat bubble */}
            <div className="max-w-[320px] bg-[#1f2c34] rounded-xl overflow-hidden shadow-lg">
                {/* Image */}
                <div className="w-full aspect-[1.91/1] bg-[#2a3942] overflow-hidden relative">
                    <img
                        src={resolvedImage}
                        alt={title || ""}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='210' fill='%232a3942'%3E%3Crect width='400' height='210'/%3E%3Ctext x='50%25' y='50%25' fill='%23546168' font-size='14' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                        }}
                    />
                    {!imageUrl && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[#546168] text-xs font-medium">Default OG image</span>
                        </div>
                    )}
                </div>
                {/* Text block */}
                <div className="p-3 border-l-4 border-[#00a884]">
                    <p className="text-[11px] text-[#00a884] font-semibold mb-1 uppercase tracking-wide truncate">
                        {SITE_NAME}
                    </p>
                    <p className="text-[14px] text-[#e9edef] font-semibold leading-snug mb-1">
                        {truncate(title || "No title", 65)}
                    </p>
                    <p className="text-[12px] text-[#8696a0] leading-relaxed">
                        {truncate(description || "No description", 120)}
                    </p>
                </div>
            </div>
            {/* Timestamp */}
            <p className="text-[10px] text-[#8696a0] mt-2 text-right pr-1">10:42 AM ✓✓</p>
        </div>
    );
}

// ─── Discord preview ──────────────────────────────────────────────────────────

function DiscordPreview({ title, description, imageUrl, url }: PreviewProps) {
    const resolvedImage = resolveImageUrl(imageUrl);
    const fullUrl = url.startsWith("http") ? url : `${SITE_URL}${url}`;

    return (
        <div className="bg-[#313338] rounded-2xl p-4 font-sans">
            {/* Message */}
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5865f2] flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                    NB
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-[14px] font-semibold text-white">naturesboon</span>
                        <span className="text-[11px] text-[#949ba4]">Today at 10:42 AM</span>
                    </div>
                    <p className="text-[14px] text-[#dbdee1] mb-2 break-all">{fullUrl}</p>

                    {/* Embed */}
                    <div className="border-l-4 border-[#5865f2] bg-[#2b2d31] rounded-sm rounded-tl-none p-3 max-w-[440px]">
                        <p className="text-[12px] text-[#00a8fc] font-semibold mb-1">{SITE_NAME}</p>
                        <a
                            href={fullUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[16px] font-semibold text-[#00a8fc] hover:underline block mb-1 leading-snug"
                        >
                            {truncate(title || "No title", 65)}
                        </a>
                        <p className="text-[14px] text-[#dbdee1] leading-relaxed mb-3">
                            {truncate(description || "No description", 200)}
                        </p>
                        {/* Large image */}
                        <div className="rounded-lg overflow-hidden w-full aspect-[1.91/1] bg-[#1e1f22]">
                            <img
                                src={resolvedImage}
                                alt={title || ""}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='210' fill='%231e1f22'%3E%3Crect width='400' height='210'/%3E%3Ctext x='50%25' y='50%25' fill='%23949ba4' font-size='14' text-anchor='middle' dominant-baseline='middle'%3EImage not found%3C/text%3E%3C/svg%3E";
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── SEO health bar ───────────────────────────────────────────────────────────

function SeoHealthBar({ issues }: { issues: ReturnType<typeof getSeoIssues> }) {
    const errors = issues.filter((i) => i.level === "error");
    const warns = issues.filter((i) => i.level === "warn");

    if (issues.length === 0) {
        return (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-700">
                <CheckCircle2 size={13} />
                All SEO fields present
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {errors.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                    <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                    <span><strong>Error:</strong> {issue.msg}</span>
                </div>
            ))}
            {warns.map((issue, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-700">
                    <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
                    <span><strong>Warning:</strong> {issue.msg}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface PreviewProps {
    title?: string;
    description?: string;
    imageUrl?: string;
    url: string;
}

export interface OGPreviewCardProps extends PreviewProps {
    /** Optional: trigger button style — "button" renders an icon button inline */
    trigger?: "button" | "inline";
}

export function OGPreviewCard({
    title,
    description,
    imageUrl,
    url,
    trigger = "inline",
}: OGPreviewCardProps) {
    const [open, setOpen] = useState(false);
    const [platform, setPlatform] = useState<"whatsapp" | "discord">("whatsapp");

    const seoIssues = getSeoIssues(title, description, imageUrl);
    const hasErrors = seoIssues.some((i) => i.level === "error");
    const hasWarns = seoIssues.some((i) => i.level === "warn");

    const indicatorClass = hasErrors
        ? "bg-red-500"
        : hasWarns
            ? "bg-amber-400"
            : "bg-emerald-400";

    if (trigger === "button") {
        return (
            <>
                {/* Trigger button */}
                <button
                    onClick={(e) => { e.stopPropagation(); setOpen(true); }}
                    title="Preview social share"
                    className="relative p-2 text-slate-400 bg-white border border-slate-200 hover:text-purple-500 hover:bg-purple-50 hover:border-purple-200 rounded-lg transition-all shadow-sm group"
                >
                    <Monitor size={16} />
                    {/* SEO status dot */}
                    <span className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${indicatorClass}`} />
                </button>

                {open && (
                    <OGPreviewModal
                        title={title}
                        description={description}
                        imageUrl={imageUrl}
                        url={url}
                        platform={platform}
                        setPlatform={setPlatform}
                        seoIssues={seoIssues}
                        onClose={() => setOpen(false)}
                    />
                )}
            </>
        );
    }

    // Inline mode — render the card directly (useful for product/page edit pages)
    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                {(["whatsapp", "discord"] as const).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPlatform(p)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${platform === p
                            ? "bg-white border-slate-300 text-slate-900 shadow-sm"
                            : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <MessageCircle size={12} />
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                ))}
                <a
                    href={url.startsWith("http") ? url : `${SITE_URL}${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto flex items-center gap-1 text-xs text-slate-400 hover:text-nb-green transition-colors"
                >
                    Open live <ExternalLink size={11} />
                </a>
            </div>
            {platform === "whatsapp"
                ? <WhatsAppPreview title={title} description={description} imageUrl={imageUrl} url={url} />
                : <DiscordPreview title={title} description={description} imageUrl={imageUrl} url={url} />
            }
            <SeoHealthBar issues={seoIssues} />
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function OGPreviewModal({
    title, description, imageUrl, url,
    platform, setPlatform, seoIssues, onClose
}: PreviewProps & {
    platform: "whatsapp" | "discord";
    setPlatform: (p: "whatsapp" | "discord") => void;
    seoIssues: ReturnType<typeof getSeoIssues>;
    onClose: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Panel */}
            <div
                className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-slate-200">
                    <div>
                        <h3 className="font-bold text-slate-900 text-base">Social share preview</h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate max-w-[300px]">{url}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Platform tabs */}
                <div className="flex gap-1 p-4 pb-0">
                    {(["whatsapp", "discord"] as const).map((p) => (
                        <button
                            key={p}
                            onClick={() => setPlatform(p)}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${platform === p
                                ? "bg-slate-900 border-slate-900 text-white"
                                : "border-slate-200 text-slate-500 hover:text-slate-700 hover:border-slate-300"
                                }`}
                        >
                            <MessageCircle size={12} />
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Preview */}
                <div className="p-4">
                    {platform === "whatsapp"
                        ? <WhatsAppPreview title={title} description={description} imageUrl={imageUrl} url={url} />
                        : <DiscordPreview title={title} description={description} imageUrl={imageUrl} url={url} />
                    }
                </div>

                {/* SEO health */}
                <div className="px-4 pb-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">SEO health check</p>
                    <SeoHealthBar issues={seoIssues} />
                </div>

                {/* Raw values (for debugging) */}
                <details className="px-4 pb-5">
                    <summary className="text-xs font-semibold text-slate-400 cursor-pointer hover:text-slate-600">
                        Raw metadata values
                    </summary>
                    <div className="mt-2 space-y-1 font-mono text-xs text-slate-500 bg-slate-50 rounded-xl p-3">
                        <p><span className="text-slate-400">title:</span> {title || <span className="text-red-400">missing</span>}</p>
                        <p><span className="text-slate-400">description:</span> {description ? `${description.length} chars` : <span className="text-red-400">missing</span>}</p>
                        <p><span className="text-slate-400">ogImage:</span> {imageUrl || <span className="text-amber-500">not set (default used)</span>}</p>
                        <p><span className="text-slate-400">url:</span> {url}</p>
                    </div>
                </details>
            </div>
        </div>
    );
}
