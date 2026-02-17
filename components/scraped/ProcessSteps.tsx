import { ClipboardList, Beaker, Factory, Rocket, LucideIcon } from 'lucide-react';

export interface ProcessStepItem {
    title: string;
    description: string;
    icon: string;
}

export interface ProcessStepsProps {
    heading?: string;
    subheading?: string;
    steps?: ProcessStepItem[];
}

const iconMap: Record<string, LucideIcon> = {
    ClipboardList: ClipboardList,
    Beaker: Beaker,
    Factory: Factory,
    Rocket: Rocket,
};

export default function ProcessSteps({
    heading = "Our Process",
    subheading = "How It Works",
    steps = [
        { icon: 'ClipboardList', title: 'Consultation', description: 'Discuss your brand vision, target market, and product requirements.' },
        { icon: 'Beaker', title: 'R&D / Formulation', description: 'Our in-house R&D team develops custom formulas tailored to your brand.' },
        { icon: 'Factory', title: 'Production', description: 'Scalable manufacturing with rigorous quality control at every stage.' },
        { icon: 'Rocket', title: 'Launch Support', description: 'Packaging design, branding, and marketing support for a successful launch.' },
    ]
}: ProcessStepsProps) {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-16">
                    <span className="text-[#16a34a] font-bold text-sm tracking-widest uppercase">{subheading}</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">{heading}</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {(steps || []).map((step, i) => {
                        const IconComponent = iconMap[step.icon] || ClipboardList;
                        return (
                            <div key={i} className="relative text-center group">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#16a34a]/20 group-hover:scale-110 transition-transform duration-300">
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-xs font-bold text-[#16a34a] mb-2 uppercase tracking-wide">STEP {i + 1}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-500 text-sm">{step.description}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#2bee6c] to-[#16a34a]/20" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
