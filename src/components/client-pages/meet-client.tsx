"use client";

import { useMemo, useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input, Select, Textarea } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { meetStatuses } from "@/lib/constants";
import { apiFetch } from "@/lib/api";
import type { MeetPlan } from "@/lib/types";
import { formatDate, toInputDate } from "@/lib/utils";

const initialForm = { next_date: "", location: "", role: "", status: "待确认", note: "" };

export function MeetClient() {
  const { session } = useEditorSession();
  const { data, loading, error, refresh } = useCollection<MeetPlan>("meet_plans", "meet_plans");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const upcoming = useMemo(() => data.find((item) => item.status !== "已完成"), [data]);
  const history = useMemo(() => data.filter((item) => item.status === "已完成"), [data]);
  const completedCount = history.length;
  const treeCount = 5 + completedCount;

  async function handleSubmit() {
    if (!form.next_date || !form.location || !form.role) return;
    setSubmitting(true);
    try {
      const payload = { ...form, note: form.note || null };
      if (editingId) {
        await apiFetch(`/api/data/meet_plans/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
      } else {
        await apiFetch("/api/data/meet_plans", { method: "POST", body: JSON.stringify(payload) });
      }
      setForm(initialForm);
      setEditingId(null);
      await refresh();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await apiFetch(`/api/data/meet_plans/${id}`, { method: "DELETE" });
    await refresh();
  }

  async function handleComplete(item: MeetPlan) {
    await apiFetch(`/api/data/meet_plans/${item.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        next_date: toInputDate(item.next_date),
        location: item.location,
        role: item.role,
        status: "已完成",
        note: item.note ?? null,
      }),
    });
    await refresh();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">见面计划</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把想见面的日子轻轻记下</h1>
      </div>

      <PaperCard>
        <p className="text-sm leading-8 text-starlight/78">
          把下次见面定下来，也把已经拥有过的时光留在月色里。
        </p>
      </PaperCard>

      <PaperCard className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[24px] border border-white/16 bg-white/8 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">累计见面</p>
          <p className="mt-2 font-display text-3xl text-starlight">{completedCount} 次</p>
          <p className="mt-1 text-xs text-starlight/60">已完成的见面会持久化在数据库里</p>
        </div>
        <div className="rounded-[24px] border border-white/16 bg-white/8 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">星球树木</p>
          <p className="mt-2 font-display text-3xl text-starlight">{treeCount} 棵</p>
          <p className="mt-1 text-xs text-starlight/60">规则：起始 5 棵，每完成一次见面多 1 棵</p>
        </div>
      </PaperCard>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">新增计划</p>
          <div className="mt-4 grid gap-4">
            <div>
              <FieldLabel>日期</FieldLabel>
              <Input type="date" value={form.next_date} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, next_date: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>地点</FieldLabel>
              <Input placeholder="想去的城市或约会地点" value={form.location} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>安排</FieldLabel>
              <Input placeholder="这次由谁来安排或确认" value={form.role} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>状态</FieldLabel>
              <Select value={form.status} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}>
                {meetStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Select>
            </div>
            <div>
              <FieldLabel>小记</FieldLabel>
              <Textarea placeholder="比如想一起吃的店、要去的路、想拍的合照位" value={form.note} disabled={!session?.canEdit} onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button disabled={!session?.canEdit || submitting} onClick={handleSubmit}>{editingId ? "保存修改" : "新增计划"}</Button>
              {editingId ? <Button className="bg-white/8" onClick={() => { setEditingId(null); setForm(initialForm); }}>取消编辑</Button> : null}
            </div>
          </div>
        </PaperCard>

        <div className="space-y-6">
          <PaperCard>
            <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">下次见面</p>
            {upcoming ? (
              <div className="mt-4 space-y-2 text-starlight/80">
                <h2 className="font-display text-3xl text-starlight">{formatDate(upcoming.next_date)}</h2>
                <p>{upcoming.location} · {upcoming.role}</p>
                <p>状态：{upcoming.status}</p>
                {upcoming.note ? <p className="text-sm leading-7 text-starlight/72">{upcoming.note}</p> : null}
              </div>
            ) : (
              <EmptyState />
            )}
          </PaperCard>

          <PaperCard>
            <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">过往见面记录</p>
            <div className="mt-4 space-y-4">
              {loading ? <p className="text-sm text-starlight/70">正在轻轻翻看旅程...</p> : null}
              {error ? <p className="text-sm text-rose-200">{error}</p> : null}
              {!data.length ? <EmptyState /> : null}
              {data.map((item) => (
                <div key={item.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl text-starlight">{formatDate(item.next_date)}</p>
                      <p className="text-sm text-starlight/70">{item.location} · {item.role}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-starlight/75">{item.status}</span>
                  </div>
                  {item.note ? <p className="mt-3 text-sm leading-7 text-starlight/76">{item.note}</p> : null}
                  {session?.canEdit ? (
                    <div className="mt-4 flex flex-wrap gap-3">
                      {item.status !== "已完成" ? (
                        <Button onClick={() => handleComplete(item)}>标记为已完成</Button>
                      ) : null}
                      <Button className="bg-white/8" onClick={() => { setEditingId(item.id); setForm({ next_date: toInputDate(item.next_date), location: item.location, role: item.role, status: item.status, note: item.note ?? "" }); }}>编辑</Button>
                      <Button className="bg-rose-300/10 text-rose-100" onClick={() => handleDelete(item.id)}>删除</Button>
                    </div>
                  ) : null}
                </div>
              ))}
              {!history.length && data.length > 0 ? <p className="text-sm text-starlight/65">等这次旅程结束，这里会亮起新的回忆。</p> : null}
            </div>
          </PaperCard>
        </div>
      </div>
    </div>
  );
}
