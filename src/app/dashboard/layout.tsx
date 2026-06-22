"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
      } else {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/my-ebooks",
      label: "My Ebooks",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      href: "/dashboard/templates",
      label: "Templates",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 7a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zm0 7a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/billing",
      label: "Billing",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: (className: string) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center font-sans">
        <p className="text-xs text-brand-muted animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col font-sans">
      {/* Mobile Top Navbar */}
      <header className="lg:hidden h-16 border-b border-white/5 bg-[#0E131F]/90 px-6 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-base shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            P
          </span>
          <span className="font-bold text-lg text-white">PageNest</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-2xl p-1 text-brand-muted hover:text-white transition-colors cursor-pointer"
        >
          ☰
        </button>
      </header>

      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 border-r border-white/5 bg-[#0E131F]/40 p-5 flex-col justify-between shrink-0 sticky top-0 h-screen">
          <div className="flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 px-2 py-1">
              <span className="h-9 w-9 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-lg shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                P
              </span>
              <span className="font-bold text-xl tracking-tight text-white">PageNest</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-[20px] text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive
                        ? "bg-white/[0.04] text-white border-l-2 border-brand-purple pl-3.5 shadow-sm"
                        : "text-brand-muted hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    {item.icon(`w-4.5 h-4.5 ${isActive ? "text-brand-purple" : "text-brand-muted"}`)}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
 
          <div className="flex flex-col gap-5">
            {/* Upgrade to Pro Card */}
            <div className="glass p-5 rounded-[20px] flex flex-col gap-2.5 relative overflow-hidden shadow-2xl transition-all duration-300 hover:border-brand-purple/30 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-brand-purple/15 rounded-full blur-xl pointer-events-none group-hover:bg-brand-purple/20 transition-all duration-300" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider">Upgrade to Pro</span>
                <span className="text-[8px] bg-brand-purple/20 text-[#a78bfa] border border-[#a78bfa]/20 px-1.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold scale-90">PRO</span>
              </div>
              <p className="text-[9px] text-brand-muted leading-relaxed">
                Unlock unlimited creations, custom branding, and high-res vector PDF/EPUB exports.
              </p>
              <Link
                href="/dashboard/billing"
                className="bg-brand-purple hover:bg-brand-purple/90 text-center text-white text-[9px] py-2.5 rounded-[12px] font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] cursor-pointer mt-1 font-sans"
              >
                Upgrade Now
              </Link>
            </div>
 
            {/* User profile row */}
            <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
              <div className="flex items-center gap-3 px-1">
                <div className="h-8.5 w-8.5 rounded-full bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center font-bold text-xs text-brand-purple">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[9px] text-brand-muted uppercase tracking-wider font-semibold">Active Member</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-1.5 py-1 text-[10px] font-bold text-brand-muted hover:text-red-400 transition-colors cursor-pointer uppercase tracking-wider"
              >
                Logout &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Slide-over Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-brand-bg/85 backdrop-blur-sm z-50 lg:hidden"
              />
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-72 bg-[#0E131F] border-l border-white/5 p-6 flex flex-col justify-between z-50 lg:hidden"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <span className="font-bold text-base uppercase tracking-wider">Menu</span>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-2xl p-1 text-brand-muted hover:text-white cursor-pointer"
                    >
                      &times;
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                            isActive
                              ? "bg-white/[0.05] text-white border-l-2 border-brand-purple pl-3.5"
                              : "text-brand-muted hover:text-white hover:bg-white/[0.02]"
                          }`}
                        >
                          {item.icon(`w-4.5 h-4.5 ${isActive ? "text-brand-purple" : "text-brand-muted"}`)}
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Upgrade card on Mobile */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider">Upgrade to Pro</p>
                    <p className="text-[9px] text-brand-muted leading-relaxed">Unlock unlimited creations and exports.</p>
                    <Link
                      href="/dashboard/billing"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-brand-purple hover:bg-brand-purple/95 text-center text-white text-[9px] py-2 rounded-lg font-bold uppercase tracking-wider transition-all mt-1"
                    >
                      Upgrade
                    </Link>
                  </div>

                  {/* Profile */}
                  <div className="border-t border-white/5 pt-4 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center font-bold text-xs text-brand-purple">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="text-xs font-bold text-white truncate">{userName}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left py-1 text-[10px] font-bold text-brand-muted hover:text-red-400 transition-colors uppercase tracking-wider"
                    >
                      Logout &rarr;
                    </button>
                  </div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main stage */}
        <main className="flex-grow p-6 lg:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
