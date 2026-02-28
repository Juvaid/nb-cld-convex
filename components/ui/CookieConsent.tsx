"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Cookie } from "lucide-react";
import { Button } from "./Button";

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);
    const [showPreferences, setShowPreferences] = useState(false);

    // Preferences options
    const [analyticsCookies, setAnalyticsCookies] = useState(true);
    const [marketingCookies, setMarketingCookies] = useState(true);

    useEffect(() => {
        // Check if consent has already been given or declined
        const consentCookie = localStorage.getItem("nb-cookie-consent");
        if (!consentCookie) {
            // Add a small delay for better user experience
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem("nb-cookie-consent", "all");
        setIsVisible(false);
    };

    const handleRejectAll = () => {
        localStorage.setItem("nb-cookie-consent", "necessary-only");
        setIsVisible(false);
    };

    const handleSavePreferences = () => {
        localStorage.setItem("nb-cookie-consent", "custom");
        localStorage.setItem("nb-cookie-analytics", analyticsCookies ? "true" : "false");
        localStorage.setItem("nb-cookie-marketing", marketingCookies ? "true" : "false");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    if (showPreferences) {
        return (
            <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto w-full p-6 sm:p-8 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-nb-green/10 flex items-center justify-center">
                                <Cookie className="w-5 h-5 text-nb-green" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cookie Preferences</h3>
                        </div>
                        <button aria-label="Close preferences" onClick={() => setShowPreferences(false)} className="text-slate-400 hover:text-slate-600 p-2">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">Strictly Necessary Cookies</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">These cookies are essential for the website to function properly and cannot be disabled. They are usually only set in response to actions made by you.</p>
                            </div>
                            <div className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full whitespace-nowrap">Always Active</div>
                        </div>

                        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">Analytics Cookies</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" title="Enable Analytics Cookies" className="sr-only peer" checked={analyticsCookies} onChange={(e) => setAnalyticsCookies(e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nb-green"></div>
                            </label>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">Marketing Cookies</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant adverts on other sites.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" title="Enable Marketing Cookies" className="sr-only peer" checked={marketingCookies} onChange={(e) => setMarketingCookies(e.target.checked)} />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nb-green"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
                        <Button variant="outline" className="flex-1 px-4 text-sm" onClick={handleRejectAll}>
                            Reject Non-Essential
                        </Button>
                        <Button variant="primary" className="flex-1 px-4 text-sm" onClick={handleSavePreferences}>
                            Save Preferences
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:left-6 z-[90] sm:max-w-md w-full animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white/95 backdrop-blur-md shadow-[0_-10px_40px_rgba(0,0,0,0.1)] sm:shadow-[0_20px_40px_rgba(0,0,0,0.15)] sm:rounded-2xl border-t sm:border border-slate-200 p-5 sm:p-6 pb-8 sm:pb-6 relative overflow-hidden group">
                {/* Decorative element */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-nb-green/10 rounded-full blur-2xl group-hover:bg-nb-green/20 transition-colors duration-500 pointer-events-none" />

                <div className="flex gap-4 items-start relative z-10">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center mt-1">
                        <Cookie className="w-5 h-5 text-nb-green" />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-2 text-sm sm:text-base">We Value Your Privacy</h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/privacy-policy" className="text-nb-green font-medium hover:underline">Privacy Policy</Link> for more details.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
                            <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={handleAcceptAll}>
                                Accept All
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-white text-slate-700 hover:bg-slate-50" onClick={handleRejectAll}>
                                Reject All
                            </Button>
                            <button
                                onClick={() => setShowPreferences(true)}
                                className="text-xs font-semibold text-slate-500 hover:text-nb-green transition-colors mt-2 sm:mt-0 sm:ml-auto underline decoration-slate-300 underline-offset-4 hover:decoration-nb-green"
                            >
                                Manage Preferences
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
