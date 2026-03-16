"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ComponentConfig } from "@puckeditor/core";
import { ProductSelector } from "../ProductSelector";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const ProductDetail = dynamic(() => import("@/components/blocks/ProductDetail"), {
    ssr: false,
});

export interface ProductDetailBlockProps {
    productId?: string;
    showHeaderFooter?: boolean;
    showSpecs?: boolean;
    showTrust?: boolean;
}

/**
 * Inner component to handle live updates on the client.
 */
function LiveProductDetail({ onProductsFound }: { onProductsFound: (p: any[]) => void }) {
    const liveProducts = useQuery(api.products.listAll, { status: "active" });
    useEffect(() => {
        if (liveProducts) onProductsFound(liveProducts);
    }, [liveProducts, onProductsFound]);
    return null;
}

export const ProductDetailBlock = ({
    productId,
    showHeaderFooter = false,
    showSpecs = true,
    showTrust = true,
    initialData, // Puck passes this now
}: ProductDetailBlockProps & { initialData?: any }) => {
    const [currentProducts, setCurrentProducts] = useState<any[]>(initialData?.initialDbProducts || []);

    const products = currentProducts.length > 0 ? currentProducts : (initialData?.initialDbProducts || []);
    const selectedProduct = products?.find((p: any) => p._id === productId);

    if (!productId) {
        return (
            <div className="py-20 bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[32px] m-4">
                <div className="text-center">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-bold text-slate-900">No Product Selected</h3>
                    <p className="text-sm text-slate-500">Select a product from the sidebar to preview the detail layout.</p>
                </div>
            </div>
        );
    }

    if (!selectedProduct) {
        return (
            <div className="py-20 bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[32px] m-4 animate-pulse">
                <div className="text-center">
                    <h3 className="text-lg font-bold text-slate-400">Loading Product Data...</h3>
                </div>
            </div>
        );
    }

    return (
        <>
            {typeof window !== "undefined" && (
                <LiveProductDetail onProductsFound={setCurrentProducts} />
            )}
            <ProductDetail
                slug={selectedProduct.slug}
                initialProduct={selectedProduct}
                showHeaderFooter={showHeaderFooter}
                showSpecs={showSpecs}
                showTrust={showTrust}
            />
        </>
    );
};

export const ProductDetailBlockConfig: ComponentConfig<ProductDetailBlockProps> = {
    fields: {
        productId: {
            type: "custom",
            label: "Select Product",
            render: ({ value, onChange }) => (
                <ProductSelector value={value || ""} onChange={onChange} />
            ),
        },
        showHeaderFooter: {
            type: "radio",
            label: "Show Site Header/Footer",
            options: [
                { label: "Yes", value: true },
                { label: "No (Block Mode)", value: false },
            ],
        },
        showSpecs: {
            type: "radio",
            label: "Show Technical Specs",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
        showTrust: {
            type: "radio",
            label: "Show Manufacturer Trust",
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false },
            ],
        },
    },
    defaultProps: {
        showHeaderFooter: false,
        showSpecs: true,
        showTrust: true,
    },
    render: (props) => <ProductDetailBlock {...props} />,
};
