import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoursePageContent from "@/components/courses/CoursePageContent";
import { getCourseBySlug } from "@/lib/data/courses";
import { getProjects } from "@/lib/data/projects";
import { getGames } from "@/lib/data/games";

export const metadata: Metadata = { title: "Computação Gráfica" };

export default async function ComputacaoGraficaPage() {
  const [course, showcaseProjects, showcaseGames] = await Promise.all([
    getCourseBySlug("computacao-grafica"),
    getProjects(),
    getGames(),
  ]);

  if (!course) notFound();

  return (
    <CoursePageContent
      course={course}
      showcaseProjects={showcaseProjects}
      showcaseGames={showcaseGames}
    />
  );
}
