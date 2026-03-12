"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import { Data } from "@puckeditor/core";
import { CustomPuckEditor } from "@/components/puck/custom-puck-editor";
import { aboutPageData } from "@/data/about-page-data";
import { productsPageData } from "@/data/products-page-data";
import { servicesPageData } from "@/data/services-page-data";
import { contactPageData } from "@/data/contact-page-data";
import homePageData from "@/data/home-page-data.json";
import { defaultServices } from "@/lib/default-theme";

interface EditorClientProps {
    path: string;
}

export function EditorClient({ path }: EditorClientProps) {
    const router = useRouter();
    const { token } = useAuth();
    const [data, setData] = useState<Data>({ content: [], root: { props: { title: "" } } });
    const [loadedPath, setLoadedPath] = useState<string | null>(null);
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [initialData, setInitialData] = useState<Data | null>(null);

    const pages = useQuery(api.pages.listPages);
    const pageData = useQuery(api.pages.getPage, { path });
    const savePage = useMutation(api.pages.savePage);
    const publishPage = useMutation(api.pages.publishPage);
    const revertDraft = useMutation(api.pages.revertDraft);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Update URL when path changes locally
    const handlePathChange = (newPath: string) => {
        router.push(`/admin/editor?path=${encodeURIComponent(newPath)}`);
    };

    // Reset data when path changes or new data loads
    useEffect(() => {
        if (pageData) {
            try {
                const loadedString = pageData.draftData || (pageData as any).data || '{"content":[],"root":{"props":{"title":""}}}';
                const parsed = JSON.parse(loadedString);

                // If the saved data has no content, try to load seed data
                if (!parsed.content || parsed.content.length === 0) {
                    const serviceSlug = path.replace(/^\/services\//, "").replace(/^\//, "");
                    const service = defaultServices.find(s => s.slug === serviceSlug);

                    if (service) {
                        setData({
                            content: [
                                {
                                    type: "ModernHero",
                                    props: {
                                        badgeText: "Our Services",
                                        title: service.title,
                                        description: service.description,
                                        primaryButtonText: "Contact Us",
                                        primaryButtonHref: "/contact",
                                        id: "Hero-service-inline"
                                    }
                                },
                                {
                                    type: "CallToAction",
                                    props: {
                                        title: "Ready to get started?",
                                        buttonText: "Request Consultation",
                                        buttonHref: "/contact",
                                        id: "CTA-service-inline"
                                    }
                                }
                            ],
                            root: { props: { title: service.title } }
                        });
                    } else if (path === "/") {
                        setData(homePageData as any);
                    } else if (path === "/about") {
                        setData(aboutPageData);
                    } else if (path === "/products") {
                        setData({
                            content: [
                                {
                                    type: "AboutHero",
                                    props: {
                                        badgeText: "Our Range",
                                        title: "Product Catalog",
                                        description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology.",
                                        id: "AboutHero-products-inline"
                                    }
                                },
                                {
                                    type: "ProductShowcase",
                                    props: {
                                        selectedProduct: "",
                                        id: "ProductShowcase-products-inline"
                                    }
                                }
                            ],
                            root: { props: { title: "Our Products" } }
                        });
                    } else if (path === "/services") {
                        setData(servicesPageData);
                    } else if (path === "/contact") {
                        setData(contactPageData);
                    } else {
                        setData(parsed);
                    }
                } else {
                    setData(parsed);
                }
                setLoadedPath(path);
                setSaveStatus("saved");
                setInitialData(parsed); // Set initial data for comparison
            } catch (e) {
                console.error("Failed to parse page data", e);
                setData({ content: [], root: { props: { title: "" } } });
                setLoadedPath(path);
                setSaveStatus("saved");
                setInitialData({ content: [], root: { props: { title: "" } } }); // Set initial data for comparison
            }
        } else if (pageData === null) {
            // Find seeding logic same as before
            const serviceSlug = path.replace(/^\/services\//, "").replace(/^\//, "");
            const service = defaultServices.find(s => s.slug === serviceSlug);

            let seedData: Data;
            if (service) {
                setData({
                    content: [
                        {
                            type: "ModernHero",
                            props: {
                                badgeText: "Our Services",
                                title: service.title,
                                description: service.description,
                                primaryButtonText: "Contact Us",
                                primaryButtonHref: "/contact",
                                id: "Hero-service-fallback"
                            }
                        },
                        {
                            type: "CallToAction",
                            props: {
                                title: "Ready to get started?",
                                buttonText: "Request Consultation",
                                buttonHref: "/contact",
                                id: "CTA-service-fallback"
                            }
                        }
                    ],
                    root: { props: { title: service.title } }
                });
            } else if (path === "/about") {
                setData(aboutPageData);
            } else if (path === "/products") {
                setData({
                    content: [
                        {
                            type: "AboutHero",
                            props: {
                                badgeText: "Our Range",
                                title: "Product Catalog",
                                description: "Premium personal care products manufactured with the finest ingredients and cutting-edge technology.",
                                id: "AboutHero-products-fallback"
                            }
                        },
                        {
                            type: "ProductShowcase",
                            props: {
                                selectedProduct: "",
                                id: "ProductShowcase-products-fallback"
                            }
                        }
                    ],
                    root: { props: { title: "Our Products" } }
                });
            } else if (path === "/services") {
                setData(servicesPageData);
            } else if (path === "/contact") {
                setData(contactPageData);
            } else if (path === "/") {
                setData(homePageData as any);
            } else {
                setData({ content: [], root: { props: { title: "" } } });
            }
            setLoadedPath(path);
        }
    }, [pageData, path]);

    const handleAutoSave = (newData: Data) => {
        setData(newData);
        setSaveStatus("saving");
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
            const currentPage = pages?.find(p => p.path === path);
            try {
                await savePage({
                    path,
                    title: pages?.find(p => p.path === path)?.title || "Untitled Page",
                    draftData: JSON.stringify(newData),
                    status: currentPage?.status || "draft",
                    token: token ?? undefined,
                });
                setSaveStatus("saved");
                setLastSaved(new Date());
            } catch (error) {
                console.error("Auto-save failed:", error);
                setSaveStatus("unsaved");
            }
        }, 1500);
    };

    const handlePublish = async (newData: Data) => {
        setData(newData);
        setSaveStatus("saving");
        try {
            // First ensure the latest draft is fully saved
            await savePage({
                path,
                title: pages?.find(p => p.path === path)?.title || "Untitled Page",
                draftData: JSON.stringify(newData),
                status: "draft",
                token: token ?? undefined,
            });

            // Execute the publish mutation
            await publishPage({ path, token: token ?? undefined });
            setSaveStatus("saved");
            setLastSaved(new Date());

            // Revalidate Cache via Server Action/API (Fire and forget)
            fetch('/api/revalidate?path=' + encodeURIComponent(path), { method: 'POST' }).catch(console.error);
        } catch (error) {
            console.error("Publish failed:", error);
            setSaveStatus("unsaved");
        }
    };

    const handleDiscard = async () => {
        if (!confirm("Are you sure you want to discard your unpublished changes? This cannot be undone.")) return;
        setSaveStatus("saving");
        try {
            await revertDraft({ path, token: token ?? undefined });
            setSaveStatus("saved");
            // pageData will strictly reload due to reactivity
        } catch (error) {
            console.error("Discard failed:", error);
            setSaveStatus("unsaved");
        }
    };

    const hasUnpublishedChanges = pageData
        ? (pageData.draftData || (pageData as any).data) !== pageData.publishedData
        : false;

    if (pageData === undefined || loadedPath !== path) {
        return (
            <div className="flex h-screen items-center justify-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Loading Editor Content...</span>
            </div>
        );
    }

    return (
        <div className="h-screen w-full relative bg-background">
            <CustomPuckEditor
                key={path}
                data={data}
                onPublish={handlePublish}
                onChange={handleAutoSave}
                pages={pages}
                currentPath={path}
                onPathChange={handlePathChange}
                hasUnpublishedChanges={hasUnpublishedChanges}
                onDiscardDraft={handleDiscard}
                isSaving={saveStatus === "saving"}
            />
        </div>
    );
}
