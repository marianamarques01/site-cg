import type { ReactNode } from "react";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PlaceholderMedia, { type PlaceholderTone } from "@/components/ui/PlaceholderMedia";
import RevealPass from "@/components/ui/RevealPass";
import ActionLink from "@/components/ui/ActionLink";

type BlogPostArticleProps = {
  title: string;
  category: string;
  formattedDate: string;
  tone: PlaceholderTone;
  coverUrl?: string;
  excerpt?: string;
  body: string[];
  showBackLink?: boolean;
  banner?: ReactNode;
};

export default function BlogPostArticle({
  title,
  category,
  formattedDate,
  tone,
  coverUrl,
  excerpt,
  body,
  showBackLink = true,
  banner,
}: BlogPostArticleProps) {
  return (
    <article>
      {banner}

      {/* Hero: capa em tela cheia com véu escuro, breadcrumb, título e metadados */}
      <header className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <PlaceholderMedia
            label={category}
            tone={tone}
            kind="layout"
            src={coverUrl}
            alt=""
            className="h-full w-full"
            showCaption={false}
            interactive={false}
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in srgb, #001a2e 78%, transparent) 0%, color-mix(in srgb, #001a2e 68%, transparent) 55%, color-mix(in srgb, #001a2e 86%, transparent) 100%)",
            }}
          />
        </div>

        <Container className="flex flex-col gap-6 pb-14 pt-[calc(var(--header-offset)+3.5rem)] text-white sm:gap-8 sm:pb-20 md:pt-[calc(var(--header-offset)+4.5rem)]">
          <RevealPass from="left">
            <nav aria-label="Breadcrumb" className="text-sm text-white/85">
              <Link href="/" className="transition-colors hover:text-white">
                Início
              </Link>
              <span className="mx-1.5 text-white/60">»</span>
              <Link href="/blog" className="transition-colors hover:text-white">
                Blog
              </Link>
              <span className="mx-1.5 text-white/60">»</span>
              <span className="text-white/75">{title}</span>
            </nav>
          </RevealPass>

          <RevealPass delay={0.04}>
            <h1 className="max-w-5xl text-balance font-sans text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {title}
            </h1>
          </RevealPass>

          <RevealPass delay={0.08}>
            <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-white/90 sm:text-base">
              <span>{category}</span>
              <span aria-hidden className="text-white/50">
                /
              </span>
              <span>{formattedDate}</span>
            </p>
          </RevealPass>
        </Container>
      </header>

      {/* Corpo: coluna estreita e centralizada, leitura confortável */}
      <Container className="pb-[var(--section-y)] pt-12 sm:pt-16">
        <div className="mx-auto flex max-w-[52rem] flex-col gap-6">
          {excerpt ? (
            <p className="text-lg leading-[1.75] text-foreground sm:text-xl">{excerpt}</p>
          ) : null}
          {body.map((paragraph, i) => (
            <RevealPass key={i} index={i} delay={0.04}>
              <p className="text-base leading-[1.85] text-foreground/85 sm:text-lg">{paragraph}</p>
            </RevealPass>
          ))}

          {showBackLink ? (
            <RevealPass>
              <div className="mt-6 border-t pt-8">
                <ActionLink href="/blog" transitionType="nav-back">
                  Voltar para o blog
                </ActionLink>
              </div>
            </RevealPass>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
