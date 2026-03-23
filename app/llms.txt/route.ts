import { NextResponse } from 'next/server';

export async function GET() {
  const content = `# Nature's Boon

Nature's Boon is a global leader in personal care manufacturing, specializing in OEM, Private Label, and innovative R&D solutions for skincare, haircare, and personal care products.

## Core Services
- **Private Label Cosmetics**: End-to-end manufacturing for your brand.
- **OEM Skincare Manufacturing**: Scalable manufacturing solutions for established and emerging brands.
- **Contract Manufacturing**: High-quality production based in Ludhiana, Punjab.
- **Research & Development**: Innovative formulations and testing.

## Key Information
- **Location**: Pakhowal Road, Thakkarwal, Ludhiana, Punjab 141013, India.
- **Website**: https://naturesboon.net
- **Primary Contact**: +91-97818 00033
- **Industry**: Cosmetic & Personal Care Manufacturing

## Main Sections
- **Products**: Explore our range of manufactured products at /products
- **Services**: Detailed breakdown of our manufacturing capabilities at /services
- **About Us**: Our history, certifications, and mission at /about
- **Blogs**: Industrial insights and beauty trends at /blogs
- **Contact**: Get a quote or inquiry at /contact

## AI & LLM Compatibility
This website is optimized for AI agents and LLMs. It includes:
- **JSON-LD**: Structured data for Organization and LocalBusiness.
- **Open Graph**: Optimized social and preview metadata.
- **Semantic HTML**: Clear document structure for better parsing.
- **Sitemap**: Comprehensive index of all public-facing content at /sitemap.xml
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
