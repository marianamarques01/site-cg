"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, {
  adminInputClassName,
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";
import CoverImageField from "@/components/admin/CoverImageField";
import GalleryField from "@/components/admin/GalleryField";
import InlinePreviewPanel from "@/components/admin/InlinePreviewPanel";
import ProjectInlinePreview from "@/components/admin/ProjectInlinePreview";
import { slugify } from "@/lib/admin/slug";
import { PROJECT_ASPECTS, PROJECT_CATEGORIES, STATUS_OPTIONS, TONE_OPTIONS } from "@/lib/admin/constants";
import type { ActionState } from "@/lib/admin/types";
import type { AdminProject } from "@/lib/admin/projects";
import type { DbMedia } from "@/lib/supabase/database.types";
import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";

type ProjectFormProps = {
  project?: AdminProject;
  mediaItems: DbMedia[];
  currentCoverUrl?: string | null;
  galleryInitialIds?: string[];
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

export default function ProjectForm({
  project,
  mediaItems,
  currentCoverUrl,
  galleryInitialIds = [],
  action,
  deleteAction,
}: ProjectFormProps) {
  const isEditing = Boolean(project);
  const [state, formAction, pending] = useActionState(action, {});
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [student, setStudent] = useState(project?.student ?? "");
  const [year, setYear] = useState(String(project?.year ?? new Date().getFullYear()));
  const [category, setCategory] = useState(project?.category ?? PROJECT_CATEGORIES[0]);
  const [tone, setTone] = useState<PlaceholderTone>((project?.tone as PlaceholderTone) ?? "blue");
  const [description, setDescription] = useState(project?.description ?? "");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(currentCoverUrl ?? null);
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const handleCoverPreviewChange = useCallback((url: string | null) => {
    setCoverPreviewUrl(url);
  }, []);

  const handleGalleryChange = useCallback((_ids: string[], items: DbMedia[]) => {
    setGalleryUrls(items.map((item) => item.url));
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {state.error ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">{state.error}</p>
      ) : null}

      <form action={formAction} className="flex flex-col gap-8">
        {project ? <input type="hidden" name="id" value={project.id} /> : null}

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Título" htmlFor="title">
            <input id="title" name="title" required value={title} onChange={(e) => setTitle(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Slug" htmlFor="slug">
            <input id="slug" name="slug" required value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Aluno" htmlFor="student">
            <input id="student" name="student" required value={student} onChange={(e) => setStudent(e.target.value)} className={adminInputClassName} />
          </AdminField>
          <AdminField label="Ano" htmlFor="year">
            <input id="year" name="year" type="number" required value={year} onChange={(e) => setYear(e.target.value)} className={adminInputClassName} />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <AdminField label="Categoria" htmlFor="category">
            <select id="category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} className={adminSelectClassName}>
              {PROJECT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Proporção" htmlFor="aspect">
            <select id="aspect" name="aspect" defaultValue={project?.aspect ?? "landscape"} className={adminSelectClassName}>
              {PROJECT_ASPECTS.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </AdminField>
          <AdminField label="Tom" htmlFor="tone">
            <select id="tone" name="tone" value={tone} onChange={(e) => setTone(e.target.value as PlaceholderTone)} className={adminSelectClassName}>
              {TONE_OPTIONS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </AdminField>
        </div>

        <AdminField label="Descrição" htmlFor="description">
          <textarea id="description" name="description" required rows={5} value={description} onChange={(e) => setDescription(e.target.value)} className={adminTextareaClassName} />
        </AdminField>

        <AdminField label="Link externo" htmlFor="external_url" hint="YouTube, Drive, itch.io etc.">
          <input
            id="external_url"
            name="external_url"
            type="url"
            defaultValue={project?.external_url ?? ""}
            placeholder="https://…"
            className={adminInputClassName}
          />
        </AdminField>

        <CoverImageField
          mediaItems={mediaItems}
          currentCoverId={project?.cover_image_id}
          currentCoverUrl={currentCoverUrl}
          onPreviewChange={handleCoverPreviewChange}
        />

        {project ? (
          <GalleryField
            mediaItems={mediaItems}
            initialIds={galleryInitialIds}
            onChange={handleGalleryChange}
          />
        ) : null}

        <div className="grid gap-8 md:grid-cols-3">
          <AdminField label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={project?.status ?? "published"} className={adminSelectClassName}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </AdminField>
          <label className="flex items-center gap-3 pt-8 text-sm text-muted">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="accent-brand" />
            Destaque na home
          </label>
          <AdminField label="Ordem no destaque" htmlFor="featured_order">
            <input id="featured_order" name="featured_order" type="number" defaultValue={project?.featured_order ?? ""} className={adminInputClassName} />
          </AdminField>
        </div>

        {project ? (
          <InlinePreviewPanel>
            <ProjectInlinePreview
              title={title}
              category={category}
              year={year}
              student={student}
              tone={tone}
              description={description}
              coverUrl={coverPreviewUrl}
              galleryUrls={galleryUrls}
            />
          </InlinePreviewPanel>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? "Salvando…" : isEditing ? "Salvar" : "Criar produção"}
          </PrimaryButton>
          {project ? (
            <a
              href={`/admin/preview/producoes/${project.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline"
            >
              Preview ↗
            </a>
          ) : null}
        </div>
      </form>

      {project && deleteAction ? (
        <form action={deleteAction} onSubmit={(e) => { if (!confirm("Excluir esta produção?")) e.preventDefault(); }}>
          <input type="hidden" name="id" value={project.id} />
          <button type="submit" className="text-sm text-red-400 hover:underline">Excluir produção</button>
        </form>
      ) : null}
    </div>
  );
}
