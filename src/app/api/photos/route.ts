import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "shared-album";
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export const runtime = "nodejs";

function getExtension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName;
  return file.type.split("/").pop() || "jpg";
}

export async function POST(request: Request) {
  try {
    const session = requireEditorSession();
    const formData = await request.formData();
    const file = formData.get("file");
    const caption = String(formData.get("caption") ?? "").trim();
    const takenAt = String(formData.get("taken_at") ?? "").trim();

    if (!(file instanceof File)) {
      return new NextResponse("请选择要上传的照片", { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return new NextResponse("只能上传图片文件", { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return new NextResponse("单张照片不能超过 4MB", { status: 400 });
    }

    const supabase = createServiceClient();
    const extension = getExtension(file);
    const storagePath = `${session.viewer}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      return new NextResponse(uploadError.message, { status: 500 });
    }

    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const { data, error } = await supabase
      .from("album_photos")
      .insert({
        image_url: publicData.publicUrl,
        storage_path: storagePath,
        caption: caption || null,
        taken_at: takenAt || null,
        user_id: session.viewer,
      })
      .select("*")
      .single();

    if (error) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}
