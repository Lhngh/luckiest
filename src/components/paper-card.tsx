import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface PaperCardProps extends PropsWithChildren {
  className?: string;
}

export function PaperCard({ className, children }: PaperCardProps) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-white/25 bg-paper p-5 shadow-paper backdrop-blur-sm",
        "relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)] before:opacity-70 before:content-['']",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}
