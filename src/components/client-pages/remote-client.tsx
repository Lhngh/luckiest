"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { apiFetch } from "@/lib/api";
import type { LongDistanceIdea } from "@/lib/types";

export function RemoteClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<LongDistanceIdea>("long_distance_ideas", "long_distance_ideas");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const currentIdea = useMemo(() => {
    if (!data.length) return null;
    return data.find((item) => item.id === currentId) ?? data[0];
  }, [currentId, data]);

  useEffect(() => {
    if (!data.length) {
      setCurrentId(null);
      return;
    }

    if (currentId && data.some((item) => item.id === currentId)) {
      return;
    }

    const randomItem = data[Math.floor(Math.random() * data.length)];
    setCurrentId(randomItem.id);
  }, [currentId, data]);

  function pickAnotherIdea() {
    if (!data.length) return;
    if (data.length === 1) {
      setCurrentId(data[0].id);
      return;
    }

    const candidates = data.filter((item) => item.id !== currentId);
    const nextItem = candidates[Math.floor(Math.random() * candidates.length)];
    setCurrentId(nextItem.id);
  }

  async function createIdea() {
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await apiFetch("/api/data/long_distance_ideas", {
        method: "POST",
        body: JSON.stringify({ content: content.trim() }),
      });
      setContent("");
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">异地随机小事</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">替今天抽一件远距离也能一起做的小事</h1>
      </div>

      <PaperCard>
        <p className="text-sm leading-8 text-starlight/78">
          这里不会展示全部候选池，只会随机掉落一件适合你们现在就去完成的小事。想换一个，就再抽一次。
        </p>
      </PaperCard>

      <PaperCard className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">今日随机任务</p>
        {currentIdea ? (
          <>
            <p className="mx-auto mt-6 max-w-2xl font-display text-3xl leading-[1.5] text-starlight sm:text-4xl">
              {currentIdea.content}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button onClick={pickAnotherIdea}>重新抽一个</Button>
              <span className="rounded-full border border-white/18 bg-white/10 px-4 py-3 text-xs text-starlight/70">
                候选池已收录 {data.length} 件
              </span>
            </div>
          </>
        ) : (
          <div className="mt-6">
            <EmptyState text="还没有候选小事，先新增几件异地也能一起做的小事，之后这里就能随机抽取了。" />
          </div>
        )}
      </PaperCard>

      {session?.canEdit ? (
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">新增候选小事</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
            <div>
              <FieldLabel>异地也能做的事</FieldLabel>
              <Input
                value={content}
                disabled={submitting}
                placeholder="比如一起开着视频，给对方点一杯今天想喝的东西"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Button disabled={submitting || !content.trim()} onClick={createIdea}>
              加入候选池
            </Button>
          </div>
        </PaperCard>
      ) : null}
    </div>
  );
}
