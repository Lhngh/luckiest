"use client";

import { useMemo, useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { apiFetch } from "@/lib/api";
import type { Wish } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export function WishClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<Wish>("wishes", "wishes");
  const [content, setContent] = useState("");

  const pending = useMemo(() => data.filter((item) => !item.is_completed), [data]);
  const completed = useMemo(() => data.filter((item) => item.is_completed), [data]);

  async function createWish() {
    if (!content) return;
    await apiFetch("/api/data/wishes", { method: "POST", body: JSON.stringify({ content, is_completed: false, completed_at: null }) });
    setContent("");
    await refresh();
  }

  async function toggleWish(item: Wish) {
    await apiFetch(`/api/data/wishes/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        is_completed: !item.is_completed,
        completed_at: item.is_completed ? null : new Date().toISOString(),
        content: item.content,
      }),
    });
    await refresh();
  }

  async function remove(id: string) {
    await apiFetch(`/api/data/wishes/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">心愿清单</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把未来的温柔一件件存起来</h1>
      </div>

      <PaperCard>
        <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">新增心愿</p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <FieldLabel>想一起完成的事</FieldLabel>
            <Input value={content} disabled={!session?.canEdit} placeholder="比如一起在秋天去看银杏" onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="sm:pt-8">
            <Button disabled={!session?.canEdit} onClick={createWish}>写下一个心愿</Button>
          </div>
        </div>
      </PaperCard>

      <div className="grid gap-6 xl:grid-cols-2">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">待完成心愿</p>
          <div className="mt-4 space-y-4">
            {!pending.length ? <EmptyState /> : null}
            {pending.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                <p className="text-sm leading-7 text-starlight/80">{item.content}</p>
                {session?.canEdit ? (
                  <div className="mt-4 flex gap-3">
                    <Button onClick={() => toggleWish(item)}>勾选完成</Button>
                    <Button className="bg-white/8" onClick={() => remove(item.id)}>删除</Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </PaperCard>

        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">已完成心愿</p>
          <div className="mt-4 space-y-4">
            {!completed.length ? <EmptyState /> : null}
            {completed.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                <p className="text-sm leading-7 text-starlight/80">{item.content}</p>
                <p className="mt-2 text-xs text-glow">完成于 {formatDateTime(item.completed_at)}</p>
                {session?.canEdit ? (
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-white/8" onClick={() => toggleWish(item)}>恢复待完成</Button>
                    <Button className="bg-rose-300/10 text-rose-100" onClick={() => remove(item.id)}>删除</Button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  );
}
