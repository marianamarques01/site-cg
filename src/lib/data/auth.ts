import { createClient } from "@/lib/supabase/server";
import type { DbProfile } from "@/lib/supabase/database.types";

export async function getCurrentProfile(): Promise<DbProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .maybeSingle();

  return (data as DbProfile | null) ?? null;
}

export async function requireEditorProfile() {
  const profile = await getCurrentProfile();
  if (!profile || !["admin", "editor"].includes(profile.role)) {
    return null;
  }
  return profile;
}
