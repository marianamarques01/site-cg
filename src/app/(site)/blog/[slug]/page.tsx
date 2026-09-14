import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/ui/Container";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import MaskedLines from "@/components/ui/MaskedLines";
import RevealPass from "@/components/ui/RevealPass";
import SectionRule from "@/components/ui/SectionRule";
import ActionLink from "@/components/ui/ActionLink";
import PageTransition from "@/components/ui/PageTransition";
import { getPostBySlug, getPosts } from "@/lib/data/posts";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <PageTransition>
      <Container className="flex flex-col gap-10 pb-[var(--section-y)] pt-40 sm:pt-48 md:gap-14">
        <RevealPass from="left">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-brand">
            {post.category} · {formattedDate}
          </span>
        </RevealPass>

        <MaskedLines
          as="h1"
          lines={[post.title]}
          className="max-w-4xl font-display text-[12vw] leading-[0.88] text-foreground sm:text-[7vw] md:text-[5vw]"
        />

        <RevealPass delay={0.06}>
          <PlaceholderMedia
            label={post.category}
            tone={post.tone}
            kind="layout"
            src={post.coverUrl}
            alt={post.title}
            className="aspect-[16/9] w-full"
            showCaption={false}
            interactive={false}
          />
        </RevealPass>

        <SectionRule />

        <div className="flex max-w-2xl flex-col gap-6">
          {post.body.map((paragraph, i) => (
            <RevealPass key={i} index={i} delay={0.04}>
              <p className="text-base leading-relaxed text-muted sm:text-lg">{paragraph}</p>
            </RevealPass>
          ))}
        </div>

        <RevealPass>
          <ActionLink href="/blog" transitionType="nav-back">
            Voltar para o blog
          </ActionLink>
        </RevealPass>
      </Container>
    </PageTransition>
  );
}
