"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { Download, Upload, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, Database } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

type ImportResult = {
    success?: boolean;
    dryRun?: boolean;
    result?: {
        dryRun?: boolean;
        wouldImport?: Record<string, number>;
        imported?: Record<string, number>;
        message?: string;
    };
    error?: string;
};

export default function DataManagerPage() {
    const { token } = useAuth();
    const [importing, setImporting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [importResult, setImportResult] = useState<ImportResult | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [dryRun, setDryRun] = useState(true);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch("/api/data/export", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error("Export failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `nb-backup-${new Date().toISOString().slice(0, 10)}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert("Export failed: " + (err instanceof Error ? err.message : String(err)));
        } finally {
            setExporting(false);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append("backup", selectedFile);
            formData.append("dryRun", String(dryRun));

            const res = await fetch("/api/data/import", {
                method: "POST",
                body: formData,
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await res.json();
            setImportResult(data);
        } catch (err) {
            setImportResult({ error: err instanceof Error ? err.message : String(err) });
        } finally {
            setImporting(false);
        }
    };

    const tableColor = (count: number) =>
        count > 0 ? "text-emerald-600 font-semibold" : "text-slate-400";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start pt-12 px-4">
            <div className="w-full max-w-2xl space-y-6">

                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <Database className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">Data Manager</h1>
                        <p className="text-slate-500 text-sm">Export &amp; restore your site database</p>
                    </div>
                </div>

                {/* Export Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Download className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-slate-900 text-lg">Export Backup</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Downloads all your site data — pages, products, settings, theme, blogs, services — as a JSON file.
                                <strong className="text-slate-700"> Do this before making big changes.</strong>
                            </p>
                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                className="mt-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                            >
                                {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                                {exporting ? "Exporting..." : "Download Backup JSON"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Import Card */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="font-bold text-slate-900 text-lg">Import / Restore</h2>
                            <p className="text-slate-500 text-sm mt-1">
                                Upload a backup JSON file to restore your data. Use <strong>Dry Run</strong> first to preview without writing anything.
                            </p>

                            {/* File picker */}
                            <div className="mt-4 space-y-3">
                                <label className="block">
                                    <span className="text-sm font-medium text-slate-700">Select backup file</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={(e) => {
                                            setSelectedFile(e.target.files?.[0] ?? null);
                                            setImportResult(null);
                                        }}
                                        className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                    />
                                </label>

                                {/* Dry run toggle */}
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={dryRun}
                                        onChange={(e) => setDryRun(e.target.checked)}
                                        className="w-4 h-4 accent-blue-600"
                                    />
                                    <span className="text-sm text-slate-700">
                                        <strong>Dry Run</strong> — preview what would be imported (no changes written)
                                    </span>
                                </label>

                                {!dryRun && (
                                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-2.5 rounded-xl">
                                        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                        Dry Run is OFF — this will write to your database!
                                    </div>
                                )}

                                <button
                                    onClick={handleImport}
                                    disabled={!selectedFile || importing}
                                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
                                >
                                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                    {importing ? "Processing..." : dryRun ? "Preview Import" : "Import Now"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Result */}
                {importResult && (
                    <div className={`rounded-2xl border p-6 ${importResult.error ? "bg-red-50 border-red-200" : "bg-emerald-50 border-emerald-200"}`}>
                        {importResult.error ? (
                            <div className="flex items-start gap-3 text-red-700">
                                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold">Error</p>
                                    <p className="text-sm mt-1">{importResult.error}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3 text-emerald-800">
                                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="font-bold">
                                        {importResult.dryRun ? "Dry Run — Preview" : "✅ Import Successful"}
                                    </p>
                                    {importResult.result?.message && (
                                        <p className="text-sm mt-1">{importResult.result.message}</p>
                                    )}
                                    {/* Table counts */}
                                    {(importResult.result?.wouldImport || importResult.result?.imported) && (
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            {Object.entries(importResult.result.wouldImport ?? importResult.result.imported ?? {}).map(([table, count]) => (
                                                <div key={table} className="flex justify-between bg-white/60 rounded-lg px-3 py-1.5 text-sm">
                                                    <span className="text-slate-600">{table}</span>
                                                    <span className={tableColor(count as number)}>{count as number} records</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Security note */}
                <div className="flex items-start gap-3 bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600">
                    <ShieldCheck className="w-4 h-4 mt-0.5 text-slate-400 flex-shrink-0" />
                    <span>
                        Only accessible locally. Admin credentials are not included in exports for security.
                        Sensitive data (sessions, inquiries, rate limits) is excluded.
                    </span>
                </div>
            </div>
        </div>
    );
}
