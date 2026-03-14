export type PageRecord = {
    _id: string;
    _creationTime: number;
    path: string;
    draftData?: string;
    publishedData?: string;
    data?: string;
    title: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    ogDescription?: string;
    schemaType?: string;
    status?: "draft" | "published";
    publishedAt?: number;
    lastModified?: number;
  };
  
  export type BlogRecord = {
      _id: string;
      _creationTime: number;
      title: string;
      slug: string;
      content: string;
      excerpt?: string;
      coverImage?: string;
      author: string;
      keywords?: string;
      status: "draft" | "published";
      publishedAt?: number;
    };

    export type ProductRecord = {
        _id: string;
        _creationTime: number;
        name: string;
        slug: string;
        price?: number;
        compareAtPrice?: number;
        description: string;
        images: string[];
        categoryId?: string;
        status: "active" | "draft" | "archived";
        sku?: string;
        usp?: string;
        tags: string[];
        keywords?: string;
        meta?: any;
        moq?: number;
        pricingTiers?: {
            minQty: number;
            price: number;
        }[];
        botanicalName?: string;
        extractionMethod?: string;
        activeCompounds?: string;
        documents?: {
            name: string;
            storageId: string;
        }[];
    };
