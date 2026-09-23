"use server";

import { redirect } from "next/navigation";
import { revalidateProjects } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { getAdminProjectById } from "@/lib/admin/projects";
import { deleteProjectMedia } from "@/lib/admin/media";
import {
  notifySubmissionApproved,
  notifySubmissionRejected,
} from "@/lib/email/submission-notifications";
import { createClient } from "@/lib/supabase/server";

export async function approveProjectAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const project = id ? await getAdminProjectById(id) : null;
  if (!project) redirect("/admin/producoes?tab=pending");

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: "published", rejection_reason: null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await notifySubmissionApproved({ ...project, status: "published", rejection_reason: null });
  revalidateProjects(project.slug);
  redirect(`/admin/producoes/${id}?saved=1`);
}

export async function rejectProjectAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("rejection_reason") ?? "").trim();
  const project = id ? await getAdminProjectById(id) : null;

  if (!project) redirect("/admin/producoes?tab=pending");
  if (!reason) redirect(`/admin/producoes/${id}?error=motivo`);

  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await notifySubmissionRejected({ ...project, status: "rejected", rejection_reason: reason }, reason);
  // Só guardamos imagens de envios aprovados.
  await deleteProjectMedia(id, project.cover_image_id);
  revalidateProjects(project.slug);
  redirect("/admin/producoes?tab=rejected");
}
