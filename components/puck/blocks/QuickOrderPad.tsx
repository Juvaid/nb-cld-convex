"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

export const QuickOrderPad = () => {
    const [rows, setRows] = useState([{ sku: "", qty: 1 }]);

    const addRow = () => setRows([...rows, { sku: "", qty: 1 }]);
    const updateRow = (index: number, field: string, value: string | number) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const handleBulkOrder = () => {
        console.log("Bulk order:", rows.filter(r => r.sku));
        // Logic to integrate with cart or inquiry system
        alert("Bulk order list submitted for quote!");
    };

    return (
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="p-2 bg-nb-green/10 rounded-lg text-nb-green">📦</span>
                Quick Order Pad
            </h3>
            <p className="text-slate-500 mb-8 text-sm">
                Enter technical SKUs and quantities directly for high-speed procurement.
            </p>

            <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400">
                    <div className="col-span-8">Product SKU / ID</div>
                    <div className="col-span-4">Quantity (kg/units)</div>
                </div>

                {rows.map((row, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-8">
                            <input
                                title="sku"
                                type="text"
                                placeholder="e.g. ASH-EXT-5-W"
                                value={row.sku}
                                onChange={(e) => updateRow(index, "sku", e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green transition-all"
                            />
                        </div>
                        <div className="col-span-4">
                            <input
                                title="quantity"
                                type="number"
                                min="1"
                                value={row.qty}
                                onChange={(e) => updateRow(index, "qty", parseInt(e.target.value))}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nb-green/20 focus:border-nb-green transition-all"
                            />
                        </div>
                    </div>
                ))}

                <div className="flex justify-between mt-8">
                    <button
                        onClick={addRow}
                        className="text-nb-green font-bold text-sm hover:underline flex items-center gap-1"
                    >
                        + Add another item
                    </button>
                    <Button
                        onClick={handleBulkOrder}
                        className="bg-nb-green hover:bg-nb-green/90 text-white rounded-xl px-8"
                    >
                        Submit Bulk Quote Request
                    </Button>
                </div>
            </div>
        </div>
    );
};
