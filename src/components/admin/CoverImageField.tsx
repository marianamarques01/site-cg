"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AdminField, { adminInputClassName, adminSelectClassName } from "@/components/admin/AdminField";
import type { DbMedia } from "@/lib/supabase/database.types";

type CoverImageFieldProps = {
  mediaItems: DbMedia[];
  currentCoverId?: string | null;
  currentCoverUrl?: string | null;
  onPreviewChange?: (coverUrl: string | null) => void;
};

export default function CoverImageField({
  mediaItems,
  currentCoverId,
  currentCoverUrl,
  onPreviewChange,
}: CoverImageFieldProps) {
  const [selectedId, setSelectedId] = useState(currentCoverId ?? "");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [removeCover, setRemoveCover] = useState(false);

  useEffect(() => {
    return () => {
      if (filePreview?.startsWith("blob:")) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  useEffect(() => {
    if (removeCover) {
      onPreviewChange?.(null);
      return;
    }
    if (filePreview) {
      onPreviewChange?.(filePreview);
      return;
    }
    const url = mediaItems.find((item) => item.id === selectedId)?.url ?? currentCoverUrl ?? null;
    onPreviewChange?.(url);
  }, [selectedId, filePreview, removeCover, mediaItems, currentCoverUrl, onPreviewChange]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (filePreview?.startsWith("blob:")) URL.revokeObjectURL(filePreview);
    if (!file) {
      setFilePreview(null);
      return;
    }
    setFilePreview(URL.createObjectURL(file));
    setRemoveCover(false);
  }

  return (
    <div className="flex flex-col gap-6 border border-border p-6">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Imagem de capa</p>

      {(currentCoverUrl || filePreview) && !removeCover ? (
        <div className="flex items-start gap-4">
          <div className="relative h-24 w-36 overflow-hidden border border-border">
            <Image
              src={filePreview ?? currentCoverUrl ?? ""}
              alt=""
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              name="remove_cover"
              checked={removeCover}
              onChange={(event) => {
                setRemoveCover(event.target.checked);
                if (event.target.checked) {
                  setSelectedId("");
                  setFilePreview(null);
                }
              }}
              className="accent-brand"
            />
            Remover capa atual
          </label>
        </div>
      ) : null}

      <AdminField label="Selecionar da biblioteca" htmlFor="cover_image_id">
        <select
          id="cover_image_id"
          name="cover_image_id"
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            setRemoveCover(false);
            if (filePreview?.startsWith("blob:")) URL.revokeObjectURL(filePreview);
            setFilePreview(null);
          }}
          className={adminSelectClassName}
        >
          <option value="">Nenhuma</option>
          {mediaItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.filename}
            </option>
          ))}
        </select>
      </AdminField>

      <AdminField label="Ou enviar arquivo" htmlFor="cover_file" hint="JPG, PNG ou WebP até 10 MB">
        <input
          id="cover_file"
          name="cover_file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={adminInputClassName}
        />
      </AdminField>

      <AdminField label="Texto alternativo (upload)" htmlFor="cover_alt">
        <input id="cover_alt" name="cover_alt" type="text" className={adminInputClassName} />
      </AdminField>
    </div>
  );
}
