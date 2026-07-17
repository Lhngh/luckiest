import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "shared-album";

export const runtime = "nodejs";

function getExtension(fileName?: string, contentType?: string) {
  const fromName = fileName?.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  return contentType?.split("/").pop() || "jpg";
}

export async function POST(request: Request) {
  try {
    const session = requireEditorSession();
    const { file_name: fileName, content_type: contentType } = (await request.json()) as {
      file_name?: string;
      content_type?: string;
    };

    if (!contentType?.startsWith("image/")) {
      return new NextResponse("只能上传图片文件", { status: 400 });
    }

    const supabase = createServiceClient();
    const extension = getExtension(fileName, contentType);
    const storagePath = `${session.viewer}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUploadUrl(storagePath);

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({
      path: data.path,
      token: data.token,
    });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}
