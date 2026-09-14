import Link from "next/link";

import type { ContentStatus } from "@/lib/supabase/database.types";

const STATUS_LABELS: Record<ContentStatus, string> = {
  pending: "Aguardando revisão",
  draft: "Rascunho",
  published: "Publicado",
  rejected: "Rejeitado",
};

type PreviewBannerProps = {
  status: ContentStatus;
  editHref: string;
  label: string;
};

export default function PreviewBanner({ status, editHref, label }: PreviewBannerProps) {
  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-3 border-b border-brand/40 bg-brand/10 px-4 py-3 text-sm">
      <p className="text-brand">
        Preview · {label} ·{" "}
        <span className="uppercase tracking-[0.12em]">{STATUS_LABELS[status]}</span>
      </p>
      <Link href={editHref} className="text-muted underline-offset-4 hover:text-foreground hover:underline">
        ← Voltar ao editor
      </Link>
    </div>
  );
}
