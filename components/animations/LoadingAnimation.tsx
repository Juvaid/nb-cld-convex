"use client";

import React from "react";

export function LoadingAnimation() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-[120px] md:max-w-[150px] animate-in fade-in zoom-in-95 duration-1000 flex flex-col items-center">
        <div className="relative w-full h-auto mb-6">
          <style>{`
                      @keyframes slideUpFade {
                        0% { opacity: 0; transform: translateY(10px); }
                        100% { opacity: 1; transform: translateY(0); }
                      }
    
                      /* FORCE system fonts with !important to prevent any font-shifts during hydration */
                      .loader-branding, 
                      .loader-branding h1, 
                      .loader-branding p {
                        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                      }
    
                      .brand-text {
                        animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                      }
                      
                      .brand-subtext {
                        animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
                      }
                    `}</style>
          <img src="/loading-logo.svg" alt="Loading..." className="w-full h-auto" />
        </div>
        <div className="text-center overflow-hidden loader-branding whitespace-nowrap">
          <h1 className="brand-text text-lg md:text-xl font-semibold text-slate-900 tracking-tight opacity-0 px-4">
            NATURE'S BOON
          </h1>
          <p className="brand-subtext text-[8px] md:text-[9px] font-medium text-[#15803d] tracking-[0.4em] mt-1 opacity-0 uppercase">
            Since 2006
          </p>
        </div>
      </div>
    </div>
  );
}
