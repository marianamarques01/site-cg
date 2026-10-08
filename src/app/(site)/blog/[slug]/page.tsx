import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageTransition from "@/components/ui/PageTransition";
import BlogPostArticle from "@/components/blog/BlogPostArticle";
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
      <BlogPostArticle
        title={post.title}
        category={post.category}
        formattedDate={formattedDate}
        tone={post.tone}
        coverUrl={post.coverUrl}
        body={post.body}
      />
    </PageTransition>
  );
}
