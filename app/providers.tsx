"use client";

import React, { useState, useEffect } from "react";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { DynamicCookieConsent, DynamicFloatingWidget } from "@/components/DynamicClients";
export function Providers({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConvexClientProvider>
      <AuthProvider>
        <ThemeProvider>
          {children}
          {modal}
          {mounted && (
            <>
              <DynamicCookieConsent />
              <DynamicFloatingWidget />
            </>
          )}
        </ThemeProvider>
      </AuthProvider>
    </ConvexClientProvider>
  );
}

