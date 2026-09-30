import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import SectionRule from "@/components/ui/SectionRule";
import BlogPostCard from "@/components/blog/BlogPostCard";
import type { BlogPost } from "@/lib/mock/types";
import type { HomeSectionTexts } from "@/lib/supabase/database.types";
import { splitLines } from "@/lib/data/text";

type BlogHighlightsProps = {
  posts: BlogPost[];
  texts: HomeSectionTexts;
};

/** Últimos posts do blog — ocupa na home o lugar que era do banner do Cineclube. */
export default function BlogHighlights({ posts, texts }: BlogHighlightsProps) {
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-[var(--section-y)]">
      <SectionRule className="mb-[calc(var(--section-y)*0.75)]" />
      <Container className="flex flex-col gap-10 md:gap-12">
        <SectionHeading
          kicker={texts.kicker}
          titleLines={splitLines(texts.title)}
          description={texts.description}
          href="/blog"
          linkLabel={texts.linkLabel}
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
