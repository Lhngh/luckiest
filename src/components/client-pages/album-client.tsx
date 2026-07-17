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
import { getBrowserSupabase } from "@/lib/supabase/browser";
import type { AlbumPhoto } from "@/lib/types";
import { formatDate, formatDateTime } from "@/lib/utils";

const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const MAX_IMAGE_EDGE = 2200;

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`;
}

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("这张照片暂时无法压缩，请换成 JPG、PNG 或 WebP"));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("照片压缩失败"));
          return;
        }
        resolve(blob);
      },
      "image/jpeg",
      quality,
    );
  });
}

async function prepareUploadFile(file: File) {
  if (file.size <= MAX_UPLOAD_BYTES && file.type !== "image/gif") {
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("当前浏览器不支持照片压缩");
  }

  context.drawImage(image, 0, 0, width, height);

  for (const quality of [0.86, 0.78, 0.7, 0.62, 0.54, 0.46, 0.38]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob.size <= MAX_UPLOAD_BYTES) {
      return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
    }
  }

  throw new Error("这张照片压缩后仍然超过 4MB，请先裁剪或换一张更小的照片");
}

export function AlbumClient() {
  const { session } = useEditorSession();
  const { data, refresh } = useCollection<AlbumPhoto>("album_photos", "album_photos");
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const previewItems = useMemo(
    () => files.slice(0, 6).map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(() => {
    return () => {
      previewItems.forEach((item) => URL.revokeObjectURL(item.url));
    };
  }, [previewItems]);

  async function uploadOne(file: File, index: number, total: number) {
    setUploadStatus(`正在处理第 ${index + 1}/${total} 张：${file.name}`);
    const uploadFile = await prepareUploadFile(file);
    const supabase = getBrowserSupabase();

    if (!supabase) {
      throw new Error("Supabase 浏览器配置缺失");
    }

    const signResponse = await fetch("/api/photos/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        file_name: uploadFile.name,
        content_type: uploadFile.type,
      }),
    });

    if (!signResponse.ok) {
      throw new Error((await signResponse.text()) || "创建上传链接失败");
    }

    const signed = (await signResponse.json()) as { path: string; token: string };
    setUploadStatus(`正在上传第 ${index + 1}/${total} 张：${formatFileSize(uploadFile.size)}`);

    const { error: uploadError } = await supabase.storage
      .from("shared-album")
      .uploadToSignedUrl(signed.path, signed.token, uploadFile, {
        contentType: uploadFile.type,
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const response = await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        storage_path: signed.path,
        caption,
        taken_at: takenAt,
      }),
    });

    if (!response.ok) {
      throw new Error((await response.text()) || "保存照片失败");
    }
  }

  async function uploadPhotos() {
    if (!files.length) return;
    setSubmitting(true);
    setUploadStatus(null);
    setError(null);

    try {
      for (let index = 0; index < files.length; index += 1) {
        await uploadOne(files[index], index, files.length);
      }

      setFiles([]);
      setCaption("");
      setTakenAt("");
      setUploadStatus(null);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
      setUploadStatus(null);
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
              <p className="mt-1 text-sm text-starlight/70">可以一次选择多张，大图会逐张压缩后直传 Supabase。</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div>
              <FieldLabel>照片</FieldLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                disabled={!session?.canEdit || submitting}
                onChange={(event) => {
                  setFiles(Array.from(event.target.files ?? []));
                  setError(null);
                  setUploadStatus(null);
                }}
              />
              {files.length ? (
                <div className="mt-2 space-y-1 text-xs text-starlight/60">
                  <p>已选择 {files.length} 张，共 {formatFileSize(files.reduce((sum, item) => sum + item.size, 0))}</p>
                  <p>超过 4MB 的照片会自动压缩，GIF 会转成静态照片。</p>
                </div>
              ) : null}
            </div>
            {previewItems.length ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {previewItems.map((item) => (
                  <div key={`${item.file.name}-${item.file.lastModified}`} className="overflow-hidden rounded-[20px] border border-white/18 bg-white/8">
                    <img src={item.url} alt="照片预览" className="aspect-square w-full object-cover" />
                  </div>
                ))}
                {files.length > previewItems.length ? (
                  <div className="flex aspect-square items-center justify-center rounded-[20px] border border-white/18 bg-white/8 text-sm text-starlight/66">
                    +{files.length - previewItems.length} 张
                  </div>
                ) : null}
              </div>
            ) : null}
            <div>
              <FieldLabel>拍摄日期</FieldLabel>
              <Input type="date" value={takenAt} disabled={!session?.canEdit || submitting} onChange={(event) => setTakenAt(event.target.value)} />
            </div>
            <div>
              <FieldLabel>照片说明</FieldLabel>
              <Textarea value={caption} disabled={!session?.canEdit || submitting} placeholder="这段说明会应用到本次上传的所有照片" onChange={(event) => setCaption(event.target.value)} />
            </div>
            {uploadStatus ? <p className="text-sm text-starlight/68">{uploadStatus}</p> : null}
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={!session?.canEdit || !files.length || submitting} onClick={uploadPhotos}>
                <span className="inline-flex items-center gap-2">
                  <UploadCloud className="h-4 w-4" />
                  {submitting ? "处理中" : files.length > 1 ? `加入 ${files.length} 张照片` : "加入相册"}
                </span>
              </Button>
              {files.length && !submitting ? (
                <Button className="bg-white/8" onClick={() => setFiles([])}>
                  清空选择
                </Button>
              ) : null}
            </div>
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
