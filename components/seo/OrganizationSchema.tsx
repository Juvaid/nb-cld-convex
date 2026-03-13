"use client";

import { OrganizationJsonLd, LocalBusinessJsonLd } from 'next-seo';

export function OrganizationSchema() {
  return (
    <>
      <OrganizationJsonLd
        type="Organization"
        id="https://darkorange-anteater-238035.hostingersite.com"
        name="Nature's Boon"
        url="https://darkorange-anteater-238035.hostingersite.com"
        logo="https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1772786218632-blk.png"
        sameAs={[
          'https://www.instagram.com/naturesboon.cosmeticsmfg',
          'https://www.facebook.com/people/Natures-Boon/100091906116013',
        ]}
        contactPoint={[
          {
            telephone: '+91-97818-00033',
            contactType: 'customer service',
            availableLanguage: ['English', 'Hindi', 'Punjabi'],
          },
        ]}
      />
      <LocalBusinessJsonLd
        type="Store"
        id="https://darkorange-anteater-238035.hostingersite.com"
        name="Nature's Boon"
        description="Personal care OEM, Private Label & Contract Manufacturing in Punjab, India."
        url="https://darkorange-anteater-238035.hostingersite.com"
        telephone="+91-97818-00033"
        address={{
          streetAddress: 'Plot No 123, JLPL Industrial Area, Sector 82',
          addressLocality: 'Mohali',
          addressRegion: 'Punjab',
          postalCode: '140308',
          addressCountry: 'IN',
        }}
        openingHours={['Mo-Sa 09:00-18:00']}
        images={[
          'https://pub-13cf3fd8cdc643a6919ef78cee02101f.r2.dev/1773305814460-herobannerv2.png',
        ]}
      />
    </>
  );
}
