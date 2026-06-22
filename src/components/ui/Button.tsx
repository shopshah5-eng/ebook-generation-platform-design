import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-sans font-bold tracking-tight rounded-full transition-all active:scale-98 select-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        {
          "bg-brand-purple text-white hover:bg-brand-purple/90 shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)]":
            variant === "primary",
          "bg-white/5 border border-brand-border text-white hover:bg-white/10":
            variant === "secondary",
          "bg-transparent border border-brand-border hover:border-brand-purple/60 text-white hover:text-brand-purple":
            variant === "outline",
          "bg-transparent text-brand-muted hover:text-white":
            variant === "ghost",
          "px-4 py-2 text-xs": size === "sm",
          "px-6 py-3 text-sm": size === "md",
          "px-8 py-4 text-base": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
