"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Check, ArrowRight, Layout, FileText, Users, Phone, Wrench, Sparkles, LucideIcon } from "lucide-react";

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateId: string, pagePath: string, pageTitle: string) => void;
}

const categoryIcons: Record<string, LucideIcon> = {
  landing: Sparkles,
  content: FileText,
  about: Users,
  contact: Phone,
  services: Wrench,
  blank: Layout,
};

const categoryLabels: Record<string, string> = {
  landing: "Landing Pages",
  content: "Content",
  about: "About",
  contact: "Contact",
  services: "Services",
  blank: "Blank",
};

export function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const templates = useQuery(api.templates.listTemplates);
  const [selectedCategory, setSelectedCategory] = useState<string>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [pagePath, setPagePath] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [step, setStep] = useState<"template" | "details">("template");

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("landing");
      setSelectedTemplate(null);
      setPagePath("");
      setPageTitle("");
      setStep("template");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredTemplates = templates?.filter((t) => t.category === selectedCategory) || [];
  const categories = Array.from(new Set(templates?.map((t) => t.category) || []));

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      setStep("details");
    }
  };

  const handleCreate = () => {
    if (selectedTemplate && pagePath && pageTitle) {
      onSelectTemplate(selectedTemplate, pagePath, pageTitle);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-black text-slate-900">
              {step === "template" ? "Choose a Template" : "Page Details"}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {step === "template" ? "Select a template to start building your page" : "Enter the details for your new page"}
            </p>
          </div>
          <button
            onClick={onClose}
            title="Close"
            aria-label="Close"
            className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "template" ? (
          <div className="flex-1 overflow-hidden flex">
            <div className="w-56 border-r border-slate-100 p-4 bg-slate-50">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">Categories</h3>
              <div className="space-y-1">
                {categories.map((category) => {
                  const Icon = categoryIcons[category] || Layout;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedCategory === category
                        ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                        : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                      {categoryLabels[category] || category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative p-6 rounded-2xl border-2 text-left transition-all ${selectedTemplate === template.id
                      ? "border-nb-green bg-nb-green/5 shadow-lg shadow-nb-green/10"
                      : "border-slate-100 hover:border-slate-200 hover:shadow-md"
                      }`}
                  >
                    <div className="text-4xl mb-4">{template.thumbnail}</div>
                    <h4 className="font-bold text-slate-900 mb-1">{template.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{template.description}</p>

                    {selectedTemplate === template.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-nb-green rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-slate-900" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  placeholder="e.g., About Us"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-nb-green focus:ring-2 focus:ring-nb-green/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  URL Path
                </label>
                <div className="flex items-center">
                  <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 text-sm font-medium">
                    /
                  </span>
                  <input
                    type="text"
                    value={pagePath}
                    onChange={(e) => setPagePath(e.target.value.replace(/^\//, ""))}
                    placeholder="about"
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-900 font-medium focus:outline-none focus:border-nb-green focus:ring-2 focus:ring-nb-green/20 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  This will be the URL of your page: /{pagePath || "..."}
                </p>
              </div>

              <button
                onClick={handleCreate}
                disabled={!pagePath || !pageTitle}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-nb-green text-slate-900 font-bold rounded-xl hover:bg-nb-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-nb-green/20"
              >
                Create Page
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50">
          {step === "template" ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSelectTemplate}
                disabled={!selectedTemplate}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep("template")}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Back
              </button>
              <div className="text-xs text-slate-400">
                Press Enter to create
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
