import { redirect } from "next/navigation";
import { requireEditorProfile } from "@/lib/data/auth";
import type { DbProfile } from "@/lib/supabase/database.types";

export async function requireEditorPage(): Promise<DbProfile> {
  const profile = await requireEditorProfile();
  if (!profile) redirect("/admin/login");
  return profile;
}
