"use server";

import { redirect } from "next/navigation";
import { revalidateGames } from "@/lib/cache/revalidate";
import { requireEditorProfile } from "@/lib/data/auth";
import { getAdminGameById } from "@/lib/admin/games";
import {
  notifyGameSubmissionApproved,
  notifyGameSubmissionRejected,
} from "@/lib/email/submission-notifications";
import { createClient } from "@/lib/supabase/server";

export async function approveGameAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const game = id ? await getAdminGameById(id) : null;
  if (!game) redirect("/admin/jogos?tab=pending");

  const supabase = await createClient();
  const { error } = await supabase
    .from("games")
    .update({ status: "published", rejection_reason: null })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await notifyGameSubmissionApproved({ ...game, status: "published", rejection_reason: null });
  revalidateGames(game.slug);
  redirect(`/admin/jogos/${id}?saved=1`);
}

export async function rejectGameAction(formData: FormData) {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");

  const id = String(formData.get("id") ?? "");
  const reason = String(formData.get("rejection_reason") ?? "").trim();
  const game = id ? await getAdminGameById(id) : null;

  if (!game) redirect("/admin/jogos?tab=pending");
  if (!reason) redirect(`/admin/jogos/${id}?error=motivo`);

  const supabase = await createClient();
  const { error } = await supabase
    .from("games")
    .update({ status: "rejected", rejection_reason: reason })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await notifyGameSubmissionRejected({ ...game, status: "rejected", rejection_reason: reason }, reason);
  revalidateGames(game.slug);
  redirect("/admin/jogos?tab=rejected");
}
