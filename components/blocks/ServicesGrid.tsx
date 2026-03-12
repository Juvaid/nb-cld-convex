import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Typography } from '@/components/ui/Typography';
import { Section } from '@/components/ui/Section';
import { motion } from 'framer-motion';

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
    useDesignSystem?: boolean;
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
    useDesignSystem = true,
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
        <section id={id} className={`py-12 sm:py-24 relative overflow-hidden ${useDesignSystem ? 'bg-white' : 'bg-slate-50'}`}>
            {useDesignSystem && (
                <>
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-nb-green/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-nb-green-light/5 rounded-full blur-[120px] translate-y-1/2 pointer-events-none" />
                </>
            )}
            
            <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
                {(badgeText || heading || subheading) && (
                    <div className="text-center mb-16 sm:mb-24">
                        {badgeText && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`inline-block px-5 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] leading-none mb-6 sm:mb-8 ${
                                    useDesignSystem ? 'bg-nb-green/10 text-nb-green border border-nb-green/20' : 'bg-nb-green/5 text-nb-green'
                                }`}
                            >
                                {badgeText}
                            </motion.div>
                        )}
                        
                        {useDesignSystem ? (
                            <div className="space-y-6">
                                {heading && (
                                    <div className="text-center mb-16 max-w-2xl mx-auto">
                                        <Typography variant="section-title" align="center" color="slate-900">
                                            {heading}
                                        </Typography>
                                        <div className="w-20 h-1.5 bg-nb-green mx-auto mt-6 rounded-full opacity-20" />
                                    </div>
                                )}
                                {subheading && (
                                    <Typography variant="body" className="text-slate-500 max-w-2xl mx-auto font-medium opacity-80">
                                        {subheading}
                                    </Typography>
                                )}
                            </div>
                        ) : (
                            <>
                                {heading && <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">{heading}</h2>}
                                {subheading && (
                                    <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto mt-4 sm:mt-6 font-medium opacity-80">
                                        {subheading}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {(services || []).map((service, i) => {
                        const IconComponent = service.mediaIcon ? (iconMap[service.mediaIcon] || null) : null;
                        return (
                            <motion.div
                                key={service.slug || i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className={`group relative rounded-[32px] sm:rounded-[40px] p-8 sm:p-10 transition-all duration-500 flex flex-col h-full ${
                                    useDesignSystem 
                                    ? 'bg-white border border-slate-100 hover:border-nb-green/30 hover:shadow-[0_20px_50px_rgba(43,238,108,0.15)]' 
                                    : 'bg-white border border-slate-900/5 hover:-translate-y-4 hover:shadow-2xl hover:shadow-nb-green/15'
                                }`}
                            >
                                {service.showMedia !== false && (
                                    <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[24px] flex items-center justify-center mb-8 border transition-all duration-500 overflow-hidden flex-shrink-0 ${
                                        useDesignSystem
                                        ? 'bg-slate-50 border-slate-100 group-hover:bg-nb-green group-hover:border-nb-green group-hover:shadow-lg group-hover:shadow-nb-green/30'
                                        : 'bg-gradient-to-br from-nb-green/10 to-nb-green-light/5 border-nb-green/10 group-hover:bg-nb-green'
                                    }`}>
                                        {service.mediaType === "image" && service.mediaImage ? (
                                            <img
                                                src={service.mediaImage.startsWith('http') ? service.mediaImage : `/api/storage/${service.mediaImage}`}
                                                className="w-full h-full object-cover"
                                                alt={service.title}
                                            />
                                        ) : IconComponent ? (
                                            <IconComponent className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors duration-500 ${
                                                useDesignSystem ? 'text-slate-400 group-hover:text-white' : 'text-nb-green group-hover:text-white'
                                            }`} />
                                        ) : (
                                            <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                                                {service.mediaIcon || "✨"}
                                            </span>
                                        )}
                                    </div>
                                )}

                                {useDesignSystem ? (
                                    <div className="space-y-4 flex-grow">
                                        {service.title && (
                                            <Typography variant="section-title" color="slate-900">
                                                {service.title}
                                            </Typography>
                                        )}
                                        {service.description && (
                                            <Typography variant="small" className="text-slate-500 leading-relaxed font-medium">
                                                {service.description}
                                            </Typography>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {service.title && <h3 className="font-black text-xl sm:text-2xl text-slate-900 mb-3 sm:mb-5 leading-tight">{service.title}</h3>}
                                        {service.description && <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6 sm:mb-10 font-medium opacity-80 flex-grow">{service.description}</p>}
                                    </>
                                )}

                                {service.showButton !== false && (
                                    <Link
                                        href={service.buttonLink || `/services#${service.slug || ''}`}
                                        className={`inline-flex items-center gap-2 text-xs sm:text-sm font-black transition-all mt-8 ${
                                            useDesignSystem 
                                            ? 'text-slate-400 hover:text-nb-green uppercase tracking-widest' 
                                            : 'text-nb-green group-hover:text-slate-900'
                                        }`}
                                    >
                                        {service.buttonText || "Explore Service"}
                                        <ArrowRight className={`w-4 h-4 transition-transform ${useDesignSystem ? 'group-hover:translate-x-1' : 'group-hover:translate-x-2'}`} />
                                    </Link>
                                )}

                                {useDesignSystem && IconComponent && (
                                    <div className="absolute bottom-10 right-10 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 pointer-events-none">
                                        <IconComponent className="w-32 h-32 text-slate-900 -rotate-12" />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

