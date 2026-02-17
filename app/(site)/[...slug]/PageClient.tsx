"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { PuckRenderer } from "@/components/PuckRenderer";
import { aboutPageData } from "@/data/about-page-data";
import { productsPageData } from "@/data/products-page-data";
import { servicesPageData } from "@/data/services-page-data";
import { contactPageData } from "@/data/contact-page-data";
import homePageData from "@/data/home-page-data.json";

export default function PageClient({ slug }: { slug: string[] }) {
    const path = "/" + slug.join("/");
    const pageData = useQuery(api.pages.getPublishedPage, { path });

    if (pageData === undefined) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    // Try to parse the data if it exists
    let data;
    try {
        if (pageData) {
            data = JSON.parse(pageData.data);
        }
    } catch (e) {
        console.error("Failed to parse page data", e);
    }



    // Checking if the page is effectively empty (just a root title) to fallback to defaults
    const isEmptyPage = !data || !data.content || data.content.length === 0;

    if (!pageData || isEmptyPage) {
        if (path === "/") {
            return (
                <div className="min-h-screen">
                    <PuckRenderer data={homePageData} />
                </div>
            );
        }
        if (path === "/about") {
            const defaultData = aboutPageData;
            return (
                <div className="min-h-screen">
                    <PuckRenderer data={defaultData} />
                </div>
            );
        }

        if (path === "/products") {
            const defaultData = productsPageData;
            return (
                <div className="min-h-screen">
                    <PuckRenderer data={defaultData} />
                </div>
            );
        }

        if (path === "/services") {
            const defaultData = servicesPageData;
            return (
                <div className="min-h-screen">
                    <PuckRenderer data={defaultData} />
                </div>
            );
        }

        if (path === "/contact") {
            const defaultData = contactPageData;
            return (
                <div className="min-h-screen">
                    <PuckRenderer data={defaultData} />
                </div>
            );
        }

        return (
            <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
                <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                <p className="text-gray-500">The page you are looking for does not exist.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <PuckRenderer data={data} />
        </div>
    );
}
