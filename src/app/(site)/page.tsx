import Hero from "@/components/home/Hero";
import SplashScreen from "@/components/ui/SplashScreen";
import Marquee, { type MarqueeItem } from "@/components/ui/Marquee";
import FeaturedWork from "@/components/home/FeaturedWork";
import GamesShowcase from "@/components/home/GamesShowcase";
import CoursesSection from "@/components/home/CoursesSection";
import FaqLocationSection from "@/components/home/FaqLocationSection";
import CineclubeSection from "@/components/home/CineclubeSection";
import CtaSection from "@/components/home/CtaSection";
import PageTransition from "@/components/ui/PageTransition";
import { getHeroCategories } from "@/lib/data/categories";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getGames } from "@/lib/data/games";
import { getCourses } from "@/lib/data/courses";
import { getFaqItems } from "@/lib/data/faq";
import { getSiteSettings } from "@/lib/data/settings";

export default async function Home() {
  const [heroCategories, featuredProjects, games, courses, faq, settings] = await Promise.all([
    getHeroCategories(),
    getFeaturedProjects(6),
    getGames(),
    getCourses(),
    getFaqItems(),
    getSiteSettings(),
  ]);

  const marqueeItems: MarqueeItem[] = settings.marquee_items;

  const ctaTitleLines =
    settings.cta_title?.split("\n").map((line) => line.trim()).filter(Boolean) ?? undefined;

  return (
    <PageTransition>
      <SplashScreen />
      <Hero categories={heroCategories} />
      <Marquee items={marqueeItems} />
      <FeaturedWork projects={featuredProjects} />
      <GamesShowcase games={games} />
      <CoursesSection courses={courses} />
      <CineclubeSection />
      <FaqLocationSection
        items={faq}
        addressLines={(settings.contact_address ?? undefined)
          ?.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)}
        contactEmail={settings.contact_email ?? undefined}
        instagram={settings.social_links?.instagram ?? undefined}
      />
      <CtaSection
        titleLines={ctaTitleLines}
        description={settings.cta_description ?? undefined}
      />
    </PageTransition>
  );
}
