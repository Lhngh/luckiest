"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SoftNav() {
  const pathname = usePathname();
  const homeSideItems = navItems.filter((item) => item.href !== "/");

  if (pathname === "/") {
    const leftItems = homeSideItems.slice(0, 3);
    const rightItems = homeSideItems.slice(3);

    return (
      <nav className="pointer-events-none fixed inset-y-0 left-0 right-0 z-50 flex items-center justify-between px-2 sm:px-4 lg:px-8">
        <ul className="pointer-events-auto flex flex-col gap-3">
          {leftItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-14 w-12 items-center justify-center rounded-[26px] border border-white/45 bg-[rgba(255,247,252,0.72)] px-3 py-3 text-starlight shadow-paper backdrop-blur-md transition hover:scale-[1.03] hover:bg-white/85 sm:min-h-16 sm:w-[78px] sm:flex-col sm:gap-1.5"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden text-[11px] tracking-[0.18em] sm:block">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="pointer-events-auto flex flex-col gap-3">
          {rightItems.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex min-h-14 w-12 items-center justify-center rounded-[26px] border border-white/45 bg-[rgba(255,247,252,0.72)] px-3 py-3 text-starlight shadow-paper backdrop-blur-md transition hover:scale-[1.03] hover:bg-white/85 sm:min-h-16 sm:w-[78px] sm:flex-col sm:gap-1.5"
              >
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden text-[11px] tracking-[0.18em] sm:block">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[min(94vw,720px)] -translate-x-1/2 rounded-full border border-white/45 bg-[rgba(255,247,252,0.68)] p-2 shadow-paper backdrop-blur-md">
      <ul className="grid grid-cols-6 gap-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] text-[#7a648f] transition",
                  active ? "bg-[linear-gradient(180deg,rgba(255,248,252,0.96),rgba(249,216,233,0.9))] text-[#6a547f] shadow-glow" : "hover:bg-white/50 hover:text-[#6a547f]",
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
