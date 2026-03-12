"use client";

import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { DynamicCookieConsent, DynamicFloatingWidget } from "@/components/DynamicClients";

export function Providers({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <ConvexClientProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          {modal}
          <DynamicCookieConsent />
          <DynamicFloatingWidget />
        </ThemeProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
}
