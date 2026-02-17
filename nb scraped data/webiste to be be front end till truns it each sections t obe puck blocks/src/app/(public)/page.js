import Hero from '@/components/public/Hero';
import ServicesGrid from '@/components/public/ServicesGrid';
import StatsCounter from '@/components/public/StatsCounter';
import TestimonialSlider from '@/components/public/TestimonialSlider';
import ProductCard from '@/components/public/ProductCard';
import Link from 'next/link';
import { defaultProductCategories } from '@/lib/theme';
import { ArrowRight } from 'lucide-react';

export const metadata = {
    title: "Nature's Boon — Your Global Partner in Personal Care Excellence",
    description: "Trusted manufacturer and supplier of premium personal care products since 2006. OEM, Private Label & Contract Manufacturing in Ludhiana, India.",
};

export default function HomePage() {
    return (
        <>
            <Hero />

            {/* About preview */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-semibold text-sm tracking-widest uppercase">Who We Are</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground mb-6">About Us</h2>
                            <p className="text-muted leading-relaxed mb-4">
                                Established in 2006 at Ludhiana (Punjab, India), Nature&apos;s Boon is recognized as one of the most trusted
                                Manufacturers and Suppliers of high quality personal care products including Face Wash, Hair Oil,
                                Facial Kit, Shampoo, Body Massage Oil, Hair Protein Cream, Face Scrub, Face Mask, and more.
                            </p>
                            <p className="text-muted leading-relaxed mb-6">
                                We have formulated &amp; packaged for quality brands such as Luster Cosmetics, True Derma Essentials,
                                Man Pride, The Man Company, Glamveda, Skinnatura, and many more.
                            </p>
                            <Link
                                href="/about"
                                className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-dark transition-colors"
                            >
                                Learn More About Us
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="relative">
                            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-surface to-accent-light p-12 flex items-center justify-center min-h-[400px]">
                                <div className="text-center">
                                    <div className="text-8xl mb-4">🏭</div>
                                    <p className="text-primary-dark font-semibold">State-of-the-Art Manufacturing</p>
                                    <p className="text-muted text-sm mt-1">ISO Certified Facility, Ludhiana</p>
                                </div>
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 -right-4 glass rounded-2xl p-4 shadow-xl">
                                <div className="text-2xl font-bold gradient-text">15+</div>
                                <div className="text-xs text-muted">Years of Excellence</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <ServicesGrid />
            <StatsCounter />

            {/* Products preview */}
            <section className="section-padding bg-surface">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-primary font-semibold text-sm tracking-widest uppercase">Our Range</span>
                        <h2 className="text-3xl md:text-4xl font-bold mt-2 text-foreground">Our Products</h2>
                        <p className="text-muted max-w-2xl mx-auto mt-4">
                            Premium personal care products manufactured with the finest ingredients and cutting-edge technology.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {defaultProductCategories.map((cat) => (
                            <ProductCard key={cat.slug} category={cat} />
                        ))}
                    </div>
                </div>
            </section>

            <TestimonialSlider />

            {/* CTA section */}
            <section className="section-padding bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Ready to Launch Your Brand?
                    </h2>
                    <p className="text-muted max-w-xl mx-auto mb-8">
                        Partner with Nature&apos;s Boon for world-class OEM and Private Label manufacturing.
                        From formulation to finished product — we&apos;ve got you covered.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-white bg-gradient-to-r from-primary to-accent rounded-full hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-1"
                    >
                        Get Your Free Quote
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
