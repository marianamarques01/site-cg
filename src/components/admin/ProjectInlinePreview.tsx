import Image from "next/image";
import PlaceholderMedia, { type PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import SectionRule from "@/components/ui/SectionRule";

type ProjectInlinePreviewProps = {
  title: string;
  category: string;
  year: number | string;
  student: string;
  tone: PlaceholderTone;
  description: string;
  coverUrl?: string | null;
  galleryUrls?: string[];
};

export default function ProjectInlinePreview({
  title,
  category,
  year,
  student,
  tone,
  description,
  coverUrl,
  galleryUrls = [],
}: ProjectInlinePreviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
        {category || "Categoria"} · {year || "—"}
      </span>

      <h2 className="font-display text-4xl leading-[0.9] text-foreground sm:text-5xl">
        {title || "Título da produção"}
      </h2>

      <p className="text-sm text-muted sm:text-base">{student || "Aluno"}</p>

      <PlaceholderMedia
        label={category || "Produção"}
        tone={tone}
        src={coverUrl ?? undefined}
        alt={title || "Capa"}
        className="aspect-[16/9] w-full"
        showCaption={false}
        interactive={false}
      />

      {galleryUrls.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {galleryUrls.map((url, index) => (
            <div key={`${url}-${index}`} className="relative aspect-[4/3] overflow-hidden border border-border">
              <Image
                src={url}
                alt={`${title || "Produção"} ${index + 1}`}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          ))}
        </div>
      ) : null}

      <SectionRule />

      <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
        {description || "A descrição aparecerá aqui."}
      </p>
    </div>
  );
}
