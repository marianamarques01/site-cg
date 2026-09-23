import Link from "next/link";
import { redirect } from "next/navigation";
import AdminDisplayControls from "@/components/admin/AdminDisplayControls";
import AdminNav from "@/components/admin/AdminNav";
import { requireEditorProfile } from "@/lib/data/auth";
import { getAdminStats } from "@/lib/admin/stats";
import { signOut } from "@/app/admin/actions";

const SECTIONS = [
  { href: "/admin/posts", label: "Posts", description: "Blog e notícias", statKey: "posts" as const },
  { href: "/admin/producoes", label: "Produções", description: "Portfólio de alunos", statKey: "projects" as const },
  { href: "/admin/jogos", label: "Jogos", description: "Jogos estudantis", statKey: "games" as const },
  { href: "/admin/cursos", label: "Cursos", description: "Textos dos cursos" },
  { href: "/admin/faq", label: "FAQ", description: "Perguntas da home" },
  { href: "/admin/hero", label: "Página principal", description: "Categorias do topo da home" },
  { href: "/admin/midia", label: "Mídia", description: "Biblioteca de imagens", statKey: "media" as const },
  { href: "/admin/configuracoes", label: "Configurações", description: "Contato, chamada final, marquee" },
] as const;

export default async function AdminDashboardPage() {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const stats = await getAdminStats();

  return (
    <div className="min-h-screen px-6 py-12 sm:px-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-12">
        <header className="flex flex-col gap-6 border-b border-border pb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">Admin</p>
              <h1 className="mt-2 font-display text-4xl text-foreground sm:text-5xl">
                FUMEC Criativa
              </h1>
              <p className="mt-2 text-sm text-muted">
                Logado como {profile.email ?? profile.id} · {profile.role}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AdminDisplayControls />
              <form action={signOut}>
                <button
                  type="submit"
                  className="border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-brand hover:text-foreground"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
          <AdminNav />
        </header>

        {stats.pendingSubmissions > 0 ? (
          <p className="border border-amber-500/30 px-4 py-3 text-sm text-amber-200">
            {stats.pendingSubmissions} submiss{stats.pendingSubmissions === 1 ? "ão" : "ões"} de alunos
            aguardando revisão
            {stats.pendingProjectSubmissions > 0 && stats.pendingGameSubmissions > 0
              ? ` (${stats.pendingProjectSubmissions} produções, ${stats.pendingGameSubmissions} jogos)`
              : ""}
            .{" "}
            {stats.pendingProjectSubmissions > 0 ? (
              <Link href="/admin/producoes?tab=pending" className="underline underline-offset-4">
                Produções
              </Link>
            ) : null}
            {stats.pendingProjectSubmissions > 0 && stats.pendingGameSubmissions > 0 ? " · " : null}
            {stats.pendingGameSubmissions > 0 ? (
              <Link href="/admin/jogos?tab=pending" className="underline underline-offset-4">
                Jogos
              </Link>
            ) : null}
          </p>
        ) : null}

        {stats.drafts > 0 ? (
          <p className="border border-border px-4 py-3 text-sm text-muted">
            {stats.drafts} rascunho{stats.drafts === 1 ? "" : "s"} de posts aguardando publicação.
          </p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          {SECTIONS.map((section) => {
            const count =
              "statKey" in section && section.statKey ? stats[section.statKey] : null;

            return (
              <Link
                key={section.href}
                href={section.href}
                className="group border border-border p-6 transition-colors hover:border-brand"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-2xl text-foreground group-hover:text-brand">
                    {section.label}
                  </h2>
                  {count !== null ? (
                    <span className="text-xs uppercase tracking-[0.12em] text-faint">{count}</span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm text-muted">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
