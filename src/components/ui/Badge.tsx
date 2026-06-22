import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold font-sans uppercase tracking-widest bg-brand-gold/15 text-brand-gold border border-brand-gold/20 select-none",
        className
      )}
    >
      {children}
    </span>
  );
}
