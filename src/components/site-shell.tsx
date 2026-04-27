"use client";

import type { PropsWithChildren } from "react";
import { useEditorSession } from "@/app/providers";
import { SoftNav } from "@/components/soft-nav";

export function SiteShell({ children }: PropsWithChildren) {
  const { session } = useEditorSession();

  return (
    <div className="relative min-h-screen pb-32">
      <div className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4 rounded-full border border-white/15 bg-white/6 px-5 py-3 text-sm text-starlight/70 backdrop-blur-sm">
          <p>京沪相隔，共赴星月</p>
          <p>{session?.canEdit ? `正在以 ${session.name} 身份编辑` : "当前为只读浏览模式"}</p>
        </div>
        {children}
      </div>
      <SoftNav />
    </div>
  );
}
