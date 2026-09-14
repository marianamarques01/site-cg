import Link from "next/link";
import PlaceholderMedia from "@/components/ui/PlaceholderMedia";
import TiltCard from "@/components/ui/TiltCard";
import MediaMorph from "@/components/ui/MediaMorph";
import RevealPass from "@/components/ui/RevealPass";
import BlogCategoryBadge from "@/components/blog/BlogCategoryBadge";
import { CATEGORY_KIND, TONE_ACCENT } from "@/components/blog/blog-tones";
import type { BlogPost } from "@/lib/mock/types";

type BlogPostCardProps = {
  post: BlogPost;
  index: number;
};

export default function BlogPostCard({ post, index }: BlogPostCardProps) {
  const accent = TONE_ACCENT[post.tone];
  const formattedDate = new Date(post.date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <RevealPass index={index % 2} from={index % 2 === 0 ? "bottom" : "left"}>
      <Link
        href={`/blog/${post.slug}`}
        transitionTypes={["nav-forward"]}
        className="group flex h-full flex-col overflow-hidden border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-border-strong focus-visible:-translate-y-1 focus-visible:border-border-strong"
        data-cursor-label="ler"
        style={{
          background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 6%, var(--color-surface)) 0%, var(--color-surface) 40%)`,
        }}
      >
        <TiltCard className="aspect-[4/3] w-full shrink-0" max={5}>
          <MediaMorph name={`blog-${post.slug}`}>
            <PlaceholderMedia
              label={post.category}
              tone={post.tone}
              kind={CATEGORY_KIND[post.category] ?? "layout"}
              src={post.coverUrl}
              alt={post.title}
              className="h-full w-full"
              showCaption={false}
              index={String(index + 1).padStart(2, "0")}
              indexPosition="corner"
            />
          </MediaMorph>
        </TiltCard>

        <div className="flex flex-1 flex-col gap-2 p-4">
          <BlogCategoryBadge category={post.category} tone={post.tone} />

          <h2 className="font-display text-lg leading-tight tracking-tight text-foreground transition-colors duration-300 group-hover:text-brand group-focus-visible:text-brand sm:text-xl">
            {post.title}
          </h2>

          <p className="line-clamp-2 flex-1 text-xs leading-relaxed text-muted sm:text-sm">{post.excerpt}</p>

          <time className="text-xs text-faint" dateTime={post.date}>
            {formattedDate}
          </time>
        </div>
      </Link>
    </RevealPass>
  );
}
