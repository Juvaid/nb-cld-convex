import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';

export interface ServiceItem {
    showMedia?: boolean;
    mediaType?: "icon" | "image";
    mediaIcon?: string;
    mediaImage?: string;
    title: string;
    description: string;
    showButton?: boolean;
    buttonText?: string;
    buttonLink?: string;
    slug?: string;
}

export interface ServicesGridProps {
    id?: string;
    badgeText?: string;
    heading?: string;
    subheading?: string;
    services?: ServiceItem[];
}

const iconMap: Record<string, LucideIcon> = {
    Palette: Palette,
    FlaskConical: FlaskConical,
    BadgeCheck: BadgeCheck,
    Megaphone: Megaphone,
};

export default function ServicesGrid({
    id,
    badgeText = "Our Capability",
    heading = "Expert Solutions for Your Brand",
    subheading = "We provide comprehensive, end-to-end manufacturing services to help you build a world-class personal care brand.",
    services = [
        {
            title: 'Label & Packaging Designing',
            description: 'Label and packaging designing is an essential aspect of branding and marketing strategy.',
            showMedia: true,
            mediaType: "icon",
            mediaIcon: 'Palette',
            slug: 'label-packaging-designing',
        },
        {
            title: 'Customised Finished Product',
            description: 'A personal care product design must account for market demand.',
            showMedia: true,
            mediaType: "icon",
            mediaIcon: 'FlaskConical',
            slug: 'customised-finished-product',
        },
        {
            title: 'Trademark & Logo',
            description: 'We create trademarks and logos that effectively represent your brand.',
            showMedia: true,
            mediaType: "icon",
            mediaIcon: 'BadgeCheck',
            slug: 'trademark-logo',
        },
        {
            title: 'Digital Marketing',
            description: 'We help brands promote their products and services to their target audience.',
            showMedia: true,
            mediaType: "icon",
            mediaIcon: 'Megaphone',
            slug: 'digital-marketing',
        },
    ]
}: ServicesGridProps) {
    return (
        <section id={id} className="py-12 sm:py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                <div className="text-center mb-16 sm:mb-24">
                    <div className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-nb-green/5 text-nb-green text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] leading-none mb-4 sm:mb-6">
                        {badgeText}
                    </div>
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">{heading}</h2>
                    <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto mt-4 sm:mt-6 font-medium opacity-80">
                        {subheading}
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                    {(services || []).map((service, i) => {
                        const IconComponent = service.mediaIcon ? (iconMap[service.mediaIcon] || null) : null;
                        return (
                            <div
                                key={service.slug || i}
                                className="group relative bg-white rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 hover:-translate-y-4 transition-all duration-700 border border-slate-900/5 hover:border-nb-green/20 hover:shadow-2xl hover:shadow-nb-green/15 flex flex-col h-full"
                            >
                                {service.showMedia !== false && (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[24px] bg-gradient-to-br from-nb-green/10 to-nb-green-light/5 flex items-center justify-center mb-6 sm:mb-10 border border-nb-green/10 group-hover:scale-110 group-hover:bg-nb-green group-hover:shadow-2xl group-hover:shadow-nb-green/40 transition-all duration-700 overflow-hidden flex-shrink-0">
                                        {service.mediaType === "image" && service.mediaImage ? (
                                            <img
                                                src={service.mediaImage.startsWith('http') ? service.mediaImage : `/api/storage/${service.mediaImage}`}
                                                className="w-full h-full object-cover"
                                                alt={service.title}
                                            />
                                        ) : IconComponent ? (
                                            <IconComponent className="w-8 h-8 sm:w-10 sm:h-10 text-nb-green group-hover:text-white transition-colors" />
                                        ) : (
                                            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                                                {service.mediaIcon || "✨"}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <h3 className="font-black text-xl sm:text-2xl text-slate-900 mb-3 sm:mb-5 leading-tight">{service.title}</h3>
                                <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 font-medium opacity-80 hidden sm:block flex-grow">{service.description}</p>

                                {service.showButton !== false && (
                                    <Link
                                        href={service.buttonLink || `/services#${service.slug || ''}`}
                                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-nb-green group-hover:text-slate-900 transition-all mt-auto"
                                    >
                                        {service.buttonText || "Explore Service"}
                                        <ArrowRight className="w-4 h-4 translate-y-[1px] group-hover:translate-x-2 transition-transform" />
                                    </Link>
                                )}

                                {/* Decorative background element on hover */}
                                {IconComponent && (
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-5 transition-opacity duration-700 pointer-events-none">
                                        <IconComponent className="w-16 h-16 sm:w-24 sm:h-24 text-nb-green rotate-12" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

