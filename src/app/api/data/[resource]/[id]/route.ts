import { NextResponse } from "next/server";
import { isResourceName, pickMutableFields, resourceConfig } from "@/lib/data-config";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, { params }: { params: { resource: string; id: string } }) {
  if (!isResourceName(params.resource)) {
    return new NextResponse("未找到资源", { status: 404 });
  }

  const config = resourceConfig[params.resource];
  if (!config.allowPatch) {
    return new NextResponse("当前资源不支持修改", { status: 405 });
  }

  try {
    requireEditorSession();
    const payload = pickMutableFields((await request.json()) as Record<string, unknown>, config.mutableFields);
    const supabase = createServiceClient();
    const { data, error } = await supabase.from(config.table).update(payload).eq("id", params.id).select("*").single();

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}

export async function DELETE(_: Request, { params }: { params: { resource: string; id: string } }) {
  if (!isResourceName(params.resource)) {
    return new NextResponse("未找到资源", { status: 404 });
  }

  const config = resourceConfig[params.resource];
  if (!config.allowDelete) {
    return new NextResponse("当前资源不支持删除", { status: 405 });
  }

  try {
    const session = requireEditorSession();
    const supabase = createServiceClient();

    if (config.canDelete) {
      const { data: record, error: queryError } = await supabase.from(config.table).select("*").eq("id", params.id).single();
      if (queryError) {
        return new NextResponse(queryError.message, { status: 500 });
      }
      if (!config.canDelete(record as Record<string, unknown>, session)) {
        return new NextResponse("只能删除自己的内容", { status: 403 });
      }
    }

    const { error } = await supabase.from(config.table).delete().eq("id", params.id);
    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}
