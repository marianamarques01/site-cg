import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/data/settings";
import { instagramUrl, youtubeUrl } from "@/lib/social-links";

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Explorar",
    links: [
      { href: "/producoes", label: "Projetos" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Cursos",
    links: [
      { href: "/cursos/computacao-grafica", label: "Computação Gráfica" },
      { href: "/cursos/design-de-games", label: "Design de Games" },
    ],
  },
  {
    title: "Institucional",
    links: [
      { href: "/sobre", label: "Sobre" },
      { href: "/contato", label: "Contato" },
      { href: "https://www.fumec.br", label: "FUMEC.br" },
    ],
  },
];

export default async function Footer() {
  const settings = await getSiteSettings();
  const socialLinks = [
    { href: instagramUrl(settings.social_links?.instagram), label: "Instagram" },
    { href: youtubeUrl(settings.social_links?.youtube), label: "YouTube" },
  ].filter((link): link is { href: string; label: string } => Boolean(link.href));

  return (
    <footer className="relative border-t border-border">
      <Container className="grid gap-16 py-20 md:grid-cols-[1.2fr_2fr] md:py-28">
        <div className="flex flex-col gap-6">
          <Logo className="h-10 w-10" />
          <p className="max-w-xs font-display text-3xl leading-[0.95] tracking-tight text-foreground">
            Produções dos cursos de Computação Gráfica e Design de Games.
          </p>
          {socialLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-5">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
                {column.title}
              </span>
              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>

      <Container className="flex flex-col gap-3 border-t border-border py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} FUMEC Criativa — Computação Gráfica &amp; Design de Games</span>
        <span>Belo Horizonte, MG</span>
      </Container>
    </footer>
  );
}
