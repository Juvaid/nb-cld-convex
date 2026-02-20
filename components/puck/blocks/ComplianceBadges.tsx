import React from "react";

const badges = [
    { name: "GMP Certified", icon: "✔️", description: "Good Manufacturing Practices" },
    { name: "ISO 9001:2015", icon: "🌐", description: "Quality Management System" },
    { name: "USDA Organic", icon: "🌱", description: "Certified Organic Production" },
    { name: "AYUSH Certified", icon: "🌿", description: "Ministry of AYUSH, India" },
];

export const ComplianceBadges = () => {
    return (
        <div className="py-12 bg-slate-50/50">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-10">
                    <span className="text-nb-green font-bold text-xs uppercase tracking-[0.2em] mb-2 block">Trust & Verification</span>
                    <h2 className="text-2xl font-bold text-slate-900">Global Quality Certifications</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge, idx) => (
                        <div
                            key={idx}
                            className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all group group-hover:-translate-y-1"
                        >
                            <div className="w-12 h-12 bg-nb-green/5 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                {badge.icon}
                            </div>
                            <h4 className="font-bold text-slate-900 mb-1">{badge.name}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
