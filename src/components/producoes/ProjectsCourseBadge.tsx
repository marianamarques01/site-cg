import { COURSE_TONE } from "@/lib/mock/courses";
import type { CourseSlug } from "@/lib/mock/types";

const LABELS: Record<CourseSlug, string> = {
  "computacao-grafica": "Comp. Gráfica",
  "design-de-games": "Design de Games",
};

type ProjectsCourseBadgeProps = {
  course: CourseSlug;
};

export default function ProjectsCourseBadge({ course }: ProjectsCourseBadgeProps) {
  return (
    <span
      className="inline-flex w-fit items-center border px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.14em]"
      style={{ borderColor: `color-mix(in srgb, ${COURSE_TONE[course]} 45%, transparent)`, color: COURSE_TONE[course] }}
    >
      {LABELS[course]}
    </span>
  );
}
