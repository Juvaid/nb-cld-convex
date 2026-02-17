import Link from 'next/link';
import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight, LucideIcon } from 'lucide-react';

export interface ServiceDetailItem {
    title: string;
    description: string;
    icon: string;
    slug: string;
}

export interface ServiceDetailListProps {
    services?: ServiceDetailItem[];
}

const iconMap: Record<string, LucideIcon> = {
    Palette: Palette,
    FlaskConical: FlaskConical,
    BadgeCheck: BadgeCheck,
    Megaphone: Megaphone,
};

export default function ServiceDetailList({ services = [] }: ServiceDetailListProps) {
    if (!services || services.length === 0) {
        return <div className="py-20 text-center text-slate-500">No services configured.</div>;
    }

    return (
        <section className="py-20 sm:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-24">
                {services.map((service, i) => {
                    const IconComponent = iconMap[service.icon] || Palette;
                    const isReversed = i % 2 !== 0;

                    return (
                        <div
                            key={service.slug || i}
                            id={service.slug}
                            className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
                        >
                            <div className={isReversed ? 'lg:order-2' : ''}>
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#2bee6c] flex items-center justify-center mb-5 shadow-lg shadow-[#16a34a]/20">
                                    <IconComponent className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">{service.title}</h2>
                                <p className="text-slate-500 leading-relaxed mb-6 whitespace-pre-line">{service.description}</p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-[#16a34a] to-[#2bee6c] rounded-full hover:shadow-lg hover:shadow-[#2bee6c]/30 transition-all"
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                            <div className={`rounded-[32px] bg-gradient-to-br from-slate-50 to-[#2bee6c]/10 p-12 flex items-center justify-center min-h-[300px] ${isReversed ? 'lg:order-1' : ''}`}>
                                <IconComponent className="w-24 h-24 text-[#16a34a]/20" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
