"use client";

import { Suspense, useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Container } from "@/components/ui/Container";

// Inner component that reads searchParams — must be wrapped in Suspense
function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectedFrom") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  // Auto-redirect if already authenticated
  useEffect(() => {
    const supabase = createClient();
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(redirectTo);
      } else {
        setCheckingSession(false);
      }
    };
    checkSession();
  }, [router, redirectTo]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();
    try {
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
      router.push(redirectTo);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Sign up failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setErrorMsg("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || `${provider} authentication failed.`);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center font-sans">
        <p className="text-xs text-brand-muted animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#070B14] text-white flex items-center justify-center px-6 relative overflow-hidden font-sans">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      <Container className="max-w-md w-full relative z-10 !px-0">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-4">
            <span className="h-9 w-9 rounded-lg bg-brand-purple text-white flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              P
            </span>
            <span className="font-bold text-xl tracking-tight text-white">PageNest</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white uppercase tracking-wider">Create Account</h1>
          <p className="text-xs text-brand-muted mt-1">Start generating professional publications free</p>
        </div>

        <div className="glass border border-white/5 rounded-[24px] p-6 md:p-8 shadow-2xl backdrop-blur-md bg-white/[0.02]">
          {/* OAuth Buttons */}
          <div className="flex flex-col gap-3.5 mb-6">
            <button
              onClick={() => handleOAuth("google")}
              className="w-full flex items-center justify-center py-3 border border-white/5 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" fill="none">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>
            <button
              onClick={() => handleOAuth("github")}
              className="w-full flex items-center justify-center py-3 border border-white/5 rounded-xl font-semibold text-xs text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5 mr-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              <span>Continue with GitHub</span>
            </button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] text-brand-muted uppercase">or sign up with email</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="px-4 py-3 rounded-xl border border-white/5 bg-white/5 text-white outline-none text-xs focus:border-brand-purple/60 focus:bg-white/[0.08] transition-all"
              />
            </div>

            {errorMsg && <p className="text-[10px] text-red-400 font-semibold">{errorMsg}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-xs font-bold transition-all rounded-full shadow-[0_0_15px_rgba(124,58,237,0.35)] cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-[10px] text-brand-muted text-center pt-6 mt-4 border-t border-white/5">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-purple font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </Container>
    </main>
  );
}

// Suspense boundary required by Next.js 15 for useSearchParams()
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#070B14] text-white flex items-center justify-center font-sans">
          <p className="text-xs text-brand-muted animate-pulse">Loading...</p>
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
