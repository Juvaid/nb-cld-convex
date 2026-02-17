import React from 'react';
import { Factory, Users, Award, Target, LucideIcon } from 'lucide-react';

export interface JourneyCard {
    icon: string;
    title: string;
    desc: string;
}

export interface AboutJourneyProps {
    heading?: string;
    introduction?: string;
    paragraphs?: string[];
    cards?: JourneyCard[];
}

const iconMap: Record<string, LucideIcon> = {
    Factory,
    Users,
    Award,
    Target
};

export default function AboutJourney({
    heading = "Our Journey",
    introduction = "Established in the year 2006 at Ludhiana (Punjab, India), Nature's Boon is recognized as one of the most trusted Manufacturers and Suppliers of high quality personal care products.",
    paragraphs = [
        "In our journey of manufacturing, we have formulated & packaged for quality brands such as Luster Cosmetics, True Derma Essentials, Man Pride, Pukhraj Herbals, The Man Company, Glamveda, Skinnatura, Nuskhe By Paras, Studd Muffyn, Organic Essence, Taryansh Herbals, and many more.",
        "Our own products are marketed under the brand names \"Luster Cosmetics, True Derma Essentials, Man Pride\". These products are processed using best quality ingredients and sophisticated processing technology, formulated as per set industry norms and in compliance with international standards."
    ],
    cards = [
        { icon: 'Factory', title: 'Advanced Infrastructure', desc: 'State-of-the-art manufacturing, quality testing, warehousing, and packaging facilities.' },
        { icon: 'Users', title: 'Experienced Team', desc: 'Skilled professionals ensuring smooth operations at every stage of production.' },
        { icon: 'Award', title: 'Quality Commitment', desc: 'Experienced quality controllers monitor the complete process from procurement to dispatch.' },
        { icon: 'Target', title: 'Visionary Leadership', desc: 'Under the leadership of Founder & Mentor, Ms. Archana Dhingra, we continue to reach new heights.' },
    ]
}: AboutJourneyProps) {
    return (
        <section className="py-20 sm:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{heading}</h2>
                        <div className="space-y-4 text-slate-500 leading-relaxed font-medium text-lg opacity-80">
                            <p>{introduction}</p>
                            {paragraphs.map((para, idx) => (
                                <p key={idx}>{para}</p>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {(cards || []).map((item) => {
                            const IconComp = iconMap[item.icon] || Factory;
                            return (
                                <div key={item.title} className="flex gap-4 p-5 rounded-[24px] bg-white border border-slate-100 hover:border-[#16a34a]/30 hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center shrink-0 shadow-md shadow-[#16a34a]/20">
                                        <IconComp className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                        <p className="text-slate-500 text-xs sm:text-sm font-medium">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
