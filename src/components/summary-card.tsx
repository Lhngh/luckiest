import { PaperCard } from "@/components/paper-card";

interface SummaryCardProps {
  eyebrow: string;
  title: string;
  description: string;
  highlight?: string;
}

export function SummaryCard({ eyebrow, title, description, highlight }: SummaryCardProps) {
  return (
    <PaperCard className="h-full min-h-40">
      <p className="text-xs uppercase tracking-[0.32em] text-starlight/55">{eyebrow}</p>
      <h3 className="mt-3 font-display text-3xl text-starlight">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-starlight/76">{description}</p>
      {highlight ? <p className="mt-4 text-sm text-glow">{highlight}</p> : null}
    </PaperCard>
  );
}
