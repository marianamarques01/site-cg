import Link from "next/link";
import type { GameListTab } from "@/lib/admin/games";

type GameListTabsProps = {
  active: GameListTab;
  counts: Record<Exclude<GameListTab, "all">, number>;
};

const TABS: { key: GameListTab; label: string }[] = [
  { key: "pending", label: "Pendentes" },
  { key: "published", label: "Publicados" },
  { key: "draft", label: "Rascunhos" },
  { key: "rejected", label: "Rejeitados" },
  { key: "all", label: "Todos" },
];

export default function GameListTabs({ active, counts }: GameListTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const count = tab.key === "all" ? null : counts[tab.key];
        const isActive = active === tab.key;

        return (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/jogos" : `/admin/jogos?tab=${tab.key}`}
            className={
              isActive
                ? "border border-brand px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-brand"
                : "border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:border-brand hover:text-foreground"
            }
          >
            {tab.label}
            {count !== null && count > 0 ? ` (${count})` : ""}
          </Link>
        );
      })}
    </nav>
  );
}
