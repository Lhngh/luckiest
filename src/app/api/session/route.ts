import { NextResponse } from "next/server";
import { EDITOR_COOKIE, encodeSession, getSessionFromCookies, verifyEditor } from "@/lib/auth";
import { viewerMeta } from "@/lib/constants";
import type { ViewerKey } from "@/lib/types";

export async function GET() {
  return NextResponse.json(getSessionFromCookies());
}

export async function POST(request: Request) {
  const { viewer, token } = (await request.json()) as { viewer?: string; token?: string };
  if (!verifyEditor(viewer, token)) {
    return new NextResponse("链接无效或已失效", { status: 401 });
  }

  const nextViewer = viewer as ViewerKey;
  const response = NextResponse.json({
    viewer: nextViewer,
    name: viewerMeta[nextViewer].name,
    canEdit: true,
  });
  response.cookies.set(EDITOR_COOKIE, encodeSession(nextViewer, token as string), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
