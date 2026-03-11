"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";



const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    // During SSR/build, skip the AuthProvider if we don't have a window
    // to avoid potential hook issues in the build environment.
    if (typeof window === "undefined") {
        return <>{children}</>;
    }

    return (
        <ConvexAuthProvider client={convex}>
            {children}
        </ConvexAuthProvider>
    );
}
