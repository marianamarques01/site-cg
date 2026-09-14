import type { ContentStatus } from "@/lib/supabase/database.types";

const LABELS: Record<ContentStatus, string> = {
  pending: "Aguardando",
  draft: "Rascunho",
  published: "Publicado",
  rejected: "Rejeitado",
};

const STYLES: Record<ContentStatus, string> = {
  pending: "border border-amber-500/40 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-amber-300",
  draft: "border border-border px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-faint",
  published: "border border-brand/40 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-brand",
  rejected: "border border-red-500/40 px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-red-300",
};

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return <span className={STYLES[status]}>{LABELS[status]}</span>;
}
