import { ConvexHttpClient } from "convex/browser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({ path: ".env.local" });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function rebuildPages() {
  console.log("🚀 Starting content restoration...");

  // 1. Our Brands Page
  const ourBrandsData = {
    content: [
      {
        type: "ModernHero",
        props: {
          title: "Our Prestigious Brands",
          subtitle: "Discover our in-house brands dedicated to premium personal care and dermatological excellence.",
          badgeText: "TRUSTED EXCELLENCE",
          theme: "glass"
        }
      },
      {
        type: "Section",
        props: {
          heading: "True Derma",
          subheading: "Advanced Dermatological Solutions",
          sectionId: "true-derma"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>True Derma is a premium skincare brand created by Nature’s Boon, a leading manufacturer in natural and organic beauty products. With a commitment to using only the purest ingredients sourced from nature, True Derma offers a range of products designed to nourish and revitalize your skin.</p><p>From gentle cleansers to potent serums, each product is carefully crafted to deliver real results, leaving you with a healthier, more radiant complexion. Trust in the power of nature with True Derma.</p>"
            }
          }
        ]
      },
      {
        type: "Section",
        props: {
          heading: "Luster Cosmetics",
          subheading: "Premium Quality, Accessible Beauty",
          sectionId: "luster"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>Luster Cosmetics is a premium beauty brand created by Nature’s Boon, a trusted name in the field of natural and organic skincare. With a commitment to quality, Luster Cosmetics offers a range of products expertly crafted with the finest natural and organic ingredients.</p><p>From nourishing moisturizers to foaming facewashes, each product is designed to deliver real results and enhance your natural beauty. At Luster Cosmetics, we believe that beauty should be accessible to everyone. That’s why we offer our high-quality products at competitive prices, without compromising on quality or performance. Whether you’re looking for a simple, everyday routine or want to add some glam to your look, Luster Cosmetics has something for everyone.</p>"
            }
          }
        ]
      },
      {
        type: "Section",
        props: {
          heading: "Man Pride",
          subheading: "Modern Grooming for the Modern Man",
          sectionId: "man-pride"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>Man Pride is a men’s grooming brand that offers a range of products specifically designed to meet the needs of modern men. From skincare to hair care, each product is crafted with high-quality ingredients to provide effective and reliable results.</p><p>Whether you’re looking for a face wash to cleanse and refresh your skin or a hair wax to add some style to your locks, Man Pride has you covered.</p>"
            }
          }
        ]
      }
    ],
    root: {
      title: "Our Luxury Brands | Nature's Boon",
      description: "Explore the house of brands by Nature's Boon, including Luster Cosmetics, True Derma, and Man Pride. Premium personal care and clinical skincare solutions.",
      schemaType: "about"
    }
  };

  // 2. Case Studies Page
  const caseStudiesData = {
    content: [
      {
        type: "ModernHero",
        props: {
          title: "Manufacturing Success Stories",
          subtitle: "See how our formulation expertise and quality commitment drive market success for our partners.",
          badgeText: "PROVEN RESULTS",
          theme: "dark"
        }
      },
      {
        type: "Section",
        props: {
          heading: "Case Study I: Lacto Dark Spot Remover",
          subheading: "Market Dominance with 1 Lakh+ Units Sold",
          sectionId: "case-study-1"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>Luster Cosmetics Lacto Dark Spot Remover Cream is a highly successful skincare product that has achieved over 1 lakh+ unit sales and thousands of positive reviews on all major e-commerce marketplaces. One of the key factors that has contributed to its success is its unique formulation using lacto protein, vitamins, and antioxidants.</p><p>The product's affordability and wide availability, combined with Nature's Boon's commitment to natural ingredients, have enabled it to capture significant market share and build immense consumer trust.</p>"
            }
          }
        ]
      },
      {
        type: "Section",
        props: {
          heading: "Case Study II: Nuskhe by Paras Pigmentation",
          subheading: "Rapid Growth through Herbal Innovation",
          sectionId: "case-study-2"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>Nuskhe by Paras’ Pigmentation Cream is a natural and effective skincare product that has gained immense popularity in a short time. Manufactured by Nature's Boon, this herbal solution has received overwhelming positive reviews, helping build immediate credibility and a loyal customer base.</p><p>Our commitment to effective natural ingredients, coupled with strategic branding, has made this cream a benchmarks in the herbal pigmentation category.</p>"
            }
          }
        ]
      },
      {
        type: "Section",
        props: {
          heading: "Case Study III: Hyaluronic Series",
          subheading: "Comprehensive Skincare Regimen",
          sectionId: "case-study-3"
        },
        items: [
          {
            type: "TextBlock",
            props: {
              content: "<p>The Hyaluronic Series by Nuskhe by Paras (Face Wash, Gel, Scrub, and Mask) has become an effective product range in the market. Formulated by Nature's Boon with high-concentration hyaluronic acid, it provides a complete moisture-retention solution.</p><p>This all-in-one regimen satisfies the modern consumer's need for comprehensive skincare, proving that high-performance active ingredients and natural extracts can work together for exceptional results.</p>"
            }
          }
        ]
      }
    ],
    root: {
      title: "Case Studies & Success Stories | Nature's Boon",
      description: "Read about our manufacturing success stories, from high-volume dark spot removers to innovative herbal skincare series.",
      schemaType: "about"
    }
  };

  try {
    // Save Our Brands
    await client.mutation("pages:savePage", {
      path: "/our-brands",
      title: "Our Luxury Brands",
      description: ourBrandsData.root.description,
      status: "published",
      draftData: JSON.stringify(ourBrandsData),
    });
    console.log("✅ Our Brands page restored!");

    // Save Case Studies
    await client.mutation("pages:savePage", {
      path: "/case-studies",
      title: "Case Studies",
      description: caseStudiesData.root.description,
      status: "published",
      draftData: JSON.stringify(caseStudiesData),
    });
    console.log("✅ Case Studies page restored!");

  } catch (error) {
    console.error("❌ Failed to restore content:", error);
  }
}

rebuildPages();
