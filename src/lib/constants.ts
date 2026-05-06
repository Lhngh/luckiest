import { BookOpen, Dices, HeartHandshake, Home, MessageCircleHeart, Sparkles, Stars } from "lucide-react";
import type { ViewerKey } from "@/lib/types";

export const viewerMeta: Record<ViewerKey, { name: string; whisper: string }> = {
  xing: { name: "糕糕", whisper: "把想念写成温柔的路标" },
  yue: { name: "汉堡", whisper: "让月光替你轻轻回应" },
};

export const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/meet", label: "见面", icon: HeartHandshake },
  { href: "/remote", label: "异地", icon: Dices },
  { href: "/book", label: "共读", icon: BookOpen },
  { href: "/enjoy", label: "共赏", icon: Stars },
  { href: "/message", label: "留言", icon: MessageCircleHeart },
  { href: "/wish", label: "心愿", icon: Sparkles },
];

export const meetStatuses = ["待确认", "已确认", "已完成"] as const;
export const bookStatuses = ["计划中", "进行中", "已归档"] as const;
export const enjoyTypes = ["音乐剧", "音乐会", "文艺电影", "治愈动画"] as const;
export const moods = ["☆", "月", "花", "心"] as const;
