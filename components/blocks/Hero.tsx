import Link from 'next/link';
import { ArrowRight, Award, FlaskConical, Factory, ShieldCheck, Zap, LucideIcon } from 'lucide-react';
import { Typography } from '../ui/Typography';
import Image from 'next/image';

export interface HeroProps {
    id?: string;
    badgeText?: string;
    title?: string;
    titleGradient?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    secondaryButtonHref?: string;
    stats?: Array<{ value: string; label: string }>;
    cards?: Array<{ icon: string; title: string; desc: string }>;
    alignment?: 'left' | 'center' | 'right';
    useDesignSystem?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
    Factory,
    FlaskConical,
    ShieldCheck,
    Award,
    Zap
};

export default function Hero({
    id,
    badgeText = "15+ Years of Manufacturing Excellence",
    title = "Your Global Partner",
    titleGradient = "in Personal Care Excellence",
    description = "From formulation to finished product — we manufacture premium personal care products for world-class brands. OEM, Private Label & Contract Manufacturing.",
    primaryButtonText = "Inquire Now",
    primaryButtonHref = "/contact",
    secondaryButtonText = "View Products Range",
    secondaryButtonHref = "/products",
    stats = [
        { value: '750+', label: 'Tons Capacity' },
        { value: '200+', label: 'SKUs' },
        { value: '20+', label: 'Global Clients' },
    ],
    cards = [
        { icon: 'Factory', title: 'OEM Manufacturing', desc: 'Precision production' },
        { icon: 'FlaskConical', title: 'Private Label', desc: 'Tailored for your brand' },
        { icon: 'ShieldCheck', title: 'Quality Assurance', desc: 'ISO global standards' },
        { icon: 'Award', title: 'R&D Innovation', desc: 'Herbal formulations' },
    ],
    alignment = 'center',
    useDesignSystem = true,
    ...pProps
}: HeroProps & Record<string, any>) {
    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    const containerAlignmentClasses = {
        left: 'mr-auto',
        center: 'mx-auto',
        right: 'ml-auto'
    };

    const sectionId = id || (pProps as any).id;
    const dataBlock = (pProps as any)["data-block"];

    return (
        <section id={sectionId} data-block={dataBlock} className="relative min-h-0 lg:min-h-[60vh] flex items-center pt-10 sm:pt-12 md:pt-14 pb-0 overflow-hidden bg-transparent">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-nb-green/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 animate-float opacity-60" />
                <div
                    className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-nb-green-light/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 opacity-40 [--anim-delay:3s]"
                />
                <div className="absolute inset-0 opacity-[0.05] bg-grid-dots" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-center text-center lg:text-left">
                    {/* Left content */}
                    <div className="animate-fade-in-up">
                        {useDesignSystem ? (
                            <Typography variant="detail" color="nb-green" uppercase className="inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-nb-green/5 border border-nb-green/10 mb-4 sm:mb-6 mx-auto lg:mx-0">
                                <Zap className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-nb-green" />
                                {badgeText}
                            </Typography>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 sm:gap-3 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-nb-green/5 border border-nb-green/10 text-nb-green text-[8.5px] md:text-xs font-black mb-4 sm:mb-6 uppercase tracking-wider md:tracking-[0.2em] leading-none mx-auto lg:mx-0">
                                <Zap className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-nb-green" />
                                {badgeText}
                            </div>
                        )}

                        {useDesignSystem ? (
                            <Typography variant="h1" color="slate-900" className="mb-4 sm:mb-6 text-balance">
                                {title}{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-nb-green to-nb-green-deep pb-2 block sm:inline">
                                    {titleGradient}
                                </span>
                            </Typography>
                        ) : (
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.1] sm:leading-[0.95] tracking-tight mb-4 sm:mb-6 text-balance">
                                {title}{" "}
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-nb-green to-nb-green-deep pb-2 block sm:inline">
                                    {titleGradient}
                                </span>
                            </h1>
                        )}

                        {useDesignSystem ? (
                            <Typography variant="body" color="slate-600" weight="medium" className="mb-6 sm:mb-8 opacity-90 mx-auto lg:mx-0 max-w-xl">
                                {description}
                            </Typography>
                        ) : (
                            <p className="text-sm sm:text-lg md:text-xl text-slate-500 max-w-xl mb-6 sm:mb-8 leading-relaxed font-medium opacity-90 mx-auto lg:mx-0">
                                {description}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center lg:justify-start">
                            <Link
                                href={primaryButtonHref}
                                className="group inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-3 sm:py-4.5 text-sm sm:text-base font-black text-white bg-slate-900 rounded-[20px] sm:rounded-[24px] hover:bg-nb-green transition-all hover:scale-105 shadow-2xl shadow-slate-900/20"
                            >
                                {primaryButtonText}
                                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href={secondaryButtonHref}
                                className="inline-flex items-center justify-center gap-3 px-6 sm:px-10 py-3.5 sm:py-4.5 text-sm sm:text-base font-black text-nb-green bg-nb-green/5 border-2 border-nb-green/10 rounded-[20px] sm:rounded-[24px] hover:bg-white hover:border-nb-green transition-all hover:scale-105"
                            >
                                {secondaryButtonText}
                            </Link>
                        </div>

                        {/* Quick stats with glass background - Hidden on mobile */}
                        <div className="hidden lg:flex gap-4 sm:gap-12 mt-6 sm:mt-12 p-3.5 sm:p-6 rounded-[32px] sm:rounded-[40px] bg-white/40 backdrop-blur-md max-w-fit border border-white/60 mx-auto lg:mx-0">
                            {(stats || []).map((stat, i) => (
                                <div key={i}>
                                    <div className="text-xl sm:text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                                    <div className="text-[8.5px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.1em] mt-0.5 sm:mt-2 opacity-70 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Refined Glassmorphism cards - Hidden on mobile */}
                    <div className="hidden lg:block relative group lg:mt-0">
                        <div className={`grid grid-cols-2 gap-3 sm:gap-4 max-w-lg ${containerAlignmentClasses[alignment]}`}>
                            {(cards || []).map((card, i) => {
                                const IconComp = iconMap[card.icon] || Factory;
                                return (
                                    <div
                                        key={i}
                                        className={`bg-white/40 backdrop-blur-md rounded-[24px] sm:rounded-[32px] p-3.5 sm:p-8 hover:-translate-y-4 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(21,128,61,0.2)] border border-white/60 flex flex-col ${alignmentClasses[alignment]} ${i === 0 ? "delay-0" : i === 1 ? "delay-75" : i === 2 ? "delay-150" : "delay-200"
                                            }`}
                                    >
                                        <div className="w-9 h-9 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-nb-green-soft to-nb-green-deep flex items-center justify-center mb-3 sm:mb-6 shadow-xl shadow-nb-green/20 overflow-hidden">
                                            {iconMap[card.icon] ? (
                                                <IconComp className="w-5 sm:w-10 h-5 sm:h-10 text-white" />
                                            ) : card.icon ? (
                                                <div className="relative w-full h-full">
                                                    <Image
                                                        src={card.icon?.startsWith('http') || card.icon?.startsWith('/') ? card.icon : `/api/storage/${card.icon}`}
                                                        fill
                                                        className="object-cover"
                                                        alt={card.title}
                                                        sizes="(max-width: 640px) 40px, (max-width: 1024px) 64px, 64px"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-full bg-nb-green/20" />
                                            )}
                                        </div>
                                        <h3 className="font-black text-slate-900 text-[12px] sm:text-xl mb-1 sm:mb-3 leading-tight break-words">{card.title}</h3>
                                        <p className="text-[9px] sm:text-sm text-slate-500 leading-relaxed font-semibold opacity-80">{card.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Curve */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block w-full h-[20px] sm:h-[40px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c126.31-41.28,247.92,11.39,372,21.9,132.06,11.17,252,5.28,375-10.37V120H0V0C0,0,147.22,97.72,321.39,56.44Z" className="fill-slate-50"></path>
                </svg>
            </div>
        </section>
    );
}

