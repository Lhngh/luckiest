import { cookies } from "next/headers";
import type { EditorSession, ViewerKey } from "@/lib/types";
import { viewerMeta } from "@/lib/constants";

export const EDITOR_COOKIE = "xingyue-editor";

interface StoredSession {
  viewer: ViewerKey;
  token: string;
}

export function verifyEditor(viewer?: string | null, token?: string | null): viewer is ViewerKey {
  if (!viewer || !token) return false;
  if (viewer !== "xing" && viewer !== "yue") return false;
  const expected = viewer === "xing" ? process.env.LOVE_APP_ACCESS_XING : process.env.LOVE_APP_ACCESS_YUE;
  return Boolean(expected && token === expected);
}

export function encodeSession(viewer: ViewerKey, token: string) {
  return Buffer.from(JSON.stringify({ viewer, token } satisfies StoredSession)).toString("base64url");
}

export function decodeSession(raw?: string): StoredSession | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as StoredSession;
    return verifyEditor(parsed.viewer, parsed.token) ? parsed : null;
  } catch {
    return null;
  }
}

export function getSessionFromCookies(): EditorSession | null {
  const stored = decodeSession(cookies().get(EDITOR_COOKIE)?.value);
  if (!stored) return null;
  return {
    viewer: stored.viewer,
    name: viewerMeta[stored.viewer].name,
    canEdit: true,
  };
}

export function requireEditorSession() {
  const session = getSessionFromCookies();
  if (!session?.canEdit) {
    throw new Error("仅限专属双人链接可编辑");
  }
  return session;
}
