import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white/5 border border-brand-border rounded-[20px] p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-brand-purple/40 hover:bg-white/[0.07]",
        className
      )}
    >
      {children}
    </div>
  );
}
