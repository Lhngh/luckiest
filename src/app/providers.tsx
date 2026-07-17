"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import type { EditorSession } from "@/lib/types";

interface SessionContextValue {
  session: EditorSession | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  loading: true,
  refreshSession: async () => undefined,
});

export function AppProviders({ children }: PropsWithChildren) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<EditorSession | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const data = await apiFetch<EditorSession | null>("/api/session");
      setSession(data);
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const viewer = searchParams.get("viewer");
    const token = searchParams.get("token");

    if (!viewer || !token) {
      void refreshSession();
      return;
    }

    const boot = async () => {
      try {
        const data = await apiFetch<EditorSession>("/api/session", {
          method: "POST",
          body: JSON.stringify({ viewer, token }),
        });
        setSession(data);
      } finally {
        setLoading(false);
        const nextParams = new URLSearchParams(searchParams.toString());
        nextParams.delete("viewer");
        nextParams.delete("token");
        const query = nextParams.toString();
        router.replace(query ? `${pathname}?${query}` : pathname);
      }
    };

    void boot();
  }, [pathname, refreshSession, router, searchParams]);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/service-worker.js").then((registration) => registration.update());

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type !== "SW_UPDATED") return;
      if (sessionStorage.getItem("sw-reloaded") === "1") return;
      sessionStorage.setItem("sw-reloaded", "1");
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener("message", handleMessage);
    return () => navigator.serviceWorker.removeEventListener("message", handleMessage);
  }, []);

  const value = useMemo(
    () => ({ session, loading, refreshSession }),
    [loading, refreshSession, session],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useEditorSession() {
  return useContext(SessionContext);
}
