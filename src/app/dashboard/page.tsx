"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase/client";
import { DashboardHome } from "../../components/sections/DashboardHome";
import CreationWizard from "../../components/wizard/CreationWizard";
import GenerationProgress from "../../components/generation/GenerationProgress";
import EditorWorkspace from "../../components/editor/EditorWorkspace";

interface Ebook {
  id: string;
  title: string;
  author: string;
  theme: string;
  coverImage?: string;
  created_at?: string;
  pages: any[];
}

export default function DashboardHomeRoute() {
  const [userName, setUserName] = useState("Creator");
  const [userId, setUserId] = useState("");
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

  // Overlays
  const [wizardActive, setWizardActive] = useState(false);
  const [genProgressData, setGenProgressData] = useState<any | null>(null);
  const [editingEbook, setEditingEbook] = useState<Ebook | null>(null);

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator";
        setUserName(name.charAt(0).toUpperCase() + name.slice(1));
        setUserId(user.id);
        fetchEbooks();
      }
    };
    loadSession();
  }, []);

  const fetchEbooks = async () => {
    try {
      const res = await fetch("/api/ebooks");
      const data = await res.json();
      if (res.ok && data.ebooks) {
        const mapped = data.ebooks.map((b: any) => ({
          id: b.id,
          title: b.title,
          author: b.author || "Creator",
          theme: b.template_name || "Startup",
          pages: Array.isArray(b.content) ? b.content : [],
          created_at: b.created_at,
        }));
        setEbooks(mapped);
      }
    } catch (err) {
      console.error("Failed to load ebooks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = (wizardData: {
    prompt: string;
    author: string;
    pageCount: number;
    style: string;
    audience: string;
    tone: string;
    outline: any[];
  }) => {
    setWizardActive(false);
    setGenProgressData(wizardData);
  };

  const handleDuplicate = async (bookId: string) => {
    const book = ebooks.find((b) => b.id === bookId);
    if (!book) return;
    const supabase = createClient();
    try {
      const newId = crypto.randomUUID();
      const { error } = await supabase
        .from("ebooks")
        .insert({
          id: newId,
          user_id: userId,
          title: `${book.title} (Copy)`,
          template_name: book.theme,
          content: book.pages,
          created_at: new Date().toISOString(),
        });
      if (error) throw error;
      await fetchEbooks();
      alert("Ebook duplicated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (bookId: string) => {
    if (!confirm("Are you sure you want to permanently delete this ebook?")) return;
    try {
      const res = await fetch(`/api/ebooks/${bookId}`, { method: "DELETE" });
      if (res.ok) {
        setEbooks((prev) => prev.filter((b) => b.id !== bookId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEbook = async (updatedBook: Ebook) => {
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
      setEbooks((prev) => prev.map((b) => (b.id === updatedBook.id ? updatedBook : b)));
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const handleExport = (book: Ebook, type: string) => {
    // Show download prompt simulator
    alert(`Initiating download for "${book.title}" in ${type} format...`);
  };

  if (editingEbook) {
    return (
      <EditorWorkspace
        ebook={editingEbook}
        onClose={() => {
          setEditingEbook(null);
          fetchEbooks();
        }}
        onSave={handleSaveEbook}
      />
    );
  }

  return (
    <>
      {loading ? (
        <div className="flex flex-col gap-6 font-sans">
          <p className="text-xs text-brand-muted animate-pulse">Loading workspace...</p>
        </div>
      ) : (
        <DashboardHome
          userName={userName}
          ebooks={ebooks}
          onCreateTrigger={() => setWizardActive(true)}
          onEdit={(book) => setEditingEbook({ ...book, pages: book.pages || [] })}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onExport={(book, type) => handleExport({ ...book, pages: book.pages || [] }, type)}
        />
      )}

      {/* Creation Wizard Modal */}
      {wizardActive && (
        <CreationWizard
          onClose={() => setWizardActive(false)}
          onGenerate={handleGenerate}
          userName={userName}
        />
      )}

      {/* Generation Loader Screen Overlay */}
      {genProgressData && (
        <GenerationProgress
          topic={genProgressData.prompt}
          templateName={genProgressData.style}
          userName={userName}
          author={genProgressData.author}
          pageCount={genProgressData.pageCount}
          audience={genProgressData.audience}
          tone={genProgressData.tone}
          outline={genProgressData.outline}
          onComplete={(generatedBook) => {
            setGenProgressData(null);
            setEditingEbook(generatedBook);
            fetchEbooks();
          }}
          onClose={() => setGenProgressData(null)}
        />
      )}
    </>
  );
}
