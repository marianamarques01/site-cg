import PlaceholderMedia, { type PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import SectionRule from "@/components/ui/SectionRule";

type PostInlinePreviewProps = {
  title: string;
  category: string;
  publishedAt: string;
  tone: PlaceholderTone;
  excerpt: string;
  body: string;
  coverUrl?: string | null;
};

function formatDate(value: string) {
  if (!value) return "Sem data";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Sem data";
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PostInlinePreview({
  title,
  category,
  publishedAt,
  tone,
  excerpt,
  body,
  coverUrl,
}: PostInlinePreviewProps) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
        {category || "Categoria"} · {formatDate(publishedAt)}
      </span>

      <h2 className="font-display text-4xl leading-[0.9] text-foreground sm:text-5xl">
        {title || "Título do post"}
      </h2>

      <PlaceholderMedia
        label={category || "Blog"}
        tone={tone}
        kind="layout"
        src={coverUrl ?? undefined}
        alt={title || "Capa"}
        className="aspect-[16/9] w-full"
        showCaption={false}
        interactive={false}
      />

      <SectionRule />

      <div className="flex max-w-2xl flex-col gap-5">
        {excerpt ? <p className="text-lg text-muted">{excerpt}</p> : null}
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, index) => (
            <p key={index} className="text-base leading-relaxed text-muted sm:text-lg">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-sm text-faint">O corpo do post aparecerá aqui.</p>
        )}
      </div>
    </div>
  );
}
