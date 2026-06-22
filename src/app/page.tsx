"use client";

import { useState, useEffect } from "react";
import { createClient } from "../lib/supabase/client";

// Import layout components
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AppLayout } from "@/components/layout/AppLayout";
import { Container } from "@/components/ui/Container";

// Import landing sections
import { Hero } from "@/components/sections/Hero";
import { SocialProof } from "@/components/sections/SocialProof";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Showcase } from "@/components/sections/Showcase";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Features } from "@/components/sections/Features";
import { Templates } from "@/components/sections/Templates";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";

// Import dashboard views
import { DashboardHome } from "@/components/sections/DashboardHome";
import CreationWizard from "@/components/wizard/CreationWizard";
import EditorWorkspace from "@/components/editor/EditorWorkspace";
import { BillingPanel } from "@/components/sections/BillingPanel";
import { SettingsPanel } from "@/components/sections/SettingsPanel";
import FirstUserOnboarding from "@/components/wizard/FirstUserOnboarding";
import ActivationChecklist from "@/components/layout/ActivationChecklist";
import PaywallModal from "@/components/ui/PaywallModal";

export type ViewState = "landing" | "dashboard" | "billing" | "settings" | "ebooks" | "templates" | "onboarding";

export default function Home() {
  const [view, setView] = useState<ViewState>("landing");
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);

  // Subscription and Paywall states
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallReason] = useState("");
  
  // User profile states
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");

  // Ebooks list
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [selectedEbook, setSelectedEbook] = useState<any>(null);
  const [wizardActive, setWizardActive] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");

  // Load user session and ebooks list
  useEffect(() => {
    const supabase = createClient();

    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        setUserEmail(user.email || "");
        setUserId(user.id);
        setView("dashboard");
        loadEbooks(user.id);
      }
    };

    checkSession();
  }, []);

  const loadEbooks = async (uid: string) => {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from("ebooks")
        .select("*")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Map database schema "content" to "pages"
      const mapped = (data || []).map((b) => ({
        id: b.id,
        title: b.title,
        author: (b as any).author || "Creator",
        theme: b.template_name || "Startup",
        pages: Array.isArray(b.content) ? b.content : [],
        created_at: b.created_at,
      }));
      
      setEbooks(mapped);

      // Trigger onboarding for brand new users
      if (mapped.length === 0) {
        setView("onboarding");
      }
    } catch (err) {
      console.error("Failed to load ebooks:", err);
    }
  };

  const handleAuthSuccess = (name: string) => {
    setUserName(name);
    setAuthMode(null);
    setView("dashboard");
    
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || "");
        setUserId(user.id);
        loadEbooks(user.id);
      }
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUserName("");
    setUserEmail("");
    setUserId("");
    setEbooks([]);
    setView("landing");
  };

  // Ebook CRUD Actions
  const handleGenerate = async (wizardData: {
    prompt: string;
    author: string;
    pageCount: number;
    style: string;
    audience: string;
  }) => {
    setWizardActive(false);

    try {
      const response = await fetch("/api/generate-ebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: wizardData.prompt,
          templateName: wizardData.style,
          author: wizardData.author,
          pageCount: wizardData.pageCount,
        }),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || "Failed to generate ebook");
      }

      // Refresh list
      await loadEbooks(userId);

      // Open new book in Editor
      const generatedTemplate = {
        id: responseData.ebookId,
        title: responseData.title,
        author: wizardData.author,
        theme: responseData.theme || wizardData.style,
        pages: responseData.pages || [],
      };

      setSelectedEbook(generatedTemplate);
    } catch (err: any) {
      alert(err.message || "An error occurred while generating the ebook.");
    }
  };

  const handleSaveEbook = async (updatedBook: any) => {
    // Set edit milestone on save action
    try {
      localStorage.setItem("pagenest_checklist_edit", "true");
    } catch {}

    const supabase = createClient();
    try {
      const { error } = await supabase
        .from("ebooks")
        .update({
          title: updatedBook.title,
          content: updatedBook.pages,
        })
        .eq("id", updatedBook.id);

      if (error) throw error;
      
      // Update local state
      setEbooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    } catch (err) {
      console.error("Failed to save ebook to Supabase:", err);
    }
  };

  const handleDuplicate = async (bookId: string) => {
    const bookToDuplicate = ebooks.find((b) => b.id === bookId);
    if (!bookToDuplicate) return;

    const supabase = createClient();
    try {
      const newId = crypto.randomUUID();
      const { error } = await supabase
        .from("ebooks")
        .insert({
          id: newId,
          user_id: userId,
          title: `${bookToDuplicate.title} (Copy)`,
          template_name: bookToDuplicate.theme,
          content: bookToDuplicate.pages,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      await loadEbooks(userId);
      alert("Ebook duplicated successfully!");
    } catch (err) {
      console.error("Duplicate failed:", err);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to permanently delete this ebook?")) return;

    const supabase = createClient();
    try {
      const { error } = await supabase.from("ebooks").delete().eq("id", bookId);
      if (error) throw error;
      setEbooks((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleExport = (book: any, format: string) => {
    alert(`Initiating ${format} export generator pipeline for "${book.title}"`);
  };

  const handleSettingsUpdate = (data: { name: string; email: string }) => {
    setUserName(data.name);
    setUserEmail(data.email);
  };

  const handleDeleteAccount = async () => {
    alert("Account deletion request logged. Redirecting to auth center.");
    handleLogout();
  };

  const handleCreateNewEbook = () => {
    // TODO: Restore subscription gating limit checks here later
    /*
    if (planId === "plan_free" && ebooks.length >= 1) {
      setPaywallReason("Free accounts are limited to 1 ebook creation. Upgrade to Pro to create up to 50 ebooks with priority generation.");
      setPaywallOpen(true);
      return;
    }
    if (planId === "plan_pro" && ebooks.length >= 50) {
      setPaywallReason("Pro accounts are limited to 50 ebooks. Upgrade to Agency for unlimited creations, brand kits, and workspaces.");
      setPaywallOpen(true);
      return;
    }
    */

    if (ebooks.length === 0) {
      setView("onboarding");
    } else {
      setWizardActive(true);
    }
  };

  // View routing stage
  if (selectedEbook) {
    return (
      <EditorWorkspace
        ebook={selectedEbook}
        onClose={() => {
          setSelectedEbook(null);
          loadEbooks(userId);
        }}
        onSave={handleSaveEbook}
      />
    );
  }

  // Onboarding full-screen experience
  if (view === "onboarding") {
    return (
      <FirstUserOnboarding
        userName={userName}
        onComplete={async (generatedBook) => {
          setSelectedEbook(generatedBook);
          setView("dashboard");
          await loadEbooks(userId);
        }}
        onClose={() => {
          setView("dashboard");
        }}
      />
    );
  }

  // Render Dashboard Stage Layout if view is app-centric
  if (view !== "landing") {
    return (
      <>
        <AppLayout
          activeView={view}
          onViewChange={(v) => {
            setView(v as ViewState);
            if (v === "templates") {
              try {
                localStorage.setItem("pagenest_checklist_templates", "true");
              } catch {}
            }
          }}
          userName={userName}
          onLogout={handleLogout}
          onCreateTrigger={handleCreateNewEbook}
        >
          {view === "dashboard" && (
            <DashboardHome
              userName={userName}
              ebooks={ebooks}
              onCreateTrigger={handleCreateNewEbook}
              onEdit={setSelectedEbook}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          )}
          {view === "ebooks" && (
            <DashboardHome
              userName={userName}
              ebooks={ebooks}
              onCreateTrigger={handleCreateNewEbook}
              onEdit={setSelectedEbook}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onExport={handleExport}
            />
          )}
          {view === "templates" && (
            <div className="flex flex-col gap-6">
              <h2 className="text-xl font-bold text-white">Ebook Theme Library</h2>
              <Templates onSelectTemplate={(tpl) => {
                // TODO: Restore premium template gating check here later
                /*
                const isPremium = ["Startup", "Finance", "Marketing", "Business"].includes(tpl.theme);
                if (planId === "plan_free" && isPremium) {
                  setPaywallReason(`The "${tpl.title}" template is a premium feature. Upgrade to Pro to access our entire library of layouts.`);
                  setPaywallOpen(true);
                  return;
                }
                */
                setSelectedEbook({
                  id: crypto.randomUUID(),
                  title: `My ${tpl.title}`,
                  author: userName,
                  theme: tpl.theme,
                  pages: [
                    { type: "cover", title: `My ${tpl.title}`, subtitle: "First Edition" }
                  ],
                });
              }} />
            </div>
          )}
          {view === "billing" && (
            <BillingPanel ebookCount={ebooks.length} />
          )}
          {view === "settings" && (
            <SettingsPanel
              userName={userName}
              userEmail={userEmail}
              onUpdate={handleSettingsUpdate}
              onDeleteAccount={handleDeleteAccount}
            />
          )}

          {wizardActive && (
            <CreationWizard
              onClose={() => setWizardActive(false)}
              onGenerate={handleGenerate}
              userName={userName}
            />
          )}
        </AppLayout>
        <ActivationChecklist />
        <PaywallModal
          isOpen={paywallOpen}
          onClose={() => setPaywallOpen(false)}
          reason={paywallReason}
        />
      </>
    );
  }

  // Otherwise render standard Landing Page
  return (
    <main className="pn-app-shell bg-brand-bg min-h-screen">
      <Navbar
        authMode={authMode}
        setAuthMode={setAuthMode}
        userName={userName}
        onAuth={handleAuthSuccess}
        onLogout={handleLogout}
        onViewDashboard={() => setView("dashboard")}
      />
      <Hero
        onCreate={() => setAuthMode("signup")}
      />
      <SocialProof />
      <HowItWorks />
      <Showcase />
      <BeforeAfter />
      <Features />
      <Templates onSelectTemplate={() => setAuthMode("signup")} />
      <Testimonials />
      <Pricing
        billing={billingPeriod}
        setBilling={setBillingPeriod}
        onStart={() => setAuthMode("signup")}
      />
      <FAQ />

      {/* SECTION 10 — FINAL CTA */}
      <section className="py-24 bg-[#070B14] px-6 lg:px-16 border-t border-b border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-brand-purple/10 blur-[120px] pointer-events-none" />
        <Container className="!px-0 relative z-10 flex flex-col items-center gap-6 max-w-xl">
          <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
            Ready To Publish Your First Ebook?
          </h2>
          <p className="text-brand-muted text-sm max-w-md leading-relaxed">
            Generate, edit and export professional ebooks in minutes. Start creating and scaling your digital audience today.
          </p>
          <button
            onClick={() => setAuthMode("signup")}
            className="px-8 py-4 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-sans text-sm font-bold transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center justify-center gap-2 group cursor-pointer mt-4"
          >
            <span>Start Creating Free</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </Container>
      </section>

      <Footer />
      <PaywallModal
        isOpen={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        reason={paywallReason}
      />
    </main>
  );
}
