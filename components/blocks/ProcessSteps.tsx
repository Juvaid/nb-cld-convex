import { ClipboardList, Beaker, Factory, Rocket, LucideIcon } from 'lucide-react';

export interface ProcessStepItem {
    title: string;
    description: string;
    icon: string;
}

export interface ProcessStepsProps {
    id?: string;
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
    id,
    heading = "Our Process",
    subheading = "How It Works",
    steps = [
        { icon: 'ClipboardList', title: 'Consultation', description: 'Discuss your brand vision, target market, and product requirements.' },
        { icon: 'Beaker', title: 'R&D / Formulation', description: 'Our in-house R&D team develops custom formulas tailored to your brand.' },
        { icon: 'Factory', title: 'Production', description: 'Scalable manufacturing with rigorous quality control at every stage.' },
        { icon: 'Rocket', title: 'Launch Support', description: 'Packaging design, branding, and marketing support for a successful launch.' },
    ],
    ...pProps
}: ProcessStepsProps & Record<string, any>) {
    const sectionId = id || (pProps as any).id;
    const dataBlock = (pProps as any)["data-block"];

    return (
        <section id={sectionId} data-block={dataBlock} className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="text-center mb-16">
                    <span className="text-nb-green font-bold text-sm tracking-widest uppercase">{subheading}</span>
                    <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">{heading}</h2>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {(steps || []).map((step, i) => {
                        const IconComponent = iconMap[step.icon];
                        return (
                            <div key={i} className="relative text-center group">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-nb-green-soft to-nb-green-deep flex items-center justify-center mx-auto mb-4 shadow-lg shadow-nb-green/20 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                    {IconComponent ? (
                                        <IconComponent className="w-8 h-8 text-white" />
                                    ) : (
                                        <img
                                            src={step.icon?.startsWith('http') ? step.icon : `/api/storage/${step.icon}`}
                                            className="w-full h-full object-cover"
                                            alt={step.title}
                                        />
                                    )}
                                </div>
                                <div className="text-xs font-bold text-nb-green mb-2 uppercase tracking-wide">STEP {i + 1}</div>
                                <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                                <p className="text-slate-500 text-sm">{step.description}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-nb-green-light to-nb-green/20" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
