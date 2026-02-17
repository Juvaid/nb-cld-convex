import { CheckCircle, Users, Factory, Award, Target, FlaskConical } from 'lucide-react';

export const metadata = {
    title: "About Us — Nature's Boon",
    description: "Learn about Nature's Boon — one of India's most trusted personal care manufacturers since 2006.",
};

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-40 pb-20 bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
                <div className="absolute top-20 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 relative">
                    <span className="text-accent font-semibold text-sm tracking-widest uppercase">Our Story</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">About Nature&apos;s Boon</h1>
                    <p className="text-white/70 max-w-2xl text-lg">
                        A legacy of excellence in personal care manufacturing since 2006.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-3xl font-bold text-foreground mb-6">Our Journey</h2>
                            <div className="space-y-4 text-muted leading-relaxed">
                                <p>
                                    Established in the year 2006 at Ludhiana (Punjab, India), Nature&apos;s Boon is recognized as one of the
                                    most trusted Manufacturers and Suppliers of high quality personal care products such as Face Wash,
                                    Hair Oil, Facial Kit, Shampoo, Facial Skin Toner, Body Massage Oil, Hair Protein Cream, Face Scrub,
                                    Face Mask, Bath Salt, Tan Removal Cleansers, and more.
                                </p>
                                <p>
                                    In our journey of manufacturing, we have formulated &amp; packaged for quality brands such as Luster Cosmetics,
                                    True Derma Essentials, Man Pride, Pukhraj Herbals, The Man Company, Glamveda, Skinnatura, Nuskhe By Paras,
                                    Studd Muffyn, Organic Essence, Taryansh Herbals, and many more.
                                </p>
                                <p>
                                    Our own products are marketed under the brand names &ldquo;Luster Cosmetics, True Derma Essentials, Man Pride&rdquo;.
                                    These products are processed using best quality ingredients and sophisticated processing technology,
                                    formulated as per set industry norms and in compliance with international standards.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { icon: Factory, title: 'Advanced Infrastructure', desc: 'State-of-the-art manufacturing, quality testing, warehousing, and packaging facilities.' },
                                { icon: Users, title: 'Experienced Team', desc: 'Skilled professionals ensuring smooth operations at every stage of production.' },
                                { icon: Award, title: 'Quality Commitment', desc: 'Experienced quality controllers monitor the complete process from procurement to dispatch.' },
                                { icon: Target, title: 'Visionary Leadership', desc: 'Under the leadership of Founder & Mentor, Ms. Archana Dhingra, we continue to reach new heights.' },
                            ].map((item) => (
                                <div key={item.title} className="flex gap-4 p-5 rounded-2xl glass border border-primary/5 hover:shadow-lg transition-shadow">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                                        <item.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-muted text-sm">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-surface">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-foreground mb-12">Why Choose Nature&apos;s Boon?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: CheckCircle, title: 'ISO Certified Quality', desc: 'All products meet international quality standards with rigorous testing at every stage.' },
                            { icon: FlaskConical, title: 'In-house R&D', desc: '75+ products developed by our dedicated research and development team.' },
                            { icon: Factory, title: 'Scalable Operations', desc: '750+ tons annual capacity with flexible production for brands of all sizes.' },
                        ].map((item) => (
                            <div key={item.title} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-5">
                                    <item.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-2">{item.title}</h3>
                                <p className="text-muted text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
