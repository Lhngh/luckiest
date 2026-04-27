import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FieldLabel({ children }: { children: string }) {
  return <label className="mb-2 block text-sm text-starlight/80">{children}</label>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-[22px] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition",
        "placeholder:text-starlight/45 focus:border-glow/60 focus:bg-white/14",
        props.className,
      )}
    />
  );
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "min-h-28 w-full rounded-[24px] border border-white/20 bg-white/10 px-4 py-3 text-sm text-white outline-none transition",
        "placeholder:text-starlight/45 focus:border-glow/60 focus:bg-white/14",
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "w-full rounded-[22px] border border-white/20 bg-[#23365f] px-4 py-3 text-sm text-white outline-none transition",
        "focus:border-glow/60",
        props.className,
      )}
    />
  );
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "rounded-full border border-[#ffe5aa]/35 bg-[#ffe5aa]/16 px-5 py-3 text-sm font-medium text-starlight transition duration-300",
        "hover:scale-[1.02] hover:bg-[#ffe5aa]/24 hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    />
  );
}
