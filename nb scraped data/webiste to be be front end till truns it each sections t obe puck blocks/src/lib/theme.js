// Default theme values used when Supabase is not connected
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

// Default stats
export const defaultStats = [
    { value: '15+', label: 'Years of Experience' },
    { value: '65+', label: 'Strong Family' },
    { value: '200+', label: 'SKUs Produced Annually' },
    { value: '75+', label: 'Products by In-house R&D' },
    { value: '20+', label: 'Happy Clients' },
    { value: '750+', label: 'Tons Annual Capacity' },
];

// Default services
export const defaultServices = [
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

// Default products by category
export const defaultProductCategories = [
    {
        name: "Men's Grooming",
        slug: 'mens-grooming',
        description: 'Beard Oil, Hair Wax',
        imageUrl: '/images/mens-grooming.jpg',
    },
    {
        name: 'Body & Personal Care',
        slug: 'body-personal-care',
        description: 'Body Lotion, Hand & Foot Care, Lip Care, Body Wash, Roll on Deodorant, Hair Removal Wax, Body Scrub, Body Cream',
        imageUrl: '/images/body-care.jpg',
    },
    {
        name: 'Hair Care',
        slug: 'hair-care',
        description: 'Hair Shampoo, Hair Oil, Hair Serum',
        imageUrl: '/images/hair-care.jpg',
    },
    {
        name: 'Skin Care',
        slug: 'skin-care',
        description: 'Face Wash, Facial Kit, Face Serum, Face Cream, DTan, Face Scrub, Face Mist Skin Toner, Cleansing Milk, Moisturizer, SPF, Face Pack & Mask, Massage Cream',
        imageUrl: '/images/skin-care.jpg',
    },
];

// Default testimonials
export const defaultTestimonials = [
    { author: 'Mehar', company: 'VitalFlow Client', content: 'Highly professional and excellent service with very hygienic environment by Nature\'s Boon.', rating: 5 },
    { author: 'Harsimran Kaur', company: 'Global Beauty Inc.', content: 'They provide the best products and services and even this is a very good platform for anyone who needs a manufacturer for their brand.', rating: 5 },
    { author: 'Harjot Singh', company: 'Luster Cosmetics', content: 'One of the things I loved about this company is that they provided comprehensive services, eliminating the need for multiple vendors.', rating: 5 },
    { author: 'Shivam Bhasiin', company: 'Wellness Partners', content: 'They offer an extensive range of cosmetics, spanning from exquisite skincare formulations to stunning skin care essentials.', rating: 5 },
    { author: 'Karamjot Singh', company: 'Herbal Essence Ltd.', content: 'Excellent packaging, awesome quality, very nice follow ups.', rating: 5 },
    { author: 'Ankita Mahajan', company: 'SkinCare Pro', content: 'I\'m truly impressed by the exquisite product range they offer, and I have a special fondness for their facial kits.', rating: 5 },
    { author: 'Jass Verma', company: 'Beauty Brand Co.', content: 'Awesome team that\'s been helping us bring our products to life.', rating: 5 },
];

// Export theme as JSON for platform migration
export function exportThemeAsJSON(settings, content, products, services) {
    return JSON.stringify({
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        theme: settings,
        content,
        products,
        services,
    }, null, 2);
}
