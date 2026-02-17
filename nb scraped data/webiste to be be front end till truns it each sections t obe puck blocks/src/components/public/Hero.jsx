import Link from 'next/link';
import { ArrowRight, Award, FlaskConical, Factory, ShieldCheck, Zap } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden bg-white">
            {/* Background Gradient & Pattern */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px] -translate-y-1/3 translate-x-1/4 animate-float opacity-60" />
                <div className="absolute bottom-0 left-0 w-[60%] h-[60%] bg-accent/10 rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4 opacity-40" style={{ animationDelay: '3s' }} />
                <div className="absolute inset-0 opacity-[0.05]" style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, #15803d 1px, transparent 0)',
                    backgroundSize: '32px 32px'
                }} />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 w-full">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center text-center lg:text-left">
                    {/* Left content */}
                    <div className="animate-fade-in-up">
                        <div className="inline-flex items-center gap-1.5 sm:gap-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[8px] sm:text-xs font-black mb-6 sm:mb-10 uppercase tracking-[0.1em] sm:tracking-[0.2em] leading-none mx-auto lg:mx-0">
                            <Zap className="w-2.5 sm:w-3.5 h-2.5 sm:h-3.5 fill-primary" />
                            15+ Years of Manufacturing Excellence
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-dark leading-[1.1] sm:leading-[0.95] tracking-tight mb-6 sm:mb-10">
                            Your Global Partner in <br />
                            <span className="gradient-text pb-2 block">
                                Personal Care Excellence
                            </span>
                        </h1>

                        <p className="text-base sm:text-xl md:text-2xl text-muted max-w-xl mb-8 sm:mb-12 leading-relaxed font-medium opacity-90 mx-auto lg:mx-0">
                            From formulation to finished product — we manufacture premium personal care products
                            for world-class brands. <span className="text-primary font-black">OEM, Private Label &amp; Contract Manufacturing.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                            <Link
                                href="/contact"
                                className="group inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-black text-white bg-dark rounded-[20px] sm:rounded-[24px] hover:bg-primary transition-all hover:scale-105 shadow-2xl shadow-dark/20"
                            >
                                Inquire Now
                                <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-2 transition-transform" />
                            </Link>
                            <Link
                                href="/products"
                                className="inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-5 sm:py-6 text-base sm:text-lg font-black text-primary bg-primary/5 border-2 border-primary/10 rounded-[20px] sm:rounded-[24px] hover:bg-white hover:border-primary transition-all hover:scale-105"
                            >
                                View Products Range
                            </Link>
                        </div>

                        {/* Quick stats with glass background */}
                        <div className="flex gap-6 sm:gap-12 mt-12 sm:mt-20 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] glass max-w-fit border-white/60 mx-auto lg:mx-0">
                            {[
                                { value: '750+', label: 'Tons Capacity' },
                                { value: '200+', label: 'SKUs' },
                                { value: '20+', label: 'Global Clients' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-xl sm:text-4xl font-black text-dark tracking-tighter">{stat.value}</div>
                                    <div className="text-[8px] sm:text-[10px] font-black text-muted uppercase tracking-[0.1em] mt-1 sm:mt-2 opacity-70 leading-tight">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Refined Glassmorphism cards */}
                    <div className="relative group lg:block mt-12 lg:mt-0">
                        <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-lg mx-auto">
                            {[
                                { icon: Factory, title: 'OEM Manufacturing', desc: 'Precision production' },
                                { icon: FlaskConical, title: 'Private Label', desc: 'Tailored for your brand' },
                                { icon: ShieldCheck, title: 'Quality Assurance', desc: 'ISO global standards' },
                                { icon: Award, title: 'R&D Innovation', desc: 'Herbal formulations' },
                            ].map((card, i) => (
                                <div
                                    key={card.title}
                                    className="glass rounded-[24px] sm:rounded-[40px] p-4 sm:p-10 hover:-translate-y-4 transition-all duration-700 hover:shadow-[0_20px_60px_-15px_rgba(21,128,61,0.2)] border-white/60"
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-lg sm:rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 sm:mb-8 shadow-xl shadow-primary/20">
                                        <card.icon className="w-5 sm:w-8 h-5 sm:h-8 text-white" />
                                    </div>
                                    <h3 className="font-black text-dark text-sm sm:text-xl mb-1 sm:mb-3 leading-tight break-words">{card.title}</h3>
                                    <p className="text-[9px] sm:text-sm text-muted leading-relaxed font-semibold opacity-80">{card.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hero Curve */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                <svg className="relative block w-full h-[40px] sm:h-[80px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c126.31-41.28,247.92,11.39,372,21.9,132.06,11.17,252,5.28,375-10.37V120H0V0C0,0,147.22,97.72,321.39,56.44Z" className="fill-surface-muted"></path>
                </svg>
            </div>
        </section>
    );
}
