"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import { Container } from "../ui/Container";

export type AuthMode = "login" | "signup" | null;

interface NavbarProps {
  authMode: AuthMode;
  setAuthMode?: (mode: AuthMode) => void;
  userName: string;
  onAuth?: (name: string) => void;
  onLogout?: () => void;
  pendingCreate?: boolean;
  setPendingCreate?: (val: boolean) => void;
  onViewDashboard?: () => void;
}

export function Navbar({
  authMode,
  setAuthMode,
  userName,
  onAuth,
  onLogout,
  pendingCreate,
  setPendingCreate,
  onViewDashboard,
}: NavbarProps) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-border bg-brand-bg/85 backdrop-blur-md px-6 lg:px-16 py-4">
      <Container className="flex items-center justify-between !px-0">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="h-9 w-9 rounded-lg bg-brand-purple text-white flex items-center justify-center font-sans text-lg font-bold group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.4)]">
            P
          </span>
          <span className="font-sans text-xl font-bold tracking-tight text-white">
            PageNest
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8 font-sans text-xs font-semibold uppercase tracking-wider text-brand-muted">
          <a
            href="#features"
            className="hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors"
          >
            Process
          </a>
          <a
            href="#templates"
            className="hover:text-white transition-colors"
          >
            Templates
          </a>
          <a
            href="#pricing"
            className="hover:text-white transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="flex items-center gap-4 relative">
          {userName ? (
            <div className="flex items-center gap-3">
              {onViewDashboard && (
                <button
                  onClick={onViewDashboard}
                  className="hidden md:block px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all shadow-lg hover:shadow-xl cursor-pointer"
                >
                  Dashboard
                </button>
              )}
              <span className="hidden md:flex h-8 w-8 rounded-full bg-white/10 text-white border border-brand-border items-center justify-center font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </span>
              <button
                onClick={() => onLogout?.()}
                className="hidden md:block font-sans text-xs font-bold text-brand-muted hover:text-white transition-colors cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="font-sans text-xs font-bold text-white hover:text-brand-purple transition-colors cursor-pointer"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all hover:scale-102 shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer"
              >
                Sign up
              </Link>
            </div>
          )}

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg hover:bg-white/5 text-brand-muted hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <AnimatePresence>
            {authMode && !userName && (
              <AuthPopover
                mode={authMode}
                onModeChange={(mode) => setAuthMode?.(mode)}
                onAuth={(name) => onAuth?.(name)}
                onClose={() => {
                  setAuthMode?.(null);
                  if (setPendingCreate) setPendingCreate(false);
                }}
                isCentered={pendingCreate}
              />
            )}
          </AnimatePresence>
        </div>
      </Container>

      {/* Landing Mobile Slide-out Drawer Navigation */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileDrawerOpen(false)}
              className="fixed inset-0 z-50 bg-[#070B14]/80 backdrop-blur-md md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 w-80 max-w-[85vw] bg-[#0E131F] border-l border-white/5 p-6 z-50 flex flex-col justify-between md:hidden"
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <a href="#top" className="flex items-center gap-2" onClick={() => setMobileDrawerOpen(false)}>
                    <span className="h-8 w-8 rounded-lg bg-brand-purple text-white flex items-center justify-center font-sans text-base font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                      P
                    </span>
                    <span className="font-sans text-lg font-bold tracking-tight text-white">
                      PageNest
                    </span>
                  </a>
                  <button
                    onClick={() => setMobileDrawerOpen(false)}
                    className="text-2xl p-1 text-brand-muted hover:text-white cursor-pointer"
                    aria-label="Close menu"
                  >
                    &times;
                  </button>
                </div>

                <nav className="flex flex-col gap-5 font-sans text-sm font-semibold uppercase tracking-wider text-brand-muted">
                  <a
                    href="#features"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="hover:text-white transition-colors py-2"
                  >
                    Features
                  </a>
                  <a
                    href="#how-it-works"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="hover:text-white transition-colors py-2"
                  >
                    Process
                  </a>
                  <a
                    href="#templates"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="hover:text-white transition-colors py-2"
                  >
                    Templates
                  </a>
                  <a
                    href="#pricing"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="hover:text-white transition-colors py-2"
                  >
                    Pricing
                  </a>
                </nav>
              </div>

              <div className="border-t border-white/5 pt-6 flex flex-col gap-3">
                {userName ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <span className="h-9 w-9 rounded-full bg-white/10 text-white border border-brand-border flex items-center justify-center font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                      <span className="font-sans text-sm font-bold text-white">{userName}</span>
                    </div>
                    {onViewDashboard && (
                      <button
                        onClick={() => {
                          setMobileDrawerOpen(false);
                          onViewDashboard();
                        }}
                        className="w-full py-3 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all text-center shadow-lg cursor-pointer"
                      >
                        Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setMobileDrawerOpen(false);
                        onLogout?.();
                      }}
                      className="w-full text-center py-2 text-xs font-bold text-brand-muted hover:text-white transition-colors cursor-pointer"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="w-full py-3 text-center rounded-full border border-white/10 hover:border-white/20 text-white font-sans text-xs font-bold transition-colors cursor-pointer block"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="w-full py-3 text-center rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer block"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 font-sans">
      <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="px-4 py-2.5 rounded-xl border border-brand-border bg-white/5 text-white outline-none font-sans text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all"
      />
    </div>
  );
}

function AuthPopover({
  mode,
  onModeChange,
  onAuth,
  onClose,
  isCentered,
}: {
  mode: Exclude<AuthMode, null>;
  onModeChange: (mode: AuthMode) => void;
  onAuth: (name: string) => void;
  onClose: () => void;
  isCentered?: boolean;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    const supabase = createClient();
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim() || email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        onAuth(name.trim() || email.split("@")[0] || "Creator");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onAuth(
          data.user?.user_metadata?.full_name ||
            email.split("@")[0] ||
            "Creator"
        );
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "Google Authentication failed");
    }
  };

  const handleGithubAuth = async () => {
    setErrorMsg("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "GitHub Authentication failed");
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-brand-bg/80 backdrop-blur-sm ${
          isCentered ? "block" : "block md:hidden"
        }`}
        onClick={onClose}
      />
      <motion.div
        initial={
          isCentered
            ? { opacity: 0, scale: 0.95 }
            : { opacity: 0, y: 100 }
        }
        animate={
          isCentered
            ? { opacity: 1, scale: 1 }
            : { opacity: 1, y: 0 }
        }
        exit={
          isCentered
            ? { opacity: 0, scale: 0.95 }
            : { opacity: 0, y: 100 }
        }
        transition={{ type: "spring", damping: 25, stiffness: 220 }}
        className={`z-50 bg-[#0E131F] border border-brand-border p-6 shadow-2xl flex flex-col gap-4 font-sans ${
          isCentered
            ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 rounded-[20px]"
            : "fixed bottom-0 left-0 right-0 w-full rounded-t-[24px] border-x-0 border-b-0 pb-[calc(1.5rem+env(safe-area-inset-bottom,16px))] md:absolute md:bottom-auto md:left-auto md:right-0 md:top-12 md:w-80 md:rounded-[20px] md:border"
        }`}
      >
        {/* iOS style Pull Handle for mobile bottom sheet */}
        {!isCentered && (
          <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mb-2 md:hidden" />
        )}

        <div className="flex justify-between items-center border-b border-brand-border pb-3">
          <h3 className="font-sans text-base font-bold text-white">
            {mode === "signup" ? "Create Account" : "Welcome Back"}
          </h3>
          <button
            className="text-brand-muted hover:text-white cursor-pointer text-lg leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleGoogleAuth}
            className="w-full flex items-center justify-center py-2 border border-brand-border rounded-xl font-sans text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
          
          <button
            onClick={handleGithubAuth}
            className="w-full flex items-center justify-center py-2 border border-brand-border rounded-xl font-sans text-xs font-semibold text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-[1px] flex-1 bg-brand-border" />
          <span className="text-[10px] text-brand-muted uppercase">or</span>
          <div className="h-[1px] flex-1 bg-brand-border" />
        </div>

        <form onSubmit={submit} className="flex flex-col gap-3.5">
          {mode === "signup" && (
            <LabeledInput
              label="Full Name"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={setName}
            />
          )}
          <LabeledInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            type="email"
          />
          <LabeledInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            type="password"
          />

          {errorMsg && <p className="text-[10px] text-red-400">{errorMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all shadow-[0_0_15px_rgba(124,58,237,0.3)] cursor-pointer"
          >
            {loading
              ? "Authenticating..."
              : mode === "signup"
              ? "Sign up"
              : "Log in"}
          </button>
        </form>

        <p className="text-[10px] text-brand-muted text-center pt-2">
          {mode === "signup" ? "Already have an account?" : "New to PageNest?"}{" "}
          <button
            className="text-brand-purple font-bold hover:underline cursor-pointer"
            onClick={() => onModeChange(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </>
  );
}
