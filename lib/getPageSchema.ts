import { PageRecord } from "@/types";

export function getPageSchema(schemaType: string, pageData: PageRecord, siteUrl: string) {
  const url = `${siteUrl}${pageData.path === "/" ? "" : pageData.path}`;
  
  switch (schemaType) {
    case "product-list":
      return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": pageData.title,
        "description": pageData.description,
        "url": url,
      };
    case "service":
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": pageData.title,
        "description": pageData.description,
        "provider": {
          "@type": "Organization",
          "name": "Nature's Boon",
          "url": siteUrl
        }
      };
    case "about":
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Archana Dhingra",
        "jobTitle": "Founder & Mentor",
        "worksFor": {
          "@type": "Organization",
          "name": "Nature's Boon",
          "url": siteUrl
        }
      };
    case "blog-post":
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": pageData.title,
        "description": pageData.description,
        "author": {
          "@type": "Organization",
          "name": "Nature's Boon"
        }
      };
    case "contact":
      return {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "name": pageData.title,
        "description": pageData.description,
        "url": url
      };
    default:
      return null;
  }
}
