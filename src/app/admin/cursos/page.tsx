import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { requireEditorPage } from "@/lib/admin/guard";
import { listAdminCourses } from "@/lib/admin/courses";

export default async function AdminCoursesPage() {
  await requireEditorPage();
  const courses = await listAdminCourses();

  return (
    <AdminShell title="Cursos" description="Edite os textos das duas formações.">
      <div className="grid gap-4">
        {courses.map((course) => (
          <Link key={course.slug} href={`/admin/cursos/${course.slug}`} className="border border-border p-6 transition-colors hover:border-brand">
            <h2 className="font-display text-2xl text-foreground">{course.name}</h2>
            <p className="mt-2 text-sm text-muted">{course.tagline}</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
