import { Container } from "../ui/Container";

export function Footer() {
  return (
    <footer className="w-full border-t border-brand-border bg-brand-bg py-16 px-6 lg:px-16 text-white font-sans">
      <Container className="!px-0">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
            <a href="#top" className="flex items-center gap-2 self-start">
              <span className="h-9 w-9 rounded-lg bg-brand-purple text-white flex items-center justify-center font-sans text-lg font-bold shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                P
              </span>
              <span className="font-sans text-xl font-bold tracking-tight text-white">
                PageNest
              </span>
            </a>
            <p className="text-xs text-brand-muted max-w-xs leading-relaxed">
              PageNest is an AI-powered publishing suite for creators, marketers, and SaaS founders. Write, design, and export professional ebooks in minutes.
            </p>
          </div>

          {/* Links Cols */}
          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Product</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-muted">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#templates" className="hover:text-white transition-colors">Templates</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Resources</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-muted">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Design Guides</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ebook Strategy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Company</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-muted">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press Room</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2 flex flex-col gap-4">
            <h4 className="text-[10px] font-bold text-brand-muted uppercase tracking-widest">Legal</h4>
            <ul className="flex flex-col gap-2.5 text-xs text-brand-muted">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SLA</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-brand-border/40 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-brand-muted uppercase tracking-wider">
            &copy; {new Date().getFullYear()} PageNest Inc. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-brand-muted">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
