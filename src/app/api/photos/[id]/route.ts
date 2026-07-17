import { NextResponse } from "next/server";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

const BUCKET = "shared-album";

export const runtime = "nodejs";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = requireEditorSession();
    const supabase = createServiceClient();
    const { data: photo, error: queryError } = await supabase
      .from("album_photos")
      .select("*")
      .eq("id", params.id)
      .single();

    if (queryError) {
      return new NextResponse(queryError.message, { status: 500 });
    }

    if (photo.user_id !== session.viewer) {
      return new NextResponse("只能删除自己上传的照片", { status: 403 });
    }

    if (photo.storage_path) {
      const { error: storageError } = await supabase.storage.from(BUCKET).remove([photo.storage_path]);
      if (storageError) {
        return new NextResponse(storageError.message, { status: 500 });
      }
    }

    const { error } = await supabase.from("album_photos").delete().eq("id", params.id);
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}
