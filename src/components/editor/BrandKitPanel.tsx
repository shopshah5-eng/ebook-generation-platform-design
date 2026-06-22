"use client";

import { useState } from "react";

interface BrandKit {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}

interface BrandKitPanelProps {
  initialBrandKit?: BrandKit;
  onApply: (brandKit: BrandKit) => void;
}

export default function BrandKitPanel({ initialBrandKit, onApply }: BrandKitPanelProps) {
  const [logoUrl, setLogoUrl] = useState(initialBrandKit?.logoUrl || "");
  const [primaryColor, setPrimaryColor] = useState(initialBrandKit?.primaryColor || "#7C3AED");
  const [secondaryColor, setSecondaryColor] = useState(initialBrandKit?.secondaryColor || "#10B981");
  const [fontFamily, setFontFamily] = useState(initialBrandKit?.fontFamily || "sans");

  // Predefined gorgeous brand colors
  const brandColors = [
    "#7C3AED", // Violet
    "#EC4899", // Pink
    "#F59E0B", // Amber
    "#10B981", // Emerald
    "#3B82F6", // Blue
    "#EF4444", // Red
    "#6366F1", // Indigo
    "#14532D", // Sage Dark
    "#FEF3C7", // Gold Champagne
  ];

  const handleApply = () => {
    onApply({
      logoUrl: logoUrl || undefined,
      primaryColor,
      secondaryColor,
      fontFamily,
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">
          BRAND IDENTITY
        </span>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Workspace Brand Kit
        </h4>
      </div>

      <div className="h-px bg-white/5" />

      {/* Workspace Logo */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
          Brand Logo URL
        </label>
        <input
          type="text"
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
          placeholder="https://example.com/logo.png"
        />
        <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo Preview"
              className="h-8 max-w-[80px] object-contain border border-white/10 p-1 bg-white/5 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="h-8 w-8 border border-dashed border-white/10 rounded flex items-center justify-center text-[10px] text-brand-muted font-bold">
              ★
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">Logo Badge</span>
            <span className="text-[8px] text-brand-muted">Will overlay in page header spreads</span>
          </div>
        </div>
      </div>

      {/* Colors Selection */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
            Primary Accent Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent shrink-0"
            />
            <div className="grid grid-cols-6 gap-1 flex-1">
              {brandColors.slice(0, 6).map((c) => (
                <button
                  key={c}
                  onClick={() => setPrimaryColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                    primaryColor === c ? "border-white scale-110 shadow-lg" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
            Secondary Accent Color
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent shrink-0"
            />
            <div className="grid grid-cols-6 gap-1 flex-1">
              {brandColors.slice(3).map((c) => (
                <button
                  key={c}
                  onClick={() => setSecondaryColor(c)}
                  className={`w-6 h-6 rounded-full border transition-all cursor-pointer hover:scale-105 shrink-0 ${
                    secondaryColor === c ? "border-white scale-110 shadow-lg" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Default Font pairing */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
          Global Font Family
        </label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs cursor-pointer"
        >
          <option value="sans" className="bg-[#0E131F]">Inter (Sans Serif)</option>
          <option value="serif" className="bg-[#0E131F]">Merriweather (Serif)</option>
          <option value="mono" className="bg-[#0E131F]">Courier Prime (Mono)</option>
        </select>
      </div>

      <div className="h-px bg-white/5" />

      {/* Apply Button */}
      <button
        onClick={handleApply}
        className="w-full py-3.5 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all cursor-pointer"
      >
        Apply Brand Kit Globally
      </button>
    </div>
  );
}
