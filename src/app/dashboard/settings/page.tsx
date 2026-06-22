"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useRouter } from "next/navigation";
import { SettingsPanel } from "../../../components/sections/SettingsPanel";

export default function SettingsRoute() {
  const router = useRouter();
  const [name, setName] = useState("Creator");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    const loadSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setName(user.user_metadata?.full_name || user.email?.split("@")[0] || "Creator");
        setEmail(user.email || "");
      }
      setLoading(false);
    };
    loadSession();
  }, []);

  const handleProfileUpdate = (data: { name: string; email: string }) => {
    setName(data.name);
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to permanently delete your account? This will erase all your generated ebooks. This action is irreversible.")) {
      const supabase = createClient();
      try {
        // Log out user
        await supabase.auth.signOut();
        router.push("/");
        alert("Account deletion request processed.");
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
      </div>
    );
  }

  return (
    <div className="py-2">
      <SettingsPanel
        userName={name}
        userEmail={email}
        onUpdate={handleProfileUpdate}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}
