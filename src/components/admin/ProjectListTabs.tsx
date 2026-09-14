import Link from "next/link";
import type { ProjectListTab } from "@/lib/admin/projects";

type ProjectListTabsProps = {
  active: ProjectListTab;
  counts: Record<Exclude<ProjectListTab, "all">, number>;
};

const TABS: { key: ProjectListTab; label: string }[] = [
  { key: "pending", label: "Pendentes" },
  { key: "published", label: "Publicadas" },
  { key: "draft", label: "Rascunhos" },
  { key: "rejected", label: "Rejeitadas" },
  { key: "all", label: "Todas" },
];

export default function ProjectListTabs({ active, counts }: ProjectListTabsProps) {
  return (
    <nav className="flex flex-wrap gap-2">
      {TABS.map((tab) => {
        const count = tab.key === "all" ? null : counts[tab.key];
        const isActive = active === tab.key;

        return (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/producoes" : `/admin/producoes?tab=${tab.key}`}
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
