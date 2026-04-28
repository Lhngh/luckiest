import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";

interface PaperCardProps extends PropsWithChildren {
  className?: string;
}

export function PaperCard({ className, children }: PaperCardProps) {
  return (
    <section
      className={cn(
        "rounded-[30px] border border-white/40 bg-paper p-5 shadow-paper backdrop-blur-md",
        "relative overflow-hidden bg-[rgba(255,255,255,0.26)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.34),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0.05))] before:opacity-90 before:content-['']",
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </section>
  );
}
