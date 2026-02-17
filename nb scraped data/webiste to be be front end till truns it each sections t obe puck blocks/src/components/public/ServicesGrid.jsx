import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { defaultServices } from '@/lib/theme';

const iconMap = {
    Palette: Palette,
    FlaskConical: FlaskConical,
    BadgeCheck: BadgeCheck,
    Megaphone: Megaphone,
};

export default function ServicesGrid() {
    return (
        <section className="section-padding bg-surface-muted relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-primary/5 text-primary text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] leading-none mb-4 sm:mb-6">
                        Our Capability
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-dark tracking-tight leading-[1.1]">Expert Solutions <br className="hidden sm:block" />for Your Brand</h2>
                    <p className="text-base sm:text-xl text-muted max-w-2xl mx-auto mt-4 sm:mt-6 font-medium opacity-80">
                        We provide comprehensive, end-to-end manufacturing services to help you build a world-class personal care brand.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                    {defaultServices.map((service, i) => {
                        const IconComponent = iconMap[service.icon] || Palette;
                        return (
                            <div
                                key={service.slug}
                                className="group relative bg-white rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 hover:-translate-y-4 transition-all duration-700 border border-dark/5 hover:border-primary/20 hover:shadow-[0_30px_70px_-20px_rgba(21,128,61,0.15)]"
                            >
                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[24px] bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center mb-6 sm:mb-10 border border-primary/10 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-2xl group-hover:shadow-primary/40 transition-all duration-700">
                                    <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="font-black text-xl sm:text-2xl text-dark mb-3 sm:mb-5 leading-tight">{service.title}</h3>
                                <p className="text-muted text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 font-medium opacity-80 hidden sm:block">{service.description}</p>
                                <Link
                                    href={`/services#${service.slug}`}
                                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-primary group-hover:text-dark transition-all"
                                >
                                    Explore Service
                                    <ArrowRight className="w-4 h-4 translate-y-[1px] group-hover:translate-x-2 transition-transform" />
                                </Link>

                                {/* Decorative background element on hover */}
                                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none">
                                    <IconComponent className="w-16 h-16 sm:w-24 sm:h-24 text-primary rotate-12" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
