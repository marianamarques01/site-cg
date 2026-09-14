import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import PageIntro from "@/components/ui/PageIntro";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import PageTransition from "@/components/ui/PageTransition";
import BlogFeaturedPost from "@/components/blog/BlogFeaturedPost";
import BlogPostCard from "@/components/blog/BlogPostCard";
import CinemaPageBackground from "@/components/ui/CinemaPageBackground";
import { getPosts } from "@/lib/data/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Conteúdo, eventos, notícias e bastidores dos cursos.",
};

export default async function BlogPage() {
  const posts = await getPosts();
  const [featured, ...rest] = posts;

  return (
    <PageTransition>
      <div className="relative min-h-screen">
        <CinemaPageBackground />
        <div className="relative z-[1]">
      <PageIntro
        kicker="Blog"
        titleLines={["Bastidores"]}
        description="Conteúdo, eventos, notícias e bastidores dos cursos de Computação Gráfica e Design de Games."
      />

      <Container className="flex flex-col gap-10 pb-[var(--section-y)] md:gap-14">
        {featured && (
          <div className="flex flex-col gap-5 md:gap-6">
            <RevealPass from="left">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
                Em destaque
              </p>
            </RevealPass>
            <BlogFeaturedPost post={featured} />
          </div>
        )}

        {rest.length > 0 && (
          <>
            <SectionRule />
            <div className="flex flex-col gap-5 md:gap-6">
              <RevealPass from="left">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
                  Mais leituras
                </p>
              </RevealPass>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
                {rest.map((post, i) => (
                  <BlogPostCard key={post.slug} post={post} index={i} />
                ))}
              </div>
            </div>
          </>
        )}
      </Container>
        </div>
      </div>
    </PageTransition>
  );
}
