import { createAdminClient } from "@/lib/supabase/server";
import type { DbProject } from "@/lib/supabase/database.types";
import { normalizeExternalUrl } from "@/lib/submissions/external-url";
import {
  assertSubmissionRateLimit,
  uniqueSubmissionSlug,
  uploadMediaFileAdmin,
} from "@/lib/submissions/submit-media";
import type { ProjectSubmissionInput } from "@/lib/submissions/validate";

export async function submitStudentProject(
  input: ProjectSubmissionInput,
  coverFile: File,
  galleryFiles: File[],
): Promise<DbProject> {
  const supabase = await createAdminClient();
  const email = input.student_email.trim().toLowerCase();

  await assertSubmissionRateLimit(email);

  const cover = await uploadMediaFileAdmin(coverFile, input.title);
  const galleryMedia = await Promise.all(
    galleryFiles.map((file, index) => uploadMediaFileAdmin(file, `${input.title} — ${index + 1}`)),
  );

  const slug = uniqueSubmissionSlug(input.title, "producao");
  const now = new Date().toISOString();

  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      slug,
      title: input.title.trim(),
      student: input.student.trim(),
      student_email: email,
      student_course: input.student_course,
      category: input.category,
      year: input.year,
      tone: "blue",
      aspect: "landscape",
      description: input.description.trim(),
      external_url: normalizeExternalUrl(input.external_url),
      cover_image_id: cover.id,
      featured: false,
      featured_order: null,
      status: "pending",
      submitted_at: now,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  if (galleryMedia.length > 0) {
    const rows = galleryMedia.map((media, sort_order) => ({
      project_id: project.id,
      media_id: media.id,
      sort_order,
    }));

    const { error: galleryError } = await supabase.from("project_gallery").insert(rows);
    if (galleryError) throw new Error(galleryError.message);
  }

  return project as DbProject;
}
