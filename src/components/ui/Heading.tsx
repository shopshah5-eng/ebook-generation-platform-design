import { ElementType, ReactNode } from "react";
import { cn } from "../../utils/cn";

interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  className?: string;
}

export function Heading({ level = 2, children, className }: HeadingProps) {
  const Tag = `h${level}` as ElementType;

  return (
    <Tag
      className={cn(
        "font-sans font-bold text-white tracking-tight leading-tight",
        {
          "text-4xl lg:text-6xl": level === 1,
          "text-3xl lg:text-5xl": level === 2,
          "text-2xl lg:text-4xl": level === 3,
          "text-xl lg:text-2xl": level === 4,
          "text-lg lg:text-xl": level === 5,
          "text-base lg:text-lg": level === 6,
        },
        className
      )}
    >
      {children}
    </Tag>
  );
}
