import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "B2B SaaS - Public Site",
    description: "High-end B2B platform",
};

export default function SiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
}
