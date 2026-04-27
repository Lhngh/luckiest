/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input, Select, Textarea } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { apiFetch } from "@/lib/api";
import { bookStatuses, viewerMeta } from "@/lib/constants";
import type { BookNote, BookPlan } from "@/lib/types";
import { formatDate, formatDateTime, toInputDate } from "@/lib/utils";

const initialBook = { title: "", cover_url: "", start_date: "", end_date: "", status: "进行中" };
const initialNote = { book_id: "", content: "", page: "" };

export function BookClient() {
  const { session } = useEditorSession();
  const { data: books, refresh: refreshBooks } = useCollection<BookPlan>("book_plans", "book_plans");
  const { data: notes, refresh: refreshNotes } = useCollection<BookNote>("book_notes", "book_notes");
  const [bookForm, setBookForm] = useState(initialBook);
  const [noteForm, setNoteForm] = useState(initialNote);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentBook = useMemo(() => books.find((item) => item.status !== "已归档") ?? books[0], [books]);
  const archivedBooks = useMemo(() => books.filter((item) => item.status === "已归档"), [books]);
  const currentNotes = useMemo(
    () => notes.filter((item) => item.book_id === (noteForm.book_id || currentBook?.id)),
    [currentBook?.id, noteForm.book_id, notes],
  );

  async function saveBook() {
    const payload = { ...bookForm, cover_url: bookForm.cover_url || null };
    if (editingId) {
      await apiFetch(`/api/data/book_plans/${editingId}`, { method: "PATCH", body: JSON.stringify(payload) });
    } else {
      await apiFetch("/api/data/book_plans", { method: "POST", body: JSON.stringify(payload) });
    }
    setBookForm(initialBook);
    setEditingId(null);
    await refreshBooks();
  }

  async function deleteBook(id: string) {
    await apiFetch(`/api/data/book_plans/${id}`, { method: "DELETE" });
    await refreshBooks();
  }

  async function saveNote() {
    const bookId = noteForm.book_id || currentBook?.id;
    if (!bookId || !noteForm.content) return;
    await apiFetch("/api/data/book_notes", {
      method: "POST",
      body: JSON.stringify({ book_id: bookId, content: noteForm.content, page: noteForm.page ? Number(noteForm.page) : null }),
    });
    setNoteForm((prev) => ({ ...prev, content: "", page: "" }));
    await refreshNotes();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">共读计划</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把同一本书读成两份心意</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">月度共读</p>
          <div className="mt-4 grid gap-4">
            <div>
              <FieldLabel>书名</FieldLabel>
              <Input value={bookForm.title} disabled={!session?.canEdit} placeholder="比如《小王子》" onChange={(e) => setBookForm((prev) => ({ ...prev, title: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>封面链接</FieldLabel>
              <Input value={bookForm.cover_url} disabled={!session?.canEdit} placeholder="https://..." onChange={(e) => setBookForm((prev) => ({ ...prev, cover_url: e.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>开始日期</FieldLabel>
                <Input type="date" value={bookForm.start_date} disabled={!session?.canEdit} onChange={(e) => setBookForm((prev) => ({ ...prev, start_date: e.target.value }))} />
              </div>
              <div>
                <FieldLabel>结束日期</FieldLabel>
                <Input type="date" value={bookForm.end_date} disabled={!session?.canEdit} onChange={(e) => setBookForm((prev) => ({ ...prev, end_date: e.target.value }))} />
              </div>
            </div>
            <div>
              <FieldLabel>状态</FieldLabel>
              <Select value={bookForm.status} disabled={!session?.canEdit} onChange={(e) => setBookForm((prev) => ({ ...prev, status: e.target.value }))}>
                {bookStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </Select>
            </div>
            <div className="flex gap-3">
              <Button disabled={!session?.canEdit} onClick={saveBook}>{editingId ? "保存书单" : "新增书籍"}</Button>
              {editingId ? <Button className="bg-white/8" onClick={() => { setEditingId(null); setBookForm(initialBook); }}>取消</Button> : null}
            </div>
          </div>
        </PaperCard>

        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">正在共读</p>
          {currentBook ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-[112px_1fr]">
              <div className="overflow-hidden rounded-[24px] border border-white/16 bg-white/8">
                {currentBook.cover_url ? (
                  <img src={currentBook.cover_url} alt={currentBook.title} className="h-full min-h-[160px] w-full object-cover" />
                ) : (
                  <div className="flex h-full min-h-[160px] items-center justify-center text-sm text-starlight/60">等待封面</div>
                )}
              </div>
              <div className="space-y-3">
                <h2 className="font-display text-3xl text-starlight">{currentBook.title}</h2>
                <p className="text-sm text-starlight/74">{formatDate(currentBook.start_date)} - {formatDate(currentBook.end_date)}</p>
                <p className="text-sm text-starlight/74">状态：{currentBook.status}</p>
                {session?.canEdit ? (
                  <div className="flex gap-3">
                    <Button
                      className="bg-white/8"
                      onClick={() => {
                        setBookForm({
                          title: currentBook.title,
                          cover_url: currentBook.cover_url ?? "",
                          start_date: toInputDate(currentBook.start_date),
                          end_date: toInputDate(currentBook.end_date),
                          status: currentBook.status,
                        });
                        setEditingId(currentBook.id);
                      }}
                    >
                      编辑
                    </Button>
                    <Button className="bg-rose-300/10 text-rose-100" onClick={() => deleteBook(currentBook.id)}>删除</Button>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-4"><EmptyState /></div>
          )}
        </PaperCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">写下心得</p>
          <div className="mt-4 grid gap-4">
            <div>
              <FieldLabel>归属书籍</FieldLabel>
              <Select value={noteForm.book_id || currentBook?.id || ""} disabled={!session?.canEdit} onChange={(e) => setNoteForm((prev) => ({ ...prev, book_id: e.target.value }))}>
                <option value="">选择一本共读书</option>
                {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
              </Select>
            </div>
            <div>
              <FieldLabel>页码</FieldLabel>
              <Input value={noteForm.page} disabled={!session?.canEdit} placeholder="例如 128" onChange={(e) => setNoteForm((prev) => ({ ...prev, page: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>摘抄或读后感</FieldLabel>
              <Textarea value={noteForm.content} disabled={!session?.canEdit} placeholder="写下触动你的一句话" onChange={(e) => setNoteForm((prev) => ({ ...prev, content: e.target.value }))} />
            </div>
            <Button disabled={!session?.canEdit} onClick={saveNote}>写下心得</Button>
          </div>
        </PaperCard>

        <PaperCard>
          <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">读书记录</p>
          <div className="mt-4 space-y-4">
            {!currentNotes.length ? <EmptyState /> : null}
            {currentNotes.map((note) => (
              <div key={note.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
                <div className="flex items-center justify-between gap-3 text-sm text-starlight/66">
                  <span>{viewerMeta[note.user_id].name}</span>
                  <span>{formatDateTime(note.created_at)}</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-starlight/82">{note.content}</p>
                <p className="mt-2 text-xs text-glow">{note.page ? `页码：${note.page}` : "未标注页码"}</p>
              </div>
            ))}
          </div>
        </PaperCard>
      </div>

      <PaperCard>
        <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">已读书单</p>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {!archivedBooks.length ? <EmptyState /> : null}
          {archivedBooks.map((book) => (
            <div key={book.id} className="rounded-[24px] border border-white/16 bg-white/8 p-4">
              <h3 className="font-display text-2xl text-starlight">{book.title}</h3>
              <p className="mt-2 text-sm text-starlight/72">{formatDate(book.start_date)} - {formatDate(book.end_date)}</p>
            </div>
          ))}
        </div>
      </PaperCard>
    </div>
  );
}
