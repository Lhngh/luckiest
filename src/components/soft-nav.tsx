"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SoftNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(94vw,720px)] -translate-x-1/2 rounded-full border border-white/20 bg-[#112142]/88 p-2 shadow-paper backdrop-blur-md">
      <ul className="grid grid-cols-6 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] text-starlight/70 transition",
                  active ? "bg-white/14 text-starlight shadow-glow" : "hover:bg-white/10 hover:text-starlight",
                )}
              >
                <Icon className="mb-1 h-4 w-4" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
