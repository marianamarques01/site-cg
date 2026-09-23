"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/producoes", label: "Produções" },
  { href: "/admin/jogos", label: "Jogos" },
  { href: "/admin/cursos", label: "Cursos" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/hero", label: "Página principal" },
  { href: "/admin/midia", label: "Mídia" },
  { href: "/admin/configuracoes", label: "Config" },
] as const;

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {LINKS.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              active
                ? "border border-brand px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-brand"
                : "border border-border px-3 py-1.5 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:border-brand hover:text-foreground"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
