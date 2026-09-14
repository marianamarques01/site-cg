import Hero from "@/components/home/Hero";
import SplashScreen from "@/components/ui/SplashScreen";
import Marquee, { type MarqueeItem } from "@/components/ui/Marquee";
import FeaturedWork from "@/components/home/FeaturedWork";
import GamesShowcase from "@/components/home/GamesShowcase";
import CineclubeSection from "@/components/home/CineclubeSection";
import CtaSection from "@/components/home/CtaSection";
import PageTransition from "@/components/ui/PageTransition";
import { getHeroCategories } from "@/lib/data/categories";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getGames } from "@/lib/data/games";
import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroCategories, featuredProjects, games, settings] = await Promise.all([
    getHeroCategories(),
    getFeaturedProjects(6),
    getGames(),
    getSiteSettings(),
  ]);

  const marqueeItems: MarqueeItem[] = settings.marquee_items;

  const ctaTitleLines =
    settings.cta_title?.split("\n").map((line) => line.trim()).filter(Boolean) ?? undefined;

  return (
    <PageTransition>
      <div
        id="intro-gate"
        className="fixed inset-0 z-[200] bg-void"
        aria-hidden="true"
        suppressHydrationWarning
      />
      <SplashScreen />
      <Hero categories={heroCategories} />
      <Marquee items={marqueeItems} />
      <FeaturedWork projects={featuredProjects} />
      <GamesShowcase games={games} />
      <CineclubeSection />
      <CtaSection
        titleLines={ctaTitleLines}
        description={settings.cta_description ?? undefined}
      />
    </PageTransition>
  );
}
