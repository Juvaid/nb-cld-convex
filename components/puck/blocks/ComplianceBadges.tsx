import React from "react";
import { 
    ShieldCheck, 
    Globe, 
    Leaf, 
    Award, 
    CheckCircle2, 
    Search, 
    Zap, 
    Dna
} from "lucide-react";
import { sharedFields } from "../fields/shared";

const iconMap: Record<string, React.ReactNode> = {
    "ShieldCheck": <ShieldCheck className="w-6 h-6" />,
    "Globe": <Globe className="w-6 h-6" />,
    "Leaf": <Leaf className="w-6 h-6" />,
    "Award": <Award className="w-6 h-6" />,
    "CheckCircle2": <CheckCircle2 className="w-6 h-6" />,
    "Search": <Search className="w-6 h-6" />,
    "Zap": <Zap className="w-6 h-6" />,
    "Dna": <Dna className="w-6 h-6" />,
};

export const ComplianceBadges = ({ 
    title = "Global Quality Certifications",
    badgeText = "Trust & Verification",
    items = [],
    columns = 4,
    ...props
}: any) => {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-nb-green rounded-full blur-[100px] -mr-64 -mt-64" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-nb-green rounded-full blur-[100px] -ml-64 -mb-64" />
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    {badgeText && (
                        <span className="inline-block px-4 py-1.5 bg-nb-green/5 text-nb-green text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-nb-green/10 mb-6 animate-fade-in">
                            {badgeText}
                        </span>
                    )}
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight mb-4">
                        {title}
                    </h2>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-8`}>
                    {items.map((item: any, idx: number) => (
                        <div
                            key={idx}
                            className="group p-8 rounded-[32px] bg-white border border-slate-100 shadow-premium hover:shadow-2xl hover:shadow-nb-green/10 transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-nb-green/0 via-transparent to-nb-green/0 group-hover:from-nb-green/5 group-hover:to-transparent transition-all duration-700" />
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-nb-green/5 flex items-center justify-center text-nb-green mb-6 group-hover:scale-110 group-hover:bg-nb-green group-hover:text-white transition-all duration-500 shadow-sm border border-nb-green/10">
                                    {iconMap[item.iconName] || <ShieldCheck className="w-8 h-8" />}
                                </div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-nb-green transition-colors">{item.name}</h4>
                                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.description}</p>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <CheckCircle2 className="w-5 h-5 text-nb-green/20" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const ComplianceBadgesConfig = {
    fields: {
        title: { type: "text" },
        badgeText: { type: "text" },
        columns: {
            type: "select",
            options: [
                { label: "2 Columns", value: 2 },
                { label: "3 Columns", value: 3 },
                { label: "4 Columns", value: 4 },
            ]
        },
        items: {
            type: "array",
            getItemSummary: (item: any) => item.name || "Badge Item",
            arrayFields: {
                name: { type: "text" },
                description: { type: "textarea" },
                iconName: {
                    type: "select",
                    options: [
                        { label: "Shield (GMP)", value: "ShieldCheck" },
                        { label: "Globe (ISO)", value: "Globe" },
                        { label: "Leaf (Organic)", value: "Leaf" },
                        { label: "Award (Certified)", value: "Award" },
                        { label: "Science (R&D)", value: "Dna" },
                        { label: "Flash (Fast)", value: "Zap" },
                        { label: "Audit", value: "Search" },
                    ]
                }
            }
        },
        ...sharedFields
    },
    defaultProps: {
        title: "World-Class Quality Standards",
        badgeText: "Compliance & Trust",
        columns: 4,
        items: [
            { name: "GMP Certified", description: "Strict adherence to Good Manufacturing Practices for safety and consistency.", iconName: "ShieldCheck" },
            { name: "ISO 9001:2015", description: "International Quality Management standards ensuring process excellence.", iconName: "Globe" },
            { name: "AYUSH Approval", description: "Certified by the Ministry of AYUSH for authentic herbal formulations.", iconName: "Leaf" },
            { name: "Global Compliance", description: "Export-ready standards meeting international market requirements.", iconName: "Award" },
        ]
    },
    render: (props: any) => <ComplianceBadges {...props} />
};
