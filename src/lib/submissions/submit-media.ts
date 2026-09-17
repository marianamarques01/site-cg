import { createAdminClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/admin/slug";
import type { DbMedia } from "@/lib/supabase/database.types";

export async function uploadMediaFileAdmin(file: File, alt: string): Promise<DbMedia> {
  const supabase = await createAdminClient();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "arquivo";
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `submissions/${Date.now()}-${base}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from("media").upload(path, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (uploadError) throw new Error(uploadError.message || "Falha ao enviar o arquivo para o storage.");

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      filename: file.name,
      url: publicUrl,
      alt: alt || file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message || "Falha ao registrar o arquivo enviado.");
  return data as DbMedia;
}

export function uniqueSubmissionSlug(title: string, prefix: string): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${slugify(title) || prefix}-${suffix}`;
}

export async function assertSubmissionRateLimit(email: string): Promise<void> {
  const supabase = await createAdminClient();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const normalized = email.trim().toLowerCase();

  const [projects, games] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("student_email", normalized)
      .gte("submitted_at", since),
    supabase
      .from("games")
      .select("*", { count: "exact", head: true })
      .eq("student_email", normalized)
      .gte("submitted_at", since),
  ]);

  if (projects.error) throw new Error(projects.error.message || "Falha ao verificar limite de envios (produções).");
  if (games.error) throw new Error(games.error.message || "Falha ao verificar limite de envios (jogos).");

  const total = (projects.count ?? 0) + (games.count ?? 0);
  if (total >= 3) {
    throw new Error("Limite de envios atingido. Tente novamente em uma hora.");
  }
}
