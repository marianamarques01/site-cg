import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/admin/slug";
import type { DbMedia } from "@/lib/supabase/database.types";

export async function listMedia(): Promise<DbMedia[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as DbMedia[];
}

/** Biblioteca: esconde imagens de envios de alunos que ainda não foram aprovados. */
export async function listApprovedMedia(): Promise<DbMedia[]> {
  const supabase = await createClient();
  const [media, pendingProjects, pendingGames] = await Promise.all([
    listMedia(),
    supabase.from("projects").select("id, cover_image_id").eq("status", "pending"),
    supabase.from("games").select("cover_image_id").eq("status", "pending"),
  ]);

  if (pendingProjects.error) throw new Error(pendingProjects.error.message);
  if (pendingGames.error) throw new Error(pendingGames.error.message);

  const hidden = new Set<string>();
  for (const row of [...(pendingProjects.data ?? []), ...(pendingGames.data ?? [])]) {
    if (row.cover_image_id) hidden.add(row.cover_image_id);
  }

  const projectIds = (pendingProjects.data ?? []).map((row) => row.id);
  if (projectIds.length > 0) {
    const { data, error } = await supabase
      .from("project_gallery")
      .select("media_id")
      .in("project_id", projectIds);
    if (error) throw new Error(error.message);
    for (const row of data ?? []) hidden.add(row.media_id);
  }

  return media.filter((item) => !hidden.has(item.id));
}

export async function getMediaById(id: string): Promise<DbMedia | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("media").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return (data as DbMedia | null) ?? null;
}

export async function uploadMediaFiles(files: File[]): Promise<DbMedia[]> {
  const uploaded: DbMedia[] = [];
  for (const file of files) {
    if (file.size > 0) uploaded.push(await uploadMediaFile(file));
  }
  return uploaded;
}

export async function uploadMediaFile(file: File, alt?: string): Promise<DbMedia> {
  const supabase = await createClient();
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "arquivo";
  const ext = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const path = `${Date.now()}-${base}.${ext}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: uploadError } = await supabase.storage.from("media").upload(path, buffer, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(path);

  const { data, error } = await supabase
    .from("media")
    .insert({
      filename: file.name,
      url: publicUrl,
      alt: alt?.trim() || file.name,
      mime_type: file.type || null,
      size_bytes: file.size,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as DbMedia;
}

export async function deleteMediaById(id: string): Promise<void> {
  const supabase = await createClient();
  const media = await getMediaById(id);
  if (!media) return;

  const storagePath = media.url.split("/media/")[1];
  if (storagePath) {
    await supabase.storage.from("media").remove([decodeURIComponent(storagePath)]);
  }

  const { error } = await supabase.from("media").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteMediaByIds(ids: (string | null | undefined)[]): Promise<void> {
  const unique = [...new Set(ids.filter((id): id is string => Boolean(id)))];
  for (const id of unique) await deleteMediaById(id);
}

/** Remove capa e galeria de uma produção (usado ao recusar envios). */
export async function deleteProjectMedia(projectId: string, coverImageId: string | null): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("project_gallery")
    .select("media_id")
    .eq("project_id", projectId);
  if (error) throw new Error(error.message);
  await deleteMediaByIds([coverImageId, ...(data ?? []).map((row) => row.media_id)]);
}

export async function resolveCoverImageId(
  formData: FormData,
  currentId: string | null,
): Promise<string | null> {
  const coverFile = formData.get("cover_file");
  if (coverFile instanceof File && coverFile.size > 0) {
    const alt = String(formData.get("cover_alt") ?? "");
    const media = await uploadMediaFile(coverFile, alt);
    return media.id;
  }

  const selected = String(formData.get("cover_image_id") ?? "").trim();
  if (selected) return selected;
  if (formData.get("remove_cover") === "on") return null;
  return currentId;
}
