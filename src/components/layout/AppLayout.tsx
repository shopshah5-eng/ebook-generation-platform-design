"use client";

import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
  userName: string;
  onLogout: () => void;
  onCreateTrigger: () => void;
}

export function AppLayout({
  children,
  activeView,
  onViewChange,
  userName,
  onLogout,
  onCreateTrigger,
}: AppLayoutProps) {

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      id: "ebooks",
      label: "My Ebooks",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "templates",
      label: "Templates",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      ),
    },
    {
      id: "billing",
      label: "Billing",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      id: "settings",
      label: "Settings",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden h-16 border-b border-white/5 bg-[#0E131F]/90 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-base shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            P
          </span>
          <span className="font-bold text-lg">PageNest</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateTrigger}
            className="px-3.5 py-1.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            + Create
          </button>
        </div>
      </header>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar (lg:flex) */}
        <aside className="hidden lg:flex w-64 border-r border-white/5 bg-[#0E131F]/40 p-5 flex-col justify-between shrink-0 sticky top-0 h-screen">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2 px-2 py-1">
              <span className="h-9 w-9 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                P
              </span>
              <span className="font-bold text-xl tracking-tight text-white">PageNest</span>
            </div>

            {/* Create Ebook Button */}
            <button
              onClick={onCreateTrigger}
              className="w-full py-3 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] cursor-pointer flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Ebook</span>
            </button>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = activeView === item.id || (item.id === "ebooks" && activeView === "ebooks");
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      isActive
                        ? "bg-white/[0.05] text-white border-l-2 border-brand-purple pl-3.5"
                        : "text-brand-muted hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.icon(`w-4.5 h-4.5 ${isActive ? "text-brand-purple" : "text-brand-muted"}`)}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex flex-col gap-5">
            {/* Upgrade to Pro Card */}
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-2 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-12 h-12 bg-brand-purple/10 rounded-full blur-xl pointer-events-none" />
              <p className="text-[11px] font-bold text-white uppercase tracking-wider">Upgrade to Pro</p>
              <p className="text-[9px] text-brand-muted leading-relaxed">
                Unlock unlimited creations, custom branding & exports.
              </p>
              <button
                onClick={() => onViewChange("billing")}
                className="bg-brand-purple hover:bg-brand-purple/95 text-white text-[9px] py-2 rounded-lg font-bold uppercase tracking-wider transition-all shadow-[0_0_10px_rgba(124,58,237,0.2)] cursor-pointer mt-1"
              >
                Upgrade Now
              </button>
            </div>

            {/* User profile row */}
            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-1">
                <div className="h-8 w-8 rounded-full bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center font-bold text-xs text-brand-purple">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[9px] text-brand-muted uppercase tracking-wider font-semibold">Active Member</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full text-left px-1.5 py-1 text-[10px] font-bold text-brand-muted hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider"
              >
                Logout &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Persistent Glassmorphic Bottom Navigation Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0E131F]/90 border-t border-white/5 backdrop-blur-md flex items-center justify-around z-45 px-4 pb-[env(safe-area-inset-bottom,12px)]">
          {navItems.map((item) => {
            const isActive = activeView === item.id || (item.id === "ebooks" && activeView === "ebooks");
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center justify-center py-2 px-3 text-[9px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  isActive ? "text-brand-purple" : "text-brand-muted hover:text-white"
                }`}
              >
                {item.icon(`w-5 h-5 mb-0.5 ${isActive ? "text-brand-purple" : "text-brand-muted"}`)}
                <span className="text-[8px] mt-0.5">{item.label === "My Ebooks" ? "Ebooks" : item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Main Content Viewport */}
        <main className="flex-grow p-6 lg:p-12 pb-24 lg:pb-12 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
