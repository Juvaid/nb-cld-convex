"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error in Puck React ComponentBoundary:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-slate-50/50 rounded-[40px] m-4 border-2 border-dashed border-red-500/20">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-[0px_0px_50px_rgba(239,68,68,0.1)]">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-2">
                        Content Block Unavailable
                    </h2>
                    <p className="text-slate-500 max-w-[400px] text-sm leading-relaxed mb-8">
                        This section of the page encountered a rendering glitch. The rest of the site is functioning normally.
                    </p>
                    <div className="flex gap-4">
                        <Button
                            variant="primary"
                            className="bg-black hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-black/10 transition-all font-bold px-6"
                            onClick={() => this.setState({ hasError: false })}
                        >
                            Try Again
                        </Button>
                        <Link href="/">
                            <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:text-black font-semibold h-full px-6 bg-white">
                                <Home className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
