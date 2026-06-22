"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase/client";

interface SettingsPanelProps {
  userName: string;
  userEmail: string;
  onUpdate?: (data: { name: string; email: string }) => void;
  onDeleteAccount: () => void;
}

export function SettingsPanel({ userName, userEmail, onUpdate, onDeleteAccount }: SettingsPanelProps) {
  const [name, setName] = useState(userName);
  const email = userEmail;
  const [savingProfile, setSavingProfile] = useState(false);

  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Preference States
  const [darkMode, setDarkMode] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name },
      });
      if (error) throw error;
      if (onUpdate) {
        onUpdate({ name, email });
      }
      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setUpdatingPassword(true);
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      alert("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err.message || "Failed to update password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl font-sans text-white px-1 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">Account Settings</h1>
        <p className="text-[11px] sm:text-xs text-brand-muted mt-2 font-medium">
          Manage your personal identity, login password, and workspace preferences.
        </p>
      </div>
 
      {/* Profile settings card */}
      <div className="glass p-5 sm:p-6 rounded-[20px] shadow-2xl relative overflow-hidden">
        <h3 className="font-black text-xs text-brand-muted uppercase tracking-widest mb-5">
          Profile Information
        </h3>
        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5 relative z-10">
          {/* Avatar Row */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-5">
            <div className="h-12 w-12 rounded-full bg-brand-purple/15 border border-brand-purple/25 flex items-center justify-center font-black text-lg text-brand-purple shadow-md">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">Profile Photo</p>
              <button
                type="button"
                onClick={() => alert("Upload avatar integration coming soon...")}
                className="text-[9px] text-[#a78bfa] hover:text-white hover:underline font-extrabold uppercase tracking-widest mt-1.5 cursor-pointer block text-left transition-colors min-h-[30px]"
              >
                Upload New Image
              </button>
            </div>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-black tracking-widest">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full min-h-[44px] px-4 rounded-[12px] border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] transition-all focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
 
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-black tracking-widest">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                disabled
                className="w-full min-h-[44px] px-4 rounded-[12px] border border-white/5 bg-white/5 text-brand-muted outline-none text-xs cursor-not-allowed opacity-60"
              />
            </div>
          </div>
 
          <button
            type="submit"
            disabled={savingProfile}
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-md shadow-brand-purple/20 sm:self-end cursor-pointer uppercase tracking-wider transition-all mt-2 active:scale-95 duration-200 flex items-center justify-center"
          >
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
 
      {/* Password security card */}
      <div className="glass p-5 sm:p-6 rounded-[20px] shadow-2xl">
        <h3 className="font-black text-xs text-brand-muted uppercase tracking-widest mb-5">
          Security & Password
        </h3>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-brand-muted uppercase font-black tracking-widest">
              Current Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full min-h-[44px] px-4 rounded-[12px] border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] transition-all focus:ring-1 focus:ring-brand-purple/20"
            />
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-black tracking-widest">
                New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-[12px] border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] transition-all focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
 
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-black tracking-widest">
                Confirm New Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full min-h-[44px] px-4 rounded-[12px] border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs focus:bg-white/[0.08] transition-all focus:ring-1 focus:ring-brand-purple/20"
              />
            </div>
          </div>
 
          <button
            type="submit"
            disabled={updatingPassword || !newPassword}
            className="w-full sm:w-auto min-h-[44px] px-6 rounded-full bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-xs shadow-md shadow-brand-purple/20 sm:self-end cursor-pointer uppercase tracking-wider transition-all mt-2 disabled:opacity-40 active:scale-95 duration-200 flex items-center justify-center"
          >
            {updatingPassword ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
 
      {/* Preferences card */}
      <div className="glass p-5 sm:p-6 rounded-[20px] shadow-2xl flex flex-col gap-5">
        <h3 className="font-black text-xs text-brand-muted uppercase tracking-widest">
          Workspace Preferences
        </h3>
        
        {/* Toggle switches list */}
        <div className="flex flex-col gap-4">
          {/* Dark Mode Switch */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="pr-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Force Dark Theme</p>
              <p className="text-[10px] text-brand-muted mt-1 leading-normal font-medium">Use low-contrast obsidian layers and dark glows.</p>
            </div>
            
            {/* Styled custom toggle wrapped in a 48x48px target */}
            <div className="min-h-[44px] flex items-center justify-center -mr-3 shrink-0">
              <button
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="w-12 h-12 flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Toggle dark theme"
              >
                <div
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 ${
                    darkMode ? "bg-brand-purple" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`h-4.5 w-4.5 rounded-full bg-white shadow-md transform duration-300 ${
                      darkMode ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
 
          {/* Notifications Switch */}
          <div className="flex items-center justify-between">
            <div className="pr-4">
              <p className="text-xs font-bold text-white uppercase tracking-wider">Email Generation Alerts</p>
              <p className="text-[10px] text-brand-muted mt-1 leading-normal font-medium">Receive digests and finished outline structure alerts.</p>
            </div>
            
            {/* Styled custom toggle wrapped in a 48x48px target */}
            <div className="min-h-[44px] flex items-center justify-center -mr-3 shrink-0">
              <button
                type="button"
                onClick={() => setEmailNotifications(!emailNotifications)}
                className="w-12 h-12 flex items-center justify-center focus:outline-none cursor-pointer"
                aria-label="Toggle email notifications"
              >
                <div
                  className={`w-10 h-5.5 rounded-full p-0.5 transition-colors duration-300 ${
                    emailNotifications ? "bg-brand-purple" : "bg-white/10"
                  }`}
                >
                  <div
                    className={`h-4.5 w-4.5 rounded-full bg-white shadow-md transform duration-300 ${
                      emailNotifications ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
 
      {/* Account Deletion Danger Zone */}
      <div className="glass p-5 sm:p-6 border-red-500/10 bg-red-500/[0.01] rounded-[20px] border shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xs font-black text-red-400 uppercase tracking-widest">Danger Zone</h3>
        </div>
        <p className="text-[10px] sm:text-[11px] text-brand-muted leading-relaxed font-medium">
          Permanently delete your account and remove all generated ebooks and covers. This operation cannot be reversed.
        </p>
        <button
          onClick={onDeleteAccount}
          className="w-full sm:w-auto min-h-[44px] px-5 rounded-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 font-bold text-[10px] uppercase tracking-wider mt-4 cursor-pointer transition-all active:scale-95 duration-200 flex items-center justify-center"
        >
          Permanently Delete Account
        </button>
      </div>
    </div>
  );
}
