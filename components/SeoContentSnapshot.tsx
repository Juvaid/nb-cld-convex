/**
 * SeoContentSnapshot — Server Component
 * 
 * Renders a clean, semantic HTML snapshot of page content extracted from the
 * Puck JSON data. This is ALWAYS present in the initial HTML sent to the browser,
 * making the content fully crawlable and indexable by search engines.
 * 
 * The content is visually hidden (sr-only) but fully accessible to screen readers
 * and crawlers. The interactive Puck client renderer overlays it.
 */

interface SeoContentSnapshotProps {
    puckData: any;
    products?: any[] | null;
    categories?: any[] | null;
    globalStats?: any[] | null;
    path: string;
}

/** Extract text content from known Puck block types */
function extractBlockContent(block: any): { heading?: string; text?: string; items?: string[] } | null {
    if (!block?.type || !block?.props) return null;
    const p = block.props;

    switch (block.type) {
        case "HeroCarousel":
            const slide = p.slides?.[0];
            return slide ? { heading: slide.title || slide.heading, text: slide.subtitle || slide.description } : null;

        case "ModernHero":
        case "NatureBoonHero":
        case "Hero":
        case "OrbitalHero":
        case "ProductGridHero":
        case "BentoGridHero":
        case "LayeredDepthHero":
        case "KineticMarqueeHero":
        case "SwissStyleHero":
        case "StackedCardHero":
            return { heading: p.title || p.heading, text: p.subtitle || p.description };

        case "AboutHero":
            return { heading: p.title, text: p.description };

        case "AboutJourney":
            return {
                heading: p.heading,
                text: p.introduction,
                items: p.cards?.map((c: any) => `${c.title}: ${c.desc}`).filter(Boolean),
            };

        case "WhyChooseUs":
            return {
                heading: p.heading,
                items: p.items?.map((i: any) => `${i.title}: ${i.desc}`).filter(Boolean),
            };

        case "ModernStats":
        case "NatureBoonStats":
            return {
                heading: p.heading || "Key Statistics",
                items: p.stats?.map((s: any) => `${s.label}: ${s.value}`).filter(Boolean),
            };

        case "ServiceDetailList":
        case "ModernServices":
        case "BentoServices":
            return {
                heading: p.heading || "Our Services",
                items: p.services?.map((s: any) => `${s.title}: ${s.description}`).filter(Boolean),
            };

        case "CallToAction":
        case "CTA":
            return { heading: p.heading, text: p.description };

        case "ContactSection":
            return {
                heading: p.heading || "Contact Us",
                items: p.infoItems?.map((i: any) => `${i.label}: ${i.value}`).filter(Boolean),
            };

        case "FAQAccordion":
            return {
                heading: p.heading || "Frequently Asked Questions",
                items: p.items?.map((i: any) => `${i.question}: ${i.answer}`).filter(Boolean),
            };

        case "ProcessTimeline":
        case "ProcessSteps":
            return {
                heading: p.heading || "Our Process",
                items: p.steps?.map((s: any) => `${s.title}: ${s.description}`).filter(Boolean),
            };

        case "FeatureGrid":
        case "IconBenefits":
            return {
                heading: p.heading || p.title,
                items: p.features?.map((f: any) => `${f.title}: ${f.description}`).filter(Boolean)
                    || p.items?.map((f: any) => `${f.title}: ${f.description}`).filter(Boolean),
            };

        case "TextBlock":
            return { text: p.content || p.text };

        case "LogoMarquee":
            return {
                heading: p.title,
                items: p.logos?.map((l: any) => l.alt).filter(Boolean),
            };

        case "ModernTestimonials":
            return {
                heading: p.heading,
                items: p.testimonials?.map((t: any) => `"${t.content}" — ${t.author}, ${t.company}`).filter(Boolean),
            };

        case "GoogleReviews":
            return { heading: p.heading || "Customer Reviews" };

        default:
            // Try generic text extraction
            if (p.title || p.heading) return { heading: p.title || p.heading, text: p.description || p.subtitle };
            return null;
    }
}

export function SeoContentSnapshot({ puckData, products, categories, globalStats, path }: SeoContentSnapshotProps) {
    let content: any[] = [];

    try {
        const parsed = typeof puckData === "string" ? JSON.parse(puckData) : puckData;
        content = parsed?.content || [];
    } catch {
        return null;
    }

    if (content.length === 0 && !products?.length) return null;

    const blocks = content.map(extractBlockContent).filter(Boolean);

    return (
        <article
            className="sr-only"
            aria-label={`Content for ${path}`}
            itemScope
            itemType="https://schema.org/WebPage"
        >
            {/* Semantic content from Puck blocks */}
            {blocks.map((block, i) => (
                <section key={i}>
                    {block!.heading && <h2>{block!.heading}</h2>}
                    {block!.text && <p>{block!.text}</p>}
                    {block!.items && block!.items.length > 0 && (
                        <ul>
                            {block!.items.map((item: string, j: number) => (
                                <li key={j}>{item}</li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}

            {/* Product catalog content for /products page */}
            {products && products.length > 0 && (
                <section>
                    <h2>Our Products</h2>
                    <ul>
                        {products.map((p: any, i: number) => (
                            <li key={i}>
                                <strong>{p.name}</strong>
                                {p.description && <span> — {p.description}</span>}
                                {p.sku && <span> (SKU: {p.sku})</span>}
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Category listing */}
            {categories && categories.length > 0 && (
                <section>
                    <h2>Product Categories</h2>
                    <ul>
                        {categories.map((c: any, i: number) => (
                            <li key={i}>{c.name}{c.description ? ` — ${c.description}` : ""}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Global stats */}
            {globalStats && globalStats.length > 0 && (
                <section>
                    <h2>Company Highlights</h2>
                    <ul>
                        {globalStats.map((s: any, i: number) => (
                            <li key={i}>{s.label}: {s.value}</li>
                        ))}
                    </ul>
                </section>
            )}
        </article>
    );
}
