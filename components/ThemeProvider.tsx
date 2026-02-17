"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ReactNode, useEffect, useState } from "react";

const defaultTheme = {
  colors: {
    primary: "#2bee6c",
    secondary: "#0f172a",
    accent: "#22c55e",
    background: "#ffffff",
    backgroundAlt: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    border: "#e2e8f0",
  },
  typography: {
    headingFont: "system-ui",
    bodyFont: "system-ui",
    headingWeight: "700",
    bodyWeight: "400",
  },
  buttons: {
    borderRadius: "12",
    paddingX: "24",
    paddingY: "12",
    primaryBg: "#2bee6c",
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
  const themeData = useQuery(api.theme.getThemeSettings);
  const [cssVars, setCssVars] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (themeData?.typography) {
      const fontsToLoad = [
        themeData.typography.headingFont,
        themeData.typography.bodyFont
      ].filter(f => f && f !== "system-ui");

      if (fontsToLoad.length > 0) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        const fontQuery = fontsToLoad
          .map(f => f.replace(/['"]/g, "").replace(/\s+/g, "+"))
          .join("&family=");
        link.href = `https://fonts.googleapis.com/css2?family=${fontQuery}:wght@300;400;500;600;700;800;900&display=swap`;
        document.head.appendChild(link);
        return () => {
          document.head.removeChild(link);
        };
      }
    }
  }, [themeData?.typography]);

  useEffect(() => {
    if (themeData) {
      const vars = flattenToCssVars(themeData);
      setCssVars(vars);
    }
  }, [themeData]);

  if (!mounted) {
    return <>{children}</>;
  }

  const headingFont = themeData?.typography?.headingFont || defaultTheme.typography.headingFont;
  const bodyFont = themeData?.typography?.bodyFont || defaultTheme.typography.bodyFont;

  return (
    <>
      <style jsx global>{`
        :root {
          ${cssVars || flattenToCssVars(defaultTheme)}
          --color-nb-green: var(--nb-colors-primary);
          --color-nb-green-light: var(--nb-colors-accent);
          --color-nb-dark: var(--nb-colors-secondary);
          --background: var(--nb-colors-background);
          --foreground: var(--nb-colors-text);
          
          /* Typography Mapping */
          --font-sans: ${bodyFont.includes("'") ? bodyFont : `'${bodyFont}'`}, system-ui;
          --font-heading: ${headingFont.includes("'") ? headingFont : `'${headingFont}'`}, var(--font-sans);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading) !important;
            font-weight: var(--nb-typography-headingWeight, 900) !important;
        }

        body {
            font-family: var(--font-sans) !important;
            font-weight: var(--nb-typography-bodyWeight, 400) !important;
        }

        button {
            border-radius: calc(var(--nb-buttons-borderRadius, 16) * 1px) !important;
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
