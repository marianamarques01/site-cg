import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import PageTransition from "@/components/ui/PageTransition";
import { getPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conteúdo, eventos, notícias e bastidores dos cursos.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <PageTransition>
      <PageIntro
        kicker="Blog"
        titleLines={["Bastidores"]}
        description="Conteúdo, eventos, notícias e bastidores dos cursos de Computação Gráfica e Design de Games."
      />
      <Container className="flex flex-col pb-[var(--section-y)]">
        <SectionRule />
        {posts.map((post, i) => (
          <RevealPass key={post.slug} index={i} from="left">
            <article className="border-b border-border py-8 sm:py-10">
              <Link
                href={`/blog/${post.slug}`}
                transitionTypes={["nav-forward"]}
                className="group grid items-start gap-6 sm:grid-cols-[minmax(0,1fr)_12rem] sm:gap-10 md:grid-cols-[minmax(0,1fr)_16rem]"
                data-cursor-label="ler"
              >
                <div className="flex flex-col gap-3 sm:max-w-xl">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-brand">
                    {post.category}
                  </span>
                  <h2 className="font-display text-2xl leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-3xl">
                    {post.title}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
                  <time className="text-xs text-faint" dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
                <PlaceholderMedia
                  label={post.category}
                  tone={post.tone}
                  kind="layout"
                  src={post.coverUrl}
                  alt={post.title}
                  className="aspect-[4/3] w-full sm:aspect-square"
                  showCaption={false}
                  interactive={false}
                />
              </Link>
            </article>
          </RevealPass>
        ))}
      </Container>
    </PageTransition>
  );
}
