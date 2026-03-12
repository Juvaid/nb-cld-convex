import Link from 'next/link';
import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight, LucideIcon } from 'lucide-react';
import { motion } from "framer-motion";
import { Typography } from '../ui/Typography';

export interface ServiceDetailItem {
    title: string;
    description: string;
    icon: string;
    image?: string;
    slug: string;
}

export interface ServiceDetailListProps {
    services?: ServiceDetailItem[];
    useDesignSystem?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
    Palette: Palette,
    FlaskConical: FlaskConical,
    BadgeCheck: BadgeCheck,
    Megaphone: Megaphone,
};

export default function ServiceDetailList({ services = [], useDesignSystem = true }: ServiceDetailListProps) {
    if (!services || services.length === 0) {
        return <div className="py-20 text-center text-slate-500">No services configured.</div>;
    }

    return (
        <section className={`py-20 sm:py-32 ${useDesignSystem ? 'bg-white' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-24">
                {services.map((service, i) => {
                    const IconComponent = iconMap[service.icon] || Palette;
                    const isReversed = i % 2 !== 0;

                    return (
                        <motion.div
                            key={service.slug || i}
                            id={service.slug}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                            className={`grid lg:grid-cols-2 gap-16 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
                        >
                            <div className={`${isReversed ? 'lg:order-2' : ''} space-y-8`}>
                                <div className="inline-flex">
                                    <div className={`w-20 h-20 rounded-[24px] ${useDesignSystem ? 'bg-slate-50 border-slate-100 shadow-lg shadow-slate-100' : 'bg-white/40 backdrop-blur-xl border border-white/40 shadow-2xl shadow-nb-green/10'} flex items-center justify-center relative group overflow-hidden transition-all duration-500`}>
                                        <div className="absolute inset-0 bg-gradient-to-br from-nb-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        {iconMap[service.icon] ? (
                                            <IconComponent className={`w-10 h-10 ${useDesignSystem ? 'text-slate-400 group-hover:text-nb-green' : 'text-nb-green'} relative z-10 transition-colors`} />
                                        ) : (
                                            <img
                                                src={service.icon?.startsWith('http') || service.icon?.startsWith('/') ? service.icon : `/api/storage/${service.icon}`}
                                                className="w-full h-full object-cover relative z-10"
                                                alt={service.title}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {useDesignSystem ? (
                                        <>
                                            <Typography variant="h2" weight="black" className="text-slate-900 leading-tight">
                                                {service.title}
                                            </Typography>
                                            <Typography variant="body" weight="medium" className="text-slate-500 leading-relaxed">
                                                {service.description}
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                                                {service.title}
                                            </h2>
                                            <div className="text-lg text-slate-500 leading-relaxed font-medium">
                                                {service.description}
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Link
                                    href="/contact"
                                    className={`inline-flex items-center gap-3 px-8 py-4 text-sm font-black transition-all group ${
                                        useDesignSystem 
                                        ? 'text-slate-900 bg-white border border-slate-200 rounded-full hover:bg-slate-900 hover:text-white' 
                                        : 'text-white bg-slate-900 rounded-2xl hover:bg-nb-green hover:text-slate-900'
                                    }`}
                                >
                                    Get Started
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>

                            <div className={`${isReversed ? 'lg:order-1' : ''} relative overflow-hidden ${useDesignSystem ? 'rounded-[48px] shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)]' : 'rounded-[40px] shadow-2xl shadow-slate-200/50'} group`}>
                                <div className={`aspect-[4/3] ${useDesignSystem ? 'bg-slate-50' : 'bg-gradient-to-br from-slate-50 to-nb-green-light/20'} flex items-center justify-center p-12 relative overflow-hidden`}>
                                    {/* Animated Background Elements */}
                                    {!useDesignSystem && (
                                        <motion.div
                                            animate={{
                                                scale: [1, 1.2, 1],
                                                opacity: [0.1, 0.2, 0.1],
                                            }}
                                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                            className="absolute top-0 right-0 w-64 h-64 bg-nb-green rounded-full blur-[100px]"
                                        />
                                    )}

                                    {service.image ? (
                                        <img
                                            src={service.image.startsWith('http') || service.image.startsWith('/') ? service.image : `/api/storage/${service.image}`}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            alt={service.title}
                                        />
                                    ) : (
                                        <div className="relative z-10 flex flex-col items-center">
                                            <div className={`w-32 h-32 rounded-3xl bg-white shadow-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-500 ${useDesignSystem ? 'border border-slate-100' : ''}`}>
                                                {iconMap[service.icon] ? (
                                                    <IconComponent className={`w-16 h-16 ${useDesignSystem ? 'text-slate-200 group-hover:text-nb-green' : 'text-nb-green'} transition-colors duration-500`} />
                                                ) : (
                                                    <img
                                                        src={service.icon?.startsWith('http') || service.icon?.startsWith('/') ? service.icon : `/api/storage/${service.icon}`}
                                                        className="w-20 h-20 object-contain"
                                                        alt={service.title}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}
