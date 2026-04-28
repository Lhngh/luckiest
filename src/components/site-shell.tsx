"use client";

import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { useEditorSession } from "@/app/providers";
import { SoftNav } from "@/components/soft-nav";

export function SiteShell({ children }: PropsWithChildren) {
  const { session } = useEditorSession();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={isHome ? "relative min-h-screen overflow-hidden" : "relative min-h-screen pb-32"}>
      <div className={isHome ? "mx-auto w-full max-w-7xl px-3 py-3 sm:px-6 sm:py-5 lg:px-10" : "mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8"}>
        {!isHome && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm text-starlight/70 backdrop-blur-sm">
            <p>一起把日子写成星光</p>
            <p>{session?.canEdit ? `正在以 ${session.name} 身份编辑` : "当前为只读浏览模式"}</p>
          </div>
        )}
        {children}
      </div>
      <SoftNav />
    </div>
  );
}
