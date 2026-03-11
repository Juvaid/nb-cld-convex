"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email: string;
    role: "admin" | "client";
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    token: string | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    if (typeof window === "undefined") {
        return (
            <AuthContext.Provider
                value={{
                    user: null,
                    login: async () => { },
                    logout: async () => { },
                    isLoading: true,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }
    const [token, setToken] = useState<string | null>(null);
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();

    // Load token from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("auth_token");
            if (stored) setToken(stored);
        }
        setIsHydrated(true);
    }, []);

    const currentUser = useQuery(
        api.auth.getCurrentUser,
        token && isHydrated ? { token } : "skip" // Token is string | null, args expects optional string.
    );

    const loginMutation = useMutation(api.auth.login);
    const logoutMutation = useMutation(api.auth.logout);

    const login = async (email: string, password: string) => {
        const result = await loginMutation({ email, password });
        localStorage.setItem("auth_token", result.token);
        // Set cookie for middleware access (expires in 30 days)
        document.cookie = `auth_token=${result.token}; path=/; max-age=${30 * 24 * 60 * 60}; SameSite=Lax`;
        setToken(result.token);
        router.push("/admin");
    };

    const logout = async () => {
        if (token) {
            await logoutMutation({ token });
        }
        localStorage.removeItem("auth_token");
        // Clear cookie
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        setToken(null);
        router.push("/login"); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider
            value={{
                user: currentUser ? { ...currentUser, role: currentUser.role as "admin" | "client" } : null,
                login,
                logout,
                token,
                isLoading: !isHydrated || (currentUser === undefined && !!token), // Wait for hydration before judging auth
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};
