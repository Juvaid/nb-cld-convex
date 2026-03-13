"use client";

import { useState, useEffect } from "react";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { DynamicCookieConsent, DynamicFloatingWidget } from "@/components/DynamicClients";
import { DefaultSeo } from 'next-seo';
import SEO_CONFIG from '@/lib/seo.config';
import { OrganizationSchema } from '@/components/seo/OrganizationSchema';

export function Providers({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  return (
    <ConvexClientProvider>
      <AuthProvider>
        <ThemeProvider>
          {isMounted && (
            <>
              <DefaultSeo {...SEO_CONFIG} />
              <OrganizationSchema />
            </>
          )}
          {children}
          {modal}
          <DynamicCookieConsent />
          <DynamicFloatingWidget />
        </ThemeProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
}

