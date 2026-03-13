"use client";

import { OrganizationJsonLd, LocalBusinessJsonLd } from 'next-seo';

const SITE_URL = 'https://new.naturesboon.net';

export function OrganizationSchema() {
  return (
    <>
      <OrganizationJsonLd
        type="Organization"
        id={SITE_URL}
        name="Nature's Boon"
        url={SITE_URL}
        logo="https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1772786218632-blk.png"
        sameAs={[
          'https://www.instagram.com/naturesboon.cosmeticsmfg',
          'https://www.facebook.com/people/Natures-Boon/100091906116013',
        ]}
        contactPoint={[
          {
            telephone: '+91-9877659808',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi', 'Punjabi'],
          },
        ]}
      />
      <LocalBusinessJsonLd
        type="Store"
        id={SITE_URL}
        name="Nature's Boon"
        description="Personal care OEM, Private Label & Contract Manufacturing in Punjab, India."
        url={SITE_URL}
        telephone="+91-9877659808"
        address={{
          streetAddress: 'Pakhowal Rd, adj. Sri Chaitanya Techno School, Thakkarwal',
          addressLocality: 'Ludhiana',
          addressRegion: 'Punjab',
          postalCode: '142022',
          addressCountry: 'IN',
        }}
        openingHours={['Mo-Fr 09:00-18:00']}
        images={[
          'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png',
        ]}
      />
    </>
  );
}
