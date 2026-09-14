import PlaceholderMedia, { type PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import SectionRule from "@/components/ui/SectionRule";

type GameInlinePreviewProps = {
  title: string;
  genre: string;
  platform: string;
  year: number | string;
  team: string;
  tone: PlaceholderTone;
  description: string;
  coverUrl?: string | null;
};

export default function GameInlinePreview({
  title,
  genre,
  platform,
  year,
  team,
  tone,
  description,
  coverUrl,
}: GameInlinePreviewProps) {
  return (
    <div className="flex flex-col gap-8">
      <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
        {genre || "Gênero"} · {platform || "Plataforma"} · {year || "—"}
      </span>

      <h2 className="font-display text-4xl leading-[0.9] text-foreground sm:text-5xl">
        {title || "Título do jogo"}
      </h2>

      <p className="text-sm text-muted sm:text-base">{team || "Equipe"}</p>

      <PlaceholderMedia
        label={genre || "Jogo"}
        tone={tone}
        kind="tilemap"
        src={coverUrl ?? undefined}
        alt={title || "Capa"}
        className="aspect-[16/9] w-full"
        showCaption={false}
        interactive={false}
      />

      <SectionRule />

      <p className="max-w-2xl text-balance text-base leading-relaxed text-muted sm:text-lg">
        {description || "A descrição aparecerá aqui."}
      </p>
    </div>
  );
}
