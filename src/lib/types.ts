export type ViewerKey = "xing" | "yue";

export interface Profile {
  id: ViewerKey;
  name: string;
  avatar: string | null;
  created_at: string;
}

export interface MeetPlan {
  id: string;
  next_date: string;
  location: string;
  role: string;
  status: "待确认" | "已确认" | "已完成";
  note: string | null;
  created_at: string;
}

export interface BookPlan {
  id: string;
  title: string;
  cover_url: string | null;
  start_date: string;
  end_date: string;
  status: "计划中" | "进行中" | "已归档";
  created_at: string;
}

export interface BookNote {
  id: string;
  book_id: string;
  user_id: ViewerKey;
  content: string;
  page: number | null;
  created_at: string;
}

export interface EnjoyPlan {
  id: string;
  title: string;
  type: string;
  date: string;
  review: string | null;
  rating: number | null;
  created_at: string;
}

export interface MessageItem {
  id: string;
  user_id: ViewerKey;
  content: string;
  mood: string | null;
  created_at: string;
}

export interface Wish {
  id: string;
  content: string;
  is_completed: boolean;
  completed_at: string | null;
  created_at: string;
}

export interface LongDistanceIdea {
  id: string;
  content: string;
  created_at: string;
}

export interface EditorSession {
  viewer: ViewerKey;
  name: string;
  canEdit: boolean;
}
