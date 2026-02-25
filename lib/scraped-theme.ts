// Default theme values ported from scraped repo
export const defaultTheme = {
    siteName: "Nature's Boon",
    tagline: 'Your Global Partner in Personal Care Excellence',
    logoUrl: '/images/logo.png',
    primaryColor: '#16a34a',
    secondaryColor: '#064e3b',
    accentColor: '#2bee6c',
    fontFamily: 'Inter',
};

// Default navigation links
export const defaultNavLinks = [
    { label: 'Home', href: '/', sortOrder: 0 },
    { label: 'About', href: '/about', sortOrder: 1 },
    { label: 'Services', href: '/services', sortOrder: 2 },
    { label: 'Products', href: '/products', sortOrder: 3 },
    { label: 'Contact', href: '/contact', sortOrder: 4 },
];

export interface Stat {
    value: string;
    label: string;
}

// Default stats
export const defaultStats: Stat[] = [
    { value: '15+', label: 'Years of Experience' },
    { value: '65+', label: 'Strong Family' },
    { value: '200+', label: 'SKUs Produced Annually' },
    { value: '75+', label: 'Products by In-house R&D' },
    { value: '20+', label: 'Happy Clients' },
    { value: '750+', label: 'Tons Annual Capacity' },
];

export interface Service {
    title: string;
    description: string;
    icon: string;
    slug: string;
}

// Default services
export const defaultServices: Service[] = [
    {
        title: 'Label & Packaging Designing',
        description: 'Label and packaging designing is an essential aspect of branding and marketing strategy. We create market-ready packaging that makes your products stand out.',
        icon: 'Palette',
        slug: 'label-packaging-designing',
    },
    {
        title: 'Customised Finished Product',
        description: 'A personal care product design must account for market demand. We develop tailored formulas that satisfy diverse consumer needs.',
        icon: 'FlaskConical',
        slug: 'customised-finished-product',
    },
    {
        title: 'Trademark & Logo',
        description: 'We create trademarks and logos that effectively represent your brand, establish identity, and build customer trust.',
        icon: 'BadgeCheck',
        slug: 'trademark-logo',
    },
    {
        title: 'Digital Marketing',
        description: 'We help brands promote their products and services to their target audience with effective digital marketing strategies.',
        icon: 'Megaphone',
        slug: 'digital-marketing',
    },
];

export interface ProductCategory {
    _id?: string;
    name: string;
    slug: string;
    description: string;
    images?: string[];
}

// Default products by category
export const defaultProductCategories: ProductCategory[] = [
    {
        name: "Men's Grooming",
        slug: 'mens-grooming',
        description: 'Beard Oil, Hair Wax',
        images: ['/images/mens-grooming.jpg'],
    },
    {
        name: 'Body & Personal Care',
        slug: 'body-personal-care',
        description: 'Body Lotion, Hand & Foot Care, Lip Care, Body Wash, Roll on Deodorant, Hair Removal Wax, Body Scrub, Body Cream',
        images: ['/images/body-care.jpg'],
    },
    {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Hair Shampoo, Hair Oil, Hair Serum',
        images: ['/images/hair-care.jpg'],
    },
    {
        name: 'Skin Care',
        slug: 'skin-care',
        description: 'Face Wash, Facial Kit, Face Serum, Face Cream, DTan, Face Scrub, Face Mist Skin Toner, Cleansing Milk, Moisturizer, SPF, Face Pack & Mask, Massage Cream',
        images: ['/images/skin-care.jpg'],
    },
];

export interface Testimonial {
    author: string;
    company: string;
    content: string;
    rating: number;
}

// Default testimonials
export const defaultTestimonials: Testimonial[] = [
    { author: 'Mehar', company: 'VitalFlow Client', content: 'Nature\'s Boon delivers an incredibly professional experience. Their state-of-the-art facilities ensure the highest hygiene standards, giving us complete peace of mind.', rating: 5 },
    { author: 'Harsimran Kaur', company: 'Global Beauty Inc.', content: 'Finding a reliable partner can be tough, but their exceptional product quality and end-to-end service make them the ultimate platform for building a cosmetics brand.', rating: 5 },
    { author: 'Harjot Singh', company: 'Luster Cosmetics', content: 'What truly sets them apart is their turnkey approach. By handling formulation, packaging, and logistics under one roof, they eliminated the headache of managing multiple vendors.', rating: 5 },
    { author: 'Shivam Bhasiin', company: 'Wellness Partners', content: 'Their catalog is incredibly versatile. From advanced skincare formulations to essential everyday cosmetics, the attention to detail is evident in every single batch.', rating: 5 },
    { author: 'Karamjot Singh', company: 'Herbal Essence Ltd.', content: 'Top-tier packaging design paired with premium product quality. The team consistently stays in touch, making the entire manufacturing process transparent and stress-free.', rating: 5 },
    { author: 'Ankita Mahajan', company: 'SkinCare Pro', content: 'I was genuinely blown away by the sophistication of their product range. Their specialized facial kits, in particular, have become a massive hit with our customers.', rating: 5 },
    { author: 'Jass Verma', company: 'Beauty Brand Co.', content: 'An absolutely brilliant team to work with. They took our challenging concept, refined the formula, and successfully brought our dream products to life.', rating: 5 },
];
