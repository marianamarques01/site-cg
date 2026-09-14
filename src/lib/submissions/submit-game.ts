import { createAdminClient } from "@/lib/supabase/server";
import type { DbGame } from "@/lib/supabase/database.types";
import { normalizeExternalUrl } from "@/lib/submissions/external-url";
import {
  assertSubmissionRateLimit,
  uniqueSubmissionSlug,
  uploadMediaFileAdmin,
} from "@/lib/submissions/submit-media";
import type { GameSubmissionInput } from "@/lib/submissions/validate";

export async function submitStudentGame(
  input: GameSubmissionInput,
  coverFile: File,
): Promise<DbGame> {
  const supabase = await createAdminClient();
  const email = input.student_email.trim().toLowerCase();

  await assertSubmissionRateLimit(email);

  const cover = await uploadMediaFileAdmin(coverFile, input.title);
  const slug = uniqueSubmissionSlug(input.title, "jogo");
  const now = new Date().toISOString();
  const team = input.team.trim() || input.student.trim();

  const { data: game, error } = await supabase
    .from("games")
    .insert({
      slug,
      title: input.title.trim(),
      team,
      genre: input.genre.trim(),
      platform: input.platform.trim(),
      year: input.year,
      tone: "blue",
      description: input.description.trim(),
      external_url: normalizeExternalUrl(input.external_url),
      cover_image_id: cover.id,
      status: "pending",
      student_email: email,
      student_course: input.student_course,
      submitted_at: now,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return game as DbGame;
}
