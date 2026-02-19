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
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    // Load token from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const stored = localStorage.getItem("auth_token");
            if (stored) setToken(stored);
        }
    }, []);

    const currentUser = useQuery(
        api.auth.getCurrentUser,
        token ? { token } : "skip" // Token is string | null, args expects optional string.
    );

    const loginMutation = useMutation(api.auth.login);
    const logoutMutation = useMutation(api.auth.logout);

    const login = async (email: string, password: string) => {
        const result = await loginMutation({ email, password });
        localStorage.setItem("auth_token", result.token);
        setToken(result.token);
        router.push("/admin");
    };

    const logout = async () => {
        if (token) {
            await logoutMutation({ token });
        }
        localStorage.removeItem("auth_token");
        setToken(null);
        router.push("/login"); // Redirect to login after logout
    };

    return (
        <AuthContext.Provider
            value={{
                user: currentUser ? { ...currentUser, role: currentUser.role as "admin" | "client" } : null,
                login,
                logout,
                isLoading: currentUser === undefined && !!token, // Loading if token exists but user not loaded yet
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
