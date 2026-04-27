import type { EditorSession } from "@/lib/types";

type ResourceName =
  | "meet_plans"
  | "book_plans"
  | "book_notes"
  | "enjoy_plans"
  | "messages"
  | "wishes"
  | "profiles";

interface ResourceConfig {
  table: ResourceName;
  orderBy: string;
  ascending?: boolean;
  mutableFields: string[];
  allowCreate: boolean;
  allowPatch: boolean;
  allowDelete: boolean;
  enrichCreate?: (payload: Record<string, unknown>, session: EditorSession) => Record<string, unknown>;
  canDelete?: (record: Record<string, unknown>, session: EditorSession) => boolean;
}

export const resourceConfig: Record<ResourceName, ResourceConfig> = {
  profiles: {
    table: "profiles",
    orderBy: "created_at",
    ascending: true,
    mutableFields: [],
    allowCreate: false,
    allowPatch: false,
    allowDelete: false,
  },
  meet_plans: {
    table: "meet_plans",
    orderBy: "next_date",
    ascending: true,
    mutableFields: ["next_date", "location", "role", "status", "note"],
    allowCreate: true,
    allowPatch: true,
    allowDelete: true,
  },
  book_plans: {
    table: "book_plans",
    orderBy: "start_date",
    ascending: false,
    mutableFields: ["title", "cover_url", "start_date", "end_date", "status"],
    allowCreate: true,
    allowPatch: true,
    allowDelete: true,
  },
  book_notes: {
    table: "book_notes",
    orderBy: "created_at",
    ascending: false,
    mutableFields: ["book_id", "content", "page"],
    allowCreate: true,
    allowPatch: false,
    allowDelete: true,
    enrichCreate: (payload, session) => ({ ...payload, user_id: session.viewer }),
  },
  enjoy_plans: {
    table: "enjoy_plans",
    orderBy: "date",
    ascending: false,
    mutableFields: ["title", "type", "date", "review", "rating"],
    allowCreate: true,
    allowPatch: true,
    allowDelete: true,
  },
  messages: {
    table: "messages",
    orderBy: "created_at",
    ascending: false,
    mutableFields: ["content", "mood"],
    allowCreate: true,
    allowPatch: false,
    allowDelete: true,
    enrichCreate: (payload, session) => ({ ...payload, user_id: session.viewer }),
    canDelete: (record, session) => record.user_id === session.viewer,
  },
  wishes: {
    table: "wishes",
    orderBy: "created_at",
    ascending: false,
    mutableFields: ["content", "is_completed", "completed_at"],
    allowCreate: true,
    allowPatch: true,
    allowDelete: true,
  },
};

export function isResourceName(value: string): value is ResourceName {
  return value in resourceConfig;
}

export function pickMutableFields(payload: Record<string, unknown>, allowed: string[]) {
  return Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));
}
