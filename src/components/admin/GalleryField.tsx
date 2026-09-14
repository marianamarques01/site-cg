"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import AdminField, { adminInputClassName, adminSelectClassName } from "@/components/admin/AdminField";
import SortableList from "@/components/admin/SortableList";
import { uploadGalleryMediaAction } from "@/app/admin/midia/actions";
import type { DbMedia } from "@/lib/supabase/database.types";

type GalleryFieldProps = {
  mediaItems: DbMedia[];
  initialIds: string[];
  onChange?: (ids: string[], items: DbMedia[]) => void;
};

export default function GalleryField({ mediaItems, initialIds, onChange }: GalleryFieldProps) {
  const [selectedIds, setSelectedIds] = useState(initialIds);
  const [extraMedia, setExtraMedia] = useState<DbMedia[]>([]);
  const [pickerId, setPickerId] = useState("");
  const [uploadState, uploadAction, uploadPending] = useActionState(uploadGalleryMediaAction, {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allMedia = useMemo(() => {
    const map = new Map(mediaItems.map((item) => [item.id, item]));
    extraMedia.forEach((item) => map.set(item.id, item));
    return map;
  }, [mediaItems, extraMedia]);

  const selectedMedia = useMemo(
    () =>
      selectedIds
        .map((id) => allMedia.get(id))
        .filter((item): item is DbMedia => Boolean(item)),
    [allMedia, selectedIds],
  );

  useEffect(() => {
    onChange?.(selectedIds, selectedMedia);
  }, [selectedIds, selectedMedia, onChange]);

  useEffect(() => {
    if (!uploadState.items?.length) return;
    setExtraMedia((current) => {
      const map = new Map(current.map((item) => [item.id, item]));
      uploadState.items!.forEach((item) => map.set(item.id, item as DbMedia));
      return Array.from(map.values());
    });
    setSelectedIds((ids) => {
      const next = [...ids];
      uploadState.items!.forEach((item) => {
        if (!next.includes(item.id)) next.push(item.id);
      });
      return next;
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [uploadState.items]);

  function addFromPicker() {
    if (!pickerId || selectedIds.includes(pickerId)) return;
    setSelectedIds((ids) => [...ids, pickerId]);
    setPickerId("");
  }

  function handleUploadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = fileInputRef.current;
    if (!input?.files?.length) return;
    const formData = new FormData();
    Array.from(input.files).forEach((file) => formData.append("files", file));
    uploadAction(formData);
  }

  return (
    <div className="flex flex-col gap-6 border border-border p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Galeria</p>
        <p className="mt-1 text-xs text-muted">
          Imagens extras na página da produção. Envie várias de uma vez ou escolha da biblioteca.
        </p>
      </div>

      <input type="hidden" name="gallery_media_ids" value={JSON.stringify(selectedIds)} />

      {selectedMedia.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {selectedMedia.map((item) => (
            <div key={item.id} className="relative aspect-square overflow-hidden border border-border">
              <Image src={item.url} alt={item.alt ?? item.filename} fill className="object-cover" sizes="120px" />
              <button
                type="button"
                onClick={() => setSelectedIds((ids) => ids.filter((id) => id !== item.id))}
                className="absolute right-1 top-1 bg-void/80 px-1.5 py-0.5 text-xs text-red-300"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <SortableList
        items={selectedMedia.map((item) => ({
          id: item.id,
          label: item.filename,
          hint: item.alt ?? undefined,
        }))}
        onReorder={async (ids) => setSelectedIds(ids)}
        emptyMessage="Nenhuma imagem na galeria."
      />

      <form onSubmit={handleUploadSubmit} className="flex flex-col gap-3 border border-dashed border-border p-4">
        {uploadState.error ? <p className="text-sm text-red-400">{uploadState.error}</p> : null}
        {uploadState.success ? <p className="text-sm text-brand">{uploadState.success}</p> : null}

        <AdminField label="Enviar imagens" htmlFor="gallery_files" hint="JPG, PNG ou WebP — selecione várias de uma vez">
          <input
            ref={fileInputRef}
            id="gallery_files"
            name="files"
            type="file"
            accept="image/*"
            multiple
            className={adminInputClassName}
          />
        </AdminField>

        <button
          type="submit"
          disabled={uploadPending}
          className="self-start border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-brand hover:text-foreground disabled:opacity-50"
        >
          {uploadPending ? "Enviando…" : "Fazer upload e adicionar"}
        </button>
      </form>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <AdminField label="Adicionar da biblioteca" htmlFor="gallery_picker">
          <select
            id="gallery_picker"
            value={pickerId}
            onChange={(event) => setPickerId(event.target.value)}
            className={adminSelectClassName}
          >
            <option value="">Selecione…</option>
            {Array.from(allMedia.values())
              .filter((item) => !selectedIds.includes(item.id))
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.filename}
                </option>
              ))}
          </select>
        </AdminField>
        <button
          type="button"
          onClick={addFromPicker}
          className="border border-border px-4 py-3 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}
