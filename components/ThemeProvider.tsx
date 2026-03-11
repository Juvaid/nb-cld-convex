"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactNode, useEffect, useState } from "react";

const defaultTheme = {
  colors: {
    primary: "#15803d",
    secondary: "#0f172a",
    accent: "#16a34a",
    background: "#ffffff",
    backgroundAlt: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  },
  typography: {
    headingFont: "system-ui",
    bodyFont: "system-ui",
    logoFont: "Inter",
    headingWeight: "700",
    headingLetterSpacing: "0em",
    bodyWeight: "400",
    bodyLineHeight: "1.5",
  },
  buttons: {
    borderRadius: "12",
    paddingX: "24",
    paddingY: "12",
    primaryBg: "#16a34a",
    primaryText: "#0f172a",
  },
  spacing: {
    containerMaxWidth: "1280",
    sectionPaddingY: "64",
  },
  effects: {
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    transition: "0.2s",
  },
  layout: {
    borderRadius: "12px"
  }
};

function flattenToCssVars(obj: any, prefix = "--nb-"): string {
  let css = "";
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}${key}`;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      css += flattenToCssVars(value, `${varName}-`);
    } else {
      css += `${varName}: ${value};\n`;
    }
  }
  return css;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  if (typeof window === "undefined") {
    return <>{children}</>;
  }
  const themeData = useQuery(api.theme.getThemeSettings);
  // Initialize cssVars with the default theme immediately for SSR and initial render
  const [cssVars, setCssVars] = useState(() => flattenToCssVars(defaultTheme));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only update cssVars if themeData is available and different from the default
    if (themeData) {
      const newCssVars = flattenToCssVars(themeData);
      if (newCssVars !== cssVars) { // Prevent unnecessary re-renders if theme hasn't changed
        setCssVars(newCssVars);
      }
    }
  }, [themeData, cssVars]); // Add cssVars to dependency array to ensure comparison is accurate

  useEffect(() => {
    // Only run on client-side after mount
    if (!mounted || !themeData?.typography) return;

    const fontsToLoad = [
      themeData.typography.headingFont,
      themeData.typography.bodyFont,
      themeData.typography.logoFont
    ].filter(f => f && f !== "system-ui");

    if (fontsToLoad.length === 0) return;

    const fontQuery = Array.from(new Set(fontsToLoad)) // Deduplicate fonts
      .map(f => f.replace(/['"]/g, "").replace(/\s+/g, "+"))
      .join("&family=");

    const href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700;800;900&display=swap`;

    // Check if the font link already exists to avoid duplicates
    let link = document.querySelector(`link[href="${href}"]`) as HTMLLinkElement;

    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      document.head.appendChild(link);
    }

    return () => {
      // Optional: Remove font if theme changes (often better to leave it cached though)
      // For now, we leave it to avoid FOUC on rapid theme toggles, but ensure no dups above.
    };
  }, [themeData?.typography]);

  useEffect(() => {
    if (themeData) {
      const vars = flattenToCssVars(themeData);
      setCssVars(vars);
    }
  }, [themeData]);

  const headingFont = themeData?.typography?.headingFont || defaultTheme.typography.headingFont;
  const bodyFont = themeData?.typography?.bodyFont || defaultTheme.typography.bodyFont;
  const logoFont = themeData?.typography?.logoFont || defaultTheme.typography.logoFont;

  const currentCssVars = cssVars || flattenToCssVars(defaultTheme);

  return (
    <>
      <style jsx global>{`
        :root {
          ${currentCssVars}
          --color-nb-green: var(--nb-colors-primary);
          --color-nb-green-light: var(--nb-colors-accent);
          
          /* Derived Dynamic Gradients */
          --color-nb-green-soft: color-mix(in srgb, var(--nb-colors-primary), white 25%);
          --color-nb-green-deep: color-mix(in srgb, var(--nb-colors-primary), black 15%);
          --color-nb-accent-soft: color-mix(in srgb, var(--nb-colors-accent), white 25%);
          
          --color-nb-dark: var(--nb-colors-secondary);
          --background: var(--nb-colors-background);
          --foreground: var(--nb-colors-text);
          
          /* Typography Mapping */
          --font-sans: ${bodyFont.includes("'") ? bodyFont : `'${bodyFont}'`}, system-ui;
          --font-heading: ${headingFont.includes("'") ? headingFont : `'${headingFont}'`}, var(--font-sans);
          --font-logo: ${logoFont.includes("'") ? logoFont : `'${logoFont}'`}, var(--font-heading);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading) !important;
            font-weight: var(--nb-typography-headingWeight, 700) !important;
            letter-spacing: var(--nb-typography-headingLetterSpacing, 0em) !important;
        }

        body {
            font-family: var(--font-sans) !important;
            font-weight: var(--nb-typography-bodyWeight, 400) !important;
            line-height: var(--nb-typography-bodyLineHeight, 1.5) !important;
        }

        .font-logo {
            font-family: var(--font-logo) !important;
        }

        button {
            border-radius: calc(var(--nb-buttons-borderRadius, 12) * 1px) !important;
        }

        .container {
            max-width: calc(var(--nb-spacing-containerMaxWidth, 1280) * 1px) !important;
            margin-left: auto;
            margin-right: auto;
        }

        section {
            padding-top: calc(var(--nb-spacing-sectionPaddingY, 64) * 1px) !important;
            padding-bottom: calc(var(--nb-spacing-sectionPaddingY, 64) * 1px) !important;
        }
      `}</style>
      {children}
    </>
  );
}

export function useTheme() {
  const themeData = useQuery(api.theme.getThemeSettings);
  const saveSetting = useMutation(api.theme.saveThemeSetting);
  const saveAll = useMutation(api.theme.saveAllThemeSettings);
  const reset = useMutation(api.theme.resetThemeSettings);

  return {
    theme: themeData || defaultTheme,
    saveSetting,
    saveAll,
    reset,
  };
}
