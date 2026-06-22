"use client";

interface CoverEditorPanelProps {
  page: any;
  ebook: any;
  onChange: (field: any, value: any) => void;
}

export default function CoverEditorPanel({ page, ebook, onChange }: CoverEditorPanelProps) {
  // Predefined gorgeous palettes for Cover
  const palettes = [
    { name: "Obsidian", from: "#070B14", to: "#1E1B4B", color: "#F3F4F6", text: "Obsidian Dark" },
    { name: "Royal Purple", from: "#4C1D95", to: "#7C3AED", color: "#FFFFFF", text: "Royal Gradient" },
    { name: "Sage", from: "#14532D", to: "#ECFDF5", color: "#14532D", text: "Green Meadow" },
    { name: "Champagne", from: "#78350F", to: "#FEF3C7", color: "#78350F", text: "Gold Champagne" },
    { name: "Crimson", from: "#7F1D1D", to: "#FEE2E2", color: "#7F1D1D", text: "Rose Velvet" },
    { name: "Deep Ocean", from: "#0F172A", to: "#0EA5E9", color: "#FFFFFF", text: "Ocean Splash" },
  ];

  // Predefined premium fonts
  const fonts = [
    { id: "sans", name: "Inter (Sans)" },
    { id: "serif", name: "Merriweather (Serif)" },
    { id: "mono", name: "Courier Prime (Mono)" },
    { id: "outfit", name: "Outfit (Modern)" },
    { id: "syne", name: "Syne (Expressive)" },
  ];

  // Predefined cover images presets
  const coverImages = [
    { url: "https://images.pexels.com/photos/19907129/pexels-photo-19907129.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Business Stage" },
    { url: "https://images.pexels.com/photos/2099266/pexels-photo-2099266.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Open Journal" },
    { url: "https://images.pexels.com/photos/8400596/pexels-photo-8400596.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Creator Studio" },
    { url: "https://images.pexels.com/photos/3184311/pexels-photo-3184311.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Office Workspace" },
    { url: "https://images.pexels.com/photos/4386442/pexels-photo-4386442.jpeg?auto=compress&cs=tinysrgb&w=800", label: "Compound Graph" },
  ];

  const handlePaletteSelect = (palette: typeof palettes[0]) => {
    onChange("bgTheme", palette.name.toLowerCase().replace(" ", "-"));
    onChange("coverPalette", {
      from: palette.from,
      to: palette.to,
      color: palette.color,
      name: palette.name,
    });
  };

  const currentPalette = page.coverPalette || {
    from: "#070B14",
    to: "#1E1B4B",
    color: "#F3F4F6",
    name: "Obsidian",
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] text-brand-purple font-extrabold uppercase tracking-wider">
          COVER EDITOR MODE
        </span>
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Customize Book Jacket
        </h4>
      </div>

      <div className="h-px bg-white/5" />

      {/* Book Metadata */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
            Book Title
          </label>
          <input
            type="text"
            value={page.title || ebook.title || ""}
            onChange={(e) => onChange("title", e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
            placeholder="Ebook Title"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
            Subtitle / Description
          </label>
          <textarea
            value={page.subtitle || ""}
            onChange={(e) => onChange("subtitle", e.target.value)}
            rows={2}
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs resize-none font-sans"
            placeholder="Enter subtitle details..."
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
            Author
          </label>
          <input
            type="text"
            value={page.author || ebook.author || ""}
            onChange={(e) => onChange("author", e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
            placeholder="Author name"
          />
        </div>
      </div>

      {/* Palette Selectors */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
          Color Palette Preset
        </label>
        <div className="grid grid-cols-2 gap-2">
          {palettes.map((p) => {
            const isSelected = currentPalette.name === p.name;
            return (
              <button
                key={p.name}
                onClick={() => handlePaletteSelect(p)}
                className={`p-2.5 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                  isSelected ? "border-brand-purple bg-brand-purple/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[10px] font-bold text-white truncate">{p.name}</span>
                  <span className="text-[8px] text-brand-muted truncate">{p.text}</span>
                </div>
                <div className="flex items-center -space-x-1 shrink-0 ml-1">
                  <div className="h-4.5 w-3.5 rounded-l" style={{ backgroundColor: p.from }} />
                  <div className="h-4.5 w-3.5 rounded-r" style={{ backgroundColor: p.to }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fonts selectors */}
      <div className="flex flex-col gap-2">
        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
          Cover Typography
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fonts.map((f) => {
            const isSelected = (page.fontFamily || "sans") === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onChange("fontFamily", f.id)}
                className={`py-2 px-3 rounded-xl border text-[10.5px] font-bold transition-all text-left cursor-pointer ${
                  isSelected ? "bg-brand-purple/20 border-brand-purple text-white" : "bg-white/5 border-white/5 text-brand-muted hover:text-white"
                }`}
              >
                {f.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Graphic System */}
      <div className="flex flex-col gap-2.5">
        <label className="text-[9px] text-brand-muted uppercase font-bold tracking-wider">
          Background Image Overlay
        </label>
        <div className="flex flex-col gap-2">
          {coverImages.map((img) => {
            const isSelected = page.image === img.url;
            return (
              <button
                key={img.label}
                onClick={() => onChange("image", isSelected ? null : img.url)}
                className={`p-2 rounded-xl border flex items-center gap-3 transition-all text-left cursor-pointer ${
                  isSelected ? "border-brand-purple bg-brand-purple/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.label}
                  className="w-10 h-10 object-cover rounded-lg border border-white/10 shrink-0"
                />
                <div className="flex flex-col gap-0.5 overflow-hidden">
                  <span className="text-[10px] font-bold text-white">{img.label}</span>
                  <span className="text-[8px] text-brand-muted">Click to {isSelected ? "remove" : "apply"}</span>
                </div>
              </button>
            );
          })}

          <div className="h-px bg-white/5 my-1" />

          {/* Custom Image URL input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[8px] text-brand-muted uppercase tracking-wider">
              Custom Image URL
            </label>
            <input
              type="text"
              value={page.image || ""}
              onChange={(e) => onChange("image", e.target.value || null)}
              className="px-4 py-2 rounded-xl border border-white/5 bg-white/5 text-white outline-none focus:border-brand-purple/60 text-xs font-sans"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
