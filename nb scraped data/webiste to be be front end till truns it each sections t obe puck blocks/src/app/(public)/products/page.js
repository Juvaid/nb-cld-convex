import Link from 'next/link';
import { defaultProductCategories } from '@/lib/theme';
import { ArrowRight, Search } from 'lucide-react';

export const metadata = {
    title: "Our Products — Nature's Boon",
    description: "Explore our premium personal care product range: Hair Care, Skin Care, Body Care, and Men's Grooming. OEM and Private Label available.",
};

// Detailed products per category
const productsByCategory = {
    'skin-care': [
        { name: 'Face Wash', usp: 'Sulphate Free' },
        { name: 'Facial Kit', usp: 'Premium Ingredients' },
        { name: 'Face Serum', usp: 'Vitamin C Enriched' },
        { name: 'Face Cream', usp: 'Deep Moisturizing' },
        { name: 'D-Tan', usp: 'Natural Extracts' },
        { name: 'Face Scrub', usp: 'Gentle Exfoliation' },
        { name: 'Face Mist / Skin Toner', usp: 'pH Balanced' },
        { name: 'Cleansing Milk', usp: 'Hydrating Formula' },
        { name: 'Moisturizer', usp: 'All Skin Types' },
        { name: 'SPF Sunscreen', usp: 'Broad Spectrum' },
        { name: 'Face Pack & Mask', usp: 'Herbal Blend' },
        { name: 'Massage Cream', usp: 'Professional Grade' },
    ],
    'hair-care': [
        { name: 'Hair Shampoo', usp: 'Paraben Free' },
        { name: 'Hair Oil', usp: 'Ayurvedic Blend' },
        { name: 'Hair Serum', usp: 'Frizz Control' },
    ],
    'body-personal-care': [
        { name: 'Body Lotion', usp: 'Deep Nourishing' },
        { name: 'Hand & Foot Care', usp: 'Intensive Repair' },
        { name: 'Lip Care', usp: 'Natural SPF' },
        { name: 'Body Wash', usp: 'Gentle Cleansing' },
        { name: 'Roll-on Deodorant', usp: '48hr Protection' },
        { name: 'Hair Removal Wax', usp: 'Skin Friendly' },
        { name: 'Body Scrub', usp: 'Exfoliating' },
        { name: 'Body Cream', usp: 'Moisturizing' },
    ],
    'mens-grooming': [
        { name: 'Beard Oil', usp: 'Natural Growth' },
        { name: 'Hair Wax', usp: 'Strong Hold' },
    ],
};

export default function ProductsPage() {
    return (
        <>
            {/* Hero */}
            <section className="relative pt-40 pb-20 bg-gradient-to-br from-primary-dark to-primary overflow-hidden">
                <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
                <div className="max-w-7xl mx-auto px-4 relative">
                    <span className="text-accent font-semibold text-sm tracking-widest uppercase">Our Range</span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2 mb-4">Product Catalog</h1>
                    <p className="text-white/70 max-w-2xl text-lg">
                        Premium personal care products manufactured with the finest ingredients and cutting-edge technology.
                    </p>
                </div>
            </section>

            {/* Category filters */}
            <section className="sticky top-[88px] z-40 bg-white/80 backdrop-blur-lg border-b border-primary/10 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-3">
                    {defaultProductCategories.map((cat) => (
                        <a
                            key={cat.slug}
                            href={`#${cat.slug}`}
                            className="px-4 py-2 text-sm font-medium rounded-full border border-primary/10 hover:bg-primary hover:text-white transition-all"
                        >
                            {cat.name}
                        </a>
                    ))}
                    <div className="ml-auto relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                        <input
                            type="text"
                            placeholder="Search formulations..."
                            className="pl-9 pr-4 py-2 text-sm border border-primary/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
                        />
                    </div>
                </div>
            </section>

            {/* Product categories */}
            <section className="section-padding bg-white">
                <div className="max-w-7xl mx-auto space-y-20">
                    {defaultProductCategories.map((cat) => (
                        <div key={cat.slug} id={cat.slug}>
                            <div className="mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{cat.name}</h2>
                                <p className="text-muted mt-1">{cat.description}</p>
                            </div>

                            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                {(productsByCategory[cat.slug] || []).map((product) => (
                                    <div
                                        key={product.name}
                                        className="group rounded-2xl border border-primary/5 bg-white hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                                    >
                                        <div className="h-40 bg-gradient-to-br from-surface to-accent-light flex items-center justify-center">
                                            <span className="text-4xl opacity-30 group-hover:scale-110 transition-transform">🌿</span>
                                        </div>
                                        <div className="p-5">
                                            <span className="inline-block px-2 py-0.5 text-xs font-medium text-primary bg-primary/5 rounded-full mb-2">
                                                {product.usp}
                                            </span>
                                            <h3 className="font-semibold text-foreground">{product.name}</h3>
                                            <Link
                                                href="/contact"
                                                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white bg-gradient-to-r from-primary to-accent px-4 py-2 rounded-full hover:shadow-md transition-all"
                                            >
                                                Inquire for Bulk
                                                <ArrowRight className="w-3 h-3" />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Custom formulation CTA */}
            <section className="section-padding bg-gradient-to-br from-primary-dark to-primary">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Formulation?</h2>
                    <p className="text-white/70 mb-8">
                        Our in-house R&amp;D team can develop unique formulations tailored to your brand&apos;s requirements.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold text-primary-dark bg-gradient-to-r from-accent to-green-300 rounded-full hover:shadow-2xl hover:shadow-accent/30 transition-all hover:-translate-y-1"
                    >
                        Request Custom Formula
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </>
    );
}
