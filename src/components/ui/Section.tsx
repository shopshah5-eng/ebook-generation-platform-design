import { ReactNode } from "react";
import { cn } from "../../utils/cn";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export function Section({ children, id, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-24 relative overflow-hidden", className)}
    >
      {children}
    </section>
  );
}
