export type ActionState = {
  error?: string;
  success?: string;
};

import type { DbMedia } from "@/lib/supabase/database.types";

export type MediaUploadState = ActionState & {
  items?: DbMedia[];
};
