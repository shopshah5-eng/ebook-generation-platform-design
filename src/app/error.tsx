"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log details to monitoring service (Plausible, Vercel logs)
    console.error("Global boundary intercepted crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col items-center justify-center font-sans px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main glass box */}
      <div className="glass p-8 sm:p-12 rounded-[24px] max-w-md w-full text-center relative z-10 bg-white/[0.02] border border-white/5 shadow-2xl flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
            Something went wrong
          </h1>
          <p className="text-xs text-brand-muted leading-relaxed font-medium">
            An unexpected error occurred while compiling your editor assets or fetching workspace data.
          </p>
        </div>

        <div className="h-[1px] bg-white/5 w-full" />

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => reset()}
            className="w-full min-h-[44px] px-6 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer shadow-md shadow-brand-purple/20 active:scale-95 duration-200"
          >
            Retry Action
          </button>
          
          <button
            onClick={() => window.location.href = "/"}
            className="w-full min-h-[44px] px-6 rounded-full border border-white/10 hover:border-brand-purple/50 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer hover:bg-white/5"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
