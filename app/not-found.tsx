"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="w-24 h-24 bg-nb-green/10 rounded-full flex items-center justify-center mb-8">
        <span className="text-5xl font-bold text-nb-green">!</span>
      </div>
      <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-4">404 - Not Found</h1>
      <p className="text-xl text-slate-600 mb-10 max-w-md mx-auto">
        The page you're looking for seems to have vanished into thin air.
      </p>
      <Link 
        href="/" 
        className="px-8 py-4 bg-nb-green text-slate-950 text-lg font-bold rounded-2xl shadow-lg hover:bg-nb-green/90 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        Return to Home
      </Link>
    </div>
  );
}
