"use client";

import { useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Select, Textarea } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { apiFetch } from "@/lib/api";
import { moods, viewerMeta } from "@/lib/constants";
import type { MessageItem } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function MessageClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<MessageItem>("messages", "messages");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("☆");

  async function submit() {
    if (!content) return;
    await apiFetch("/api/data/messages", { method: "POST", body: JSON.stringify({ content, mood }) });
    setContent("");
    await refresh();
  }

  async function remove(id: string) {
    await apiFetch(`/api/data/messages/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">双向留言板</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把想说的话轻轻放进夜色里</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">留下悄悄话</p>
          <div className="mt-4 grid gap-4">
            <div>
              <FieldLabel>小表情</FieldLabel>
              <Select value={mood} disabled={!session?.canEdit} onChange={(e) => setMood(e.target.value)}>
                {moods.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel>内容</FieldLabel>
              <Textarea value={content} disabled={!session?.canEdit} placeholder="记录想念，把今晚的情绪留在这里吧" onChange={(e) => setContent(e.target.value)} />
            </div>
            <Button disabled={!session?.canEdit} onClick={submit}>记录想念</Button>
          </div>
        </PaperCard>

        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">最新留言</p>
          <div className="mt-4 space-y-4">
            {!data.length ? <EmptyState /> : null}
            {data.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-starlight">
                    <span className="text-xl">{item.mood ?? "☆"}</span>
                    <span className="font-medium">{viewerMeta[item.user_id].name}</span>
                  </div>
                  <span className="text-xs text-starlight/60">{formatDateTime(item.created_at)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-starlight/80">{item.content}</p>
                {session?.canEdit && session.viewer === item.user_id ? (
                  <Button className="mt-4 bg-white/8" onClick={() => remove(item.id)}>删除我的留言</Button>
                ) : null}
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  );
}
