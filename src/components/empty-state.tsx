export function EmptyState({ text = "还没记录，把我们的故事写在这里吧" }: { text?: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-white/20 bg-white/5 px-5 py-8 text-center text-sm text-starlight/70">
      {text}
    </div>
  );
}
