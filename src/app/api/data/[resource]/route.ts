import { NextResponse } from "next/server";
import { isResourceName, pickMutableFields, resourceConfig } from "@/lib/data-config";
import { requireEditorSession } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(_: Request, { params }: { params: { resource: string } }) {
  if (!isResourceName(params.resource)) {
    return new NextResponse("未找到资源", { status: 404 });
  }

  const config = resourceConfig[params.resource];
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from(config.table)
    .select("*")
    .order(config.orderBy, { ascending: config.ascending ?? false });

  if (error) {
    return new NextResponse(error.message, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request, { params }: { params: { resource: string } }) {
  if (!isResourceName(params.resource)) {
    return new NextResponse("未找到资源", { status: 404 });
  }

  const config = resourceConfig[params.resource];
  if (!config.allowCreate) {
    return new NextResponse("当前资源不支持新增", { status: 405 });
  }

  try {
    const session = requireEditorSession();
    const payload = pickMutableFields((await request.json()) as Record<string, unknown>, config.mutableFields);
    const nextPayload = config.enrichCreate ? config.enrichCreate(payload, session) : payload;
    const supabase = createServiceClient();
    const { data, error } = await supabase.from(config.table).insert(nextPayload).select("*").single();

    if (error) {
      return new NextResponse(error.message, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : "无权限操作", { status: 401 });
  }
}
