import Link from "next/link";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import RevealPass from "@/components/ui/RevealPass";
import ActionLink from "@/components/ui/ActionLink";
import MaskedLines from "@/components/ui/MaskedLines";
import BlogCategoryBadge from "@/components/blog/BlogCategoryBadge";
import { CATEGORY_KIND } from "@/components/blog/blog-tones";
import { TONE_ACCENT } from "@/components/blog/blog-tones";
import type { BlogPost } from "@/lib/mock/types";

type BlogFeaturedPostProps = {
  post: BlogPost;
};

export default function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  const accent = TONE_ACCENT[post.tone];
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <RevealPass from="bottom">
      <Link
        href={`/blog/${post.slug}`}
        transitionTypes={["nav-forward"]}
        className="group relative grid overflow-hidden border border-border bg-surface md:grid-cols-[1.1fr_min(42%,28rem)] md:items-stretch"
        data-cursor-label="ler"
        style={{
          boxShadow: `inset 4px 0 0 ${accent}`,
        }}
      >
        <div className="relative flex flex-col justify-between gap-8 p-6 sm:p-8 md:p-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <BlogCategoryBadge category={post.category} tone={post.tone} large />
              <span className="text-xs text-faint">{formattedDate}</span>
            </div>

            <MaskedLines
              as="h2"
              lines={[post.title]}
              className="font-display text-[11vw] leading-[0.88] tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-5xl md:text-4xl lg:text-5xl"
            />

            <p className="max-w-lg text-sm leading-relaxed text-muted sm:text-base">{post.excerpt}</p>
          </div>

          <ActionLink>Ler agora</ActionLink>
        </div>

        <div className="relative min-h-[14rem] md:min-h-0">
          <TiltCard className="h-full min-h-[14rem] w-full md:min-h-full" max={6}>
            <MediaMorph name={`blog-${post.slug}`}>
              <PlaceholderMedia
                label={post.category}
                tone={post.tone}
                kind={CATEGORY_KIND[post.category] ?? "layout"}
                src={post.coverUrl}
                alt={post.title}
                className="h-full min-h-[14rem] w-full md:min-h-full"
                showCaption={false}
              />
            </MediaMorph>
          </TiltCard>
        </div>
      </Link>
    </RevealPass>
  );
}
