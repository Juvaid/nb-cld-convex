'use client';

import { useState } from 'react';
import { Download, Copy, CheckCircle } from 'lucide-react';
import { defaultTheme, defaultServices, defaultProductCategories, defaultTestimonials, defaultStats, defaultNavLinks, exportThemeAsJSON } from '@/lib/theme';

export default function ExportPage() {
    const [copied, setCopied] = useState(false);
    const [exportName, setExportName] = useState('naturesboon-theme-export');

    const exportData = exportThemeAsJSON(
        defaultTheme,
        { navLinks: defaultNavLinks, stats: defaultStats, testimonials: defaultTestimonials },
        defaultProductCategories,
        defaultServices
    );

    const handleCopy = () => {
        navigator.clipboard.writeText(exportData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${exportName}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Theme & Content Export</h1>
                <p className="text-gray-500 text-sm mt-1">Export your site configuration as JSON for platform migration or backup.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Export controls */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Export Options</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Export Name</label>
                            <input
                                value={exportName}
                                onChange={e => setExportName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-medium text-gray-600">Includes:</h3>
                            {['Theme Settings', 'Navigation Links', 'Content Blocks', 'Services', 'Products', 'Testimonials', 'Stats'].map((item) => (
                                <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
                                    <input type="checkbox" checked readOnly className="rounded border-gray-300 text-primary focus:ring-primary" />
                                    {item}
                                </label>
                            ))}
                        </div>

                        <div className="space-y-2 pt-2">
                            <button
                                onClick={handleDownload}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary-dark transition-colors"
                            >
                                <Download className="w-4 h-4" /> Download JSON
                            </button>
                            <button
                                onClick={handleCopy}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors"
                            >
                                {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                    <h2 className="font-bold text-gray-900 mb-4">Export Preview</h2>
                    <pre className="bg-gray-900 text-green-400 p-5 rounded-xl text-xs overflow-auto max-h-[600px] font-mono leading-relaxed">
                        {exportData}
                    </pre>
                </div>
            </div>

            {/* Info */}
            <div className="mt-6 bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">🔄 Platform Migration Ready</h3>
                <p className="text-white/70 text-sm">
                    This JSON export contains your complete site configuration. You can use it to migrate to any hosting provider
                    or import into another CMS. The export includes theme settings, all content blocks, product catalog,
                    services, and testimonials.
                </p>
            </div>
        </div>
    );
}
