import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "shared-album";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = requireEditorSession();
    const { storage_path: storagePath, caption, taken_at: takenAt } = (await request.json()) as {
      storage_path?: string;
      caption?: string;
      taken_at?: string;
    };

    if (!storagePath || !storagePath.startsWith(`${session.viewer}/`)) {
      return new NextResponse("照片路径无效", { status: 400 });
    }

    const supabase = createServiceClient();
    const { data: publicData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    const { data, error } = await supabase
      .from("album_photos")
      .insert({
        image_url: publicData.publicUrl,
        storage_path: storagePath,
        caption: caption?.trim() || null,
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
