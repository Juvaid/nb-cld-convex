"use client";

import { OrganizationJsonLd, LocalBusinessJsonLd } from 'next-seo';

export const OrganizationSchema = () => {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://naturesboon.in';
    
    return (
        <>
            <OrganizationJsonLd
                type="Organization"
                id={`${siteUrl}/#organization`}
                name="Nature's Boon"
                url={siteUrl}
                logo={`${siteUrl}/logo-high-res.png`}
                contactPoints={[
                    {
                        telephone: '+91-9876543210',
                        contactType: 'customer service',
                        areaServed: 'IN',
                        availableLanguage: ['Hindi', 'English'],
                    },
                ]}
                sameAs={[
                    'https://www.facebook.com/naturesboon',
                    'https://www.instagram.com/naturesboon',
                    'https://www.linkedin.com/company/naturesboon',
                ]}
            />
            <LocalBusinessJsonLd
                type="LocalBusiness"
                id={`${siteUrl}/#localbusiness`}
                name="Nature's Boon Cosmetics"
                description="Leading Private Label Cosmetics & Skincare Manufacturer in India."
                url={siteUrl}
                telephone="+91-9876543210"
                address={{
                    streetAddress: 'Plot No. 123, Industrial Area',
                    addressLocality: 'Bawana',
                    addressRegion: 'Delhi',
                    postalCode: '110039',
                    addressCountry: 'IN',
                }}
                geo={{
                    latitude: '28.7997',
                    longitude: '77.0330',
                }}
                images={[
                    `${siteUrl}/og-image.jpg`,
                ]}
                openingHours={[
                    {
                        opens: '09:00',
                        closes: '18:00',
                        dayOfWeek: [
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                        ],
                    },
                ]}
            />
        </>
    );
};
