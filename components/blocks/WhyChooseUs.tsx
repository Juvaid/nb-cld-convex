import React from 'react';
import { CheckCircle, FlaskConical, Factory, LucideIcon } from 'lucide-react';

export interface WhyChooseUsItem {
    icon: string;
    title: string;
    desc: string;
}

export interface WhyChooseUsProps {
    heading?: string;
    items?: WhyChooseUsItem[];
}

const iconMap: Record<string, LucideIcon> = {
    CheckCircle,
    FlaskConical,
    Factory
};

export default function WhyChooseUs({
    heading = "Why Choose Nature's Boon?",
    items = [
        { icon: 'CheckCircle', title: 'ISO Certified Quality', desc: 'All products meet international quality standards with rigorous testing at every stage.' },
        { icon: 'FlaskConical', title: 'In-house R&D', desc: '75+ products developed by our dedicated research and development team.' },
        { icon: 'Factory', title: 'Scalable Operations', desc: '750+ tons annual capacity with flexible production for brands of all sizes.' },
    ]
}: WhyChooseUsProps) {
    return (
        <section className="py-12 sm:py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-12 tracking-tight">{heading}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {(items || []).map((item) => {
                        const IconComp = iconMap[item.icon] || CheckCircle;
                        return (
                            <div key={item.title} className="bg-white rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-shadow border border-slate-100">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-nb-green-soft to-nb-green-deep flex items-center justify-center mx-auto mb-5 shadow-lg shadow-nb-green/20 overflow-hidden">
                                    {iconMap[item.icon] ? (
                                        <IconComp className="w-8 h-8 text-white" />
                                    ) : (
                                        <img
                                            src={item.icon?.startsWith('http') ? item.icon : `/api/storage/${item.icon}`}
                                            className="w-full h-full object-cover"
                                            alt={item.title}
                                        />
                                    )}
                                </div>
                                <h3 className="font-black text-lg text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
