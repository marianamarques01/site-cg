import AdminShell from "@/components/admin/AdminShell";
import SavedNotice from "@/components/admin/SavedNotice";
import CourseForm from "@/components/admin/CourseForm";
import { requireEditorPage } from "@/lib/admin/guard";
import { getAdminCourseBySlug } from "@/lib/admin/courses";
import { updateCourseAction } from "@/app/admin/cursos/actions";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditCoursePage({ params, searchParams }: PageProps) {
  await requireEditorPage();
  const { slug } = await params;
  const { saved } = await searchParams;
  const course = await getAdminCourseBySlug(slug);
  if (!course) notFound();

  return (
    <AdminShell title={course.name} description="Editar conteúdo do curso">
      <SavedNotice show={Boolean(saved)} />
      <CourseForm course={course} action={updateCourseAction} />
    </AdminShell>
  );
}
