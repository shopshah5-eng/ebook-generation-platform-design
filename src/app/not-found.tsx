import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070B14] text-white flex flex-col items-center justify-center font-sans px-6 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main glass box */}
      <div className="glass p-8 sm:p-12 rounded-[24px] max-w-md w-full text-center relative z-10 bg-white/[0.02] border border-white/5 shadow-2xl flex flex-col items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-brand-purple/15 border border-brand-purple/20 flex items-center justify-center font-black text-2xl text-brand-purple shadow-lg">
          404
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight uppercase">
            Page Not Found
          </h1>
          <p className="text-xs text-brand-muted leading-relaxed font-medium">
            The workspace or resource you are looking for does not exist, or has been moved to a new destination.
          </p>
        </div>

        <div className="h-[1px] bg-white/5 w-full" />

        <Link
          href="/"
          className="w-full min-h-[44px] px-6 rounded-full bg-brand-purple hover:bg-brand-purple/95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center transition-all cursor-pointer shadow-md shadow-brand-purple/20 active:scale-95 duration-200"
        >
          Return to Workspace
        </Link>
      </div>
    </div>
  );
}
