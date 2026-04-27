import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date?: string | null, pattern = "yyyy.MM.dd") {
  if (!date) return "未设定";
  return format(new Date(date), pattern, { locale: zhCN });
}

export function formatDateTime(date?: string | null) {
  if (!date) return "未设定";
  return format(new Date(date), "yyyy.MM.dd HH:mm", { locale: zhCN });
}

export function toInputDate(date?: string | null) {
  if (!date) return "";
  return format(new Date(date), "yyyy-MM-dd");
}

export function countdownParts(target?: string | null) {
  if (!target) {
    return { days: "--", hours: "--", minutes: "--" };
  }

  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) {
    return { days: "00", hours: "00", minutes: "00" };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
  };
}
