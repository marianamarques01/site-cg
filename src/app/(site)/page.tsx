import Hero from "@/components/home/Hero";
import SplashScreen from "@/components/ui/SplashScreen";
import Marquee, { type MarqueeItem } from "@/components/ui/Marquee";
import FeaturedWork from "@/components/home/FeaturedWork";
import GamesShowcase from "@/components/home/GamesShowcase";
import BlogHighlights from "@/components/home/BlogHighlights";
import CtaSection from "@/components/home/CtaSection";
import PageTransition from "@/components/ui/PageTransition";
import IntroGate from "@/components/ui/IntroGate";
import { getHeroCategories } from "@/lib/data/categories";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getGames } from "@/lib/data/games";
import { getSiteSettings } from "@/lib/data/settings";
import { splitLines } from "@/lib/data/text";
import { getPosts } from "@/lib/data/posts";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroCategories, featuredProjects, games, settings, posts] = await Promise.all([
    getHeroCategories(),
    getFeaturedProjects(8),
    getGames(),
    getSiteSettings(),
    getPosts(),
  ]);

  const marqueeItems: MarqueeItem[] = settings.marquee_items;

  const texts = settings.home_texts;
  const ctaTitleLines = splitLines(settings.cta_title);

  return (
    <PageTransition>
      <IntroGate />
      <SplashScreen />
      <Hero categories={heroCategories} />
      <Marquee items={marqueeItems} />
      <FeaturedWork projects={featuredProjects} texts={texts.featured} />
      <GamesShowcase games={games} texts={texts.games} />
      <BlogHighlights posts={posts.slice(0, 3)} texts={texts.blog} />
      <CtaSection
        titleLines={ctaTitleLines}
        description={settings.cta_description ?? undefined}
        kicker={texts.ctaKicker}
        buttonLabel={texts.ctaButton}
      />
    </PageTransition>
  );
}
