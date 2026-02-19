import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export interface PageTemplate {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: "landing" | "content" | "about" | "contact" | "services" | "blank";
  data: any;
}

export const templates: Record<string, PageTemplate> = {
  homepage: {
    id: "homepage",
    name: "Homepage",
    description: "Full-featured homepage with hero, stats, services, and CTA",
    thumbnail: "🏠",
    category: "landing",
    data: {
      root: {
        props: {
          header: {
            logoText: "NatureBoon",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ],
            portalText: "Client Portal",
            contactText: "Get Quote",
          },
          footer: {
            copyrightText: "© 2026 NatureBoon. All rights reserved.",
          },
        },
      },
      content: [
        {
          type: "NatureBoonHero",
          props: {
            title: "Crafting Beauty with Nature's Essence",
            subtitle: "Nature's Boon",
            description: "Leading manufacturer and supplier of premium personal care products since 2006. ISO certified, quality guaranteed.",
            buttonText: "Get Private Label Quote",
            backgroundVariant: "white",
            flexDirection: "row",
            flexAlign: "center",
            flexJustify: "between",
            gap: "12",
          },
        },
        {
          type: "NatureBoonStats",
          props: {
            stats: [
              { value: "15+", label: "Years Experience" },
              { value: "200+", label: "Annual SKUs" },
              { value: "750+", label: "Tons Capacity" },
              { value: "65+", label: "Strong Family" },
            ],
            backgroundVariant: "white",
            flexDirection: "row",
            flexAlign: "center",
            flexJustify: "between",
            gap: "12",
          },
        },
        {
          type: "ServiceGrid",
          props: {
            title: "Our Professional Services",
            items: [
              { title: "Private Label Manufacturing", description: "Custom formulations tailored to your brand specifications" },
              { title: "Bulk Production", description: "Large-scale manufacturing with consistent quality" },
              { title: "Product Development", description: "From concept to creation with our expert team" },
              { title: "Quality Assurance", description: "ISO 22716 certified processes and rigorous testing" },
            ],
            backgroundVariant: "slate-50",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "8",
          },
        },
        {
          type: "IconBenefits",
          props: {
            title: "Why Partner With Us?",
            benefits: [
              { title: "Sustainable Sourcing", description: "Ethically sourced natural ingredients from verified suppliers" },
              { title: "Custom Formulations", description: "Tailored recipes to match your brand's unique requirements" },
              { title: "Scalable Production", description: "From small batches to industrial-scale manufacturing" },
              { title: "Global Compliance", description: "Meet international regulatory standards with confidence" },
            ],
            backgroundVariant: "white",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "10",
          },
        },
        {
          type: "CTA",
          props: {
            title: "Ready to Build Your Brand?",
            buttonText: "Request Consultation",
            backgroundVariant: "slate-900",
            flexDirection: "col",
            flexAlign: "center",
            flexJustify: "center",
            gap: "12",
          },
        },
      ],
    },
  },
  about: {
    id: "about",
    name: "About Us",
    description: "Company story, mission, and team introduction",
    thumbnail: "📖",
    category: "about",
    data: {
      root: {
        props: {
          header: {
            logoText: "NatureBoon",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ],
            portalText: "Client Portal",
            contactText: "Get Quote",
          },
          footer: {
            copyrightText: "© 2026 NatureBoon. All rights reserved.",
          },
        },
      },
      content: [
        {
          type: "NatureBoonHero",
          props: {
            title: "Our Story",
            subtitle: "About NatureBoon",
            description: "Since 2006, we've been at the forefront of natural personal care manufacturing, combining ancient wisdom with modern science.",
            buttonText: "Learn More",
            backgroundVariant: "white",
            flexDirection: "row",
            flexAlign: "center",
            flexJustify: "between",
            gap: "12",
          },
        },
        {
          type: "FeatureGrid",
          props: {
            title: "Our Mission",
            items: [
              { title: "Quality First", description: "Uncompromising commitment to the highest quality standards in every product we manufacture" },
              { title: "Natural Ingredients", description: "Sourcing the finest natural and organic ingredients from sustainable suppliers worldwide" },
              { title: "Innovation", description: "Continuous research and development to bring cutting-edge formulations to market" },
              { title: "Sustainability", description: "Environmental responsibility in every step of our manufacturing process" },
            ],
            backgroundVariant: "slate-50",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "8",
          },
        },
        {
          type: "ProcessTimeline",
          props: {
            title: "How We Work",
            steps: [
              { title: "Consultation", description: "We discuss your vision, requirements, and timeline" },
              { title: "Formulation", description: "Our team develops custom formulations" },
              { title: "Sample Development", description: "We create prototypes for your approval" },
              { title: "Production", description: "Scalable manufacturing with quality checks" },
            ],
            backgroundVariant: "white",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "10",
          },
        },
        {
          type: "CTA",
          props: {
            title: "Want to Learn More About Us?",
            buttonText: "Get in Touch",
            backgroundVariant: "slate-900",
            flexDirection: "col",
            flexAlign: "center",
            flexJustify: "center",
            gap: "12",
          },
        },
      ],
    },
  },
  services: {
    id: "services",
    name: "Services",
    description: "Showcase your services and capabilities",
    thumbnail: "🛠️",
    category: "services",
    data: {
      root: {
        props: {
          header: {
            logoText: "NatureBoon",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ],
            portalText: "Client Portal",
            contactText: "Get Quote",
          },
          footer: {
            copyrightText: "© 2026 NatureBoon. All rights reserved.",
          },
        },
      },
      content: [
        {
          type: "NatureBoonHero",
          props: {
            title: "Our Services",
            subtitle: "What We Offer",
            description: "Comprehensive manufacturing solutions tailored to your business needs.",
            buttonText: "Request Quote",
            backgroundVariant: "white",
            flexDirection: "row",
            flexAlign: "center",
            flexJustify: "between",
            gap: "12",
          },
        },
        {
          type: "ServiceGrid",
          props: {
            title: "Manufacturing Services",
            items: [
              { title: "Private Label", description: "End-to-end manufacturing under your brand" },
              { title: "Contract Manufacturing", description: "Production based on your specifications" },
              { title: "Formulation Development", description: "Custom product creation from scratch" },
              { title: "Packaging Design", description: "Complete packaging solutions" },
              { title: "Quality Testing", description: "Comprehensive lab testing services" },
              { title: "Regulatory Support", description: "Compliance with global standards" },
            ],
            backgroundVariant: "slate-50",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "8",
          },
        },
        {
          type: "IconBenefits",
          props: {
            title: "Why Choose Our Services?",
            benefits: [
              { title: "Industry Experience", description: "15+ years of expertise in personal care manufacturing" },
              { title: "State-of-the-Art Facilities", description: "Modern equipment and clean room environments" },
              { title: "Dedicated Support", description: "Personal account managers for every client" },
              { title: "Flexible Volumes", description: "From 1000 to 1 million+ units" },
            ],
            backgroundVariant: "white",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "10",
          },
        },
        {
          type: "CTA",
          props: {
            title: "Discuss Your Project",
            buttonText: "Schedule Consultation",
            backgroundVariant: "slate-900",
            flexDirection: "col",
            flexAlign: "center",
            flexJustify: "center",
            gap: "12",
          },
        },
      ],
    },
  },
  contact: {
    id: "contact",
    name: "Contact Us",
    description: "Contact form and company information",
    thumbnail: "📞",
    category: "contact",
    data: {
      root: {
        props: {
          header: {
            logoText: "NatureBoon",
            links: [
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Services", href: "/services" },
              { label: "Contact", href: "/contact" },
            ],
            portalText: "Client Portal",
            contactText: "Get Quote",
          },
          footer: {
            copyrightText: "© 2026 NatureBoon. All rights reserved.",
          },
        },
      },
      content: [
        {
          type: "NatureBoonHero",
          props: {
            title: "Get in Touch",
            subtitle: "Contact Us",
            description: "We'd love to hear from you. Reach out to discuss your manufacturing needs.",
            buttonText: "Send Message",
            backgroundVariant: "white",
            flexDirection: "row",
            flexAlign: "center",
            flexJustify: "between",
            gap: "12",
          },
        },
        {
          type: "FeatureGrid",
          props: {
            items: [
              { title: "Email", description: "contact@natureboon.com" },
              { title: "Phone", description: "+1 (555) 123-4567" },
              { title: "Address", description: "123 Manufacturing Way, Industry City, ST 12345" },
              { title: "Hours", description: "Mon-Fri: 9AM - 6PM EST" },
            ],
            backgroundVariant: "slate-50",
            flexDirection: "row",
            flexJustify: "center",
            flexAlign: "stretch",
            gap: "8",
          },
        },
        {
          type: "FAQAccordion",
          props: {
            title: "Frequently Asked Questions",
            questions: [
              { question: "What is your minimum order quantity?", answer: "Our minimum order quantity varies by product. Contact us for specific details." },
              { question: "How long does production take?", answer: "Typical production time is 4-8 weeks depending on complexity and volume." },
              { question: "Do you offer samples?", answer: "Yes, we provide sample production for quality verification before bulk orders." },
              { question: "What certifications do you have?", answer: "We are ISO 22716 certified and follow GMP guidelines." },
            ],
            backgroundVariant: "white",
            flexDirection: "col",
            gap: "4",
          },
        },
      ],
    },
  },
  blank: {
    id: "blank",
    name: "Blank Page",
    description: "Start from scratch with an empty page",
    thumbnail: "📄",
    category: "blank",
    data: {
      root: {
        props: {
          header: {
            logoText: "NatureBoon",
            links: [],
            portalText: "Client Portal",
            contactText: "Get Quote",
          },
          footer: {
            copyrightText: "© 2026 NatureBoon. All rights reserved.",
          },
        },
      },
      content: [],
    },
  },
};

export const listTemplates = query({
  handler: async () => {
    return Object.values(templates);
  },
});

export const getTemplate = query({
  args: { templateId: v.string() },
  handler: async (ctx, args) => {
    return templates[args.templateId] || null;
  },
});

// --- Saved Blocks (Component Templates) ---

export const saveSavedBlock = mutation({
  args: {
    name: v.string(),
    componentType: v.string(),
    props: v.any(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const templateId = await ctx.db.insert("componentTemplates", {
      name: args.name,
      componentType: args.componentType,
      props: args.props,
      category: args.category,
      createdAt: Date.now(),
    });
    return templateId;
  },
});

export const listSavedBlocks = query({
  handler: async (ctx) => {
    return await ctx.db.query("componentTemplates").order("desc").collect();
  },
});

export const deleteSavedBlock = mutation({
  args: { id: v.id("componentTemplates") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
