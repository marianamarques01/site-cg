"use client";

import { useActionState, useCallback, useEffect, useState } from "react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import AdminField, {
  adminInputClassName,
  adminSelectClassName,
  adminTextareaClassName,
} from "@/components/admin/AdminField";
import CoverImageField from "@/components/admin/CoverImageField";
import InlinePreviewPanel from "@/components/admin/InlinePreviewPanel";
import PostInlinePreview from "@/components/admin/PostInlinePreview";
import { slugify } from "@/lib/admin/slug";
import type { PostActionState } from "@/app/admin/posts/actions";
import type { AdminPost } from "@/lib/admin/posts";
import type { DbMedia } from "@/lib/supabase/database.types";
import type { PlaceholderTone } from "@/components/ui/PlaceholderMedia";

const TONE_OPTIONS: { value: PlaceholderTone; label: string }[] = [
  { value: "blue", label: "Azul" },
  { value: "violet", label: "Violeta" },
  { value: "electric", label: "Elétrico" },
  { value: "mix", label: "Mix" },
];

type PostFormProps = {
  post?: AdminPost;
  mediaItems: DbMedia[];
  currentCoverUrl?: string | null;
  action: (prev: PostActionState, formData: FormData) => Promise<PostActionState>;
  deleteAction?: (formData: FormData) => Promise<void>;
};

export default function PostForm({
  post,
  mediaItems,
  currentCoverUrl,
  action,
  deleteAction,
}: PostFormProps) {
  const isEditing = Boolean(post);
  const [state, formAction, pending] = useActionState(action, {});
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [category, setCategory] = useState(post?.category ?? "");
  const [publishedAt, setPublishedAt] = useState(post?.published_at ?? "");
  const [tone, setTone] = useState<PlaceholderTone>((post?.tone as PlaceholderTone) ?? "mix");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [body, setBody] = useState(post?.body?.join("\n\n") ?? "");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(currentCoverUrl ?? null);

  useEffect(() => {
    if (!slugTouched && title) {
      setSlug(slugify(title));
    }
  }, [title, slugTouched]);

  const handleCoverPreviewChange = useCallback((url: string | null) => {
    setCoverPreviewUrl(url);
  }, []);

  return (
    <div className="flex flex-col gap-10">
      {state.error ? (
        <p className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <form action={formAction} className="flex flex-col gap-8">
        {post ? <input type="hidden" name="id" value={post.id} /> : null}

        <div className="grid gap-8 md:grid-cols-2">
          <AdminField label="Título" htmlFor="title">
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Slug" htmlFor="slug" hint="URL: /blog/seu-slug">
            <input
              id="slug"
              name="slug"
              required
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              className={adminInputClassName}
            />
          </AdminField>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <AdminField label="Categoria" htmlFor="category">
            <input
              id="category"
              name="category"
              required
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="Eventos, Bastidores…"
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Data de publicação" htmlFor="published_at">
            <input
              id="published_at"
              name="published_at"
              type="date"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
              className={adminInputClassName}
            />
          </AdminField>

          <AdminField label="Tom visual" htmlFor="tone">
            <select
              id="tone"
              name="tone"
              value={tone}
              onChange={(event) => setTone(event.target.value as PlaceholderTone)}
              className={adminSelectClassName}
            >
              {TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </AdminField>
        </div>

        <AdminField label="Resumo" htmlFor="excerpt">
          <textarea
            id="excerpt"
            name="excerpt"
            required
            rows={3}
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            className={adminTextareaClassName}
          />
        </AdminField>

        <CoverImageField
          mediaItems={mediaItems}
          currentCoverId={post?.cover_image_id}
          currentCoverUrl={currentCoverUrl}
          onPreviewChange={handleCoverPreviewChange}
        />

        <AdminField
          label="Corpo"
          htmlFor="body"
          hint="Separe parágrafos com uma linha em branco."
        >
          <textarea
            id="body"
            name="body"
            required
            rows={12}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className={adminTextareaClassName}
          />
        </AdminField>

        <AdminField label="Status" htmlFor="status">
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className={adminSelectClassName}
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
          </select>
        </AdminField>

        <InlinePreviewPanel>
          <PostInlinePreview
            title={title}
            category={category}
            publishedAt={publishedAt}
            tone={tone}
            excerpt={excerpt}
            body={body}
            coverUrl={coverPreviewUrl}
          />
        </InlinePreviewPanel>

        <div className="flex flex-wrap items-center gap-4 border-t border-border pt-8">
          <PrimaryButton type="submit" disabled={pending}>
            {pending ? "Salvando…" : isEditing ? "Salvar alterações" : "Criar post"}
          </PrimaryButton>

          {post ? (
            <>
              <a
                href={`/admin/preview/posts/${post.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline"
              >
                Preview ↗
              </a>
              {post.status === "published" ? (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted underline-offset-4 hover:text-brand hover:underline"
                >
                  Ver no site ↗
                </a>
              ) : null}
            </>
          ) : null}
        </div>
      </form>

      {post && deleteAction ? (
        <form
          action={deleteAction}
          className="border-t border-border pt-8"
          onSubmit={(event) => {
            if (!confirm("Excluir este post permanentemente?")) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="id" value={post.id} />
          <button
            type="submit"
            className="text-sm text-red-400 underline-offset-4 hover:underline"
          >
            Excluir post
          </button>
        </form>
      ) : null}
    </div>
  );
}
