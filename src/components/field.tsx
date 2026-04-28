import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function FieldLabel({ children }: { children: string }) {
  return <label className="mb-2 block text-sm text-[#7b668f]">{children}</label>;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
          "w-full rounded-[22px] border border-white/55 bg-white/45 px-4 py-3 text-sm text-[#5f4e73] outline-none transition",
          "placeholder:text-[#9f88b6] focus:border-rose/70 focus:bg-white/60",
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
          "min-h-28 w-full rounded-[24px] border border-white/55 bg-white/45 px-4 py-3 text-sm text-[#5f4e73] outline-none transition",
          "placeholder:text-[#9f88b6] focus:border-rose/70 focus:bg-white/60",
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
          "w-full rounded-[22px] border border-white/55 bg-white/55 px-4 py-3 text-sm text-[#5f4e73] outline-none transition",
          "focus:border-rose/70",
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
          "rounded-full border border-[#f5bfd5]/70 bg-[linear-gradient(180deg,rgba(255,245,249,0.88),rgba(250,214,231,0.78))] px-5 py-3 text-sm font-medium text-[#6d587f] transition duration-300",
          "hover:scale-[1.02] hover:border-[#f2aac8] hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-50",
        props.className,
      )}
    />
  );
}
