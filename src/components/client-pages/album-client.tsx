/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { useEditorSession } from "@/app/providers";
import { EmptyState } from "@/components/empty-state";
import { Button, FieldLabel, Input, Textarea } from "@/components/field";
import { PaperCard } from "@/components/paper-card";
import { useCollection } from "@/hooks/use-collection";
import { viewerMeta } from "@/lib/constants";
import type { AlbumPhoto } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

export function AlbumClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<AlbumPhoto>("album_photos", "album_photos");
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function uploadPhoto() {
    if (!file) return;
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("caption", caption);
      formData.append("taken_at", takenAt);

      const response = await fetch("/api/photos", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "上传失败");
      }

      setFile(null);
      setCaption("");
      setTakenAt("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function removePhoto(id: string) {
    const response = await fetch(`/api/photos/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      setError((await response.text()) || "删除失败");
      return;
    }

    await refresh();
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <p className="text-sm tracking-[0.32em] text-starlight/60">共享相册</p>
        <h1 className="mt-2 font-display text-4xl text-starlight">把见过的光存成可以一起翻看的照片</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <PaperCard>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-[#7b668f]">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">上传照片</p>
              <p className="mt-1 text-sm text-starlight/70">支持 JPG、PNG、WebP 等图片，单张最多 4MB。</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <FieldLabel>照片</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                disabled={!session?.canEdit || submitting}
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>
            {previewUrl ? (
              <div className="overflow-hidden rounded-[24px] border border-white/18 bg-white/8">
                <img src={previewUrl} alt="照片预览" className="max-h-[320px] w-full object-cover" />
              </div>
            ) : null}
            <div>
              <FieldLabel>拍摄日期</FieldLabel>
              <Input type="date" value={takenAt} disabled={!session?.canEdit || submitting} onChange={(event) => setTakenAt(event.target.value)} />
            </div>
            <div>
              <FieldLabel>照片说明</FieldLabel>
              <Textarea value={caption} disabled={!session?.canEdit || submitting} placeholder="写下这张照片里的地点、心情或一句话" onChange={(event) => setCaption(event.target.value)} />
            </div>
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            <Button disabled={!session?.canEdit || !file || submitting} onClick={uploadPhoto}>
              <span className="inline-flex items-center gap-2">
                <UploadCloud className="h-4 w-4" />
                {submitting ? "正在上传" : "加入相册"}
              </span>
            </Button>
          </div>
        </PaperCard>

        <PaperCard>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-starlight/55">照片墙</p>
            <span className="rounded-full border border-white/18 bg-white/10 px-4 py-2 text-xs text-starlight/70">
              已收录 {data.length} 张
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {!data.length ? <EmptyState text="还没有照片，等第一张光落进相册里。" /> : null}
            {data.map((photo) => (
              <article key={photo.id} className="overflow-hidden rounded-[26px] border border-white/16 bg-white/10">
                <img src={photo.image_url} alt={photo.caption ?? "相册照片"} className="aspect-[4/3] w-full object-cover" />
                <div className="space-y-3 p-4">
                  <div className="flex items-center justify-between gap-3 text-xs text-starlight/62">
                    <span>{viewerMeta[photo.user_id].name}</span>
                    <span>{photo.taken_at ? formatDate(photo.taken_at) : formatDateTime(photo.created_at)}</span>
                  </div>
                  {photo.caption ? <p className="text-sm leading-7 text-starlight/82">{photo.caption}</p> : null}
                  {session?.canEdit && session.viewer === photo.user_id ? (
                    <Button className="bg-rose-300/10 text-rose-100" onClick={() => removePhoto(photo.id)}>
                      <span className="inline-flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        删除照片
                      </span>
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </PaperCard>
      </div>
    </div>
  );
}
