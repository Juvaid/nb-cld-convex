"use client";

export const dynamic = "force-dynamic";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileText, Edit2, ExternalLink, Plus, FolderTree } from "lucide-react";
import { OGPreviewCard } from "@/components/admin/OGPreviewCard";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

type PageType = "core" | "blog" | "service" | "product" | "seo" | "other";

function inferPageType(path: string): PageType {
    if (path === "/" || path === "/about" || path === "/contact") return "core";
    if (path === "/services" || path.startsWith("/services")) return "service";
    if (path === "/products" || path.startsWith("/products")) return "product";
    if (path === "/blogs" || path.startsWith("/blogs")) return "blog";
    if (path.startsWith("/best-") || path.startsWith("/top-")) return "seo";
    return "other";
}

export default function PagesAdmin() {
    const pages = useQuery(api.pages.listPages);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | PageType>("all");
    const { token } = useAuth();
    const createPage = useMutation(api.pages.createPageFromTemplate);
    const toggleStatus = useMutation(api.pages.updatePageStatus);
    const router = useRouter();

    const handleSelectTemplate = async (templateId: string, pagePath: string, pageTitle: string) => {
        const templates = await fetch(`/api/templates/${templateId}`).then(r => r.json());

        await createPage({
            path: "/" + pagePath,
            title: pageTitle,
            templateData: templates.data,
            token: token ?? undefined,
        });

        router.push(`/admin/editor?path=/${pagePath}`);
    };

    const filteredPages = useMemo(() => {
        if (!pages) return undefined;

        return pages
            .map((page: any) => ({
                ...page,
                _type: inferPageType(page.path as string),
            }))
            .filter((page: any) => {
                const matchesSearch =
                    page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    page.path.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesStatus =
                    statusFilter === "all" ||
                    (statusFilter === "published" && page.status === "published") ||
                    (statusFilter === "draft" && (!page.status || page.status === "draft"));

                const matchesType =
                    typeFilter === "all" || page._type === typeFilter;

                return matchesSearch && matchesStatus && matchesType;
            });
    }, [pages, searchQuery, statusFilter, typeFilter]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Pages</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Manage your website&apos;s content and structure.</p>
                </div>
                <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-nb-green text-white px-4 h-10 flex-shrink-0 rounded-xl font-semibold shadow-sm hover:bg-nb-green/90 transition-all focus:ring-2 focus:ring-nb-green focus:ring-offset-2"
                >
                    <Plus size={18} />
                    Create New Page
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative w-full sm:max-w-md group">
                    <Plus className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 rotate-45 group-focus-within:text-nb-green transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search pages by title or path..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 h-10 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green focus:bg-white transition-all text-sm font-medium placeholder:text-slate-400"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
                    {(["all", "published", "draft"] as const).map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${statusFilter === status
                                ? "bg-white text-nb-green shadow-sm border border-slate-200"
                                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200 w-full sm:w-auto overflow-x-auto">
                        {(["all", "core", "service", "product", "blog", "seo", "other"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setTypeFilter(type === "all" ? "all" : type)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all whitespace-nowrap ${
                                    typeFilter === (type === "all" ? "all" : type)
                                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
                                }`}
                            >
                                {type === "seo" ? "SEO / Landing" : type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Page Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:table-cell">Path</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest hidden md:table-cell">SEO</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredPages?.map((page: any) => (
                                <tr key={page._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100/50 group-hover:scale-105 transition-transform flex-shrink-0">
                                                <FileText size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm text-slate-900">{page.title}</span>
                                                <span className="text-xs text-slate-400 mt-0.5 sm:hidden">{page.path}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 hidden sm:table-cell">
                                        <code className="text-xs font-medium bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">{page.path}</code>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        {(() => {
                                            const type = inferPageType(page.path as string);
                                            const labelMap: Record<PageType, string> = {
                                                core: "Core",
                                                blog: "Blog",
                                                service: "Service",
                                                product: "Product",
                                                seo: "SEO / Landing",
                                                other: "Other",
                                            };
                                            const colorMap: Record<PageType, string> = {
                                                core: "bg-slate-100 text-slate-700",
                                                blog: "bg-emerald-50 text-emerald-700",
                                                service: "bg-sky-50 text-sky-700",
                                                product: "bg-indigo-50 text-indigo-700",
                                                seo: "bg-amber-50 text-amber-700",
                                                other: "bg-slate-50 text-slate-500",
                                            };
                                            return (
                                                <button
                                                    onClick={() => setTypeFilter(type)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${colorMap[type]}`}
                                                >
                                                    <FolderTree size={10} />
                                                    {labelMap[type]}
                                                </button>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={async () => {
                                                const newStatus = page.status === "published" ? "draft" : "published";
                                                await toggleStatus({ id: page._id, status: newStatus, token: token ?? undefined });
                                            }}
                                            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all uppercase tracking-wider ${page.status === "published"
                                                ? "bg-nb-green/10 text-nb-green hover:bg-nb-green/20"
                                                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                }`}
                                        >
                                            {page.status || "draft"}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 hidden md:table-cell">
                                        {/* SEO quick status dot */}
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                                                !page.title || page.title.includes("||") || !page.publishedData
                                                    ? "bg-red-400"
                                                    : !page.description || !page.ogImage
                                                        ? "bg-amber-400"
                                                        : "bg-emerald-400"
                                            }`} />
                                            <span className="text-xs text-slate-400 font-medium">
                                                {!page.publishedData
                                                    ? "Not published"
                                                    : !page.description
                                                        ? "No description"
                                                        : !page.ogImage
                                                            ? "No OG image"
                                                            : "OK"
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <OGPreviewCard
                                                trigger="button"
                                                title={page.title}
                                                description={page.description}
                                                imageUrl={page.ogImage}
                                                url={page.path}
                                            />
                                            <a
                                                href={`/admin/editor?path=${page.path}`}
                                                className="p-2 text-slate-400 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 hover:border-nb-green/30 rounded-lg transition-all shadow-sm"
                                                title="Edit with Puck"
                                            >
                                                <Edit2 size={16} />
                                            </a>
                                            <a
                                                href={page.path}
                                                target="_blank"
                                                className="p-2 text-slate-400 bg-white border border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 rounded-lg transition-all shadow-sm"
                                                title="View Live"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!pages && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">Loading pages...</td>
                                </tr>
                            )}
                            {pages && filteredPages?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 text-slate-400">
                                            <FileText size={40} className="opacity-20 mb-2" />
                                            <p className="font-bold text-slate-600">No pages found</p>
                                            <p className="text-sm">Try adjusting your search or filters.</p>
                                            {(searchQuery || statusFilter !== "all") && (
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery("");
                                                        setStatusFilter("all");
                                                    }}
                                                    className="mt-4 text-nb-green text-sm font-bold hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {pages?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No pages found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TemplateSelector
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={handleSelectTemplate}
            />
        </div>
    );
}
