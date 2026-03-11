"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient, ConvexProvider } from "convex/react";
import { ReactNode } from "react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || "https://placeholder-url-for-build.convex.cloud";
const convex = new ConvexReactClient(convexUrl);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    // On the server, we provide a base ConvexProvider. 
    // This allows useQuery hooks to run without crashing, returning 'undefined'.
    if (typeof window === "undefined") {
        return <ConvexProvider client={convex}>{children}</ConvexProvider>;
    }

    return (
        <ConvexAuthProvider client={convex}>
            {children}
        </ConvexAuthProvider>
    );
}
