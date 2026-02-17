"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FileText, Edit2, ExternalLink, Plus } from "lucide-react";
import { TemplateSelector } from "@/components/editor/TemplateSelector";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PagesAdmin() {
    const pages = useQuery(api.pages.listPages);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const createPage = useMutation(api.pages.createPageFromTemplate);
    const toggleStatus = useMutation(api.pages.updatePageStatus);
    const router = useRouter();

    const handleSelectTemplate = async (templateId: string, pagePath: string, pageTitle: string) => {
        const templates = await fetch(`/api/templates/${templateId}`).then(r => r.json());

        await createPage({
            path: "/" + pagePath,
            title: pageTitle,
            templateData: templates.data,
        });

        router.push(`/admin/editor?path=/${pagePath}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Pages</h1>
                    <p className="text-slate-500">Manage your website&apos;s content and structure.</p>
                </div>
                <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="flex items-center gap-2 bg-nb-green text-slate-900 px-4 py-2 rounded-lg font-bold shadow-sm hover:shadow-md transition-all"
                >
                    <Plus size={20} />
                    Create New Page
                </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-widest">Page Name</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-widest">Path</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-widest">Status</th>
                            <th className="px-6 py-4 text-sm font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {pages?.map((page: any) => (
                            <tr key={page._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-bold text-slate-900">{page.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <code className="text-sm bg-slate-100 px-2 py-1 rounded text-slate-600">{page.path}</code>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={async () => {
                                            const newStatus = page.status === "published" ? "draft" : "published";
                                            await toggleStatus({ id: page._id, status: newStatus });
                                        }}
                                        className={`text-xs font-bold px-2 py-1 rounded-full transition-all hover:scale-105 active:scale-95 ${page.status === "published"
                                            ? "bg-nb-green/20 text-nb-green hover:bg-nb-green/30"
                                            : "bg-amber-100 text-amber-600 hover:bg-amber-200"
                                            }`}
                                    >
                                        {page.status || "draft"}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <a
                                            href={`/admin/editor?path=${page.path}`}
                                            className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-nb-green hover:bg-nb-green/5 hover:border-nb-green/20 rounded-xl transition-all shadow-sm"
                                            title="Edit with Puck"
                                        >
                                            <Edit2 size={20} />
                                        </a>
                                        <a
                                            href={page.path}
                                            target="_blank"
                                            className="p-2.5 text-slate-900 bg-white border border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all shadow-sm"
                                            title="View Live"
                                        >
                                            <ExternalLink size={20} />
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
                        {pages?.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400">No pages found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <TemplateSelector
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={handleSelectTemplate}
            />
        </div>
    );
}
