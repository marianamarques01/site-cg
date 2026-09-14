import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase/env";

export function createPublicClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseAnonKey());
}

export function getPublicClientOrNull() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createPublicClient();
}
