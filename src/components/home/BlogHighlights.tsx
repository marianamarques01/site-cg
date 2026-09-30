import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionRule from "@/components/ui/SectionRule";
import BlogPostCard from "@/components/blog/BlogPostCard";
import type { BlogPost } from "@/lib/mock/types";

type BlogHighlightsProps = {
  posts: BlogPost[];
};

/** Últimos posts do blog — ocupa na home o lugar que era do banner do Cineclube. */
export default function BlogHighlights({ posts }: BlogHighlightsProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-[var(--section-y)]">
      <SectionRule className="mb-[calc(var(--section-y)*0.75)]" />
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeading
          kicker="Blog"
          titleLines={["Bastidores", "dos cursos."]}
          description="Conteúdo, eventos, notícias e bastidores de Computação Gráfica e Design de Games."
          href="/blog"
          linkLabel="Ver todos os posts"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {posts.map((post, i) => (
            <BlogPostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
