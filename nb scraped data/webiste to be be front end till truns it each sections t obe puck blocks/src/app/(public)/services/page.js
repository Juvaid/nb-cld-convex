import { Palette, FlaskConical, BadgeCheck, Megaphone, ArrowRight, ClipboardList, Beaker, Factory, Rocket } from 'lucide-react';
import Link from 'next/link';
import { defaultServices } from '@/lib/theme';

export const metadata = {
    title: "Our Services — Nature's Boon",
    description: "End-to-end solutions for personal care brands: Label & Packaging Design, Custom Formulation, Trademark Support, and Digital Marketing.",
};

const iconMap = {
    Palette: Palette,
    FlaskConical: FlaskConical,
    BadgeCheck: BadgeCheck,
    Megaphone: Megaphone,
};

const processSteps = [
    { icon: ClipboardList, title: 'Consultation', desc: 'Discuss your brand vision, target market, and product requirements.' },
    { icon: Beaker, title: 'R&D / Formulation', desc: 'Our in-house R&D team develops custom formulas tailored to your brand.' },
    { icon: Factory, title: 'Production', desc: 'Scalable manufacturing with rigorous quality control at every stage.' },
    { icon: Rocket, title: 'Launch Support', desc: 'Packaging design, branding, and marketing support for a successful launch.' },
];

export default function ServicesPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-40 pb-20 bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 relative">
                    <span className="text-accent font-semibold text-sm tracking-widest uppercase">What We Offer</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">
                        End-to-End Solutions for Your Personal Care Brand
                    </h1>
                    <p className="text-white/70 max-w-2xl text-lg">
                        From concept to shelf — we provide comprehensive services to build, grow, and scale your brand.
                    </p>
                </div>
            </section>

            {/* Services detail — alternating layout */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto space-y-24">
                    {defaultServices.map((service, i) => {
                        const IconComponent = iconMap[service.icon] || Palette;
                        const isReversed = i % 2 !== 0;

                        return (
                            <div
                                key={service.slug}
                                id={service.slug}
                                className={`grid lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:direction-rtl' : ''}`}
                            >
                                <div className={isReversed ? 'lg:order-2' : ''}>
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">{service.title}</h2>
                                    <p className="text-muted leading-relaxed mb-6">{service.description}</p>
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-full hover:shadow-lg hover:shadow-accent/30 transition-all"
                                    >
                                        Get Started
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                <div className={`rounded-3xl bg-gradient-to-br from-surface to-accent-light p-12 flex items-center justify-center min-h-[300px] ${isReversed ? 'lg:order-1' : ''}`}>
                                    <IconComponent className="w-24 h-24 text-primary/20" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Process */}
            <section className="section-padding bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm tracking-widest uppercase">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">Our Process</h2>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {processSteps.map((step, i) => (
                            <div key={step.title} className="relative text-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                                    <step.icon className="w-8 h-8 text-white" />
                                </div>
                                <div className="text-xs font-bold text-primary mb-2">STEP {i + 1}</div>
                                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                                <p className="text-muted text-sm">{step.desc}</p>
                                {i < processSteps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-accent to-primary/20" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-gradient-to-br from-primary-dark to-primary">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Start Your Brand Journey With Us</h2>
                    <p className="text-white/70 mb-8">Let our team of experts help you create the perfect personal care product line.</p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-primary-dark bg-gradient-to-r from-accent to-green-300 rounded-full hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-1"
                    >
                        Request a Consultation
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
