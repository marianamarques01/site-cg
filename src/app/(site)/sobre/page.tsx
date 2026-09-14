import type { Metadata } from "next";
import CoursesSection from "@/components/home/CoursesSection";
import FaqLocationSection from "@/components/home/FaqLocationSection";
import PageIntro from "@/components/ui/PageIntro";
import PageTransition from "@/components/ui/PageTransition";
import { getCourses } from "@/lib/data/courses";
import { getFaqItems } from "@/lib/data/faq";
import { getSiteSettings } from "@/lib/data/settings";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça os cursos de Computação Gráfica e Design de Games da FUMEC, tire dúvidas e veja como chegar ao campus.",
};

export default async function SobrePage() {
  const [courses, faq, settings] = await Promise.all([
    getCourses(),
    getFaqItems(),
    getSiteSettings(),
  ]);

  return (
    <PageTransition>
      <PageIntro
        kicker="Sobre"
        titleLines={["Cursos, campus e dúvidas."]}
        description="Formações em Computação Gráfica e Design de Games, respostas rápidas e como encontrar a FUMEC."
        compact
      />
      <CoursesSection courses={courses} compact />
      <FaqLocationSection
        compact
        items={faq}
        addressLines={(settings.contact_address ?? undefined)
          ?.split("\n")
          .map((line) => line.trim())
          .filter(Boolean)}
        contactEmail={settings.contact_email ?? undefined}
        instagram={settings.social_links?.instagram ?? undefined}
      />
    </PageTransition>
  );
}
