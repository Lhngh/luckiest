"use client";

import { useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input, Select, Textarea } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { apiFetch } from "@/lib/api";
import { enjoyTypes } from "@/lib/constants";
import type { EnjoyPlan } from "@/lib/types";
import { formatDate, toInputDate } from "@/lib/utils";

const initialForm = { title: "", type: "音乐剧", date: "", review: "", rating: "" };

export function EnjoyClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<EnjoyPlan>("enjoy_plans", "enjoy_plans");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function saveEnjoy() {
    const payload = { ...form, review: form.review || null, rating: form.rating ? Number(form.rating) : null };
    if (editingId) {
      await apiFetch(`/api/data/enjoy_plans/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await apiFetch("/api/data/enjoy_plans", { method: "POST", body: JSON.stringify(payload) });
    }
    setForm(initialForm);
    setEditingId(null);
    await refresh();
  }

  async function remove(id: string) {
    await apiFetch(`/api/data/enjoy_plans/${id}`, { method: "DELETE" });
    await refresh();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">共赏计划</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把同一束灯光看成浪漫回声</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">新增共赏</p>
          <div className="mt-4 grid gap-4">
            <div>
              <FieldLabel>名称</FieldLabel>
              <Input value={form.title} disabled={!session?.canEdit} placeholder="音乐剧 / 电影 / 动画" onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>类型</FieldLabel>
              <Select value={form.type} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
                {enjoyTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel>时间</FieldLabel>
              <Input type="date" value={form.date} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>双人评分</FieldLabel>
              <Input value={form.rating} disabled={!session?.canEdit} placeholder="1-10" onChange={(e) => setForm((prev) => ({ ...prev, rating: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>观后感</FieldLabel>
              <Textarea value={form.review} disabled={!session?.canEdit} placeholder="留下些什么余韵" onChange={(e) => setForm((prev) => ({ ...prev, review: e.target.value }))} />
            </div>
            <Button disabled={!session?.canEdit} onClick={saveEnjoy}>{editingId ? "保存共赏" : "新增共赏项"}</Button>
          </div>
        </PaperCard>

        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">共赏记录</p>
          <div className="mt-4 space-y-4">
            {!data.length ? <EmptyState /> : null}
            {data.map((item) => (
              <div key={item.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-3xl text-starlight">{item.title}</h2>
                    <p className="text-sm text-starlight/72">{item.type} · {formatDate(item.date)}</p>
                  </div>
                  {item.rating ? <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-glow">{item.rating}/10</span> : null}
                </div>
                {item.review ? <p className="mt-3 text-sm leading-7 text-starlight/78">{item.review}</p> : null}
                {session?.canEdit ? (
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-white/8" onClick={() => { setEditingId(item.id); setForm({ title: item.title, type: item.type, date: toInputDate(item.date), review: item.review ?? "", rating: item.rating ? String(item.rating) : "" }); }}>编辑</Button>
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
